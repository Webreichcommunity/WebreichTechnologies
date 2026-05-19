export const siteConfig = {
  brandName: "WebReich",
  legalName: "WebReich Technologies",
  baseUrl: "https://webreich.in",
  defaultImage: "/logo.png",
  themeColor: "#f97316",
  locale: "en_IN",
  email: "webreichcommunity@gmail.com",
  phone: "+91 86687 22207",
  address: {
    locality: "Akola",
    region: "Maharashtra",
    country: "IN",
  },
  coordinates: {
    latitude: "20.7002",
    longitude: "77.0082",
  },
  socialLinks: [
    "https://github.com/Webreichcommunity",
    "https://www.linkedin.com/company/webreich/",
    "https://www.instagram.com/webreich/",
  ],
  brandAliases: [
    "Webreich",
    "Web Rich",
    "Webrich",
    "Webriech",
    "Webrichh",
    "Webreich Technologies",
  ],
};

const sharedKeywords = [
  "WebReich",
  "Webreich",
  "Web Rich",
  "Webreich Technologies",
  "Web development company in Akola",
  "software company Akola",
  "Maharashtra software company",
  "business automation systems India",
  "React developers Akola",
  "SaaS company Maharashtra",
];

export const routeSeo = {
  overview: {
    path: "/",
    title: "WebReich - Digital Infrastructure for Modern Businesses",
    description:
      "WebReich builds software platforms, automation systems, CRM products, and operational tools for modern businesses across India.",
    image: "/w-p8.png",
    keywords: [
      ...sharedKeywords,
      "software company India",
      "digital infrastructure",
      "software systems",
      "modern business systems",
    ],
  },
  products: {
    path: "/products",
    title: "WebReich Products - CRM, Restaurant OS, Gold Rate and Automation Software",
    description:
      "Explore WebReich software products for CRM, restaurant technology, gold rate displays, business automation, and SaaS operating systems.",
    image: "/w-p7.png",
    keywords: [
      ...sharedKeywords,
      "CRM software company India",
      "Restaurant software India",
      "Gold rate software",
      "WebReich products",
      "WebReich CRM",
      "WebReich restaurant OS",
    ],
  },
  work: {
    path: "/work",
    title: "WebReich Work - Custom Software and Web Development in Akola",
    description:
      "Selected WebReich projects across websites, CRM systems, business platforms, and custom software development for Maharashtra businesses.",
    image: "/lahole.png",
    keywords: [
      ...sharedKeywords,
      "Best web developers in Akola",
      "custom software development Maharashtra",
      "software projects Maharashtra",
      "business websites Akola",
    ],
  },
  industries: {
    path: "/industries",
    title: "Industries WebReich Serves - Restaurant, Jewellery, Construction and Retail Software",
    description:
      "WebReich builds restaurant technology, jewellery digital solutions, construction CRM, retail systems, and automation for operational businesses.",
    image: "/w-p5.png",
    keywords: [
      ...sharedKeywords,
      "restaurant technology",
      "jewellery digital solutions",
      "construction CRM",
      "retail systems",
      "manufacturing automation",
    ],
  },
  vision: {
    path: "/vision",
    title: "WebReich Vision - Indian Software Innovation for Business Operations",
    description:
      "Learn WebReich's mission to build practical Indian software innovation, operational technology, and product-backed infrastructure for businesses.",
    image: "/solar.png",
    keywords: [
      ...sharedKeywords,
      "WebReich mission",
      "Indian software innovation",
      "startup ecosystem India",
      "operational technology",
    ],
  },
  insights: {
    path: "/insights",
    title: "WebReich Insights - Software, Automation and Startup Operating Notes",
    description:
      "Read WebReich insights on software platforms, automation systems, business infrastructure, careers, and company building in India.",
    image: "/w-p8.png",
    keywords: [
      ...sharedKeywords,
      "software insights India",
      "business automation articles",
      "startup software systems",
    ],
  },
  founders: {
    path: "/founders",
    title: "WebReich Founders - Shriyash Rulhe and Akshay Bhaltilak",
    description:
      "Meet WebReich founders Shriyash Rulhe and Akshay Bhaltilak, builders focused on software products, automation, and Indian business systems.",
    image: "/w-p6.png",
    keywords: [
      ...sharedKeywords,
      "Shriyash Rulhe",
      "Akshay Bhaltilak",
      "WebReich founder",
      "Indian tech entrepreneur",
    ],
  },
  engineering: {
    path: "/engineering",
    title: "WebReich Engineering - React, Firebase, PWA and Scalable Software Systems",
    description:
      "Explore WebReich engineering across React.js, Firebase systems, PWA architecture, automation experiments, and scalable modern software stacks.",
    image: "/w-p3.png",
    keywords: [
      ...sharedKeywords,
      "React.js engineering",
      "Firebase systems",
      "PWA architecture",
      "modern software stack",
      "React developers Akola",
    ],
  },
  careers: {
    path: "/careers",
    title: "WebReich Careers - Software Internships and Startup Careers in Akola",
    description:
      "Build practical experience with WebReich internships, React training, software projects, certificates, and startup career opportunities in Maharashtra.",
    image: "/stamp.png",
    keywords: [
      ...sharedKeywords,
      "internships Akola",
      "software internships Maharashtra",
      "React internships",
      "startup careers India",
    ],
  },
  connect: {
    path: "/connect",
    title: "Contact WebReich - Software Company in Akola, Maharashtra",
    description:
      "Contact WebReich for software platforms, CRM products, restaurant technology, websites, automation systems, and business consultation.",
    image: "/logo.png",
    keywords: [
      ...sharedKeywords,
      "contact WebReich",
      "software company Akola",
      "WebReich office",
      "software consultation Maharashtra",
    ],
  },
};

export const aliasRedirects = [
  { from: "/founder", to: "/founders" },
  { from: "/labs", to: "/engineering" },
  { from: "/journal", to: "/insights" },
  { from: "/contact", to: "/connect" },
  { from: "/ecosystem", to: "/" },
  { from: "/infrastructure", to: "/engineering" },
];

export function absoluteUrl(path = "/") {
  if (String(path).startsWith("http")) return path;
  return `${siteConfig.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function imageUrl(image = siteConfig.defaultImage) {
  return absoluteUrl(image);
}
