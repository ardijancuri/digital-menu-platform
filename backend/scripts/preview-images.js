// Local-only browser QA fixture. Does not connect to Supabase or Postgres.
import express from 'express';
import sharp from 'sharp';

const app = express();
const port = Number(process.env.IMAGE_QA_PORT || 5190);
const origin = `http://127.0.0.1:${port}`;
const counts = {};
const image = await sharp({ create: { width: 800, height: 500, channels: 3, background: '#b58d6a' } }).webp().toBuffer();
app.use((req, res, next) => { res.set('Access-Control-Allow-Origin', '*'); next(); });
app.get('/images/:name', (req, res) => {
    counts[req.params.name] = (counts[req.params.name] || 0) + 1;
    res.set({ 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=2592000' }).send(image);
});
app.get('/__stats', (req, res) => res.json(counts));
app.get(['/api/public/menu', '/api/public/menu/:slug'], (req, res) => res.json({ menu: {
    business_name: 'Image QA Menu', logo_url: `${origin}/images/logo.webp`, default_language: 'en',
    theme: { background_color: '#ffffff', primary_color: '#292524', accent_color: '#f5f5f4', banner_images: [1, 2, 3].map(id => `${origin}/images/banner-${id}.webp`) },
    categories: [{ id: 1, name: 'Products', items: Array.from({ length: 60 }, (_, index) => ({ id: index + 1, name: `Product ${index + 1}`, price: 10, description: 'Image loading verification', images: [`${origin}/images/product-${index + 1}.webp`] })) },
        { id: 2, name: 'Closed category', items: [{ id: 100, name: 'Hidden product', price: 10, images: [`${origin}/images/hidden.webp`] }] }],
} }));
app.listen(port, '127.0.0.1', () => console.log(`Image QA fixture: ${origin}; GET /__stats for real image request counts`));
