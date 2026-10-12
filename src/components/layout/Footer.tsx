import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Pill } from "@/components/oss/Pill";
import { Wordmark, navItems } from "./Navbar";

const legal = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/cookies", label: "Cookies" },
];

export const Footer = forwardRef<HTMLElement>((_, ref) => (
  <footer ref={ref} className="theme-ink mt-auto rounded-t-[28px] md:rounded-t-[44px]">
    <div className="content-width pb-8 pt-16 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="t-label mb-6">Next step</p>
          <h2 className="t-mega" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
            Let&rsquo;s make
            <span className="block pl-[8vw]">your site.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 pl-0 md:pl-[8vw]">
            <Pill to="/start">Start your project</Pill>
            <a href="mailto:hello@onesimplesite.co.uk" className="link-line text-lg">
              hello@onesimplesite.co.uk
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:pl-6">
          <nav aria-label="Footer">
            <p className="mb-4 text-sm font-semibold text-muted-foreground">Explore</p>
            <ul className="space-y-2.5">
              {navItems.map((n) => (
                <li key={n.path}>
                  <Link to={n.path} className="text-base hover:text-primary">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-4 text-sm font-semibold text-muted-foreground">Start</p>
            <ul className="space-y-2.5">
              <li><Link to="/start" className="text-base hover:text-primary">Start a project</Link></li>
              <li><Link to="/packages" className="text-base hover:text-primary">From £199</Link></li>
              <li><Link to="/contact" className="text-base hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="OneSimpleSite home" className="text-lg text-foreground"><Wordmark /></Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <ul className="flex gap-6">
          {legal.map((l) => (
            <li key={l.to}><Link to={l.to} className="hover:text-foreground">{l.label}</Link></li>
          ))}
        </ul>
        <p>Made for local UK businesses</p>
      </div>
    </div>
  </footer>
));
Footer.displayName = "Footer";
