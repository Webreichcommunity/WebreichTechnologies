export const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const products = [
  {
    id: "restaurant-os",
    title: "Restaurant OS",
    category: "Hospitality SaaS",
    summary:
      "A connected operating layer for restaurants: digital menu, kitchen clarity, billing insight, customer memory, and owner dashboards.",
    description:
      "Restaurant OS is designed for hospitality teams that need faster updates, cleaner service flow, and daily visibility without heavy enterprise software.",
    status: "Build-ready",
    image: "/mirch.png",
    images: ["/mirch.png", "/w-p2.png", "/w-p3.png"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: ["QR ordering", "Kitchen workflow", "Menu intelligence", "Revenue analytics"],
    clientFeedbackOne: "The menu updates became simpler and the brand presentation felt much more premium.",
    clientOneName: "Restaurant Partner",
    clientOnePost: "Owner",
    clientFeedbackTwo: "The operating view helped us understand what customers were actually asking for.",
    clientTwoName: "Hospitality Team",
    clientTwoPost: "Manager",
  },
  {
    id: "civil-crm",
    title: "Civil CRM",
    category: "Construction Operations",
    summary:
      "CRM and project-tracking software for contractors, developers, consultants, and site teams.",
    description:
      "Civil CRM brings inquiries, site updates, quotations, follow-ups, documents, and owner visibility into one calm workspace.",
    status: "Prototype",
    image: "/w-p7.png",
    images: ["/w-p7.png", "/w-p8.png", "/w-p6.png"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: ["Lead pipeline", "Site updates", "Quotation flow", "Follow-up reminders"],
    clientFeedbackOne: "The follow-up discipline improved because every lead had a visible next step.",
    clientOneName: "Construction Client",
    clientOnePost: "Director",
    clientFeedbackTwo: "Project conversations became easier to track across office and site teams.",
    clientTwoName: "Site Operations",
    clientTwoPost: "Coordinator",
  },
  {
    id: "gold-rate-board",
    title: "Gold Rate Board",
    category: "Jewellery Tech",
    summary:
      "A live gold-rate display and customer communication system for jewellery showrooms.",
    description:
      "A showroom-ready digital rate board that improves trust, keeps staff aligned, and gives jewellery brands a sharper in-store presence.",
    status: "Concept",
    image: "/w-p1.png",
    images: ["/w-p1.png", "/w-p4.png", "/w-p5.png"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: ["Live rate board", "Branch display", "WhatsApp sharing", "Brand templates"],
    clientFeedbackOne: "Customers understood rates faster because the display looked official and current.",
    clientOneName: "Jewellery Partner",
    clientOnePost: "Store Owner",
    clientFeedbackTwo: "The branch-ready display concept matched how our sales team works.",
    clientTwoName: "Retail Lead",
    clientTwoPost: "Sales Head",
  },
];

export const projects = [
  {
    id: "lahole-eye-crm",
    title: "Lahole Eye Hospital CRM",
    industry: "Healthcare",
    summary:
      "A clinic workflow system for patient records, appointments, follow-ups, and internal visibility.",
    description:
      "WebReich studied the patient journey and shaped a responsive CRM that makes records easier to find, appointments easier to manage, and daily admin work more predictable.",
    workLink: "https://webreich.in",
    image: "/lahole.png",
    images: ["/lahole.png", "/w-p7.png", "/w-p8.png"],
    clientFeedback: "The team received a cleaner view of patient information and appointment flow.",
    clientName: "Lahole Eye Hospital",
    problem: "Patient records, appointments, and follow-ups needed a cleaner operating system.",
    solution: "A custom CRM for patient flow, history, appointments, and internal team visibility.",
    result: "Reduced admin friction and improved access to patient data.",
    technologies: "React, Firebase, Firestore, responsive dashboards",
  },
  {
    id: "mirch-menu",
    title: "Digital Menu for Restaurants",
    industry: "Hotel",
    summary:
      "A QR-first digital menu experience for faster content updates and premium food presentation.",
    description:
      "The experience turns the restaurant menu into a live digital asset with categories, visuals, offer space, and easier updates for the owner.",
    workLink: "https://webreich.in",
    image: "/mirch.png",
    images: ["/mirch.png", "/w-p2.png", "/w-p3.png"],
    clientFeedback: "Menu edits became quick and the customer-facing experience looked sharper.",
    clientName: "Restaurant Client",
    problem: "Printed menus were slow to update and did not support visual upselling.",
    solution: "A QR-first digital menu with fast content updates and rich item presentation.",
    result: "Better menu control and more premium customer experience.",
    technologies: "React, QR flows, Firebase, hosting automation",
  },
  {
    id: "nursery-commerce",
    title: "Nursery Commerce Platform",
    industry: "Education and Retail",
    summary:
      "A catalog-led commerce interface for discovery, inquiry, and local customer trust.",
    description:
      "The platform presents inventory in a structured way and turns browsing into clean customer inquiries for local teams.",
    workLink: "https://webreich.in",
    image: "/w-p5.png",
    images: ["/w-p5.png", "/w-p6.png", "/w-p1.png"],
    clientFeedback: "The catalog made the business easier to discover and explain online.",
    clientName: "Retail Partner",
    problem: "Plant catalog, inquiries, and local sales needed a digital layer.",
    solution: "A catalog-led commerce website for discovery, trust, and order inquiries.",
    result: "Expanded visibility for local customers and repeat buyers.",
    technologies: "React, catalog UI, inquiry workflow, responsive design",
  },
];

export const blogs = [
  {
    id: "software-for-real-businesses",
    title: "Software for Real Indian Businesses",
    image: "/w-p8.png",
    author: "WebReich Team",
    authorBio:
      "The WebReich team writes from active product and client work across software systems, automation, and business operations.",
    readTime: "2 min read",
    excerpt:
      "The next useful software wave will serve owner-led businesses that need clarity, automation, and trust.",
    body:
      "**WebReich** is focused on practical software: systems that help restaurants, clinics, retailers, contractors, and institutions operate better. The opportunity is not only in building more apps. It is in building operational confidence.\n\nA useful system gives the owner a clearer view, gives staff a faster daily flow, and gives customers a more trustworthy experience. That is why WebReich studies records, inquiries, follow-ups, dashboards, payments, and communication before deciding what to build.",
    createdAtText: "May 2026",
  },
  {
    id: "why-products-matter",
    title: "Why WebReich Is Moving Toward Products",
    image: "/w-p6.png",
    author: "Shriyash Rulhe",
    authorBio:
      "Founder of WebReich, focused on turning service learning into practical products, automation systems, and a stronger Bharat business network.",
    readTime: "2 min read",
    excerpt:
      "Services build cashflow. Products build company value. WebReich is combining both with a product-first roadmap.",
    body:
      "Repeated client problems are signals. When the same workflow appears across businesses, WebReich turns it into reusable product thinking: Restaurant OS, Civil CRM, digital menus, ERP modules, and automation layers.\n\nThe goal is not to copy enterprise software. The goal is to make dependable systems that small and growing teams can understand, adopt, and trust every day.",
    createdAtText: "May 2026",
  },
];

export const industries = [
  {
    name: "Jewellers",
    text:
      "WebReich builds digital systems for jewellery businesses, including live gold rate boards, jewellery e-catalogues, ornament detail pages, pricing breakdowns, and customer-facing product showcases connected with current gold and silver rates.",
  },
  {
    name: "Construction",
    text:
      "For construction and real estate businesses, WebReich builds project showcase websites, civil CRM systems, property CRM platforms, inquiry management tools, quotation records, site updates, and SEO-focused digital profiles that help owners present and manage their work professionally.",
  },
  {
    name: "Stone Crushers",
    text:
      "WebReich creates modern websites for stone crusher businesses that clearly present plant details, services, materials, capacity, location, contact information, and SEO-optimized business content to build stronger local visibility and trust.",
  },
  {
    name: "Political",
    text:
      "WebReich develops election management applications, campaign systems, voter management tools, outreach dashboards, and digital campaign platforms that help political teams organize data, manage communication, and execute election work with better control.",
  },
  {
    name: "Hotel",
    text:
      "For hotels and restaurants, WebReich builds hotel management CRMs, POS systems, inventory management tools, KOT management systems, digital menus, billing workflows, and operational dashboards that help owners upgrade daily hotel operations.",
  },
  {
    name: "Education",
    text:
      "WebReich supports education through software training, student guidance, developer mentorship, and learning portals. Our programs have helped 450+ students grow toward software careers, including placements and opportunities in companies like TCS and Infosys.",
  },
  {
    name: "Healthcare",
    text:
      "WebReich builds patient management systems and hospital management platforms that help clinics and hospitals manage appointments, patient records, staff workflows, billing, and daily operations with cleaner, faster, and more reliable digital systems.",
  },
];

export const labs = [
  {
    id: "gangootri-algo-trading-bot",
    title: "Gangootri Algo Trading Bot",
    text:
      "A research experiment around rules-based trading workflows, strategy testing, risk boundaries, alerts, and decision discipline.",
    image: "https://res.cloudinary.com/dz0dia5a1/image/upload/v1779262111/Screenshot_2026-05-20_125405_otxqje.png",
    problem:
      "Trading decisions often become emotional, inconsistent, and hard to audit when strategy rules live only in a trader's memory.",
    build:
      "WebReich shaped Gangootri as a rules-first engineering experiment: strategy inputs, risk boundaries, alerts, backtesting thinking, and execution discipline are separated into clear modules.",
    outcome:
      "The bot research helped the team understand event-driven systems, market data handling, risk guardrails, and how automation must explain its decisions before it earns trust.",
    stack: "React dashboards, strategy logic, alerts, automation workflows, analytics concepts",
    steps: ["Rule design", "Risk boundaries", "Signal testing", "Dashboard visibility"],
  },
  {
    id: "document-ai-ocr",
    title: "Document AI OCR",
    text:
      "A document intelligence experiment that converts scanned text into structured data for forms, certificates, and business records.",
    image: "https://res.cloudinary.com/dz0dia5a1/image/upload/v1779262109/Screenshot_2026-05-20_125807_p5mizo.png",
    problem:
      "Many business records still arrive as photos, PDFs, and scanned forms, which creates manual entry work and slows down teams.",
    build:
      "The OCR experiment focuses on reading document content, extracting fields, validating confidence, and preparing clean data for certificates, forms, and admin systems.",
    outcome:
      "It created a reusable direction for document automation where staff can review structured data instead of typing every field again.",
    stack: "OCR pipelines, validation UI, Firebase records, document workflows",
    steps: ["Document intake", "Text extraction", "Field validation", "Structured export"],
  },
  {
    id: "workflow-ai-automations",
    title: "Workflow AI Automations",
    text:
      "Internal prototypes for proposal writing, CRM prompts, reminders, reports, and owner-facing summaries.",
    image: "/w-p7.png",
    problem:
      "Owners lose time creating follow-ups, reports, proposal notes, and daily summaries that should come naturally from business data.",
    build:
      "WebReich experiments with AI-assisted prompts connected to CRM context, inquiry records, task reminders, and owner dashboards.",
    outcome:
      "The work informs future automation products that save time while keeping the operator in control of the final decision.",
    stack: "Prompt workflows, CRM context, reporting UI, automation triggers",
    steps: ["Context capture", "Prompt design", "Human review", "Owner summary"],
  },
];

export const navItems = [
  { label: "Overview", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Work", path: "/work" },
  { label: "Industries", path: "/industries" },
  { label: "Engineering", path: "/engineering" },
  { label: "Insights", path: "/insights" },
  { label: "Vision", path: "/vision" },
  { label: "Founders", path: "/founders" },
  { label: "Careers", path: "/careers" },
  { label: "Connect", path: "/connect" },
];
