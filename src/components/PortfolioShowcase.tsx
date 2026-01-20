import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  industry: string;
  color: string;
  stats: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Smith's Plumbing",
    industry: "Emergency Plumber",
    color: "from-cyan-500 via-blue-600 to-indigo-700",
    stats: "+340% enquiries",
  },
  {
    id: 2,
    title: "Sparkle Clean Co",
    industry: "Cleaning Service",
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    stats: "+210% bookings",
  },
  {
    id: 3,
    title: "Dave's Auto Care",
    industry: "Mechanic",
    color: "from-orange-400 via-red-500 to-pink-600",
    stats: "+180% calls",
  },
];

export function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="section-tight overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="badge-glow mb-6 inline-block">Selected Work</span>
          <h2 className="heading-lg max-w-4xl">
            Websites that{" "}
            <span className="text-gradient">deliver results</span>
          </h2>
        </motion.div>

        {/* Portfolio Grid */}
        <div
          ref={containerRef}
          className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="portfolio-card cursor-pointer">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-transform duration-700 group-hover:scale-110`}
                />

                {/* Mock browser */}
                <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white/60 text-xs font-medium">
                      {item.title.toLowerCase().replace(/['\s]/g, "")}.co.uk
                    </span>
                  </div>
                </div>

                {/* Content preview */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 pt-16">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-6" />
                  <div className="h-6 w-40 bg-white/30 rounded-lg mb-3" />
                  <div className="h-3 w-56 bg-white/20 rounded mb-2" />
                  <div className="h-3 w-48 bg-white/20 rounded mb-6" />
                  <div className="h-10 w-28 bg-white/90 rounded-lg" />
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-electric flex items-center justify-center mb-4">
                    <ArrowUpRight className="w-6 h-6 text-electric" />
                  </div>
                  <span className="text-electric font-semibold text-lg">
                    {item.stats}
                  </span>
                </motion.div>
              </div>

              {/* Info */}
              <div className="mt-5">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground">{item.industry}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-electric transition-colors group"
          >
            <span className="font-medium">View more projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
