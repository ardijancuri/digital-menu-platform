import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer service role key for backend operations to bypass RLS, otherwise use anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Uploads will fail if not provided.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
});

export const uploadFile = async (file, bucket = 'menu-assets') => {
    try {
        const timestamp = Date.now();
        // Sanitize filename
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const filePath = `${timestamp}-${cleanFileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
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
        console.error('Supabase upload error:', error);
        throw new Error('Failed to upload file to storage');
    }
};

export const deleteFile = async (fileUrl, bucket = 'menu-assets') => {
    try {
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
