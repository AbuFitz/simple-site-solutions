import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Home, FileText, CreditCard, HelpCircle } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/how-it-works", label: "Process", icon: FileText },
  { path: "/packages", label: "Pricing", icon: CreditCard },
  { path: "/faq", label: "FAQ", icon: HelpCircle },
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
      {/* Desktop Floating Navigation Pill */}
      <motion.header
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav
          className={`flex items-center gap-1 p-1.5 rounded-full border-2 border-border transition-all duration-300 ${
            scrolled ? "bg-background/98 backdrop-blur-md" : "bg-background/95 backdrop-blur-sm"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="px-4 py-2 text-lg font-bold tracking-tight whitespace-nowrap hover:text-primary transition-colors"
          >
            one<span className="text-primary">simple</span>site
          </Link>

          {/* Desktop Links */}
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/start"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </motion.header>

      {/* Mobile Top Bar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b border-border transition-all duration-300 ${
          scrolled ? "bg-background/98 backdrop-blur-md" : "bg-background"
        }`}>
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight"
          >
            one<span className="text-primary">simple</span>site
          </Link>

          {/* CTA & Menu */}
          <div className="flex items-center gap-2">
            <Link
              to="/start"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
            >
              Start
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-secondary text-foreground border border-border"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        className="mobile-bottom-nav safe-area-inset-bottom"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dotted grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            
            <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-24 relative z-10">
              <nav className="space-y-2 text-center w-full max-w-xs">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center justify-center gap-3 py-4 text-xl font-bold transition-all duration-200 rounded-2xl border-2 ${
                          location.pathname === item.path
                            ? "text-primary border-primary bg-primary/5"
                            : "text-foreground border-transparent hover:border-border hover:bg-secondary/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                  className="pt-6"
                >
                  <Link
                    to="/start"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold w-full"
                  >
                    Get Started
                    <ArrowUpRight className="w-5 h-5" />
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
