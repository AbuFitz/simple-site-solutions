import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Pill } from "@/components/oss/Pill";

export const navItems = [
  { path: "/work", label: "Work" },
  { path: "/services", label: "Services" },
  { path: "/packages", label: "Pricing" },
  { path: "/how-it-works", label: "Process" },
  { path: "/about", label: "About" },
  { path: "/faq", label: "FAQ" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold ${className}`} style={{ letterSpacing: "-0.04em" }}>
      one<span className="text-primary">simple</span>site
    </span>
  );
}

const active = (current: string, path: string) => current === path || current.startsWith(path + "/");

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const first = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const t = window.setTimeout(() => first.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-transparent bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <nav aria-label="Main" className="content-width flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <Link to="/" aria-label="OneSimpleSite home" className="text-[1.45rem]">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  aria-current={active(pathname, item.path) ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-primary ${
                    active(pathname, item.path) ? "text-foreground" : "text-foreground/70"
                  }`}
                >
                  {item.label}
                  {active(pathname, item.path) && (
                    <span aria-hidden="true" className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 rounded-[1px] bg-[hsl(var(--brand))]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Pill to="/start" className="hidden sm:inline-flex">
              Start a project
            </Pill>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-foreground/80 px-5 text-[0.9375rem] font-semibold lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="theme-ink fixed inset-0 z-[60] flex flex-col overflow-y-auto"
        >
          <div className="content-width flex h-[68px] shrink-0 items-center justify-between">
            <Link to="/" className="text-[1.3rem] sm:text-[1.45rem]" aria-label="OneSimpleSite home">
              <Wordmark />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-foreground/80 px-4 text-[0.9375rem] font-semibold"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
          <div className="content-width flex flex-1 flex-col justify-between pb-10 pt-8">
            <ul>
              {navItems.map((item, i) => (
                <li key={item.path} className="border-b border-border">
                  <Link
                    ref={i === 0 ? first : undefined}
                    to={item.path}
                    className="flex items-baseline justify-between py-4 font-display text-[2.6rem] font-bold leading-none"
                    style={{ letterSpacing: "-0.045em", paddingLeft: i % 2 ? "1.5rem" : 0 }}
                  >
                    {item.label}
                    <span className="text-sm font-medium text-muted-foreground nums">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-5">
              <Pill to="/start">Start a project</Pill>
              <p>
                <a href="mailto:hello@onesimplesite.co.uk" className="link-line text-base">
                  hello@onesimplesite.co.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
