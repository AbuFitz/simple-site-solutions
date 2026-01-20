import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="content-width py-20 md:py-28">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-headline mb-6">
            Ready to get <span className="text-primary">started?</span>
          </h2>
          <p className="text-body-lg max-w-md mx-auto mb-8">
            Let's build you a website that actually converts.
          </p>
          <Link
            to="/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all"
          >
            Start Your Project
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer Grid */}
        <div className="grid gap-12 md:grid-cols-4 pb-16 border-b border-border">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              one<span className="text-primary">simple</span>site
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              Fast, proven websites for local UK businesses. No drama, just results.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-works", label: "Process" },
                { to: "/packages", label: "Pricing" },
                { to: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/start"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start a Project
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@onesimplesite.co.uk"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@onesimplesite.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite
          </p>
          <p className="text-sm text-muted-foreground">
            Made for local UK businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
