import { absoluteUrl, imageUrl, siteConfig } from "./seoConfig.js";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.brandAliases,
    url: siteConfig.baseUrl,
    logo: imageUrl("/logo.png"),
    image: imageUrl("/logo.png"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.socialLinks,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    description:
      "WebReich is a software company in Akola, Maharashtra, building custom software, web applications, CRM products, automation systems, and digital infrastructure for businesses across India.",
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.baseUrl}/#localbusiness`,
    name: siteConfig.legalName,
    alternateName: siteConfig.brandAliases,
    url: siteConfig.baseUrl,
    image: imageUrl("/logo.png"),
    logo: imageUrl("/logo.png"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.latitude,
      longitude: siteConfig.coordinates.longitude,
    },
    areaServed: [
      { "@type": "City", name: "Akola" },
      { "@type": "State", name: "Maharashtra" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Web development",
      "CRM software",
      "Restaurant software",
      "Gold rate software",
      "Business automation",
      "React.js",
      "Firebase",
      "SaaS products",
    ],
    makesOffer: [
      "Custom software development",
      "CRM development",
      "Web application development",
      "Business process automation",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: { "@type": "Country", name: "India" },
        provider: { "@id": `${siteConfig.baseUrl}/#organization` },
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    name: siteConfig.brandName,
    alternateName: siteConfig.brandAliases,
    url: siteConfig.baseUrl,
    publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function softwareApplicationSchema(item) {
  const name = item.title || item.productName || "WebReich Software";
  const slug = slugFor(item.id || name);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: item.category || "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/products/${slug}`),
    image: imageUrl(item.image || "/P3.png"),
    description: item.description || item.summary,
    creator: { "@id": `${siteConfig.baseUrl}/#organization` },
  };
}

export function productSchema(item) {
  const name = item.title || item.productName || "WebReich Product";
  const slug = slugFor(item.id || name);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: siteConfig.brandName },
    url: absoluteUrl(`/products/${slug}`),
    image: imageUrl(item.image || "/P3.png"),
    description: item.description || item.summary,
    category: item.category || "Software",
  };
}

export function articleSchema(item, path) {
  const title = item.title || "WebReich Insight";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: item.excerpt || item.summary,
    image: imageUrl(item.image || "/hero.png"),
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    author: {
      "@type": "Person",
      name: item.author || "WebReich Team",
    },
    publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    datePublished: item.createdAtText || "2026-05",
    dateModified: item.updatedAtText || item.createdAtText || "2026-05",
  };
}

export function personSchema({ name, role, url, sameAs = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    worksFor: { "@id": `${siteConfig.baseUrl}/#organization` },
    url: url || siteConfig.baseUrl,
    sameAs,
  };
}

export function faqSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function slugFor(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
