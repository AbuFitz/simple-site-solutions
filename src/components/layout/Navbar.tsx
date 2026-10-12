import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { LogoMark, Wordmark } from "./Logo";

const navItems = [
  { path: "/work", label: "Work" },
  { path: "/how-it-works", label: "Process" },
  { path: "/packages", label: "Pricing" },
  { path: "/faq", label: "FAQ" },
];

const isActive = (current: string, path: string) =>
  current === path || (path !== "/" && current.startsWith(path + "/"));

export function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const t = window.setTimeout(() => firstLink.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex justify-center px-3 sm:top-4 md:top-5">
      <motion.header
        className="pointer-events-auto w-full max-w-[46rem]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Main"
          className={`relative flex items-center gap-1 rounded-full border p-1.5 transition-[background-color,box-shadow,border-color] duration-500 ${
            scrolled
              ? "border-white/10 bg-[hsl(150_14%_5%/0.86)] shadow-[0_18px_50px_-18px_rgb(0_0_0/0.8)] backdrop-blur-xl"
              : "border-white/[0.09] bg-[hsl(150_14%_5%/0.72)] backdrop-blur-xl"
          }`}
        >
          <Link
            to="/"
            aria-label="OneSimpleSite home"
            className="flex min-h-[44px] items-center gap-2 rounded-full pl-2.5 pr-3 text-foreground"
          >
            <LogoMark className="h-6 w-6 text-foreground" />
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <div className="ml-auto hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/start"
            className="btn-primary btn-sm ml-auto hidden gap-1.5 lg:ml-1.5 lg:inline-flex"
          >
            Start a project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <button
            ref={toggle}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[85] flex flex-col bg-background lg:hidden"
            initial={{ clipPath: "circle(0px at calc(100% - 2.6rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0px at calc(100% - 2.6rem) 2.6rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse at 80% 20%, black, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse at 80% 20%, black, transparent 70%)",
              }}
            />
            <div className="relative flex flex-1 flex-col justify-between px-6 pb-8 pt-28">
              <ul className="space-y-1">
                {[{ path: "/", label: "Home" }, ...navItems].map((item, i) => {
                  const active = isActive(pathname, item.path) && (item.path !== "/" || pathname === "/");
                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.18 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        to={item.path}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-baseline gap-4 border-b border-border/60 py-3.5 font-display text-[2.6rem] font-bold leading-none tracking-tight ${
                          active ? "text-signal" : "text-foreground"
                        }`}
                        style={{ letterSpacing: "-0.04em" }}
                      >
                        <span className="mono w-6 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground">
                          0{i + 1}
                        </span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-4"
              >
                <Link to="/start" className="btn-primary btn-lg w-full gap-2">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:hello@onesimplesite.co.uk"
                  className="mono block text-center text-xs tracking-wide text-muted-foreground"
                >
                  hello@onesimplesite.co.uk
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
