import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PortfolioItem {
  id: number;
  title: string;
  industry: string;
  gradient: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Smith's Plumbing",
    industry: "Plumber",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Sparkle Clean",
    industry: "Cleaning Service",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
  },
  {
    id: 3,
    title: "Dave's Auto",
    industry: "Mechanic",
    gradient: "from-orange-600 via-red-500 to-pink-500",
  },
];

export function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="work" className="section overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container relative">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-gradient mb-6 inline-block">Our Work</span>
            <h2 className="section-title">
              Websites that <span className="gradient-text">actually work</span>
            </h2>
            <p className="section-subtitle">
              Real sites. Real businesses. Real results.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Portfolio */}
        <div 
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={`flex gap-8 ${isHovered ? '' : 'animate-scroll'}`}
            style={{
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {/* Double the items for seamless loop */}
            {[...portfolioItems, ...portfolioItems].map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 w-[400px] md:w-[500px] lg:w-[600px]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -10 }}
              >
                <div className="gradient-border">
                  <div className="gradient-border-inner overflow-hidden">
                    {/* Mock website preview */}
                    <div className={`aspect-[16/10] bg-gradient-to-br ${item.gradient} relative`}>
                      {/* Browser chrome */}
                      <div className="absolute top-0 left-0 right-0 bg-gray-900/90 backdrop-blur px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-400 max-w-xs">
                            {item.title.toLowerCase().replace(/['\s]/g, '')}.co.uk
                          </div>
                        </div>
                      </div>
                      
                      {/* Mock content */}
                      <div className="absolute inset-0 top-10 p-6 flex flex-col items-center justify-center text-white text-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 mb-4" />
                        <div className="h-8 w-48 bg-white/30 rounded mb-3" />
                        <div className="h-4 w-64 bg-white/20 rounded mb-2" />
                        <div className="h-4 w-56 bg-white/20 rounded mb-6" />
                        <div className="h-10 w-32 bg-white rounded-lg" />
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-6 bg-card">
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.industry}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
