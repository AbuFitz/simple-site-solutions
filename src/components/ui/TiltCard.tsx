import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** CSS-3D card that tips toward the pointer on desktop. No effect on touch or with reduced motion. */
export function TiltCard({
  children,
  className = "",
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const rotateY = useTransform(sx, [-1, 1], [-max, max]);
  const rotateX = useTransform(sy, [-1, 1], [max, -max]);
  const gx = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const gy = useTransform(sy, [-1, 1], ["20%", "80%"]);
  const glareBg = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x} ${y}, hsl(0 0% 100% / 0.12), transparent 55%)`);

  return (
    <div className="perspective-1000">
      <motion.div
        ref={ref}
        className={`relative ${className}`}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          px.set(((e.clientX - r.left) / r.width) * 2 - 1);
          py.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {children}
        {glare && !reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
