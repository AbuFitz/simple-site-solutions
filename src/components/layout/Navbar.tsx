import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { CartButton } from "@/components/shop/CartButton";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/how-it-works", label: "Process" },
  { path: "/packages", label: "Pricing" },
  { path: "/shop", label: "Shop" },
  { path: "/faq", label: "FAQ" },
];

export function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => (path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(`${path}/`));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);


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

  // Escape closes the menu and returns focus to the button that opened it
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

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
        className="fixed top-3 sm:top-4 md:top-6 left-1/2 z-[80] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-2xl lg:max-w-4xl"
        style={{ x: "-50%" }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <nav
          className={`relative flex items-center gap-2 min-w-0 p-1.5 sm:p-2 rounded-full border-2 border-border transition-all duration-300 ${
            scrolled ? "bg-background/98 backdrop-blur-md shadow-lg" : "bg-background/95 backdrop-blur-sm"
          }`}
        >
          {/* Mobile/Tablet Menu Button - Moved before logo */}
          <button
            ref={menuButton}
            type="button"
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex-shrink-0 inline-flex items-center justify-center p-2.5 sm:p-3 bg-primary text-primary-foreground rounded-full transition-all hover:brightness-110"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="flex-1 min-w-0 lg:flex-none px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-lg sm:text-xl md:text-lg lg:text-2xl lg:pl-5 lg:pr-6 font-bold tracking-tight truncate"
          >
            one<span className="text-primary">simple</span>site
          </Link>

          {/* Desktop Links - hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border ${
                  isActive(item.path)
                    ? "bg-secondary text-foreground border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <CartButton className="flex-shrink-0" />

          {/* Desktop CTA */}
          <Link
            to="/start"
            className="hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:brightness-110 transition-all"
          >
            Get Started
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[75] bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              className="fixed top-[4.5rem] left-3 right-3 sm:left-6 sm:right-6 z-[85] lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="bg-background border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Dotted grid background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                <nav className="relative z-10 p-4 sm:p-5">
                  <div className="space-y-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: 0.05 + index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          to={item.path}
                          className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors border-2 ${
                            isActive(item.path)
                              ? "text-primary border-primary"
                              : "text-foreground border-transparent hover:bg-secondary"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <Link
                      to="/start"
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                    >
                      Get Started
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
