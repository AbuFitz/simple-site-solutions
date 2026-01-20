import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const footerLinks = [
  { name: "Work", path: "/#work" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Packages", path: "/packages" },
  { name: "FAQ", path: "/faq" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg-subtle opacity-50" />
      
      <div className="container relative py-20">
        {/* CTA Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to get your website <span className="gradient-text">live</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Stop losing customers to competitors with better websites.
          </p>
          <Button asChild size="lg" className="gradient-bg border-0 text-white hover:opacity-90">
            <Link to="/start">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="border-t border-border pt-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Brand */}
            <div className="text-center md:text-left">
              <Link to="/" className="text-2xl font-bold tracking-tight">
                <span className="gradient-text">one</span>
                <span className="text-foreground">simple</span>
                <span className="gradient-text">site</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                Proven websites for local businesses. Fast. Focused. Built for results.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8">
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

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OneSimpleSite. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
