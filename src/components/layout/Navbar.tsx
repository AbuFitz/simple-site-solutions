import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  { path: "/work", label: "Work" },
  { path: "/packages", label: "Pricing" },
  { path: "/how-it-works", label: "Process" },
  { path: "/guides", label: "Guides" },
  { path: "/preview", label: "Preview" },
];

type Tone = "dark" | "light";

const isCurrent = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

/**
 * Floating pill. Centred with plain CSS (no transform), so no animation library can push it off-centre.
 * Its colour follows whatever is underneath it: sections mark themselves with data-tone="light"
 * (bone, paper, cream and project colours) and the pill turns ink there; everywhere else it is bone.
 */
export function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("dark");
  const nav = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);

  const measure = useCallback(() => {
    frame.current = 0;
    const el = nav.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 2, Math.max(2, box.left + box.width / 2));
    const y = box.top + box.height / 2;
    const hit = document.elementsFromPoint(x, y).find((n) => !el.contains(n) && n.closest("[data-tone]"));
    const next = (hit?.closest("[data-tone]")?.getAttribute("data-tone") ?? "dark") as Tone;
    setTone((t) => (t === next ? t : next));
  }, []);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [schedule]);

  // New route: close the menu and re-read the tone once the new page has rendered.
  useEffect(() => {
    setMenuOpen(false);
    const t = window.setTimeout(schedule, 60);
    return () => window.clearTimeout(t);
  }, [pathname, schedule]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <div className="oss-nav-wrap">
        <nav ref={nav} className="oss-nav" data-tone={tone} aria-label="Main">
          <Link to="/" className="oss-nav__wm" aria-label="OneSimpleSite home">
            one<b>simple</b>site
          </Link>
          <div className="oss-nav__links">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} aria-current={isCurrent(pathname, item.path) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link to="/start" className="oss-nav__cta">
            <span className="oss-nav__dot" aria-hidden="true" />
            Start a project
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="oss-nav__menu"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </nav>
      </div>

      {menuOpen && (
        <>
          <button type="button" aria-hidden="true" tabIndex={-1} className="fixed inset-0 z-[78] cursor-default bg-transparent lg:hidden" onClick={() => setMenuOpen(false)} />
          <div id="mobile-menu" className="oss-menu">
            <nav aria-label="Mobile">
              <Link to="/" className="oss-menu__link" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="oss-menu__link" aria-current={isCurrent(pathname, item.path) ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
              <Link to="/start" className="oss-btn">
                <span>Start a project</span>
                <span aria-hidden="true">&#8599;</span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
