import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DottedGrid } from "@/components/ui/DottedGrid";

interface CTASectionProps {
  title: string;
  highlightedText: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function CTASection({
  title,
  highlightedText,
  description,
  primaryButtonText = "Get Started",
  primaryButtonLink = "/start",
  secondaryButtonText,
  secondaryButtonLink,
}: CTASectionProps) {
  return (
    <section className="py-10 sm:py-14 md:py-20 pb-24 md:pb-20">
      <div className="content-width">
        <motion.div
          className="bordered-highlight text-center px-4 sm:px-6 py-10 sm:py-12 md:py-16 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={24} />
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3">
              {title} <span className="text-primary">{highlightedText}</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 max-w-md mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3">
              <Link
                to={primaryButtonLink}
                className="btn-primary btn-md sm:btn-lg justify-center"
              >
                {primaryButtonText}
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  to={secondaryButtonLink}
                  className="btn-outline btn-md sm:btn-lg justify-center"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
