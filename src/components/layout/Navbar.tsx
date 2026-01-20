import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/how-it-works", label: "Process" },
  { path: "/packages", label: "Pricing" },
  { path: "/faq", label: "FAQ" },
];

export function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Floating Navigation Pill */}
      <motion.header
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <nav
          className={`flex items-center justify-between sm:justify-start gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full border-2 border-border transition-all duration-300 ${
            scrolled ? "bg-background/98 backdrop-blur-md shadow-lg" : "bg-background/95 backdrop-blur-sm"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap"
          >
            one<span className="text-primary">simple</span>site
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                  location.pathname === item.path
                    ? "bg-secondary text-foreground border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <Link
            to="/start"
            className="hidden md:inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:brightness-110 transition-all"
          >
            Get Started
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          {/* Menu Button - Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex md:hidden items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:brightness-110 transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <>
                Close
                <X className="w-4 h-4" />
              </>
            ) : (
              <>
                Menu
                <Menu className="w-4 h-4" />
              </>
            )}
          </button>
        </nav>
      </motion.header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dotted grid background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.2) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            
            <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
              <nav className="space-y-1 text-center w-full max-w-sm">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      to={item.path}
                      className={`block py-3 sm:py-4 text-2xl sm:text-3xl font-bold transition-colors rounded-2xl border-2 mb-2 ${
                        location.pathname === item.path
                          ? "text-primary border-primary bg-primary/5"
                          : "text-foreground hover:text-primary border-transparent hover:border-border"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: navItems.length * 0.08 }}
                  className="pt-6 sm:pt-8"
                >
                  <Link
                    to="/start"
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full text-base sm:text-lg font-semibold w-full justify-center border-2 border-primary"
                  >
                    Get Started
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
