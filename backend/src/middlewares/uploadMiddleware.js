import multer from 'multer';
import path from 'path';
import { MAX_UPLOAD_BYTES } from '../utils/imageOptimizer.js';

// Configure storage
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const extname = /^\.(jpeg|jpg|png|gif|webp)$/.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /^image\/(jpeg|png|gif|webp)$/.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(Object.assign(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), { status: 400 }));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        // Busboy emits its limit event at equality; allow the inclusive 2 MiB boundary.
        fileSize: MAX_UPLOAD_BYTES + 1
    },
    fileFilter: fileFilter
});

// Export upload middleware
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

export default upload;
