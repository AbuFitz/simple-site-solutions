import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { DottedGrid } from "@/components/ui/DottedGrid";

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
    <section className="section-sm overflow-hidden relative">
      <div className="content-width">
        {/* Header */}
        <motion.div
          className="bordered-section p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={20} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <div>
              <span className="badge-primary mb-3 sm:mb-4 inline-block">Our Work</span>
              <h2 className="text-headline">
                Websites that <span className="text-primary">deliver</span>
              </h2>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={scrollPrev}
                className="p-3 sm:p-4 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="p-3 sm:p-4 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_55%] min-w-0 pl-4 sm:pl-6 first:pl-4 sm:first:pl-6 md:first:pl-16"
            >
              <motion.div
                className={`group relative transition-all duration-500 ${
                  selectedIndex === index ? "scale-100" : "scale-[0.97] opacity-60"
                }`}
              >
                {/* Browser Frame */}
                <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-card border-2 border-border hover:border-primary/50 transition-colors">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-secondary border-b border-border">
                    <div className="flex gap-1 sm:gap-1.5">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div className="h-5 sm:h-6 bg-background rounded-md sm:rounded-lg flex items-center px-2 sm:px-3 border border-border">
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {item.title.toLowerCase().replace(/['\s]/g, "")}.co.uk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Website Preview */}
                  <div className="aspect-[16/10] bg-background relative">
                    {/* Placeholder website mockup */}
                    <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col">
                      {/* Hero section mockup */}
                      <div className="flex items-center justify-between mb-4 sm:mb-8">
                        <div className="h-4 sm:h-6 w-20 sm:w-32 bg-foreground/10 rounded" />
                        <div className="hidden sm:flex gap-2">
                          <div className="h-6 w-16 bg-foreground/5 rounded" />
                          <div className="h-6 w-16 bg-foreground/5 rounded" />
                          <div className="h-8 w-24 bg-primary/30 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center">
                        <div className="w-full max-w-md">
                          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-primary/20 rounded mb-3 sm:mb-4" />
                          <div className="h-8 sm:h-12 w-full bg-foreground/10 rounded mb-2 sm:mb-3" />
                          <div className="h-8 sm:h-12 w-3/4 bg-foreground/10 rounded mb-4 sm:mb-6" />
                          <div className="h-3 sm:h-4 w-full bg-foreground/5 rounded mb-1.5 sm:mb-2" />
                          <div className="h-3 sm:h-4 w-2/3 bg-foreground/5 rounded mb-6 sm:mb-8" />
                          <div className="flex gap-2 sm:gap-3">
                            <div className="h-8 sm:h-12 w-24 sm:w-32 bg-primary/40 rounded-full" />
                            <div className="h-8 sm:h-12 w-24 sm:w-32 bg-foreground/5 rounded-full border border-border" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <p className="text-foreground font-semibold text-base sm:text-lg mb-1">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info below */}
                <div className="mt-4 sm:mt-6 px-1 sm:px-2">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.industry}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6 sm:mt-10">
        {portfolioItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 border ${
              selectedIndex === index
                ? "w-6 sm:w-8 bg-primary border-primary"
                : "w-2 bg-muted-foreground/30 border-transparent hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
