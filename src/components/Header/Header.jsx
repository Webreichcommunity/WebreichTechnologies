import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems } from "../../data/webreichContent";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const middleIndex = Math.ceil(navItems.length / 2);
  const leftNav = navItems.slice(0, middleIndex);
  const rightNav = navItems.slice(middleIndex);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > 120 && currentY > lastY);
      lastY = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-[12px] font-semibold uppercase tracking-[0.13em] text-white transition after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-orange-300 after:transition-all ${
      isActive
        ? "text-white after:w-full"
        : "text-white/74 hover:text-white after:w-0 hover:after:w-full"
    }`;

  return (
    <motion.header
      animate={{ y: hidden && !open ? -110 : 0, opacity: hidden && !open ? 0 : 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 bg-transparent text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.58)_44%,rgba(0,0,0,0)_100%)]" />
      <div className="relative mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <nav className="hidden items-center justify-end gap-4 pr-16 xl:flex">
          {leftNav.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="hidden justify-self-center xl:block" aria-label="WebReich home">
          <img src="/logo.png" alt="WebReich logo" className="h-11 w-11 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]" />
        </Link>

        <Link to="/" className="col-start-1 flex items-center gap-3 justify-self-start xl:hidden" aria-label="WebReich home">
          <img src="/logo.png" alt="WebReich logo" className="h-10 w-10 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]" />
          <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-[15px] font-semibold uppercase tracking-[0.22em] text-transparent">
            WebReich
          </span>
        </Link>

        <nav className="hidden items-center justify-start gap-4 pl-16 xl:flex">
          {rightNav.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute right-4 flex items-center gap-2 sm:right-6 lg:right-8">
          {/* <Link
            to="/connect"
            className="hidden rounded-full border border-white/15 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] text-stone-950 transition hover:border-orange-300 hover:bg-orange-500 hover:text-white lg:inline-flex"
          >
            Connect
          </Link>
          <Link
            to="/connect"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur lg:hidden"
            aria-label="Connect with WebReich"
          >
            <Mail className="h-4 w-4" />
          </Link> */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white backdrop-blur-sm xl:hidden"
            aria-label="Open navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.34, ease: "easeOut" }}
            className="fixed left-0 top-0 z-[60] h-screen w-full bg-stone-950 px-5 py-6 text-white sm:w-[430px]"
          >
            <div className="flex items-center justify-between">
              <Link to="/" aria-label="WebReich home">
                <img src="/logo.png" alt="WebReich logo" className="h-10 w-10 object-contain" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-10 grid gap-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-white/10 py-4 text-lg font-medium ${
                      isActive ? "text-orange-300" : "text-white"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/35">{String(index + 1).padStart(2, "0")}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute inset-x-5 bottom-7">
              <Link
                to="/connect"
                className="flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white"
              >
                Connect with WebReich <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
