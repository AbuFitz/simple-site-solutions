import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { DottedGrid } from "@/components/ui/DottedGrid";
import fixnowScreenshot from "@/assets/portfolio/fixnowmechanics.png";
import arfmodsScreenshot from "@/assets/portfolio/arfmods.png";
import readysoldScreenshot from "@/assets/portfolio/readysold.png";

interface PortfolioItem {
  id: number;
  title: string;
  industry: string;
  description: string;
  url: string;
  screenshot: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "FixNow Mechanics",
    industry: "Mobile Mechanic",
    description: "Mobile mechanic services in Hertfordshire - we come to you!",
    url: "https://fixnowmechanics.co.uk",
    screenshot: fixnowScreenshot,
  },
  {
    id: 2,
    title: "ARF Mods",
    industry: "E-commerce / Auto Parts",
    description: "Premium BMW performance parts & coding services",
    url: "https://arfmods.vercel.app",
    screenshot: arfmodsScreenshot,
  },
  {
    id: 3,
    title: "ReadySold",
    industry: "Car Sales Service",
    description: "Sell your car stress-free with full market value",
    url: "https://readysold.vercel.app",
    screenshot: readysoldScreenshot,
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
    <section className="py-8 sm:py-12 md:py-16 overflow-hidden relative">
      <div className="content-width">
        {/* Header - Compact */}
        <motion.div
          className="bordered-section p-3 sm:p-5 md:p-6 mb-5 sm:mb-8 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={20} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <span className="badge-primary mb-2 sm:mb-3 inline-block text-[9px] sm:text-xs">Our Work</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Websites that <span className="text-primary">deliver</span>
              </h2>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                className="p-2.5 sm:p-3 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="p-2.5 sm:p-3 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors border border-border"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
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

                  {/* Website Preview - Real Screenshot */}
                  <div className="aspect-[16/10] bg-background relative overflow-hidden">
                    <img 
                      src={item.screenshot} 
                      alt={`${item.title} website preview`}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Hover overlay */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    >
                      <div className="text-center px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <p className="text-foreground font-semibold text-base sm:text-lg mb-1">
                          Visit {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </a>
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
      <div className="flex justify-center gap-1.5 mt-5 sm:mt-8">
        {portfolioItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 border ${
              selectedIndex === index
                ? "w-5 sm:w-6 bg-primary border-primary"
                : "w-1.5 sm:w-2 bg-muted-foreground/30 border-transparent hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
