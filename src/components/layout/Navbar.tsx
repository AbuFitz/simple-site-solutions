import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Work", path: "/#work" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Packages", path: "/packages" },
  { name: "FAQ", path: "/faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center group">
          <span className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">one</span>
            <span className="text-foreground">simple</span>
            <span className="gradient-text">site</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild className="gradient-bg border-0 text-white hover:opacity-90">
            <Link to="/start">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border lg:hidden">
          <div className="container flex flex-col gap-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="mt-4 gradient-bg border-0 text-white">
              <Link to="/start" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
