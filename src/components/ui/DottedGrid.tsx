import { forwardRef } from "react";

interface DottedGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

export const DottedGrid = forwardRef<HTMLDivElement, DottedGridProps>(
  (
    {
      className = "",
      dotColor = "hsl(var(--muted-foreground) / 0.15)",
      dotSize = 1,
      spacing = 24,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
      />
    );
  }
);

DottedGrid.displayName = "DottedGrid";
