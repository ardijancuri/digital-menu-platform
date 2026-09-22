import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { optimizeImage, IMAGE_CACHE_CONTROL } from './imageOptimizer.js';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer service role key for backend operations to bypass RLS, otherwise use anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET || 'menu-assets';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Uploads will fail if not provided.');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false
        }
    })
    : null;

let bucketReadyPromise = null;

const isBucketMissingError = (error) => {
    if (!error) return false;
    const message = error.message?.toLowerCase() || '';
    return (
        error.status === 404 ||
        error.statusCode === 404 ||
        error.statusCode === '404' ||
        message.includes('bucket not found')
    );
};

const ensureBucketExists = async (bucketName) => {
    if (bucketReadyPromise) return bucketReadyPromise;

    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    bucketReadyPromise = (async () => {
        try {
            const { data, error } = await supabase.storage.getBucket(bucketName);
            if (!error && data) {
                return true;
            }

            if (!isBucketMissingError(error)) {
                throw error;
            }

            if (!hasServiceRole) {
                throw new Error(`Supabase bucket "${bucketName}" does not exist and cannot be created without SUPABASE_SERVICE_ROLE_KEY.`);
            }

            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true
            });

            if (createError) {
                throw createError;
            }

            console.log(`Created Supabase bucket "${bucketName}".`);
            return true;
        } catch (err) {
            bucketReadyPromise = null; // allow retry on next call
            throw err;
        }
    })();

    return bucketReadyPromise;
};

export const uploadFile = async (file, bucket = supabaseBucket, { purpose = 'product' } = {}) => {
    try {
        const image = await optimizeImage(file.buffer, { purpose });
        if (!supabase) throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in your .env file.');
        await ensureBucketExists(bucket);

        const filePath = `optimized/v1/${purpose}/${randomUUID()}.${image.extension}`;

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, image.buffer, {
                contentType: image.contentType,
                cacheControl: IMAGE_CACHE_CONTROL,
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        if (error.status === 400) throw error;
        console.error('Supabase upload error:', error);
        const bucketInfo = bucket === supabaseBucket ? bucket : `${bucket} (configured)`;
        if (isBucketMissingError(error)) {
            throw new Error(`Supabase bucket "${bucketInfo}" is missing. Ensure it exists or provide SUPABASE_SERVICE_ROLE_KEY so the backend can create it.`);
        }
        throw new Error('Failed to upload file to storage');
    }
};

export const deleteFile = async (fileUrl, bucket = supabaseBucket) => {
    try {
        if (!supabase) return;
        // Extract file path from URL
        // URL format: https://.../storage/v1/object/public/bucket/path/to/file
        const urlParts = fileUrl.split(`${bucket}/`);
        if (urlParts.length < 2) return;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Supabase delete error:', error);
        // We generally don't want to block main flow if delete fails, just log it
    }
};

export default supabase;
