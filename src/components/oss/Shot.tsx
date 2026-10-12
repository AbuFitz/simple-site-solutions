import { useLayoutEffect, useRef, useState } from "react";
import type { WorkProject } from "@/data/work";
import { DIMS } from "@/data/work";
import { contourPath, Contour } from "./clip";

export type Crop = "top" | "upper" | "mid" | "lower" | "bottom";
const POS: Record<Crop, string> = { top: "50% 0%", upper: "50% 22%", mid: "50% 48%", lower: "50% 72%", bottom: "50% 100%" };

interface ShotProps {
  project: WorkProject;
  /** d = long desktop capture (cropped), m = phone capture, t = homepage thumbnail */
  kind?: "d" | "m" | "t";
  crop?: Crop;
  contour?: Contour;
  /** CSS aspect-ratio, e.g. "4 / 3". Reserves space before the image loads. */
  ratio?: string;
  radius?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  /** Show the real long capture scrolled to a given crop (desktop kind only). */
  decorative?: boolean;
}

/** A real project capture inside an original contour (stepped notch, arch, leaf...). */
export function Shot({
  project,
  kind = "t",
  crop = "top",
  contour = "plain",
  ratio = "16 / 10",
  radius = 24,
  className = "",
  alt,
  priority = false,
  sizes,
  decorative = false,
}: ShotProps) {
  const box = useRef<HTMLDivElement>(null);
  const [clip, setClip] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el || contour === "plain" && radius === 0) return;
    const apply = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setClip(`path('${contourPath(contour, width, height, radius)}')`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [contour, radius]);

  const src = project.img[kind];
  const w = kind === "d" ? DIMS.d.w : DIMS[kind].w;
  const h = kind === "d" ? project.img.dh : DIMS[kind].h;
  const description =
    alt ??
    (kind === "m" ? `${project.name} on a phone` : kind === "d" ? `${project.name} website, desktop capture` : `${project.name} homepage`);

  return (
    <div
      ref={box}
      className={`shot ${className}`}
      style={{ aspectRatio: ratio, clipPath: clip, borderRadius: clip ? undefined : radius }}
    >
      <img
        src={src}
        width={w}
        height={h}
        alt={decorative ? "" : description}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        style={{ objectPosition: POS[crop] }}
      />
    </div>
  );
}
