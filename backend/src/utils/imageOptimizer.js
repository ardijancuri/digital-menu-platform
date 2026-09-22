import sharp from 'sharp';

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const IMAGE_CACHE_CONTROL = '2592000';
export const IMAGE_BOUNDS = Object.freeze({ product: 800, banner: 1200, logo: 256 });
const MAX_PIXELS = 40_000_000;
const TYPES = { jpeg: ['jpg', 'image/jpeg'], png: ['png', 'image/png'], webp: ['webp', 'image/webp'], gif: ['gif', 'image/gif'] };

export class InvalidImageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidImageError';
        this.status = 400;
    }
}

// Migration permits existing files above the new-upload limit, but still enforces
// decoding limits. MIME type and extension always come from the decoded bytes.
export async function optimizeImage(buffer, { purpose = 'product', maxBytes = MAX_UPLOAD_BYTES } = {}) {
    if (!Object.hasOwn(IMAGE_BOUNDS, purpose)) throw new Error('Unknown image purpose');
    if (!Buffer.isBuffer(buffer) || !buffer.length) throw new InvalidImageError('Please upload a valid image.');
    if (buffer.length > maxBytes) throw new InvalidImageError('Image must be 2 MiB or smaller.');
    try {
        const options = { animated: true, failOn: 'warning', limitInputPixels: MAX_PIXELS };
        const metadata = await sharp(buffer, options).metadata();
        if (!TYPES[metadata.format]) throw new InvalidImageError('Only JPEG, PNG, WebP and GIF images are supported.');
        const width = metadata.width;
        const height = metadata.pageHeight || metadata.height;
        const animated = (metadata.pages || 1) > 1;
        if (width * height * (metadata.pages || 1) > MAX_PIXELS) {
            throw new InvalidImageError('Image dimensions or animation are too large.');
        }
        const [extension, contentType] = TYPES[metadata.format];
        if (animated) {
            // Metadata alone cannot detect truncated pixel data.
            await sharp(buffer, options).raw().toBuffer();
            return { buffer, extension, contentType, width, height, animated: true, optimized: false };
        }
        const bound = IMAGE_BOUNDS[purpose];
        const result = await sharp(buffer, options)
            .rotate()
            .resize({ width: bound, height: bound, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer({ resolveWithObject: true });
        if (width <= bound && height <= bound && (!metadata.orientation || metadata.orientation === 1) && buffer.length <= result.data.length) {
            return { buffer, extension, contentType, width, height, animated: false, optimized: false };
        }
        return { buffer: result.data, extension: 'webp', contentType: 'image/webp', width: result.info.width, height: result.info.height, animated: false, optimized: true };
    } catch (error) {
        if (error instanceof InvalidImageError) throw error;
        throw new InvalidImageError('Image could not be decoded. Please upload a valid JPEG, PNG, WebP or GIF.');
    }
}
