/** Retired decoration: the editorial system uses whitespace instead of dotted backgrounds. Kept so existing imports render nothing. */
import { forwardRef } from "react";

interface DottedGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

export const DottedGrid = forwardRef<HTMLDivElement, DottedGridProps>(() => null);
DottedGrid.displayName = "DottedGrid";
