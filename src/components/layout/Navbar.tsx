import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

const items = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/packages", label: "Pricing" },
  { path: "/how-it-works", label: "Process" },
  { path: "/about", label: "About" },
  { path: "/guides", label: "Guides" },
];

type Tone = "dark" | "light";
const isCurrent = (p: string, path: string) => p === path || (path !== "/" && p.startsWith(`${path}/`));

/** Minimal top bar (wordmark, Start a project, Menu) that follows the colour beneath it, plus a full-screen menu. */
export function Navbar() {
  const { pathname } = useLocation();
  // The brief form is a focused page: only a way back home, no menu and no second "Start a project".
  const focused = pathname === "/start";
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("dark");
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);

  const measure = useCallback(() => {
    raf.current = 0;
    const el = bar.current;
    if (!el) return;
    const hit = document.elementsFromPoint(window.innerWidth / 2, 40).find((n) => !el.contains(n) && n.closest("[data-tone]"));
    setScrolled(window.scrollY > window.innerHeight * 0.85);
    const next = (hit?.closest("[data-tone]")?.getAttribute("data-tone") ?? "dark") as Tone;
    setTone((t) => (t === next ? t : next));
  }, []);
  const schedule = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [schedule]);

  useEffect(() => {
    setOpen(false);
    const t = window.setTimeout(schedule, 60);
    return () => window.clearTimeout(t);
  }, [pathname, schedule]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {focused ? null : (
      <nav ref={bar} className="oss-bar" data-tone={open ? "dark" : tone} data-open={open} data-scrolled={scrolled} aria-label="Main">
        <div className="oss-bar__r">
          <Link to="/start" className="oss-bar__start">Start a project</Link>
          <button ref={btn} type="button" className="oss-bar__menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      )}
      {pathname !== "/" && (
        <Link to="/" className="oss-home-link" data-tone={open ? "dark" : tone} style={{ color: (open ? "dark" : tone) === "light" ? "#0e1311" : "#efebe3" }}>
          &#8592; Home
        </Link>
      )}
      {!focused && open && (
        <div id="site-menu" className="oss-fm" role="dialog" aria-label="Menu">
          <ul>
            {items.map((it, i) => (
              <li key={it.path}>
                <Link to={it.path} aria-current={isCurrent(pathname, it.path) ? "page" : undefined}>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="oss-fm__side">
            <p><small>CONTACT</small><a href="mailto:hello@onesimplesite.co.uk">hello@onesimplesite.co.uk</a></p>
            <p><small>PRICING</small>Fixed prices from £189. Live in 5 to 14 days, nationwide.</p>
          </div>
        </div>
      )}
    </>
  );
}
