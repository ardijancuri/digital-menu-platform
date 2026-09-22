import { createHash, randomUUID } from 'node:crypto';
import { optimizeImage, IMAGE_CACHE_CONTROL } from './imageOptimizer.js';

export const digest = buffer => createHash('sha256').update(buffer).digest('hex');
const FIELDS = { 'menu_items.images': 'product', 'menu_settings.banner_images': 'banner', 'menu_settings.logo_url': 'logo' };
const values = value => Array.isArray(value) ? value : value ? [value] : [];
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

export function storagePath(url, projectUrl, bucket) {
    try {
        const parsed = new URL(url);
        const base = new URL(projectUrl);
        const prefix = `/storage/v1/object/public/${encodeURIComponent(bucket)}/`;
        if (parsed.origin !== base.origin || !parsed.pathname.startsWith(prefix) || parsed.search || parsed.hash) return null;
        return decodeURIComponent(parsed.pathname.slice(prefix.length));
    } catch { return null; }
}

export function createInventory({ projectUrl, bucket, databaseTarget, items, settings, objects, requests = [] }) {
    const references = [];
    for (const item of items) references.push({ table: 'menu_items', column: 'images', id: item.id, ownerId: item.user_id, before: item.images });
    for (const setting of settings) {
        for (const column of ['banner_images', 'logo_url']) references.push({ table: 'menu_settings', column, id: setting.id, ownerId: setting.user_id, before: setting[column] });
    }
    const objectMap = new Map(objects.map(object => [object.name, object]));
    const assets = new Map();
    const referencedPaths = new Set();
    const skipped = [];
    for (const reference of references) {
        reference.purpose = FIELDS[`${reference.table}.${reference.column}`];
        reference.status = 'pending';
        for (const url of values(reference.before)) {
            const path = storagePath(url, projectUrl, bucket);
            if (!path) { skipped.push({ url, reason: 'External or noncanonical URL; unchanged' }); continue; }
            referencedPaths.add(path);
            const key = `${reference.purpose}:${url}`;
            if (assets.has(key)) continue;
            const object = objectMap.get(path);
            const count = requests.filter(row => {
                try { return decodeURIComponent(row.filepath || '') === `/storage/v1/object/public/${bucket}/${path}`; }
                catch { return false; }
            }).reduce((sum, row) => sum + Number(row.num_requests || 0), 0);
            assets.set(key, {
                key, oldUrl: url, oldPath: path, purpose: reference.purpose,
                beforeBytes: Number(object?.metadata?.size || 0), contentType: object?.metadata?.mimetype || null,
                cachedRequests: count, estimatedBytes: count * Number(object?.metadata?.size || 0),
                status: object ? 'pending' : 'missing',
            });
        }
    }
    return {
        version: 1, projectUrl, bucket, databaseTarget, createdAt: new Date().toISOString(),
        references, assets: [...assets.values()].sort((a, b) => b.estimatedBytes - a.estimatedBytes || b.beforeBytes - a.beforeBytes),
        unreferenced: objects.filter(object => !referencedPaths.has(object.name)).map(({ name, metadata }) => ({ name, bytes: Number(metadata?.size || 0) })),
        skipped,
    };
}

// A GET verifies the representation browsers actually receive (HEAD may have
// different cache headers). Check the bytes, MIME type, and browser max-age.
export async function verifyAsset(url, asset, fetcher = fetch) {
    const response = await fetcher(url, { signal: AbortSignal.timeout(30_000), redirect: 'error' });
    if (!response.ok) throw new Error(`Asset verification failed: HTTP ${response.status}`);
    const cache = response.headers.get('cache-control') || '';
    const age = /(?:^|,)\s*max-age=(\d+)/i.exec(cache);
    if (!age || Number(age[1]) < Number(IMAGE_CACHE_CONTROL) || /no-store|no-cache/i.test(cache)) throw new Error('Asset does not have the required browser caching');
    if (response.headers.get('content-type')?.split(';')[0] !== asset.contentType) throw new Error('Asset content type mismatch');
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== asset.afterBytes || digest(bytes) !== asset.sha256) throw new Error('Asset content mismatch');
}

export async function migrateAssets(manifest, { storage, save, ownerId, fetcher = fetch }) {
    const selected = manifest.references.filter(reference => ownerId === undefined || String(reference.ownerId) === String(ownerId));
    const needed = new Set(selected.flatMap(reference => values(reference.before).map(url => `${reference.purpose}:${url}`)));
    for (const asset of manifest.assets.filter(asset => needed.has(asset.key))) {
        // Verify previously completed uploads on every resumed run as well.
        if (asset.status === 'verified') {
            await verifyAsset(asset.newUrl, asset, fetcher);
            continue;
        }
        const { data, error } = await storage.download(asset.oldPath);
        if (error) throw new Error(`Cannot read ${asset.oldPath}: ${error.message}`);
        const original = Buffer.from(await data.arrayBuffer());
        const image = await optimizeImage(original, { purpose: asset.purpose, maxBytes: 50 * 1024 * 1024 });
        const sha256 = digest(image.buffer);
        // Persist the path BEFORE uploading, so a crash never loses its identity.
        if (!asset.newPath || asset.sha256 !== sha256) {
            asset.newPath = `optimized/v1/${asset.purpose}/${randomUUID()}.${image.extension}`;
        }
        Object.assign(asset, {
            beforeBytes: original.length, originalSha256: digest(original), afterBytes: image.buffer.length,
            contentType: image.contentType, sha256, animated: image.animated,
            width: image.width, height: image.height, status: 'prepared',
            newUrl: storage.getPublicUrl(asset.newPath).data.publicUrl,
        });
        await save(manifest);
        const uploaded = await storage.upload(asset.newPath, image.buffer, { contentType: image.contentType, cacheControl: IMAGE_CACHE_CONTROL, upsert: false });
        // A duplicate after a crash is accepted only if GET verification proves
        // it is the exact intended object. Other errors stop before DB updates.
        if (uploaded.error && String(uploaded.error.statusCode) !== '409' && uploaded.error.error !== 'Duplicate' && uploaded.error.code !== 'Duplicate') {
            throw new Error(`Upload failed for ${asset.oldPath}: ${uploaded.error.message}`);
        }
        await verifyAsset(asset.newUrl, asset, fetcher);
        asset.status = 'verified';
        await save(manifest);
    }
    return selected;
}

// One compare-and-swap per complete field preserves array order and refuses to
// overwrite concurrent edits. Saving the planned "after" before SQL also allows
// recovery when SQL commits immediately before a process interruption.
export async function updateReferences(manifest, { db, save, ownerId, rollback = false }) {
    const replacements = new Map(manifest.assets.filter(asset => asset.status === 'verified').map(asset => [asset.key, asset.newUrl]));
    for (const reference of manifest.references) {
        if (ownerId !== undefined && String(reference.ownerId) !== String(ownerId)) continue;
        if (!Object.hasOwn(FIELDS, `${reference.table}.${reference.column}`)) throw new Error('Invalid manifest field');
        if (rollback && reference.after === undefined) continue;
        if (!rollback) {
            if (reference.status === 'rolled-back') throw new Error('Create a fresh inventory after rollback');
            const replace = url => {
                const path = storagePath(url, manifest.projectUrl, manifest.bucket);
                if (!path) return url;
                const replacement = replacements.get(`${reference.purpose}:${url}`);
                if (!replacement) throw new Error(`Asset not verified: ${path}`);
                return replacement;
            };
            reference.after = Array.isArray(reference.before) ? reference.before.map(replace) : reference.before ? replace(reference.before) : reference.before;
        }
        if (same(reference.before, reference.after)) { reference.status = 'unchanged'; continue; }
        await save(manifest);
        const expected = rollback ? reference.after : reference.before;
        const replacement = rollback ? reference.before : reference.after;
        const { rows } = await db.query(
            `UPDATE public.${reference.table} SET ${reference.column} = $1 WHERE id = $2 AND ${reference.column} IS NOT DISTINCT FROM $3 RETURNING id`,
            [replacement, reference.id, expected],
        );
        if (rows.length) reference.status = rollback ? 'rolled-back' : 'applied';
        else {
            const current = await db.query(`SELECT ${reference.column} AS value FROM public.${reference.table} WHERE id = $1`, [reference.id]);
            reference.status = current.rows.length && same(current.rows[0].value, replacement) ? (rollback ? 'rolled-back' : 'applied') : 'conflict';
        }
        await save(manifest);
    }
}
