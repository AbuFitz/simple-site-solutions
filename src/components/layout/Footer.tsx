import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SOCIAL } from "@/data/site";
import locationData from "@/data/locations.json";
import { locationPath } from "@/lib/locationSeo.mjs";
import { DottedGrid } from "@/components/ui/DottedGrid";

const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.6 3c.3 2.3 1.6 3.8 3.9 4v3.1c-1.4.1-2.7-.3-3.9-1.1v6.2c0 3.8-3 6.3-6.2 6.3a6.1 6.1 0 0 1-6.2-6.1c0-3.7 3.2-6.5 7-6v3.2c-1.7-.4-3.5.8-3.5 2.7 0 1.6 1.3 2.9 2.8 2.9 1.7 0 2.9-1.3 2.9-3V3h3.2Z" />
  </svg>
);
const SOCIAL_ICON = { instagram: Instagram, facebook: Facebook, tiktok: TikTok, linkedin: Linkedin } as const;

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t-2 border-border relative mt-auto">
      <DottedGrid className="opacity-15" spacing={28} />
      <div className="content-width py-8 sm:py-10 md:py-12 lg:py-16 relative z-10">
        {/* Footer Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-4 pb-6 sm:pb-8 border-b border-border">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight">
              one<span className="text-primary">simple</span>site
            </Link>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground max-w-xs">
              Fixed-price websites for local UK businesses.
            </p>
            <ul className="mt-4 flex items-center gap-2" aria-label="OneSimpleSite on social media">
              {SOCIAL.map((n) => {
                const Icon = SOCIAL_ICON[n.id];
                return (
                  <li key={n.id}>
                    <a href={n.url} target="_blank" rel="noopener noreferrer me" className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      <span className="sr-only">{n.label} (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-semibold mb-2 sm:mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Navigate
            </h2>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/work", label: "Our Work" },
                { to: "/how-it-works", label: "Process" },
                { to: "/packages", label: "Pricing" },
                { to: "/faq", label: "FAQ" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-2 sm:mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Contact
            </h2>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  to="/start"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start a Project
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@onesimplesite.co.uk"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@onesimplesite.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Local areas */}
        <div className="mb-4 border-t border-border/60 pt-4 sm:mb-6 sm:pt-6">
          <p className="text-xs text-muted-foreground">
            OneSimpleSite provides web design and development for businesses across the UK.{" "}
            <Link to="/web-design" className="underline underline-offset-4 hover:text-foreground">Web design near you</Link> · <Link to="/guides" className="underline underline-offset-4 hover:text-foreground">Guides</Link>:
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1" aria-label="Web design by area">
            {locationData.locations.map((l) => (
              <li key={l.slug}>
                <Link to={locationPath(l.slug)} className="inline-flex min-h-[28px] items-center text-xs text-muted-foreground transition-colors hover:text-foreground">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/accessibility"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Accessibility
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Made for local UK businesses
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
