import { forwardRef, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LogoMark } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/how-it-works", label: "Process" },
  { to: "/packages", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

/** Giant wordmark that tips toward the pointer on desktop. Pure CSS 3D, no WebGL needed. */
function TiltWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-9, 9]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);

  return (
    <div
      ref={ref}
      className="perspective-1000 select-none overflow-hidden pt-6"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      aria-hidden="true"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="origin-bottom whitespace-nowrap pb-3 text-center font-display font-extrabold leading-[1]"
      >
        <span
          className="block text-[clamp(2.4rem,11.6vw,14rem)] text-transparent"
          style={{
            letterSpacing: "-0.06em",
            WebkitTextStroke: "1px hsl(var(--foreground) / 0.18)",
            textShadow:
              "0 1px 0 hsl(158 64% 42% / 0.32), 0 2px 0 hsl(158 64% 42% / 0.26), 0 3px 0 hsl(158 64% 42% / 0.2), 0 4px 0 hsl(158 64% 42% / 0.14), 0 5px 0 hsl(158 64% 42% / 0.1), 0 6px 0 hsl(158 64% 42% / 0.06)",
          }}
        >
          onesimplesite
        </span>
      </motion.div>
    </div>
  );
}

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="relative mt-auto border-t border-border bg-background">
      <div className="content-width relative z-10 pb-0 pt-14 sm:pt-16 md:pt-20">
        <div className="grid gap-10 border-b border-border pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="OneSimpleSite home">
              <LogoMark className="h-8 w-8 text-foreground" />
              <span className="font-display text-2xl font-bold" style={{ letterSpacing: "-0.04em" }}>
                one<span className="text-primary">simple</span>site
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Fast, proven websites for local UK businesses. No drama, just results.
            </p>
            <Link to="/start" className="btn-primary btn-md mt-6 inline-flex">
              Start a project
            </Link>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h2 className="eyebrow mb-4">Navigate</h2>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow mb-4">Contact</h2>
            <ul className="space-y-2.5">
              <li>
                <Link to="/start" className={linkCls}>
                  Start a project
                </Link>
              </li>
              <li>
                <a href="mailto:hello@onesimplesite.co.uk" className={linkCls}>
                  hello@onesimplesite.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="mono text-[11px] tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="mono text-[11px] tracking-wide text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="mono text-[11px] tracking-wide text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/cookies" className="mono text-[11px] tracking-wide text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
          <p className="mono text-[11px] tracking-wide text-muted-foreground">Made for local UK businesses</p>
        </div>

        <TiltWordmark />
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
