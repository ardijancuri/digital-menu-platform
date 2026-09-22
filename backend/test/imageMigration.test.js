import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import sharp from 'sharp';
import { createInventory, migrateAssets, updateReferences, verifyAsset, digest } from '../src/utils/imageMigration.js';

const projectUrl = 'https://example.supabase.co';
const bucket = 'menu-assets';
const url = name => `${projectUrl}/storage/v1/object/public/${bucket}/${name}`;
const save = async () => {};
const inventory = () => createInventory({ projectUrl, bucket, databaseTarget: {},
    items: [{ id: 1, user_id: 1, images: [url('a.jpg'), 'https://external.example/image.png', url('a.jpg')] }, { id: 2, user_id: 2, images: [url('a.jpg')] }],
    settings: [{ id: 1, user_id: 1, logo_url: null, banner_images: [] }],
    objects: [{ name: 'a.jpg', metadata: { size: 1000, mimetype: 'image/jpeg' } }, { name: 'unused.jpg', metadata: { size: 300 } }],
    requests: [{ filepath: '/storage/v1/object/public/menu-assets/a.jpg', num_requests: 7 }],
});

async function database(t, manifest) {
    const db = new PGlite();
    t.after(() => db.close());
    await db.exec('CREATE TABLE menu_items (id integer primary key, images text[]); CREATE TABLE menu_settings (id integer primary key, logo_url text, banner_images text[]);');
    for (const row of manifest.references.filter(row => row.table === 'menu_items')) await db.query('INSERT INTO menu_items VALUES ($1, $2)', [row.id, row.before]);
    await db.query('INSERT INTO menu_settings VALUES (1, null, $1)', [[]]);
    return db;
}

test('inventory deduplicates objects by role and separates unused and external assets', () => {
    const manifest = inventory();
    assert.equal(manifest.assets.length, 1);
    assert.equal(manifest.assets[0].estimatedBytes, 7000);
    assert.equal(manifest.unreferenced[0].name, 'unused.jpg');
    assert.equal(manifest.skipped.length, 1);
});

test('Postgres updates preserve array order, scope to the pilot, resume, and roll back safely', async t => {
    const manifest = inventory();
    const db = await database(t, manifest);
    Object.assign(manifest.assets[0], { status: 'verified', newUrl: url('optimized.webp') });
    await updateReferences(manifest, { db, save, ownerId: 1 });
    assert.deepEqual((await db.query('SELECT images FROM menu_items WHERE id=1')).rows[0].images, [url('optimized.webp'), 'https://external.example/image.png', url('optimized.webp')]);
    assert.deepEqual((await db.query('SELECT images FROM menu_items WHERE id=2')).rows[0].images, [url('a.jpg')]);
    await updateReferences(manifest, { db, save, ownerId: 1 });
    assert.equal(manifest.references[0].status, 'applied');
    await updateReferences(manifest, { db, save, ownerId: 1, rollback: true });
    assert.deepEqual((await db.query('SELECT images FROM menu_items WHERE id=1')).rows[0].images, manifest.references[0].before);
    await updateReferences(manifest, { db, save, ownerId: 1, rollback: true });
    assert.equal(manifest.references[0].status, 'rolled-back');
});

test('concurrent edits survive both apply and rollback', async t => {
    const manifest = inventory();
    const db = await database(t, manifest);
    Object.assign(manifest.assets[0], { status: 'verified', newUrl: url('optimized.webp') });
    await db.query('UPDATE menu_items SET images=$1 WHERE id=1', [['user-new-image']]);
    await updateReferences(manifest, { db, save, ownerId: 1 });
    assert.equal(manifest.references[0].status, 'conflict');
    await updateReferences(manifest, { db, save, ownerId: 1, rollback: true });
    assert.equal(manifest.references[0].status, 'conflict');
    assert.deepEqual((await db.query('SELECT images FROM menu_items WHERE id=1')).rows[0].images, ['user-new-image']);
});

test('a crash after the database update is recovered from the saved intended values', async t => {
    const manifest = inventory();
    const db = await database(t, manifest);
    Object.assign(manifest.assets[0], { status: 'verified', newUrl: url('optimized.webp') });
    let persisted;
    let writes = 0;
    await assert.rejects(updateReferences(manifest, { db, ownerId: 1, save: async value => {
        if (++writes === 2) throw new Error('simulated interruption');
        persisted = structuredClone(value);
    } }), /interruption/);
    await updateReferences(persisted, { db, save, ownerId: 1 });
    assert.equal(persisted.references[0].status, 'applied');
});

test('upload resume reuses its persisted path and verifies duplicate object bytes', async () => {
    const manifest = inventory();
    const original = await sharp({ create: { width: 900, height: 500, channels: 3, background: 'red' } }).jpeg().toBuffer();
    const objects = new Map();
    let uploads = 0;
    const storage = {
        download: async () => ({ data: new Blob([original]) }),
        getPublicUrl: path => ({ data: { publicUrl: url(path) } }),
        upload: async (path, bytes, options) => {
            uploads++;
            assert.equal(options.upsert, false);
            assert.equal(options.cacheControl, '2592000');
            if (objects.has(url(path))) return { error: { statusCode: '409' } };
            objects.set(url(path), { bytes, options });
            return {};
        },
    };
    const fetcher = async target => {
        const object = objects.get(target);
        return new Response(object.bytes, { headers: { 'content-type': object.options.contentType, 'cache-control': 'public, max-age=2592000' } });
    };
    let persisted;
    let writes = 0;
    await assert.rejects(migrateAssets(manifest, { storage, fetcher, ownerId: 1, save: async value => {
        if (++writes === 2) throw new Error('simulated interruption');
        persisted = structuredClone(value);
    } }), /interruption/);
    await migrateAssets(persisted, { storage, fetcher, save, ownerId: 1 });
    assert.equal(objects.size, 1);
    assert.equal(persisted.assets[0].status, 'verified');
    await migrateAssets(persisted, { storage, fetcher, save, ownerId: 1 });
    assert.equal(uploads, 2);
});

test('wrong cache headers, corrupt verification bytes and unverified assets cannot update references', async t => {
    const bytes = Buffer.from('image bytes');
    const asset = { contentType: 'image/webp', sha256: digest(bytes), afterBytes: bytes.length };
    await assert.rejects(verifyAsset(url('a.webp'), asset, async () => new Response(bytes, { headers: { 'content-type': 'image/webp', 'cache-control': 'public, max-age=3600' } })), /caching/);
    await assert.rejects(verifyAsset(url('a.webp'), asset, async () => new Response('bad', { headers: { 'content-type': 'image/webp', 'cache-control': 'public, max-age=2592000' } })), /mismatch/);
    const manifest = inventory();
    const db = await database(t, manifest);
    await assert.rejects(updateReferences(manifest, { db, save }), /not verified/);
    assert.deepEqual((await db.query('SELECT images FROM menu_items WHERE id=1')).rows[0].images, manifest.references[0].before);
});
