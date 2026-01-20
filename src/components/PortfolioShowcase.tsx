import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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
    <section className="section overflow-hidden">
      <div className="content-width">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="badge-primary mb-4 inline-block">Our Work</span>
            <h2 className="text-headline">
              Websites that <span className="text-primary">deliver</span>
            </h2>
          </div>
          
          {/* Navigation arrows - desktop */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={scrollPrev}
              className="p-4 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="p-4 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className="flex-[0_0_85%] md:flex-[0_0_70%] lg:flex-[0_0_60%] min-w-0 pl-6 first:pl-6 md:first:pl-16"
            >
              <motion.div
                className={`group relative transition-all duration-500 ${
                  selectedIndex === index ? "scale-100" : "scale-95 opacity-60"
                }`}
              >
                {/* Browser Frame */}
                <div className="rounded-2xl overflow-hidden bg-secondary border border-border">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-6 bg-background rounded-md flex items-center px-3">
                        <span className="text-xs text-muted-foreground truncate">
                          {item.title.toLowerCase().replace(/['\s]/g, "")}.co.uk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Website Preview */}
                  <div className="aspect-[16/10] bg-background relative">
                    {/* Placeholder website mockup */}
                    <div className="absolute inset-0 p-8 flex flex-col">
                      {/* Hero section mockup */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="h-6 w-32 bg-foreground/10 rounded" />
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-foreground/5 rounded" />
                          <div className="h-6 w-16 bg-foreground/5 rounded" />
                          <div className="h-8 w-24 bg-primary/30 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center">
                        <div className="w-full max-w-md">
                          <div className="h-4 w-24 bg-primary/20 rounded mb-4" />
                          <div className="h-12 w-full bg-foreground/10 rounded mb-3" />
                          <div className="h-12 w-3/4 bg-foreground/10 rounded mb-6" />
                          <div className="h-4 w-full bg-foreground/5 rounded mb-2" />
                          <div className="h-4 w-2/3 bg-foreground/5 rounded mb-8" />
                          <div className="flex gap-3">
                            <div className="h-12 w-32 bg-primary/40 rounded-full" />
                            <div className="h-12 w-32 bg-foreground/5 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <ExternalLink className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-foreground font-semibold text-lg mb-1">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info below */}
                <div className="mt-6 px-2">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.industry}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-10">
        {portfolioItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-8 bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - mobile */}
      <div className="flex md:hidden justify-center gap-3 mt-6">
        <button
          onClick={scrollPrev}
          className="p-3 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="p-3 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
