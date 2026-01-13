import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import posRoutes from './routes/posRoutes.js';
import { getMenuHtml } from './controllers/publicController.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['*'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // If '*' is in allowed origins, allow all
        if (allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        
        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Check for wildcard subdomain patterns (e.g., *.onipos.com)
        for (const allowedOrigin of allowedOrigins) {
            // Extract domain from allowed origin (remove protocol if present)
            const allowedDomain = allowedOrigin.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const originDomain = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            // If allowed origin contains a wildcard pattern like *.domain.com
            if (allowedDomain.includes('*.')) {
                const domainPattern = allowedDomain.replace('*.', '');
                // Check if origin matches subdomain pattern (e.g., subdomain.onipos.com)
                // or is the main domain itself (e.g., onipos.com)
                if (originDomain === domainPattern || originDomain.endsWith('.' + domainPattern)) {
                    return callback(null, true);
                }
            }
            // Also check if allowed origin is a main domain and origin is a subdomain of it
            // e.g., if https://onipos.com is allowed, allow https://studio-cafe.onipos.com
            else if (!allowedDomain.includes('*') && originDomain.includes('.')) {
                const parts = originDomain.split('.');
                if (parts.length >= 2) {
                    const mainDomain = parts.slice(-2).join('.'); // Get last two parts (e.g., onipos.com)
                    if (allowedDomain === mainDomain || allowedDomain.endsWith('.' + mainDomain)) {
                        return callback(null, true);
                    }
                }
            }
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// In production, serve the frontend build static assets
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use('/assets', express.static(path.join(frontendDistPath, 'assets')));
app.use('/libs', express.static(path.join(frontendDistPath, 'libs')));
app.use('/favicon.png', express.static(path.join(frontendDistPath, 'favicon.png')));

/**
 * Middleware to detect subdomain and extract slug for SEO
 * Handles requests like: studio-cafe.onipos.com
 */
const subdomainDetector = (req, res, next) => {
    const host = req.hostname || req.headers.host?.split(':')[0] || '';
    const baseDomain = process.env.BASE_DOMAIN || 'onipos.com';

    // Check if this is a subdomain request
    if (host.endsWith(`.${baseDomain}`)) {
        const subdomain = host.replace(`.${baseDomain}`, '');
        // Skip www and other reserved subdomains
        if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'admin') {
            req.subdomainSlug = subdomain;
        }
    }

    next();
};

// Apply subdomain detection middleware
app.use(subdomainDetector);

/**
 * SEO Route: Serve HTML with meta tags for subdomain menu pages
 * When a subdomain is detected (e.g., studio-cafe.onipos.com), serve SEO-optimized HTML
 * This handles the root path "/" for subdomain requests
 */
app.get('/', (req, res, next) => {
    if (req.subdomainSlug) {
        // Subdomain detected - serve SEO HTML
        return getMenuHtml(req, res);
    }
    // No subdomain - continue to next handler (404 or serve frontend)
    next();
});

/**
 * SEO Route: Serve HTML with meta tags for path-based menu pages
 * Handles: /menu/:slug (e.g., onipos.com/menu/terracota)
 */
app.get('/menu/:slug', getMenuHtml);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Digital Menu Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/pos', posRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    // Multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 2MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server only if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════╗
║   Digital Menu Platform API Server        ║
║   Running on http://localhost:${PORT}       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
╚════════════════════════════════════════════╝
      `);
    });
}

export default app;
