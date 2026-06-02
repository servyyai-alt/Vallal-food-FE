import { siteConfig, toAbsoluteUrl } from './site';

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.siteName,
  url: toAbsoluteUrl('/'),
  logo: toAbsoluteUrl('/logo.jpeg'),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer support',
      email: siteConfig.email,
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil']
    }
  ]
});

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.siteName,
  url: toAbsoluteUrl('/'),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${toAbsoluteUrl('/products')}?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

export const buildLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'GroceryStore',
  name: siteConfig.siteName,
  url: toAbsoluteUrl('/'),
  image: toAbsoluteUrl(siteConfig.defaultImage),
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    ...siteConfig.address
  },
  openingHoursSpecification: siteConfig.openingHours.map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    ...entry
  }))
});

export const buildBreadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path)
  }))
});

export const buildProductSchema = (product) => {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: (product.images || []).map((image) => toAbsoluteUrl(image)),
    sku: product.sku || product.slug || product._id,
    category: product.category?.name,
    brand: {
      '@type': 'Brand',
      name: siteConfig.shortName
    },
    offers: {
      '@type': 'Offer',
      url: toAbsoluteUrl(`/products/${product.slug}`),
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    aggregateRating: product.numReviews > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.numReviews
        }
      : undefined
  };
};
