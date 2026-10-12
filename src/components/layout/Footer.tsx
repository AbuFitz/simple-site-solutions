import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "Process" },
  { to: "/packages", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="relative mt-auto border-t border-border bg-background">
      <div className="content-width relative z-10 pb-0 pt-14 sm:pt-16 md:pt-20">
        <div className="grid gap-10 border-b border-border pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="OneSimpleSite home">
              <LogoMark className="h-8 w-8 text-foreground" />
              <span className="text-2xl font-bold">
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

      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
