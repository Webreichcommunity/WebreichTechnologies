import { Helmet } from "react-helmet-async";
import { absoluteUrl, imageUrl, routeSeo, siteConfig } from "./seoConfig";
import {
  breadcrumbSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "./structuredData";

function cleanJsonLd(items = []) {
  return items.filter(Boolean);
}

export default function SEO({
  page = "overview",
  title,
  description,
  path,
  image,
  keywords = [],
  type = "website",
  robots = "index, follow, max-image-preview:large",
  structuredData = [],
  breadcrumbs = [],
}) {
  const config = routeSeo[page] || routeSeo.overview;
  const seoTitle = title || config.title;
  const seoDescription = description || config.description;
  const canonicalPath = path || config.path || "/";
  const canonical = absoluteUrl(canonicalPath);
  const previewImage = imageUrl(image || config.image || siteConfig.defaultImage);
  const keywordList = [...(config.keywords || []), ...keywords].filter(Boolean);
  const jsonLd = cleanJsonLd([
    organizationSchema(),
    localBusinessSchema(),
    websiteSchema(),
    breadcrumbs.length ? breadcrumbSchema(breadcrumbs) : null,
    ...structuredData,
  ]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {keywordList.length > 0 && <meta name="keywords" content={keywordList.join(", ")} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta name="author" content={siteConfig.legalName} />
      <meta name="publisher" content={siteConfig.legalName} />
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Akola, Maharashtra, India" />
      <meta name="geo.position" content={`${siteConfig.coordinates.latitude};${siteConfig.coordinates.longitude}`} />
      <meta name="ICBM" content={`${siteConfig.coordinates.latitude}, ${siteConfig.coordinates.longitude}`} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.brandName} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={previewImage} />
      <meta property="og:image:alt" content={`${siteConfig.brandName} software company preview`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={previewImage} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
