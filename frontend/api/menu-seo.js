/**
 * Vercel Serverless Function for SEO-optimized menu pages
 *
 * For crawlers (Google, Bing, etc.): Returns HTML with proper SEO meta tags
 * For regular users: The SPA handles rendering via client-side routing
 *
 * This ensures search engines can crawl and index the correct title/description
 * while users still get the full interactive React experience.
 */

const BACKEND_API_URL = process.env.VITE_API_URL || 'https://your-backend.vercel.app';

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Extract subdomain from hostname
 */
function getSubdomainSlug(hostname) {
    const baseDomain = process.env.BASE_DOMAIN || 'onipos.com';

    if (hostname && hostname.endsWith(`.${baseDomain}`)) {
        const subdomain = hostname.replace(`.${baseDomain}`, '');
        if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'admin') {
            return subdomain;
        }
    }
    return null;
}

/**
 * Check if the request is from a known crawler/bot
 */
function isCrawler(userAgent) {
    if (!userAgent) return false;
    const crawlerPatterns = [
        'googlebot', 'google-inspectiontool', 'storebot-google',
        'bingbot', 'bingpreview',
        'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
        'facebookexternalhit', 'facebot',
        'twitterbot', 'linkedinbot', 'pinterest',
        'whatsapp', 'telegrambot', 'slackbot', 'discordbot',
        'applebot', 'ia_archiver',
        'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot',
        'seznambot', 'rogerbot', 'exabot'
    ];
    const ua = userAgent.toLowerCase();
    return crawlerPatterns.some(pattern => ua.includes(pattern));
}

/**
 * Generate SEO HTML for menu page
 */
function generateSeoHtml(menuData, slug, isSubdomain) {
    const title = menuData.meta_title || menuData.business_name || 'Menu';
    const description = menuData.description || `Digital menu for ${menuData.business_name}`;
    const logoUrl = menuData.logo_url || 'https://onipos.com/favicon.png';
    const canonicalUrl = isSubdomain
        ? `https://${slug}.onipos.com/`
        : `https://onipos.com/menu/${slug}`;

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeBusinessName = escapeHtml(menuData.business_name);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="${logoUrl}">

    <!-- Primary Meta Tags -->
    <title>${safeTitle}</title>
    <meta name="title" content="${safeTitle}">
    <meta name="description" content="${safeDescription}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${logoUrl}">
    <meta property="og:site_name" content="${safeBusinessName}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${logoUrl}">

    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}">

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; }
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            padding: 20px;
        }
        .content { max-width: 400px; }
        h1 { margin-bottom: 12px; color: #1f2937; font-size: 1.75rem; }
        p { color: #6b7280; line-height: 1.6; }
        .meta { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
        .meta p { font-size: 0.875rem; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>${safeBusinessName}</h1>
            <p>${safeDescription}</p>
            <div class="meta">
                <p>View our digital menu at <a href="${canonicalUrl}">${canonicalUrl}</a></p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

export default async function handler(req, res) {
    try {
        const hostname = req.headers.host || req.headers['x-forwarded-host'] || '';
        const userAgent = req.headers['user-agent'] || '';
        const subdomainSlug = getSubdomainSlug(hostname.split(':')[0]);

        // Get slug from query param or subdomain
        const slug = req.query.slug || subdomainSlug;

        if (!slug) {
            return res.status(400).send('Menu not specified');
        }

        // For non-crawler requests, let the normal SPA handle it
        // This function is specifically for SEO - serving meta tags to crawlers
        const isBot = isCrawler(userAgent);

        // Fetch menu data from backend API
        const apiUrl = `${BACKEND_API_URL}/api/public/menu/${slug}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Menu Not Found</title>
    <meta name="robots" content="noindex">
</head>
<body>
    <h1>Menu not found</h1>
</body>
</html>`);
            }
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.menu) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(404).send('Menu not found');
        }

        const html = generateSeoHtml(data.menu, slug, !!subdomainSlug);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');

        // Cache longer for bots, shorter for potential user requests
        if (isBot) {
            res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
        } else {
            res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        }

        res.status(200).send(html);
    } catch (error) {
        console.error('Menu SEO error:', error);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error</title>
</head>
<body>
    <h1>Server error</h1>
</body>
</html>`);
    }
}
