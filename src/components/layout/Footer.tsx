import { Link } from "react-router-dom";

const footerLinks = [
  { name: "How It Works", path: "/how-it-works" },
  { name: "Packages", path: "/packages" },
  { name: "FAQ", path: "/faq" },
  { name: "Get Started", path: "/start" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
              onesimplesite
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Fast, proven websites for local businesses. No fluff. Just results.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OneSimpleSite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
