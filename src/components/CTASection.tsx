import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
    <section className="py-12 sm:py-16 md:py-24 pb-28 md:pb-24">
      <div className="content-width">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 sm:w-12 h-px bg-border" />
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-8 sm:w-12 h-px bg-border" />
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            {title} <span className="text-primary">{highlightedText}</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              to={primaryButtonLink}
              className="btn-primary btn-lg justify-center"
            >
              {primaryButtonText}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link
                to={secondaryButtonLink}
                className="btn-outline btn-lg justify-center"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
