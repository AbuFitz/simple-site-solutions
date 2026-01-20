interface DottedGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

export function DottedGrid({
  className = "",
  dotColor = "hsl(var(--muted-foreground) / 0.15)",
  dotSize = 1,
  spacing = 24,
}: DottedGridProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}
