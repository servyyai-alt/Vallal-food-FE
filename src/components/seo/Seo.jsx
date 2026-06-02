import { Helmet } from 'react-helmet-async';
import { siteConfig, toAbsoluteUrl } from '../../seo/site';
import { buildOrganizationSchema, buildWebsiteSchema } from '../../seo/schema';

export default function Seo({
  title,
  description,
  keywords,
  path = '/',
  image,
  robots,
  canonical,
  schema = [],
  type = 'website'
}) {
  const pageTitle = title ? siteConfig.titleTemplate.replace('%s', title) : siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.defaultDescription;
  const pageKeywords = keywords || siteConfig.defaultKeywords;
  const pageUrl = canonical || toAbsoluteUrl(path);
  const pageImage = toAbsoluteUrl(image || siteConfig.defaultImage);
  const pageRobots = robots || siteConfig.defaultRobots;

  const schemas = [buildOrganizationSchema(), buildWebsiteSchema(), ...schema].filter(Boolean);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content={pageRobots} />
      <meta name="googlebot" content={pageRobots} />
      <meta name="theme-color" content="#16a34a" />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:locale" content={siteConfig.defaultLocale} />

      <meta name="twitter:card" content={siteConfig.twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {import.meta.env.VITE_GSC_VERIFICATION ? (
        <meta name="google-site-verification" content={import.meta.env.VITE_GSC_VERIFICATION} />
      ) : null}

      {schemas.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
