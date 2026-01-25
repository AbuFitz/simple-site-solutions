import { forwardRef } from "react";
import { Link } from "react-router-dom";
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
            <Link to="/" className="text-base sm:text-lg md:text-xl font-bold tracking-tight">
              one<span className="text-primary">simple</span>site
            </Link>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground max-w-xs">
              Fast, proven websites for local UK businesses. No drama, just results.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-works", label: "Process" },
                { to: "/packages", label: "Pricing" },
                { to: "/faq", label: "FAQ" },
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
            <h4 className="font-semibold mb-2 sm:mb-3 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
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

        {/* Bottom */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/privacy"
              className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Made for local UK businesses
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
