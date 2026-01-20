import { motion } from "framer-motion";
import { Zap, Shield, Clock } from "lucide-react";

const trustItems = [
  { icon: Zap, text: "5-10 Day Delivery" },
  { icon: Shield, text: "Satisfaction Guarantee" },
  { icon: Clock, text: "No Endless Meetings" },
];

export function TrustStrip() {
  return (
    <motion.div
      className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {trustItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <item.icon className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">{item.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
