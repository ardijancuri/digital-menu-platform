import 'dotenv/config';
import { readFile, writeFile, rename, mkdir, open, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { createInventory, migrateAssets, updateReferences } from '../src/utils/imageMigration.js';

const { values: args } = parseArgs({ options: {
    'dry-run': { type: 'boolean' }, apply: { type: 'boolean' }, rollback: { type: 'boolean' },
    manifest: { type: 'string', default: 'image-migrations/inventory.json' },
    'owner-id': { type: 'string' }, 'request-counts': { type: 'string' }, help: { type: 'boolean' },
} });
if (args.help) {
    console.log('npm run images:migrate -- [--dry-run | --apply | --rollback] --manifest image-migrations/inventory.json [--owner-id ID] [--request-counts counts.json]');
    process.exit(0);
}
if ([args['dry-run'], args.apply, args.rollback].filter(Boolean).length > 1) throw new Error('Choose one mode');
const projectUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_BUCKET || 'menu-assets';
if (!projectUrl || !key || !(process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER))) {
    throw new Error('Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DATABASE_URL (or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD) in backend/.env. No changes made.');
}
const config = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 5432), database: process.env.DB_NAME,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
};
const db = new pg.Pool({ ...config, max: 1, connectionTimeoutMillis: 15_000, statement_timeout: 30_000 });
const storage = createClient(projectUrl, key, { auth: { persistSession: false, autoRefreshToken: false } }).storage.from(bucket);
const path = resolve(args.manifest);
await mkdir(dirname(path), { recursive: true });
// Never run two processes against the same manifest.
const lock = await open(`${path}.lock`, 'wx');
const save = async manifest => {
    await writeFile(`${path}.tmp`, JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600 });
    await rename(`${path}.tmp`, path);
};
async function listObjects(prefix = '') {
    const result = [];
    for (let offset = 0; ; offset += 100) {
        const { data, error } = await storage.list(prefix, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } });
        if (error) throw new Error(error.message);
        for (const object of data) {
            const name = prefix ? `${prefix}/${object.name}` : object.name;
            if (!object.id) result.push(...await listObjects(name));
            else result.push({ ...object, name });
        }
        if (data.length < 100) return result;
    }
}
try {
    const identity = await db.query('SELECT current_database() AS database, current_user AS username');
    const connection = db.options.connectionString ? new URL(db.options.connectionString) : null;
    const databaseTarget = { ...identity.rows[0], host: connection?.hostname || config.host, user: connection ? decodeURIComponent(connection.username) : config.user };
    let manifest;
    if (!args.apply && !args.rollback) {
        try { await readFile(path); throw new Error('Manifest already exists. Use a new filename for a new inventory.'); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
        const [items, settings, objects] = await Promise.all([
            db.query('SELECT m.id, c.user_id, m.images FROM public.menu_items m JOIN public.categories c ON c.id = m.category_id'),
            db.query('SELECT id, user_id, logo_url, banner_images FROM public.menu_settings'), listObjects(),
        ]);
        let requests = args['request-counts'] ? JSON.parse(await readFile(args['request-counts'], 'utf8')) : [];
        if (!Array.isArray(requests)) throw new Error('Request counts must be a JSON array');
        requests = requests.filter(row => [1, true, '1', 'true'].includes(row.cached));
        manifest = createInventory({ projectUrl, bucket, databaseTarget, items: items.rows, settings: settings.rows, objects, requests });
        await save(manifest);
    } else {
        manifest = JSON.parse(await readFile(path, 'utf8'));
        if (manifest.version !== 1 || manifest.projectUrl !== projectUrl || manifest.bucket !== bucket || JSON.stringify(manifest.databaseTarget) !== JSON.stringify(databaseTarget)) {
            throw new Error('Manifest does not match this database and storage project');
        }
        const options = { ownerId: args['owner-id'], save };
        if (!args.rollback) await migrateAssets(manifest, { ...options, storage });
        await updateReferences(manifest, { ...options, db, rollback: Boolean(args.rollback) });
    }
    const conflicts = manifest.references.filter(reference => reference.status === 'conflict').length;
    console.log(JSON.stringify({ manifest: path, assets: manifest.assets.length,
        verified: manifest.assets.filter(asset => asset.status === 'verified').length,
        animated: manifest.assets.filter(asset => asset.animated).length,
        unreferenced: manifest.unreferenced.length, conflicts,
        savedBytes: manifest.assets.filter(asset => asset.status === 'verified').reduce((sum, asset) => sum + asset.beforeBytes - asset.afterBytes, 0),
        owners: [...new Set(manifest.references.map(reference => reference.ownerId))],
    }, null, 2));
    if (conflicts) process.exitCode = 2;
} finally {
    await db.end();
    await lock.close();
    await unlink(`${path}.lock`);
}
