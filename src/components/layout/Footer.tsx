import { forwardRef } from "react";
import { Link } from "react-router-dom";
import locationData from "@/data/locations.json";
import { locationPath } from "@/lib/locationSeo.mjs";
import { DottedGrid } from "@/components/ui/DottedGrid";

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
            <Link to="/web-design" className="underline underline-offset-4 hover:text-foreground">Web design near you</Link>:
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
