import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');

const parseEnvFile = async (filename) => {
  const filePath = path.join(projectRoot, filename);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim();
          return [key, value];
        })
    );
  } catch {
    return {};
  }
};

const env = {
  ...(await parseEnvFile('.env')),
  ...(await parseEnvFile('.env.local')),
  ...process.env
};

const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');
const apiUrl = (env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const staticRoutes = [
  '/',
  '/products',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-cancellation-policy',
  '/safety-guidelines',
  '/user-verification-policy'
];

const disallowRoutes = [
  '/admin',
  '/login',
  '/register',
  '/cart',
  '/checkout',
  '/orders',
  '/profile',
  '/wishlist',
  '/order-confirmation',
  '/payment-demo'
];

const fetchProductUrls = async () => {
  try {
    const firstPage = await fetch(`${apiUrl}/products?page=1&limit=200`);
    if (!firstPage.ok) {
      throw new Error(`Failed to fetch products: ${firstPage.status}`);
    }

    const firstPageData = await firstPage.json();
    const pages = Number(firstPageData.pages || 1);
    const allProducts = [...(firstPageData.products || [])];

    for (let pageNumber = 2; pageNumber <= pages; pageNumber += 1) {
      const response = await fetch(`${apiUrl}/products?page=${pageNumber}&limit=200`);
      if (!response.ok) break;
      const data = await response.json();
      allProducts.push(...(data.products || []));
    }

    return allProducts
      .filter((product) => product?.slug)
      .map((product) => `/products/${product.slug}`);
  } catch (error) {
    console.warn('[seo] Could not fetch dynamic product URLs for sitemap:', error.message);
    return [];
  }
};

const toXmlUrlEntry = (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/products/') ? '0.8' : '0.7'}</priority>
  </url>`;

await fs.mkdir(publicDir, { recursive: true });

const dynamicProductRoutes = await fetchProductUrls();
const sitemapRoutes = [...new Set([...staticRoutes, ...dynamicProductRoutes])];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(toXmlUrlEntry).join('\n')}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /
${disallowRoutes.map((route) => `Disallow: ${route}`).join('\n')}

Sitemap: ${siteUrl}/sitemap.xml
`;

await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
await fs.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(`[seo] Generated robots.txt and sitemap.xml for ${siteUrl}`);
