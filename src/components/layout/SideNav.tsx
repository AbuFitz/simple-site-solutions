import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Layers, Package, HelpCircle, ArrowRight } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/how-it-works", icon: Layers, label: "Process" },
  { path: "/packages", icon: Package, label: "Packages" },
  { path: "/faq", icon: HelpCircle, label: "FAQ" },
];

export function SideNav() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Side Navigation */}
      <motion.nav
        className="side-nav hidden lg:flex"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Logo */}
        <Link to="/" className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center mx-auto">
            <span className="text-xl font-bold text-background">O</span>
          </div>
        </Link>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`side-nav-link group relative ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-card text-sm font-medium whitespace-nowrap opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-border">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link to="/start" className="group">
          <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center text-electric group-hover:bg-electric group-hover:text-background transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-xl border-t border-border"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-around py-3 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                location.pathname === item.path
                  ? "text-electric"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          <Link
            to="/start"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-electric"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-xs font-medium">Start</span>
          </Link>
        </div>
      </motion.nav>
    </>
  );
}
