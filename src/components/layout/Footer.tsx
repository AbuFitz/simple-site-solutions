import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="content-width py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="logo text-2xl">
              one<span className="logo-accent">simple</span>site
            </Link>
            <p className="mt-4 text-body max-w-sm">
              Fast, proven websites for local businesses. Built from what
              already works in your industry.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-body hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-body hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-body hover:text-foreground transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-body hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/start" className="text-body hover:text-foreground transition-colors">
                  Start Your Project
                </Link>
              </li>
              <li>
                <a href="mailto:hello@onesimplesite.co.uk" className="text-body hover:text-foreground transition-colors">
                  hello@onesimplesite.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for local businesses in the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}
