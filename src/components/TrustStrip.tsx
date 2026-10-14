import { motion } from "framer-motion";

const trustItems = [
  "Fixed Prices",
  "Layouts For Your Trade",
  "Plain-English Process",
  "No Endless Meetings",
];

export function TrustStrip() {
  return (
    <motion.div
      className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {trustItems.map((item, index) => (
        <motion.span
          key={index}
          className="inline-flex items-center text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
        >
          <span className="w-1 h-1 rounded-full bg-primary mr-2" />
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
}
