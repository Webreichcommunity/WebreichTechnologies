import { Github, Instagram, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  ["Overview", "/"],
  ["Products", "/products"],
  ["Work", "/work"],
  ["Insights", "/insights"],
  ["Connect", "/connect"],
];

const socials = [
  [Github, "GitHub", "https://github.com/Webreichcommunity"],
  [Linkedin, "LinkedIn", "https://www.linkedin.com/in/shriyash-rulhe-655a9422a/"],
  [Instagram, "Instagram", "https://www.instagram.com/webreich/"],
  [Mail, "Email", "mailto:webreichcommunity@gmail.com"],
];

export default function Footer() {
  return (
    <footer className="bg-[#10100f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-center lg:grid-cols-[1.2fr_1fr_1.1fr] lg:text-left">
          <div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <img src="/logo.png" alt="WebReich logo" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-lg font-semibold uppercase tracking-[0.24em]">WebReich</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Build experiences, not products
                </p>
              </div>
            </div>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/62 lg:mx-0">
              Bharat based software company building products, automation, and business systems
              for teams that want dependable digital growth.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-300">
              Quick Links
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 lg:justify-start">
              {quickLinks.map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm text-white/62 transition hover:text-orange-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-300">
              Contact
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
              {socials.map(([Icon, label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-300 hover:bg-orange-500 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mx-auto mt-5 grid max-w-md gap-3 text-sm text-white/62 lg:mx-0">
              <a href="mailto:webreichcommunity@gmail.com" className="flex items-center justify-center gap-2 hover:text-orange-300 lg:justify-start">
                <Mail className="h-4 w-4" /> webreichcommunity@gmail.com
              </a>
              <a href="https://wa.me/918668722207" className="flex items-center justify-center gap-2 hover:text-orange-300 lg:justify-start">
                <MessageCircle className="h-4 w-4" /> +91 86687 22207
              </a>
               <a href="https://wa.me/918668722207" className="flex items-center justify-center gap-2 hover:text-orange-300 lg:justify-start">
                <MessageCircle className="h-4 w-4" /> +91 98341 53020
              </a>
              <p className="flex items-center justify-center gap-2 lg:justify-start">
                <MapPin className="h-4 w-4" /> Akola, Maharashtra, Bharat
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>&copy; 2026 WebReich. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2">
            <span>Developed by</span>
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
            <span className="font-semibold uppercase tracking-[0.16em] text-white/75">
              WebReich
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
