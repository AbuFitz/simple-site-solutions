import { ReactNode, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ChapterStageProps {
  count: number;
  /** Renders the sticky 3D stage. `chapter` runs 0..count-1 as the chapters pass the focus line. */
  stage: (chapter: MotionValue<number>) => ReactNode;
  /** One block per chapter. `active` is the chapter nearest the focus line. */
  chapters: (active: number) => ReactNode[];
  /** Tailwind classes for the pinned stage box. */
  stageClassName?: string;
  chapterClassName?: string;
}

/**
 * A pinned 3D stage with prose chapters that scroll past it.
 * Desktop: stage left, chapters right, both centred on the viewport.
 * Phone: stage pinned across the top, chapters scroll beneath it. Native scrolling throughout.
 */
export function ChapterStage({ count, stage, chapters, stageClassName = "", chapterClassName = "" }: ChapterStageProps) {
  const list = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const focus = desktop ? "50%" : "74%";
  const { scrollYProgress } = useScroll({ target: list, offset: [`start ${focus}`, `end ${focus}`] });
  const chapter = useTransform(scrollYProgress, (p) => Math.min(count - 1, Math.max(0, p * count - 0.5)));
  const [active, setActive] = useState(0);
  useMotionValueEvent(chapter, "change", (c) => {
    const n = Math.round(c);
    setActive((a) => (a === n ? a : n));
  });

  return (
    <div className="relative lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      <div
        className={`sticky top-0 z-10 bg-inherit lg:self-start ${stageClassName}`}
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        {stage(chapter)}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-b from-background to-transparent lg:hidden"
        />
      </div>
      <div ref={list} className="space-y-3 lg:space-y-0">
        {chapters(active).map((c, i) => (
          <div key={i} className={`flex items-center ${chapterClassName}`}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
