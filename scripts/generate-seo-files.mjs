import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { blogs, labs, products, projects } from "../src/data/webreichContent.js";
import { absoluteUrl, routeSeo, siteConfig } from "../src/seo/seoConfig.js";
import {
  articleSchema,
  localBusinessSchema,
  organizationSchema,
  productSchema,
  softwareApplicationSchema,
  slugFor,
  websiteSchema,
} from "../src/seo/structuredData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const publicDir = resolve(root, "public");
const today = new Date().toISOString().slice(0, 10);

function route(path, priority = "0.7", changefreq = "weekly") {
  return { loc: absoluteUrl(path), lastmod: today, priority, changefreq };
}

function itemSlug(item) {
  return slugFor(item.title || item.productName || item.workName || item.id);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function writePublicFile(name, content) {
  await mkdir(publicDir, { recursive: true });
  await writeFile(resolve(publicDir, name), content);
}

const staticRoutes = Object.values(routeSeo).map((item) =>
  route(item.path, item.path === "/" ? "1.0" : "0.82")
);

const dynamicRoutes = [
  ...products.map((item) => route(`/products/${itemSlug(item)}`, "0.78")),
  ...projects.map((item) => route(`/work/${itemSlug(item)}`, "0.76")),
  ...labs.map((item) => route(`/engineering/${itemSlug(item)}`, "0.72")),
  ...blogs.map((item) => route(`/insight/${itemSlug(item)}`, "0.72")),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...dynamicRoutes]
  .map(
    (item) => `  <url>
    <loc>${xmlEscape(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /generate-certificates
Disallow: /internship-webreich-@3535

Sitemap: ${siteConfig.baseUrl}/sitemap.xml
`;

const manifest = {
  name: "WebReich Technologies",
  short_name: "WebReich",
  description:
    "Premium Indian software company building platforms, CRM products, restaurant technology, automation systems, and business operating infrastructure.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#10100f",
  theme_color: siteConfig.themeColor,
  orientation: "portrait-primary",
  icons: [
    { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ],
  categories: ["business", "productivity", "technology"],
};

const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/logo.png"/>
      <TileColor>${siteConfig.themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema(),
    localBusinessSchema(),
    websiteSchema(),
    ...products.flatMap((item) => [productSchema(item), softwareApplicationSchema(item)]),
    ...blogs.map((item) => articleSchema(item, `/insight/${itemSlug(item)}`)),
  ],
};

await writePublicFile("sitemap.xml", sitemap);
await writePublicFile("robots.txt", robots);
await writePublicFile("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
await writePublicFile("browserconfig.xml", browserConfig);
await writePublicFile("structured-data.json", `${JSON.stringify(structuredData, null, 2)}\n`);

console.log("Generated SEO crawler files in public/.");
