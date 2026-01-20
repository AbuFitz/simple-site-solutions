import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";

interface FooterProps {
  showCTA?: boolean;
}

export function Footer({ showCTA = true }: FooterProps) {
  return (
    <footer className="border-t border-border relative bg-background">
      <DottedGrid className="opacity-10" spacing={32} />
      <div className="content-width py-12 sm:py-16 md:py-20 relative z-10">
        {/* Main CTA - Only show if showCTA is true */}
        {showCTA && (
          <motion.div 
            className="bordered-section p-6 sm:p-8 md:p-10 max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-15" spacing={24} />
            <div className="relative z-10">
              <h2 className="text-title sm:text-headline mb-3 sm:mb-4">
                Let's build your site
              </h2>
              <p className="text-body-lg max-w-md mx-auto mb-6 sm:mb-8">
                Pick a package, share your details, and get a website that converts.
              </p>
              <Link
                to="/start"
                className="btn-primary btn-lg group"
              >
                Start Your Project
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Footer Grid */}
        <div className="grid gap-8 sm:gap-12 md:grid-cols-4 pb-8 sm:pb-12 md:pb-16 border-b border-border">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight inline-block hover:text-primary transition-colors">
              one<span className="text-primary">simple</span>site
            </Link>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-sm">
              Fast, proven websites for local UK businesses. No drama, just results.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-works", label: "Process" },
                { to: "/packages", label: "Pricing" },
                { to: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  to="/start"
                  className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start a Project
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@onesimplesite.co.uk"
                  className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors break-all"
                >
                  hello@onesimplesite.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Made for local UK businesses
          </p>
        </div>

        {/* Extra padding for mobile bottom nav */}
        <div className="h-16 md:h-0" />
      </div>
    </footer>
  );
}
