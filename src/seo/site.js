export const siteConfig = {
  siteName: 'Vallal Food Products',
  shortName: 'Vallal Food',
  defaultTitle: 'Vallal Food Products | Natural Homemade Foods and Groceries',
  titleTemplate: '%s | Vallal Food Products',
  defaultDescription:
    'Shop natural, homemade, and fresh food products from Vallal Food Products with doorstep delivery, secure online payments, and customer support.',
  defaultKeywords:
    'Vallal Food Products, homemade food, natural food, groceries online, fresh food delivery, organic food, healthy food products',
  defaultRobots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  defaultImage: '/og-default.png',
  defaultLocale: 'en_IN',
  twitterCard: 'summary_large_image',
  phone: '+91 98422 09470',
  email: 'vallalfoods@gmail.com',
  address: {
    streetAddress: '22, Tharmasalai Veethi',
    addressLocality: 'Vadalur',
    addressRegion: 'Tamil Nadu',
    postalCode: '607303',
    addressCountry: 'IN'
  },
  openingHours: [
    { dayOfWeek: 'Monday', opens: '08:00', closes: '20:00' },
    { dayOfWeek: 'Tuesday', opens: '08:00', closes: '20:00' },
    { dayOfWeek: 'Wednesday', opens: '08:00', closes: '20:00' },
    { dayOfWeek: 'Thursday', opens: '08:00', closes: '20:00' },
    { dayOfWeek: 'Friday', opens: '08:00', closes: '20:00' },
    { dayOfWeek: 'Saturday', opens: '08:00', closes: '20:00' }
  ]
};

export const getSiteUrl = () => {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return 'http://localhost:5173';
};

export const toAbsoluteUrl = (path = '/') => {
  if (!path) return getSiteUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
};
