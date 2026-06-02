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

const siteUrl = (env.VITE_SITE_URL || 'https://www.vallalfoods.com').replace(/\/+$/, '');
const apiUrl = (env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.4' },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.4' },
  { path: '/refund-cancellation-policy', changefreq: 'yearly', priority: '0.4' },
  { path: '/safety-guidelines', changefreq: 'yearly', priority: '0.4' },
  { path: '/user-verification-policy', changefreq: 'yearly', priority: '0.4' }
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

const xmlEscape = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toAbsoluteUrl = (value = '') => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith('/') ? value : `/${value}`, `${siteUrl}/`).toString();
};

const toLastmod = (value) => {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
};

const fetchAllProducts = async () => {
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

    return allProducts;
  } catch (error) {
    console.warn('[seo] Could not fetch dynamic product URLs for sitemap:', error.message);
    return [];
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.warn('[seo] Could not fetch dynamic category URLs for sitemap:', error.message);
    return [];
  }
};

const buildImageNodes = (images = [], title = '') => {
  const uniqueImages = [...new Set(images.filter(Boolean))];

  return uniqueImages
    .map((imageUrl) => {
      const absoluteImageUrl = toAbsoluteUrl(imageUrl);
      if (!absoluteImageUrl) return '';

      return [
        '    <image:image>',
        `      <image:loc>${xmlEscape(absoluteImageUrl)}</image:loc>`,
        title ? `      <image:title>${xmlEscape(title)}</image:title>` : '',
        '    </image:image>'
      ]
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean)
    .join('\n');
};

const toXmlUrlEntry = ({ path: route, lastmod, changefreq, priority, images, imageTitle }) => {
  const imageNodes = buildImageNodes(images, imageTitle);

  return [
    '  <url>',
    `    <loc>${xmlEscape(toAbsoluteUrl(route))}</loc>`,
    `    <lastmod>${xmlEscape(toLastmod(lastmod))}</lastmod>`,
    `    <changefreq>${xmlEscape(changefreq)}</changefreq>`,
    `    <priority>${xmlEscape(priority)}</priority>`,
    imageNodes,
    '  </url>'
  ]
    .filter(Boolean)
    .join('\n');
};

await fs.mkdir(publicDir, { recursive: true });

const [products, categories] = await Promise.all([fetchAllProducts(), fetchCategories()]);

const sitemapEntries = [
  ...staticPages.map((page) => ({ ...page, lastmod: new Date() })),
  ...categories
    .filter((category) => category?.slug)
    .map((category) => ({
      path: `/categories/${category.slug}`,
      lastmod: category.updatedAt,
      changefreq: 'weekly',
      priority: '0.7',
      images: category.image ? [category.image] : [],
      imageTitle: category.name
    })),
  ...products
    .filter((product) => product?.slug)
    .map((product) => ({
      path: `/products/${product.slug}`,
      lastmod: product.updatedAt,
      changefreq: 'weekly',
      priority: '0.8',
      images: product.images || [],
      imageTitle: product.name
    }))
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries.map(toXmlUrlEntry).join('\n')}
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
