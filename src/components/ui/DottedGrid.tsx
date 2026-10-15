import { forwardRef } from "react";

interface DottedGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

/** The dotted background was retired with the redesign. Kept as a no-op so inner pages need no edits. */
export const DottedGrid = forwardRef<HTMLDivElement, DottedGridProps>(() => null);

DottedGrid.displayName = "DottedGrid";
