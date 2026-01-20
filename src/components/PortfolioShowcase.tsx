import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface PortfolioItem {
  id: number;
  title: string;
  industry: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Smith's Plumbing",
    industry: "Emergency Plumber",
    description: "24/7 emergency plumbing services in Manchester",
  },
  {
    id: 2,
    title: "Sparkle Clean Co",
    industry: "Cleaning Service",
    description: "Professional home & office cleaning",
  },
  {
    id: 3,
    title: "Dave's Auto Care",
    industry: "Auto Mechanic",
    description: "Trusted car repairs & MOT services",
  },
];

export function PortfolioShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 sm:py-16 md:py-20 overflow-hidden relative z-10">
      <div className="content-width">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="badge-primary mb-3 sm:mb-4 inline-block">Our Work</span>
            <h2 className="text-headline">
              Websites that <span className="text-primary">deliver</span>
            </h2>
          </div>
          
          {/* Navigation arrows */}
          <div className="flex gap-2 sm:gap-3">
            <motion.button
              onClick={scrollPrev}
              className="p-3 sm:p-4 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border hover:border-primary"
              aria-label="Previous slide"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              onClick={scrollNext}
              className="p-3 sm:p-4 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border hover:border-primary"
              aria-label="Next slide"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className="flex-[0_0_88%] sm:flex-[0_0_75%] md:flex-[0_0_65%] lg:flex-[0_0_50%] min-w-0 pl-4 sm:pl-6 first:pl-4 sm:first:pl-6"
            >
              <motion.div
                className={`group relative transition-all duration-500 ${
                  selectedIndex === index ? "scale-100 opacity-100" : "scale-[0.96] opacity-50"
                }`}
                whileHover={{ scale: selectedIndex === index ? 1.02 : 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {/* Browser Frame */}
                <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-secondary border-2 border-border group-hover:border-primary/50 transition-all duration-300">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-background border-b border-border">
                    <div className="flex gap-1 sm:gap-1.5">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/60" />
                    </div>
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div className="h-5 sm:h-6 bg-secondary rounded-lg flex items-center px-2 sm:px-3 border border-border">
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {item.title.toLowerCase().replace(/['\s]/g, "")}.co.uk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Website Preview */}
                  <div className="aspect-[16/10] bg-card relative">
                    {/* Placeholder website mockup */}
                    <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col">
                      {/* Hero section mockup */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="h-4 sm:h-5 w-20 sm:w-28 bg-foreground/10 rounded" />
                        <div className="hidden sm:flex gap-2">
                          <div className="h-5 w-14 bg-foreground/5 rounded" />
                          <div className="h-5 w-14 bg-foreground/5 rounded" />
                          <div className="h-7 w-20 bg-primary/30 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center">
                        <div className="w-full max-w-md">
                          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-primary/20 rounded mb-3 sm:mb-4" />
                          <div className="h-7 sm:h-10 w-full bg-foreground/10 rounded mb-2" />
                          <div className="h-7 sm:h-10 w-3/4 bg-foreground/10 rounded mb-4 sm:mb-5" />
                          <div className="h-3 w-full bg-foreground/5 rounded mb-1.5" />
                          <div className="h-3 w-2/3 bg-foreground/5 rounded mb-5 sm:mb-6" />
                          <div className="flex gap-2 sm:gap-3">
                            <div className="h-8 sm:h-10 w-24 sm:w-28 bg-primary/40 rounded-full" />
                            <div className="h-8 sm:h-10 w-24 sm:w-28 bg-foreground/5 rounded-full border border-border" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-background/95 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-center px-4">
                        <motion.div 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-3 sm:mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </motion.div>
                        <p className="text-foreground font-bold text-base sm:text-lg mb-1">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Info below */}
                <div className="mt-4 sm:mt-5 px-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.industry}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6 sm:mt-8">
        {portfolioItems.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-6 sm:w-8 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
}
