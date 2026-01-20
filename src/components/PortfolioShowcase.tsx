import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  industry: string;
  result: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Smith's Plumbing",
    industry: "Emergency Plumber",
    result: "+340% enquiries",
  },
  {
    id: 2,
    title: "Sparkle Clean Co",
    industry: "Cleaning Service",
    result: "+210% bookings",
  },
  {
    id: 3,
    title: "Dave's Auto Care",
    industry: "Mechanic",
    result: "+180% calls",
  },
];

export function PortfolioShowcase() {
  return (
    <section className="section">
      <div className="content-width">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="badge-primary mb-4 inline-block">Our Work</span>
          <h2 className="text-headline">
            Real results for <span className="text-accent">real businesses</span>
          </h2>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card-base hover:border-primary/50 transition-colors cursor-pointer">
                {/* Mock Preview */}
                <div className="aspect-[4/3] bg-muted rounded-lg mb-6 relative overflow-hidden">
                  {/* Browser bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-secondary flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div className="ml-3 flex-1 h-4 bg-muted rounded" />
                  </div>
                  
                  {/* Mock content */}
                  <div className="absolute inset-0 top-8 p-4 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg mb-3" />
                    <div className="w-24 h-4 bg-foreground/10 rounded mb-2" />
                    <div className="w-32 h-3 bg-foreground/5 rounded mb-4" />
                    <div className="w-16 h-6 bg-primary/30 rounded" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-3">
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-primary font-bold text-lg">
                        {item.result}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground">{item.industry}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
