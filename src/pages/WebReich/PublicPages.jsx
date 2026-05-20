import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock,
  Cpu,
  ExternalLink,
  Flame,
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Rocket,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  blogs,
  industries,
  labs,
  normalizeList,
  products,
  projects,
} from "../../data/webreichContent";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { authReady, db } from "../../Firebase/config";
import SEO from "../../seo/SEO";
import {
  articleSchema,
  faqSchema,
  personSchema,
  productSchema,
  softwareApplicationSchema,
} from "../../seo/structuredData";

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const lift = {
  initial: { opacity: 0, y: 34, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-80px" },
  variants: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  },
};

const staggerItem = {
  variants: {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: "easeOut" } },
  },
};

const pageVisuals = {
  Products: {
    image: "/w-p7.png",
    label: "Reusable platforms",
    caption: "Vertical SaaS thinking for restaurants, construction, retail, jewellery, and internal operations.",
  },
  Work: {
    image: "/lahole.png",
    label: "Client systems",
    caption: "Real workflows shaped into calmer software for teams, owners, and customers.",
  },
  Industries: {
    image: "/w-p5.png",
    label: "Sector depth",
    caption: "Business rhythm, staff behavior, customer trust, and reporting needs guide every build.",
  },
  "Vision and Mission": {
    image: "/solar.png",
    label: "Company direction",
    caption: "A product-backed software company built from practical execution and long-term trust.",
  },
  Insights: {
    image: "/w-p8.png",
    label: "Company thinking",
    caption: "Notes on software, automation, business systems, and building useful products.",
  },
  Insight: {
    image: "/w-p8.png",
    label: "Editorial",
    caption: "A field note from the way WebReich studies and builds software.",
  },
  Founders: {
    image: "/w-p6.png",
    label: "Founder-led",
    caption: "Close to product decisions, client conversations, and execution quality.",
  },
  Engineering: {
    image: "/w-p3.png",
    label: "Build culture",
    caption: "Experiments, automation, and reusable architecture for WebReich products.",
  },
  Careers: {
    image: "/stamp.png",
    label: "Practical growth",
    caption: "Training, internships, certificates, and real project exposure for early builders.",
  },
  Connect: {
    image: "/logo.png",
    label: "Start a build",
    caption: "Product, client system, internship, partnership, or founder conversation.",
  },
  Product: {
    image: "/w-p2.png",
    label: "Product view",
    caption: "A closer look at the problem, workflow, images, feedback, and inquiry path.",
  },
};

const web3AccessKey =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "61179d70-a1dc-4361-ac05-e8a6d5b9650d";

const whatsappMessage =
  "Hello WebReich, I visited your website and want to discuss a software project for my business. Please guide me with the next steps.";

function whatsappLink(phone, message = whatsappMessage) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function itemId(item) {
  return slugify(item.title || item.productName || item.workName || item.id);
}

function itemMatches(item, id) {
  return itemId(item) === id || String(item.id || "") === id;
}

function getTitle(item) {
  return item.title || item.productName || item.workName || "WebReich Project";
}

function getImages(item) {
  const images = normalizeList(item.images || item.imageLinks);
  if (images.length) return images;
  return [item.image || item.imageLink || "/logo.png"];
}

function embedUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.includes("youtube.com/embed/")) return value;
  const watch = value.match(/[?&]v=([^&]+)/);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = value.match(/youtu\.be\/([^?]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;
  return value;
}

function formatDate(value) {
  if (!value) return "WebReich Insight";
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleDateString("en-IN");
  return value.createdAtText || String(value);
}

function getReadTime(item) {
  if (item.readTime) return item.readTime;
  const words = String(item.body || item.post || item.excerpt || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function getAuthorBio(item) {
  return (
    item.authorBio ||
    item.authorInfo ||
    "Writes from WebReich's product desk, where client workflows, automation ideas, and practical software decisions are turned into readable lessons."
  );
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function getOverviewItems(items, count) {
  const selected = items.filter((item) => item.showOnOverview === true);
  return (selected.length ? selected : items).slice(0, count);
}

function labSlug(item) {
  return item.id || slugify(item.title);
}

function getCertificateId(item) {
  if (!item) return "WRI00000000";
  const baseDate = item.endDate || item.createdAtText || new Date().toISOString().slice(0, 10);
  const compactDate = String(baseDate).replace(/[^0-9]/g, "").slice(2, 8).padEnd(6, "0");
  const suffix = String(item.id || item.emailLower || item.email || "01")
    .replace(/[^a-z0-9]/gi, "")
    .slice(-4)
    .toUpperCase()
    .padStart(4, "0");
  return `WRI${compactDate}${suffix}`;
}

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${dark ? "text-orange-300" : "text-orange-600"}`}>
      {children}
    </p>
  );
}

function PageShell({ eyebrow, title, intro, dark = false, image, visualLabel, visualCaption, matteVisual = false, compactHero = false, children }) {
  const visual = pageVisuals[eyebrow] || pageVisuals.Products;
  const heroImage = image || visual.image;
  const caption = visualCaption || visual.caption;
  const label = visualLabel || visual.label;

  if (compactHero) {
    return (
      <main className="webreich-sharp-ui bg-[#f7f2e9] text-stone-950">
        <section className="relative overflow-hidden bg-[#10100f] px-4 pb-10 pt-28 text-white sm:px-6 lg:px-8 lg:pb-12 lg:pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:38px_38px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(249,115,22,.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,0))]" />
          <motion.div {...fade} className="relative mx-auto max-w-7xl">
            <Eyebrow dark>{eyebrow}</Eyebrow>
            <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
            {intro && <p className="mt-5 max-w-3xl text-sm leading-7 text-white/64 sm:text-base">{intro}</p>}
          </motion.div>
        </section>
        {children}
      </main>
    );
  }

  return (
    <main className={`webreich-sharp-ui ${dark ? "bg-[#10100f] text-white" : "bg-[#f7f2e9] text-stone-950"}`}>
      <section className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 lg:px-8 lg:pb-16 lg:pt-36">
        <div className={`absolute inset-x-0 top-0 h-56 ${dark ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0))]" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,242,233,0))]"}`} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[minmax(0,0.92fr)_minmax(440px,1fr)]">
          <motion.div {...fade} className="max-w-4xl">
            <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
            <p className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${dark ? "text-white/64" : "text-stone-600"}`}>
              {intro}
            </p>
          </motion.div>
          <motion.div
            {...lift}
            className={`relative h-[330px] overflow-hidden rounded-[1.1rem] sm:h-[390px] lg:h-[470px] ${matteVisual ? "bg-[#10100f]" : dark ? "bg-white/5" : "bg-stone-200"
              } shadow-2xl shadow-black/10`}
          >
            {matteVisual ? (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:38px_38px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(249,115,22,.22),transparent_32%),linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,0))]" />
                <div className="absolute left-6 top-6 h-16 w-16 border border-orange-300/40" />
                <div className="absolute bottom-6 right-6 h-24 w-24 border border-white/10" />
              </>
            ) : (
              <>
                <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.64))]" />
              </>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">{label}</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/78">{caption}</p>
            </div>
          </motion.div>
        </div>
      </section>
      {children}
    </main>
  );
}

function Section({ eyebrow, title, intro, dark = false, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div {...fade} className="mb-8 max-w-3xl">
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${dark ? "text-white" : "text-stone-950"}`}>
          {title}
        </h2>
        {intro && <p className={`mt-4 leading-7 ${dark ? "text-white/58" : "text-stone-600"}`}>{intro}</p>}
      </motion.div>
      {children}
    </section>
  );
}

function SectionFooter({ to, label, dark = false }) {
  return (
    <motion.div {...fade} className="mt-9">
      <Link
        to={to}
        className={`inline-flex items-center gap-2 border-t pt-4 text-sm font-semibold transition ${dark
          ? "border-white/15 text-orange-300 hover:text-white"
          : "border-stone-300 text-orange-700 hover:text-stone-950"
          }`}
      >
        {label} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}

function DarkTextureBand({ eyebrow, title, text, links = [] }) {
  return (
    <section className="relative overflow-hidden bg-[#10100f] text-white">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:46px_46px]" />
      <motion.div
        {...fade}
        className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
      >
        <div>
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>
        </div>
        <div>
          <p className="text-base leading-8 text-white/66">{text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {links.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className="inline-flex items-center gap-2 border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:border-orange-300 hover:text-orange-300"
              >
                {label} <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function renderRichText(text) {
  const tokens = String(text || "").split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-orange-300 underline decoration-orange-300/40 underline-offset-4">
          {link[1]}
        </a>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

function InquiryModal({ open, onClose, subject }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("idle");

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const payload = {
        access_key: web3AccessKey,
        subject: `WebReich Inquiry - ${subject}`,
        from_name: form.name,
        phone: form.phone,
        message: `Inquiry for ${subject}. Name: ${form.name}. Phone: ${form.phone}.`,
        to_email: "webreichcommunity@gmail.com",
        botcheck: "",
      };
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error("Could not send inquiry");
      setStatus("sent");
      setForm({ name: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="webreich-sharp-ui fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 text-stone-950 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
              Inquiry
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{subject}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-stone-200 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-2xl bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="Your name"
            required
          />
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="rounded-2xl bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="Phone number"
            required
          />
          <button
            className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send inquiry"}
          </button>
        </form>
        {status === "sent" && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <p className="font-semibold">Request submitted successfully.</p>
            <p className="mt-1 text-green-700/80">Thank you. The WebReich team will contact you soon.</p>
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <p className="font-semibold">Request could not be submitted.</p>
            <p className="mt-1 text-red-600/80">Please try again or contact WebReich directly.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ProductCard({ item }) {
  const images = getImages(item);
  const features = normalizeList(item.features);
  return (
    <motion.article {...fade} className="group overflow-hidden rounded-[1.4rem] bg-white shadow-[0_18px_50px_rgba(28,25,23,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(28,25,23,0.14)]">
      <Link to={`/products/${itemId(item)}`} className="block">
        <div className="bg-[#f7f2e9]">
          <img
            src={images[0]}
            alt={getTitle(item)}
            className="block h-auto w-full object-contain transition duration-700 group-hover:scale-[1.015]"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              {item.category || "WebReich Product"}
            </p>
            <span className="bg-stone-950 px-3 py-1 text-xs text-white">
              {item.status || "Active"}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-stone-950">{getTitle(item)}</h3>
          <p className="mt-3 text-sm leading-6 text-stone-600">{item.shortInfo || item.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature) => (
              <span key={feature} className="bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                {feature}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
            Open product <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function WorkCard({ item }) {
  const images = getImages(item);
  return (
    <motion.article {...fade} className="group grid overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_50px_rgba(28,25,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(28,25,23,0.14)] md:grid-cols-[0.9fr_1.1fr]">
      <Link to={`/work/${itemId(item)}`} className="block overflow-hidden bg-[#f7f2e9]">
        <img src={images[0]} alt={getTitle(item)} className="block h-auto w-full object-contain transition duration-700 group-hover:scale-[1.015] md:h-full" loading="lazy" decoding="async" />
      </Link>
      <div className="flex flex-col justify-between p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            {item.industry || "Selected Work"}
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{getTitle(item)}</h3>
          <p className="mt-4 text-sm leading-7 text-stone-600">{item.shortDescription || item.summary || item.description}</p>
        </div>
        <Link to={`/work/${itemId(item)}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
          Open work <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

function DetailImageGallery({ title, images, activeImage, onSelect }) {
  const safeImages = images.length ? images : ["/logo.png"];
  const currentImage = activeImage || safeImages[0];

  return (
    <div className="grid gap-4">
      <div className="bg-white shadow-[0_22px_70px_rgba(28,25,23,0.12)]">
        <div className="flex min-h-[260px] items-center justify-center bg-[#f7f2e9] sm:min-h-[360px] lg:min-h-[500px]">
          <img
            src={currentImage}
            alt={title}
            className="block h-auto max-h-[520px] w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {safeImages.slice(0, 3).map((image, index) => {
            const active = image === currentImage;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onSelect(image)}
                className={`bg-white shadow-sm transition ${active ? "ring-2 ring-orange-500 shadow-lg shadow-orange-100" : "hover:ring-1 hover:ring-stone-300"
                  }`}
              >
                <span className="flex h-24 items-center justify-center bg-[#f7f2e9] sm:h-32">
                  <img
                    src={image}
                    alt={`${title} view ${index + 1}`}
                    className="block h-auto max-h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImageStatement({ eyebrow, title, text, image, points = [], dark = false, reverse = false }) {
  return (
    <section className={dark ? "bg-[#151513]" : "bg-white/52"}>
      <div className={`mx-auto grid max-w-7xl gap-9 px-4 py-16 sm:px-6 lg:min-h-[540px] lg:grid-cols-[minmax(420px,0.95fr)_minmax(0,1fr)] lg:items-center lg:px-8 ${reverse ? "lg:[&>*:first-child]:order-2 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]" : ""}`}>
        <motion.div {...lift} className="h-[330px] overflow-hidden rounded-[1.1rem] bg-stone-200 sm:h-[390px] lg:h-[440px]">
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </motion.div>
        <motion.div {...fade} className="lg:max-w-xl">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <h2 className={`mt-4 text-3xl font-semibold leading-tight sm:text-5xl ${dark ? "text-white" : "text-stone-950"}`}>
            {title}
          </h2>
          <p className={`mt-5 text-base leading-8 ${dark ? "text-white/64" : "text-stone-600"}`}>
            {text}
          </p>
          {points.length > 0 && (
            <div className="mt-7 grid gap-3">
              {points.map((point) => (
                <p key={point} className={`border-l border-orange-300 pl-4 text-sm leading-7 ${dark ? "text-white/68" : "text-stone-700"}`}>
                  {point}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function Overview() {
  const { items: productItems } = useFirestoreCollection("products", products);
  const { items: workItems } = useFirestoreCollection("projects", projects);
  const { items: blogItems } = useFirestoreCollection("blogs", blogs);
  const overviewProducts = getOverviewItems(productItems, 3);
  const overviewWork = getOverviewItems(workItems, 2);
  const overviewInsights = getOverviewItems(blogItems, 2);

  return (
    <main className="webreich-sharp-ui bg-[#f7f2e9] text-stone-950">
      <section className="relative min-h-[86vh] overflow-hidden px-4 pt-28 text-white sm:px-6 lg:min-h-screen lg:px-8">
        <div className="absolute inset-0">
          {/* <img src="/hero.png" alt="" className="h-full w-full object-cover" fetchPriority="high" decoding="async" /> */}

          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://www.pexels.com/download/video/7385122/"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative mx-auto flex min-h-[calc(86vh-7rem)] max-w-7xl flex-col justify-center pb-20 lg:min-h-[calc(100vh-7rem)]">
          <motion.div {...fade} className="max-w-5xl">
            <Eyebrow dark className="text-2xl">WEBREICH</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.03] sm:text-5xl lg:text-6xl">
              Building <span className="text-orange-400">digital infrastructure</span> for modern businesses.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/90">
              WebReich develops software platforms, automation systems, and operational tools that help businesses scale with clarity, speed, and trust.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/connect" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Connect with WebReich <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-stone-950">
                View products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 bg-[#f7f2e9] px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          {...stagger}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            ["6+", "cities where we delivered software and digital systems"],
            ["80+", "real business workflows studied, mapped, and improved"],
            ["AI", "automation-first systems for faster daily operations"],
            ["450+", "students and early builders trained through practical guidance"],
          ].map(([value, label]) => (
            <motion.div
              {...staggerItem}
              key={label}
              className="relative min-h-36 overflow-hidden border border-stone-800 bg-[#0f0f0d] bg-[linear-gradient(135deg,rgba(249,115,22,0.2),rgba(15,15,13,0)_35%),linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:auto,24px_24px,24px_24px] px-4 py-5 text-white shadow-xl shadow-black/15 sm:min-h-40 sm:px-6 sm:py-7"
            >
              <p className="text-3xl font-semibold leading-none text-white sm:text-5xl">{value}</p>
              <p className="mt-3 text-xs font-medium leading-5 text-white/68 sm:text-sm sm:leading-6">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Section
        eyebrow="Company Overview"
        title="One company layer for products, client systems, experiments, and talent."
        intro="WebReich is built around repeatable proof: ship useful systems, learn from real sectors, turn repeated problems into products, and train people around practical execution."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Rocket, "Products", "Reusable software lines for restaurants, construction, jewellery, ERP, and workflow automation.", "/products"],
            [BriefcaseBusiness, "Work", "Selected client systems shaped around business context, not only screens.", "/work"],
            [Cpu, "Engineering", "Labs experiments in trading bots, OCR, and workflow AI.", "/engineering"],
            [Users, "Careers", "Training, internships, certificates, and early builder guidance.", "/careers"],
          ].map(([Icon, title, text, path]) => (
            <Link key={title} to={path} className="group border-t border-stone-300 bg-transparent py-6">
              <Icon className="h-6 w-6 text-orange-600" />
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                Explore <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <ImageStatement
        eyebrow="What We Build"
        title="Software that makes daily business easier to see, control, and scale."
        text="WebReich turns practical business problems into clean digital systems: customer journeys, admin workflows, dashboards, automation, payments, records, inquiries, and owner-level reporting."
        image="/P3.png"
        points={[
          "Products for repeated sector problems, from hospitality to construction and retail.",
          "Client platforms built around real staff behavior, not only attractive screens.",
          "Automation that saves time while keeping the workflow understandable for teams.",
        ]}
      />

      <Section eyebrow="Products" title="Product thinking that grows out of real business friction.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {overviewProducts.map((item) => <ProductCard key={itemId(item)} item={item} />)}
        </div>
        <SectionFooter to="/products" label="See all products" />
      </Section>

      <DarkTextureBand
        eyebrow="Focused Sectors"
        title="We explore deeply, then choose where software can create real operating leverage."
        text="WebReich is not trying to build random apps for every market. We study selected sectors, find repeated problems, and turn the clearest opportunities into products, CRMs, dashboards, and automation systems."
        links={[
          ["Industries", "/industries"],
          ["Engineering", "/engineering"],
        ]}
      />

      <Section eyebrow="Selected Work" title="Proof from systems already shaped for clients.">
        <div className="grid gap-5">
          {overviewWork.map((item) => <WorkCard key={itemId(item)} item={item} />)}
        </div>
        <SectionFooter to="/work" label="See all work" />
      </Section>

      <Section eyebrow="Insights" title="Short notes from the way WebReich thinks.">
        <div className="grid gap-5 md:grid-cols-2">
          {overviewInsights.map((item) => (
            <Link key={itemId(item)} to={`/insight/${itemId(item)}`} className="border-t border-stone-300 py-6">
              <p className="text-sm text-orange-700">{item.author || "WebReich Team"}</p>
              <h3 className="mt-3 text-2xl font-semibold">{getTitle(item)}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.excerpt}</p>
            </Link>
          ))}
        </div>
        <SectionFooter to="/insights" label="See all insights" />
      </Section>


    </main>
  );
}

export function ProductsPage() {
  const { items } = useFirestoreCollection("products", products);
  const productFaq = faqSchema([
    {
      question: "What software products does WebReich build?",
      answer:
        "WebReich builds CRM software, restaurant operating systems, gold rate software, business websites, automation systems, and SaaS products for Indian businesses.",
    },
    {
      question: "Does WebReich build custom business automation systems?",
      answer:
        "Yes. WebReich builds automation systems, dashboards, workflow tools, and operational infrastructure for modern businesses in Akola, Maharashtra, and across India.",
    },
  ]);

  return (
    <>
      <SEO
        page="products"
        structuredData={[
          productFaq,
          ...items.slice(0, 6).flatMap((item) => [
            productSchema(item),
            softwareApplicationSchema(item),
          ]),
        ]}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Products", path: "/products" },
        ]}
      />
      <PageShell
        eyebrow="Products"
         image="/P3.png"
        title="Product lines that turn repeated business problems into reusable software."
        intro="WebReich products are shaped from repeated business friction: faster service, cleaner records, staff coordination, owner visibility, and customer trust."
      >
        <ImageStatement
          eyebrow="Product Method"
          title="Each product starts with a workflow, not a feature list."
          text="We study how owners, staff, and customers actually move through the business, then convert the repeated pain into reusable software modules that can grow into stronger product lines."
          image="/P1.png"
          points={["Clear dashboards for owners.", "Fast daily actions for staff.", "Sharper customer-facing experiences."]}
        />
        <Section title="Product Portfolio">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => <ProductCard key={itemId(item)} item={item} />)}
          </div>
        </Section>
      </PageShell>
    </>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const { items } = useFirestoreCollection("products", products);
  const item = items.find((entry) => itemMatches(entry, id)) || products.find((entry) => itemMatches(entry, id));
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const images = item ? getImages(item) : [];
  const firstImage = images[0] || "";
  useEffect(() => {
    setMainImage(firstImage);
  }, [id, firstImage]);

  if (!item) return <PageShell eyebrow="Products" title="Product not found" intro="This product may have been moved from the admin panel." />;
  const video = embedUrl(item.videoUrl || item.youtubeVideo || item.video);
  const shortInfo = item.shortInfo || item.summary;
  const detailedInfo = item.description || item.details || item.summary;
  const hasDistinctDetails = cleanText(detailedInfo) && cleanText(detailedInfo) !== cleanText(shortInfo);
  const features = normalizeList(item.features);
  const feedback = [
    [item.clientOneName || item.clientNameOne, item.clientOnePost || item.clientPostOne, item.clientFeedbackOne],
    [item.clientTwoName || item.clientNameTwo, item.clientTwoPost || item.clientPostTwo, item.clientFeedbackTwo],
  ].filter((entry) => entry[2]);

  return (
    <>
      <SEO
        title={`${getTitle(item)} - WebReich Software Product`}
        description={item.description || item.details || item.summary}
        path={`/products/${itemId(item)}`}
        image={images[0]}
        keywords={[getTitle(item), item.category, "WebReich products", "software product India"]}
        structuredData={[productSchema(item), softwareApplicationSchema(item)]}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Products", path: "/products" },
          { name: getTitle(item), path: `/products/${itemId(item)}` },
        ]}
      />
      <PageShell
        eyebrow="Product"
        title={getTitle(item)}
        intro={`${item.category || "WebReich software product"}${item.status ? ` - ${item.status}` : ""}`}
        image={images[0]}
        compactHero
      >
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Link to="/products" className="mb-6 mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
            <ArrowLeft className="h-4 w-4" /> Products
          </Link>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] lg:items-start">
            <DetailImageGallery title={getTitle(item)} images={images} activeImage={mainImage} onSelect={setMainImage} />
            <aside className="bg-white p-7 shadow-[0_18px_55px_rgba(28,25,23,0.08)] lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                {item.category || "WebReich Product"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">{getTitle(item)}</h2>
              <p className="mt-4 text-base leading-8 text-stone-600">{shortInfo || detailedInfo}</p>
              <div className="mt-6 grid gap-3 border-y border-stone-200 py-5 text-sm">
                <p className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">Status</span>
                  <span className="font-semibold text-stone-950">{item.status || "Active"}</span>
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">Category</span>
                  <span className="text-right font-semibold text-stone-950">{item.category || "Software Product"}</span>
                </p>
              </div>
              {features.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Included focus</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <span key={feature} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" onClick={() => setOpen(true)} className="mt-8 w-full rounded-2xl bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
                Product inquiry
              </button>
            </aside>
          </div>
          {hasDistinctDetails && (
            <div className="mt-8 bg-[#11100e] p-6 text-white shadow-xl shadow-black/10 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Product details</p>
                  <h2 className="mt-3 text-3xl font-semibold">What this product solves</h2>
                </div>
                <p className="text-base leading-8 text-white/68">{detailedInfo}</p>
              </div>
            </div>
          )}
          {video && (
            <div className="mt-8 aspect-video overflow-hidden rounded-[1.5rem] bg-stone-950">
              <iframe src={video} title={`${getTitle(item)} video`} className="h-full w-full" allowFullScreen loading="lazy" />
            </div>
          )}
          {feedback.length > 0 && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {feedback.map(([name, post, text]) => (
                <blockquote key={text} className="rounded-[1.5rem] bg-white p-7 shadow-sm">
                  <p className="text-lg leading-8 text-stone-800">{text}</p>
                  <p className="mt-5 text-sm font-semibold text-stone-950">{name}</p>
                  <p className="text-xs text-stone-500">{post}</p>
                </blockquote>
              ))}
            </div>
          )}
        </section>
        <InquiryModal open={open} onClose={() => setOpen(false)} subject={getTitle(item)} />
      </PageShell>
    </>
  );
}

export function WorkPage() {
  const { items } = useFirestoreCollection("projects", projects);
  return (
    <PageShell
      eyebrow="Work"
      image="/P1.png"
      title="Selected systems, client platforms, and business workflows shaped by WebReich."
      intro="Selected work shows how WebReich converts real client context into reliable software, from clinic operations to restaurant experiences and catalog-led commerce."
    >
      <ImageStatement
        eyebrow="How Work Is Shaped"
        title="We design around the business moment where software must actually help."
        text="Before screens are finalized, WebReich studies records, follow-ups, customer touchpoints, staff movement, and owner decisions. The result is software that feels close to the business instead of generic."
        image="/P2.png"
        points={["Problem clarity before UI polish.", "Responsive execution for desktop and mobile teams.", "Delivery that leaves owners with usable visibility."]}
        reverse
      />
      <Section title="Selected Work">
        <div className="grid gap-6">
          {items.map((item) => <WorkCard key={itemId(item)} item={item} />)}
        </div>
      </Section>
    </PageShell>
  );
}

export function WorkDetailPage() {
  const { id } = useParams();
  const { items } = useFirestoreCollection("projects", projects);
  const item = items.find((entry) => itemMatches(entry, id)) || projects.find((entry) => itemMatches(entry, id));
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const images = item ? getImages(item) : [];
  const firstImage = images[0] || "";
  useEffect(() => {
    setMainImage(firstImage);
  }, [id, firstImage]);

  if (!item) return <PageShell eyebrow="Work" title="Work not found" intro="This work item may have been moved from the admin panel." />;
  const shortInfo = item.summary || item.shortDescription || item.description;
  const detailedInfo = item.summary || item.shortDescription || item.description;

  return (
    <>
      <SEO
        title={`${getTitle(item)} - WebReich Case Study`}
        description={detailedInfo}
        path={`/work/${itemId(item)}`}
        image={images[0]}
        keywords={[getTitle(item), item.industry, "WebReich work", "custom software development Akola"]}
        structuredData={[
          articleSchema(
            {
              ...item,
              excerpt: shortInfo,
              author: "WebReich Team",
              image: images[0],
            },
            `/work/${itemId(item)}`
          ),
        ]}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Work", path: "/work" },
          { name: getTitle(item), path: `/work/${itemId(item)}` },
        ]}
      />
      <PageShell eyebrow="Work" title={getTitle(item)} intro={item.industry || "Selected WebReich work"} image={images[0]} compactHero>
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Link to="/work" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
            <ArrowLeft className="h-4 w-4" /> Work
          </Link>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <DetailImageGallery title={getTitle(item)} images={images} activeImage={mainImage} onSelect={setMainImage} />
            <div className="bg-white p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                {item.industry || "Client Work"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold">Short description</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{shortInfo}</p>
              {item.workLink && (
                <a href={item.workLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-t border-stone-200 pt-5 text-sm font-semibold text-orange-700">
                  Visit work link <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button type="button" onClick={() => setOpen(true)} className="mt-7 w-full rounded-2xl bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
                Work inquiry
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-6 bg-[#11100e] p-6 text-white shadow-xl shadow-black/10 lg:grid-cols-[0.62fr_1fr] lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Case clarity</p>
              <h2 className="mt-3 text-3xl font-semibold">What we solved?</h2>
            </div>
            <div className="grid gap-4">
              <div className="border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-orange-200">Question</p>
                <p className="mt-2 text-lg font-semibold">What did this work need to communicate or improve?</p>
              </div>
              <div className="border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-orange-200">Answer</p>
                <p className="mt-2 text-sm leading-7 text-white/68">{detailedInfo || shortInfo}</p>
              </div>
            </div>
          </div>
          {item.clientFeedback && (
            <blockquote className="mt-8 rounded-[1.5rem] bg-white p-7 text-lg leading-8 shadow-sm">
              {item.clientFeedback}
              <p className="mt-5 text-sm font-semibold text-stone-950">{item.clientName}</p>
            </blockquote>
          )}
        </section>
        <InquiryModal open={open} onClose={() => setOpen(false)} subject={getTitle(item)} />
      </PageShell>
    </>
  );
}

export function IndustriesPage() {
  return (
    <PageShell
      eyebrow="Industries"
        image="/P4.png"
      title="Industries where WebReich has practical workflow understanding."
      intro="Every sector teaches a different rhythm: trust, records, field movement, repeat customers, urgent decisions, and owner-level visibility."
    >
      <Section title="Where we build">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <motion.div {...fade} key={industry.name} className="border-t border-stone-300 py-7">
              <Building2 className="h-6 w-6 text-orange-600" />
              <h3 className="mt-5 text-2xl font-semibold">{industry.name}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{industry.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

export function VisionPage() {
  const journey = [
    {
      date: "Oct 2024",
      title: "WebReich began as an education-first community.",
      summary:
        "We started by teaching coding and software development free of cost, because access to education and healthcare should be open to everyone.",
      details:
        "The early community focused on practical software learning for students who usually do not get startup-level exposure. It was not a coaching model; it was a builder community where serious students learned by doing.",
    },
    {
      date: "2024-2025",
      title: "The community expanded across colleges in Maharashtra.",
      summary:
        "We connected with serious students from tier-three colleges, taught them real development skills, and helped them move toward company opportunities.",
      details:
        "The community created a talent base for WebReich. Students learned React, Firebase, websites, dashboards, and professional communication while working close to real execution standards.",
    },
    {
      date: "2025",
      title: "WebReich started building websites and software systems.",
      summary:
        "With community talent and founder-led execution, we explored sectors, studied real business problems, and shipped practical systems.",
      details:
        "This year helped WebReich understand the market: clinics, restaurants, education, local commerce, operations-heavy businesses, and owners who needed clarity more than fancy technology.",
    },
    {
      date: "Sep 2025",
      title: "Election management software pushed WebReich to a new peak.",
      summary:
        "During the municipal election season, WebReich built political and election management software that sharpened our ability to handle data, outreach, and field operations.",
      details:
        "That work taught us how high-pressure teams need speed, clean data, dashboards, and communication workflows. It became one of the strongest proof points for WebReich's operational software direction.",
    },
    {
      date: "Late 2025",
      title: "Civil CRM became a focused product direction.",
      summary:
        "Construction and real estate workflows showed repeated problems around inquiries, follow-ups, quotations, projects, and owner visibility.",
      details:
        "Civil CRM grew from market research into a focused product line for contractors, developers, consultants, and site teams who need a simpler business operating layer.",
    },
    {
      date: "2026",
      title: "Jewellery, OCR, algo research, and product focus became sharper.",
      summary:
        "WebReich entered jewellery technology with live gold rate and e-catalog products while continuing OCR, automation, and algo trading engineering experiments.",
      details:
        "The jewellery line created strong pull from customers across India. Today WebReich is growing around selected sectors: jewellery, construction, web apps, CRMs, automation, and business operating systems.",
    },
  ];

  return (
    <PageShell
      eyebrow="Vision and Mission"
      image="/vision.png"
      title="Make real businesses faster, scalable, and easier to operate through software."
      intro="WebReich exists to solve practical business problems with software that actually helps owners, teams, and customers move better."
    >
      <Section
        title="Vision and Mission"
        intro="Our mission is to build software that makes businesses faster, more scalable, more automated, and more understandable. We focus on real-life business problems, not decorative technology."
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-stone-950 p-8 text-white">
            <Sparkles className="h-7 w-7 text-orange-300" />
            <h2 className="mt-6 text-4xl font-semibold leading-tight">
              Build useful software that increases business speed, trust, and operating power.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/64">
              WebReich wants to become a global software company from India by solving grounded problems in selected sectors and turning repeated friction into products.
            </p>
          </div>
          <div className="grid gap-4 content-center">
            {[
              ["Fast", "Reduce manual work and make daily decisions quicker."],
              ["Scalable", "Create systems that keep working as business volume grows."],
              ["Real", "Solve problems owners and teams actually face every day."],
              ["Useful", "Build tools that improve operations, revenue visibility, and customer trust."],
            ].map(([title, text]) => (
              <div key={title} className="border-l border-orange-300 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">{title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DarkTextureBand
        eyebrow="Company Thesis"
        title="We are not confused by every market. We choose sectors where the problem is visible."
        text="Jewellery, construction, web applications, CRMs, restaurant systems, election operations, OCR, and automation became WebReich's learning ground. The pattern is simple: study the sector, find repeated pain, build focused software."
        links={[
          ["Products", "/products"],
          ["Engineering", "/engineering"],
        ]}
      />

      <Section
        title="Journey"
        intro="A short timeline of how WebReich moved from education community to software products and selected sector focus."
      >
        <div className="grid gap-4">
          {journey.map((item) => (
            <details key={item.date} className="group border-t border-stone-300 bg-white/55 px-5 py-5 open:bg-white">
              <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">{item.date}</span>
                  <span className="mt-2 block text-2xl font-semibold text-stone-950">{item.title}</span>
                  <span className="mt-2 block text-sm leading-7 text-stone-600">{item.summary}</span>
                </span>
                <span className="text-sm font-semibold text-orange-700 group-open:text-stone-950">Read more</span>
              </summary>
              <p className="mt-5 max-w-4xl border-l border-orange-300 pl-5 text-sm leading-7 text-stone-700">
                {item.details}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

export function InsightsPage() {
  const { items } = useFirestoreCollection("blogs", blogs);
  return (
    <PageShell
      dark
      eyebrow="Insights"
        image="/P6.png"
      title="Readable thinking on software, automation, careers, and company building."
      intro="Insights are managed from the admin panel. Posts support bold text, italic text, and linked words using simple markdown."
    >
      <Section dark title="Latest posts">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={itemId(item)} to={`/insight/${itemId(item)}`} className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.04] transition hover:border-orange-300/40 hover:bg-white/[0.07]">
              <img src={item.image || item.imageLink || "/w-p8.png"} alt={getTitle(item)} className="h-52 w-full object-cover opacity-85 transition group-hover:opacity-100" loading="lazy" decoding="async" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-orange-300">{item.author || "WebReich Team"}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.createdAt || item.createdAtText)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {getReadTime(item)}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">{getTitle(item)}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{item.excerpt || String(item.body || "").slice(0, 140)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                  Open full <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

export function InsightDetailPage() {
  const { id } = useParams();
  const { items } = useFirestoreCollection("blogs", blogs);
  const item = items.find((entry) => itemMatches(entry, id)) || blogs.find((entry) => itemMatches(entry, id));
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  if (!item) return <PageShell dark eyebrow="Insights" title="Post not found" intro="This post may have been moved from the admin panel." />;
  const detailImage = item.image || item.imageLink || "/w-p8.png";

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: getTitle(item), url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
    } catch {
      setShared(false);
    }
  };

  return (
    <>
      <SEO
        title={`${getTitle(item)} - WebReich Insight`}
        description={item.excerpt || String(item.body || item.post || "").slice(0, 155)}
        path={`/insight/${itemId(item)}`}
        image={detailImage}
        type="article"
        keywords={[getTitle(item), item.author, "WebReich insights", "software automation India"]}
        structuredData={[articleSchema({ ...item, image: detailImage }, `/insight/${itemId(item)}`)]}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: getTitle(item), path: `/insight/${itemId(item)}` },
        ]}
      />
      <PageShell dark eyebrow="Insight" title={getTitle(item)} intro={item.excerpt} image={detailImage}>
        <article className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <Link to="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
            <ArrowLeft className="h-4 w-4" /> Insights
          </Link>
          <img src={detailImage} alt={getTitle(item)} className="mt-8 h-[420px] w-full rounded-[1.5rem] object-cover" loading="lazy" decoding="async" />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4 text-sm text-white/55">
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-orange-300" /> {formatDate(item.createdAt || item.createdAtText)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-300" /> {getReadTime(item)}
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setLiked((value) => !value)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${liked ? "border-orange-300 bg-orange-500 text-white" : "border-white/10 text-white/70"}`}>
                <Heart className="h-4 w-4" /> {liked ? "Liked" : "Like"}
              </button>
              <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/70">
                <Share2 className="h-4 w-4" /> {shared ? "Shared" : "Share"}
              </button>
            </div>
          </div>
          <motion.aside {...fade} className="mt-8 border-l border-orange-300 bg-white/[0.05] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Author</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{item.author || "WebReich Team"}</h2>
            <p className="mt-3 text-sm leading-7 text-white/62">{getAuthorBio(item)}</p>
          </motion.aside>
          <div className="prose prose-invert mt-8 max-w-none text-lg leading-9 text-white/76">
            {String(item.body || item.post || "").split("\n").map((paragraph, index) => (
              <p key={index}>{renderRichText(paragraph)}</p>
            ))}
          </div>
        </article>
      </PageShell>
    </>
  );
}

export function FounderPage() {
  const founders = [
    {
      name: "Shriyash Rulhe",
      role: "Founder",
      text:
        "Builder and product thinker leading WebReich toward practical software products, automation systems, and a trusted Bharat business network.",
      href: "https://shriyashwebreich.site/",
    },
    {
      name: "Akshay Bhaltilak",
      role: "Co-founder",
      text:
        "Co-builder focused on execution, collaboration, and turning WebReich's experiments into useful outcomes for clients and learners.",
      href: "https://www.akshaybhaltilak.site/",
    },
  ];
  return (
    <>
      <SEO
        page="founders"
        structuredData={founders.map((founder) =>
          personSchema({
            name: founder.name,
            role: founder.role,
            url: founder.href,
          })
        )}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Founders", path: "/founders" },
        ]}
      />
      <PageShell
        eyebrow="Founders"
        image="/P6.png"
        title="The people shaping WebReich with product discipline and ground-level business learning."
        intro="WebReich is founder-led, which keeps the company close to client problems, product decisions, and long-term trust."
      >
        <Section title="Founder team">
          <div className="grid gap-6 md:grid-cols-2">
            {founders.map((founder) => (
              <div key={founder.name} className="rounded-[1.5rem] bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">{founder.role}</p>
                <h2 className="mt-5 text-4xl font-semibold">{founder.name}</h2>
                <p className="mt-5 text-sm leading-7 text-stone-600">{founder.text}</p>
                <a href={founder.href} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                  Open full portfolio <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </Section>
      </PageShell>
    </>
  );
}

export function EngineeringPage() {
  return (
    <PageShell
      eyebrow="Engineering"
      image="/P5.png"
      title="Engineering experiments shaped around real operational problems."
      intro="WebReich engineering focuses on the hard part behind products: rules, data, automation, interfaces, reliability, and decision visibility."
    >
      <Section
        title="WebReich experiments"
        intro="Each experiment starts with a problem we noticed in business work, then becomes a small technical system that teaches us how to build stronger products."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {labs.map((item) => (
            <Link key={item.title} to={`/engineering/${labSlug(item)}`} className="group border-t border-stone-300 py-7">
              <Flame className="h-6 w-6 text-orange-600" />
              <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                Open breakdown <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <DarkTextureBand
        eyebrow="Engineering Method"
        title="We build experiments like product rehearsals."
        text="A lab only matters when it teaches the company how to solve a future customer problem better: cleaner inputs, safer automation, clearer dashboards, and stronger operator trust."
        links={[["Talk engineering", "/connect"]]}
      />
      <Section title="Engineering principles">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [Cpu, "Modular React systems", "Reusable screens, admin workflows, and public pages built for maintainable growth."],
            [ShieldCheck, "Trust-first data flows", "Firestore-backed content, guarded admin access, and inquiry workflows that can be deployed cleanly."],
            [BarChart3, "Operational visibility", "Dashboards and automation concepts that help owners read the business faster."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="border-t border-stone-300 py-6">
              <Icon className="h-6 w-6 text-orange-600" />
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

export function EngineeringDetailPage() {
  const { id } = useParams();
  const item = labs.find((entry) => labSlug(entry) === id);

  if (!item) {
    return (
      <PageShell
        eyebrow="Engineering"
        title="Experiment not found"
        intro="This engineering note may have been moved."
      />
    );
  }

  return (
    <>
      <SEO
        title={`${item.title} - WebReich Engineering`}
        description={item.text}
        path={`/engineering/${labSlug(item)}`}
        image={item.image}
        keywords={[item.title, "WebReich engineering", "automation systems", "React engineering"]}
        structuredData={[articleSchema({ ...item, excerpt: item.text, author: "WebReich Engineering" }, `/engineering/${labSlug(item)}`)]}
        breadcrumbs={[
          { name: "Overview", path: "/" },
          { name: "Engineering", path: "/engineering" },
          { name: item.title, path: `/engineering/${labSlug(item)}` },
        ]}
      />
      <PageShell eyebrow="Engineering" title={item.title} intro={item.text} image={item.image}>
        <article className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <Link to="/engineering" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
            <ArrowLeft className="h-4 w-4" /> Engineering
          </Link>
          <div className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-stone-950 p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Problem</p>
              <h2 className="mt-4 text-3xl font-semibold">What we were trying to understand</h2>
              <p className="mt-5 text-sm leading-7 text-white/68">{item.problem}</p>
            </div>
            <div className="grid gap-5">
              <div className="border-l border-orange-300 bg-white px-6 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Build</p>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.build}</p>
              </div>
              <div className="border-l border-orange-300 bg-white px-6 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Outcome</p>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.outcome}</p>
              </div>
            </div>
          </div>
          <section className="mt-10">
            <h2 className="text-3xl font-semibold">Engineering breakdown</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {item.steps.map((step, index) => (
                <div key={step} className="border-t border-stone-300 py-5">
                  <p className="text-xs text-stone-400">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-semibold">{step}</h3>
                </div>
              ))}
            </div>
            <p className="mt-8 border-l border-orange-300 pl-5 text-sm leading-7 text-stone-600">
              Stack direction: {item.stack}. The goal is not to over-engineer a lab; it is to learn enough to build a product-grade system when the market problem becomes clear.
            </p>
          </section>
        </article>
      </PageShell>
    </>
  );
}

export function CareersPage() {
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle");
  const [verifiedIntern, setVerifiedIntern] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState("idle");
  const [application, setApplication] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    role: "",
    why: "",
    growth: "",
    proof: "",
    hardThing: "",
    availability: "",
  });

  const updateApplication = (field) => (event) => {
    setApplication((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const verifyIntern = async (event) => {
    event.preventDefault();
    setVerifyStatus("loading");
    setVerifiedIntern(null);
    try {
      await authReady;
      const internsRef = collection(db, "interns");
      const internsQuery = query(
        internsRef,
        where("emailLower", "==", verifyEmail.trim().toLowerCase())
      );
      const snapshot = await getDocs(internsQuery);
      if (snapshot.empty) {
        setVerifyStatus("empty");
        return;
      }
      setVerifiedIntern({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      setVerifyStatus("success");
    } catch {
      setVerifyStatus("error");
    }
  };

  const printCertificate = () => {
    if (!verifiedIntern) return;
    const originalTitle = document.title;
    document.title = `${getCertificateId(verifiedIntern)}-WebReich-Internship-Completion`;
    window.print();
    document.title = originalTitle;
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    setApplicationStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3AccessKey,
          subject: "WebReich Career Application",
          from_name: application.name,
          email: application.email,
          phone: application.phone,
          message: [
            `Role/track: ${application.role}`,
            `GitHub/Profile: ${application.github || "Not provided"}`,
            `Why join WebReich: ${application.why}`,
            `How can you help WebReich grow: ${application.growth}`,
            `Proof of work: ${application.proof}`,
            `Hard thing solved: ${application.hardThing}`,
            `Availability: ${application.availability}`,
          ].join("\n\n"),
          to_email: "webreichcommunity@gmail.com",
          botcheck: "",
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error("Could not send");
      setApplicationStatus("sent");
      setApplication({
        name: "",
        email: "",
        phone: "",
        github: "",
        role: "",
        why: "",
        growth: "",
        proof: "",
        hardThing: "",
        availability: "",
      });
    } catch {
      setApplicationStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .career-certificate-print, .career-certificate-print * { visibility: visible; }
          .career-certificate-print {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
      <PageShell
        eyebrow="Careers"
        image="/P7.png"
        title="Build with WebReich, or verify the work you already completed."
        intro="Careers at WebReich are practical: real products, real client workflows, real ownership, and certificate-backed proof for verified interns."
      >
        <Section title="Career programs">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Users, "Training and guidance", "Structured learning around React, Firebase, product thinking, and professional project execution."],
              [BadgeCheck, "Verified proof", "Interns can verify their record publicly and download the official internship completion letter."],
              [BriefcaseBusiness, "Startup exposure", "Builders work around products, client workflows, dashboards, automation, and growth problems."],
            ].map(([Icon, title, text]) => (
              <div key={title} className="border-t border-stone-300 py-7">
                <Icon className="h-6 w-6 text-orange-600" />
                <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <DarkTextureBand
          eyebrow="Builder Standard"
          title="We care less about perfect resumes and more about proof, ownership, and hunger."
          text="WebReich is a startup environment. The best candidates show work, learn fast, communicate clearly, and care about solving business problems through software."
          links={[["Apply below", "/careers"]]}
        />

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div {...fade}>
            <Eyebrow>Verify Yourself</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Find your internship record.</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Enter the same email used in your WebReich internship record. If verified, your details and download option will appear.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={verifyIntern}>
              <input
                type="email"
                value={verifyEmail}
                onChange={(event) => setVerifyEmail(event.target.value)}
                placeholder="intern@email.com"
                className="min-h-12 flex-1 border border-stone-300 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                required
              />
              <button
                type="submit"
                disabled={verifyStatus === "loading"}
                className="min-h-12 bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:bg-stone-400"
              >
                {verifyStatus === "loading" ? "Checking..." : "Verify"}
              </button>
            </form>
            {verifyStatus === "empty" && <p className="mt-4 text-sm text-stone-500">No verified intern found with this email.</p>}
            {verifyStatus === "error" && <p className="mt-4 text-sm text-red-600">Could not verify right now. Please try again.</p>}
          </motion.div>

          <motion.div {...fade} className="bg-white p-6 shadow-sm">
            {!verifiedIntern && (
              <div className="flex min-h-72 items-center justify-center border border-dashed border-stone-300 p-8 text-center text-sm leading-7 text-stone-500">
                Verified internship details will appear here.
              </div>
            )}
            {verifiedIntern && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-700">Verified Intern</p>
                <h3 className="mt-3 text-3xl font-semibold">{verifiedIntern.name}</h3>
                <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                  <p><span className="font-semibold text-stone-950">Role:</span> {verifiedIntern.role}</p>
                  <p><span className="font-semibold text-stone-950">College:</span> {verifiedIntern.college}</p>
                  <p><span className="font-semibold text-stone-950">Duration:</span> {verifiedIntern.duration}</p>
                  <p><span className="font-semibold text-stone-950">Performance:</span> {verifiedIntern.performance}</p>
                  <p><span className="font-semibold text-stone-950">Dates:</span> {verifiedIntern.startDate} - {verifiedIntern.endDate}</p>
                  <p><span className="font-semibold text-stone-950">Certificate:</span> {getCertificateId(verifiedIntern)}</p>
                </div>
                <button
                  type="button"
                  onClick={printCertificate}
                  className="mt-6 w-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Download Internship Completion Letter
                </button>
              </div>
            )}
          </motion.div>
        </section>

        <Section
          title="Apply to join WebReich"
          intro="This is intentionally startup-style. We want to understand how you think, what you have built, and how you can help WebReich grow."
        >
          <form className="grid gap-5 bg-white p-6 shadow-sm md:grid-cols-2" onSubmit={submitApplication}>
            {[
              ["name", "Name", "text", true],
              ["email", "Email", "email", true],
              ["phone", "Phone number", "tel", true],
              ["github", "GitHub / portfolio link", "url", false],
              ["role", "Role or track you want", "text", true],
              ["availability", "Availability", "text", true],
            ].map(([field, label, type, required]) => (
              <label key={field}>
                <span className="text-sm font-semibold text-stone-700">{label}</span>
                <input
                  type={type}
                  value={application[field]}
                  onChange={updateApplication(field)}
                  className="mt-2 w-full bg-white border border-stone-300 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  required={required}
                />
              </label>
            ))}
            {[
              ["why", "Why do you want to join WebReich?"],
              ["growth", "How can you help WebReich grow in the next 6 months?"],
              ["proof", "Show one proof of work, project, or skill you are proud of."],
              ["hardThing", "Tell us about one hard thing you solved without giving up."],
            ].map(([field, label]) => (
              <label key={field} className="md:col-span-2">
                <span className="text-sm font-semibold text-stone-700">{label}</span>
                <textarea
                  value={application[field]}
                  onChange={updateApplication(field)}
                  rows={4}
                  className="mt-2 w-full border bg-white border-stone-300 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  required
                />
              </label>
            ))}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={applicationStatus === "sending"}
                className="bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:bg-stone-400"
              >
                {applicationStatus === "sending" ? "Submitting..." : "Submit application"}
              </button>
              {applicationStatus === "sent" && <p className="mt-4 text-sm text-green-700">Application submitted. WebReich will review it soon.</p>}
              {applicationStatus === "error" && <p className="mt-4 text-sm text-red-600">Could not submit application. Please try again.</p>}
            </div>
          </form>
        </Section>
      </PageShell>

      <div className="career-certificate-print hidden w-[210mm] bg-white p-10 text-slate-900">
        {verifiedIntern && (
          <div className="h-[297mm] border border-slate-200 p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="WebReich Logo" className="h-14" />
                <div>
                  <p className="text-base font-semibold tracking-[0.2em] text-orange-500">WebReich</p>
                  <p className="mt-1 text-xs text-slate-500">IT Solutions & Software Development Company</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="uppercase tracking-[0.25em] text-orange-500">Certificate ID</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{getCertificateId(verifiedIntern)}</p>
              </div>
            </div>
            <div className="mt-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Internship Completion Letter</p>
              <p className="mt-12 text-base text-slate-700">This is to certify that</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-950">{verifiedIntern.name}</h2>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-700">
                has successfully completed an internship with WebReich as a <strong>{verifiedIntern.role}</strong> from <strong>{verifiedIntern.startDate}</strong> to <strong>{verifiedIntern.endDate}</strong>. During this period, the intern worked with sincerity, learning discipline, and practical contribution toward assigned software tasks.
              </p>
            </div>
            <div className="mt-12 grid gap-4 text-sm sm:grid-cols-2">
              <p><strong>College:</strong> {verifiedIntern.college}</p>
              <p><strong>Duration:</strong> {verifiedIntern.duration}</p>
              <p><strong>Technologies:</strong> {verifiedIntern.techStack}</p>
              <p><strong>Performance:</strong> {verifiedIntern.performance}</p>
            </div>
            <div className="mt-20 flex items-end justify-between">
              <div>
                <img src="/Shri_sign.png" alt="Authorized signature" className="h-14" />
                <p className="mt-2 text-sm font-semibold">Authorized Signatory</p>
                <p className="text-xs text-slate-500">Shriyash R. Rulhe</p>
              </div>
              <img src="/stamp.png" alt="Company seal" className="h-24 w-24 object-contain" />
            </div>
            <div className="mt-16 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
              <p>webreichcommunity@gmail.com | www.webreich.in</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });
  const [status, setStatus] = useState("idle");
  const connectWhatsappMessage =
    "Hello WebReich, I want to connect for software development, automation, or a business website. Please guide me.";
  const socials = useMemo(
    () => [
      [Github, "GitHub", "https://github.com/Webreichcommunity"],
      [Linkedin, "LinkedIn", "https://www.linkedin.com/in/shriyash-rulhe-655a9422a/"],
      [Instagram, "Instagram", "https://www.instagram.com/webreich/"],
      [MessageCircle, "WhatsApp", whatsappLink("918668722207", connectWhatsappMessage)],
    ],
    [connectWhatsappMessage]
  );

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3AccessKey,
          subject: "WebReich Connect Form",
          from_name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.reason,
          to_email: "webreichcommunity@gmail.com",
          botcheck: "",
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error("Could not send");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", reason: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <PageShell
      eyebrow="Connect"
      title="Start a conversation with WebReich."
      intro="Use the form for products, client systems, internship guidance, collaborations, or founder conversations."
    >
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <div className="grid gap-4">
            <a href="mailto:webreichcommunity@gmail.com" className="flex items-center gap-3 border-t border-stone-300 py-5">
              <Mail className="h-5 w-5 text-orange-600" /> webreichcommunity@gmail.com
            </a>
            <a
              href={whatsappLink("918668722207", "Hello WebReich, I visited your website and want to discuss a software project. Please connect me with your team.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-t border-stone-300 py-5"
            >
              <MessageCircle className="h-5 w-5 text-orange-600" /> +91 86687 22207
            </a>

            <a
              href={whatsappLink("919834153020", "Hello WebReich, I need guidance for a website, CRM, automation, or product build. Please share the next steps.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-t border-stone-300 py-5"
            >
              <MessageCircle className="h-5 w-5 text-orange-600" /> +91 98341 53020
            </a>
            <p className="flex items-center gap-3 border-t border-stone-300 py-5">
              <MapPin className="h-5 w-5 text-orange-600" /> Akola, Maharashtra, Bharat
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map(([Icon, label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-orange-600" aria-label={label}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <form className="rounded-[1.5rem] bg-white p-6 shadow-sm" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["name", "Name", "text"],
              ["email", "Email", "email"],
              ["phone", "Phone number", "tel"],
            ].map(([field, label, type]) => (
              <label key={field} className={field === "phone" ? "md:col-span-2" : ""}>
                <span className="text-sm font-semibold text-stone-700">{label}</span>
                <input
                  type={type}
                  value={form[field]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
                  className="mt-2 bg-white w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  required
                />
              </label>
            ))}
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Reason of connect</span>
              <textarea
                value={form.reason}
                onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                rows={5}
                className="mt-2 bg-orange-200 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {status === "sending" ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
          </button>
          {status === "sent" && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <p className="font-semibold">Request submitted successfully.</p>
              <p className="mt-1 text-green-700/80">Thank you for connecting with WebReich. We will respond soon.</p>
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <p className="font-semibold">Request could not be submitted.</p>
              <p className="mt-1 text-red-600/80">Please try again or contact us directly on email or WhatsApp.</p>
            </div>
          )}
        </form>
      </section>
    </PageShell>
  );
}

export function EcosystemPage() {
  return <Overview />;
}

export function InfrastructurePage() {
  return <EngineeringPage />;
}
