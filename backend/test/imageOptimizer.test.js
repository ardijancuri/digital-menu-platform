import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import express from 'express';
import { once } from 'node:events';
import { optimizeImage, MAX_UPLOAD_BYTES } from '../src/utils/imageOptimizer.js';
import { uploadSingle } from '../src/middlewares/uploadMiddleware.js';

const source = (width, height, channels = 3) => sharp({ create: { width, height, channels, background: { r: 200, g: 70, b: 10, alpha: 0.4 } } });

test('JPEG is resized without distortion and emitted as WebP', async () => {
    const input = await source(1600, 1000).jpeg().toBuffer();
    const image = await optimizeImage(input);
    assert.equal(image.width, 800);
    assert.equal(image.height, 500);
    assert.equal(image.contentType, 'image/webp');
    assert.ok(image.buffer.length < input.length);
});

test('banner and logo bounds, alpha, metadata stripping, and no upscaling', async () => {
    const input = await source(2000, 1000, 4).png().toBuffer();
    const banner = await optimizeImage(input, { purpose: 'banner' });
    const logo = await optimizeImage(input, { purpose: 'logo' });
    assert.deepEqual([banner.width, banner.height], [1200, 600]);
    assert.deepEqual([logo.width, logo.height], [256, 128]);
    assert.equal((await sharp(logo.buffer).metadata()).hasAlpha, true);
    assert.equal((await sharp(logo.buffer).metadata()).exif, undefined);
    const small = await optimizeImage(await source(40, 20).png().toBuffer());
    assert.deepEqual([small.width, small.height], [40, 20]);
});

test('EXIF rotation is applied before output and is not retained as an unrotated original', async () => {
    const input = await source(120, 60).jpeg().withMetadata({ orientation: 6 }).toBuffer();
    const image = await optimizeImage(input);
    assert.deepEqual([image.width, image.height], [60, 120]);
    assert.equal((await sharp(image.buffer).metadata()).orientation, undefined);
});

test('an already efficient WebP can stay byte-for-byte unchanged', async () => {
    const input = await source(100, 100).webp({ quality: 10 }).toBuffer();
    const image = await optimizeImage(input);
    assert.deepEqual(image.buffer, input);
});

test('animated GIF and WebP retain all frames and original bytes', async () => {
    const pixels = Buffer.concat([Buffer.alloc(2 * 2 * 3, 0), Buffer.alloc(2 * 2 * 3, 255)]);
    for (const format of ['gif', 'webp']) {
        const input = await sharp(pixels, { raw: { width: 2, height: 4, channels: 3, pageHeight: 2 } })[format]({ delay: [100, 100], loop: 0 }).toBuffer();
        assert.equal((await sharp(input, { animated: true }).metadata()).pages, 2);
        const image = await optimizeImage(input);
        assert.equal(image.animated, true);
        assert.deepEqual(image.buffer, input);
    }
});

test('corrupt and oversized images fail before storage; exact 2 MiB boundary passes size validation', async () => {
    await assert.rejects(optimizeImage(Buffer.from('not an image')), { status: 400 });
    const jpeg = await source(200, 100).jpeg().toBuffer();
    await assert.rejects(optimizeImage(jpeg.subarray(0, 100)), { status: 400 });
    await assert.rejects(optimizeImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1)), /2 MiB/);
    const exact = Buffer.concat([jpeg, Buffer.alloc(MAX_UPLOAD_BYTES - jpeg.length)]);
    assert.ok((await optimizeImage(exact)).buffer.length > 0);
});

test('multipart upload enforces 2 MiB even if MAX_FILE_SIZE is configured larger', async t => {
    const app = express();
    app.post('/', uploadSingle('image'), (req, res) => res.json({ bytes: req.file.size }));
    app.use((error, req, res, next) => res.status(400).json({ code: error.code }));
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    t.after(() => server.close());
    for (const size of [MAX_UPLOAD_BYTES, MAX_UPLOAD_BYTES + 1]) {
        const form = new FormData();
        form.set('image', new Blob([Buffer.alloc(size)], { type: 'image/jpeg' }), 'photo.jpg');
        const response = await fetch(`http://127.0.0.1:${server.address().port}`, { method: 'POST', body: form });
        assert.equal(response.status, size === MAX_UPLOAD_BYTES ? 200 : 400);
    }
});
