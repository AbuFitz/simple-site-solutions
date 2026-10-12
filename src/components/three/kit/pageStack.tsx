import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { Slab } from "./slab";
import { clamp, easeOutBack, smooth, useDrawnTexture } from "./hooks";
import { drawers, PAGE_GAP, PAGE_HEIGHT, PAGE_MODULES, PAGE_W, texSize, Thumbs } from "./pageTextures";
import { projects } from "@/data/work";

const THUMB_SLUGS = ["fixnow-mechanics", "brightlearn-tutoring", "true-to-detail"];

/** Loads a few real project thumbnails for the "work" module so the drawn page is made of real work. */
function useThumbs(): { thumbs: Thumbs; version: number } {
  const [version, setVersion] = useState(0);
  const thumbs = useRef<Thumbs>([null, null, null]);
  useEffect(() => {
    let alive = true;
    THUMB_SLUGS.forEach((slug, i) => {
      const p = projects.find((x) => x.slug === slug);
      if (!p) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!alive) return;
        thumbs.current[i] = img;
        setVersion((v) => v + 1);
      };
      img.src = p.img.t;
    });
    return () => {
      alive = false;
    };
  }, []);
  return { thumbs: thumbs.current, version };
}

export function ModuleSlab({ k, thumbs, version }: { k: (typeof PAGE_MODULES)[number]["key"]; thumbs: Thumbs; version: number }) {
  const m = PAGE_MODULES.find((x) => x.key === k)!;
  const { w, h } = texSize(m);
  const draw = drawers[k];
  const tex = useDrawnTexture(w, h, (ctx, cw, ch) => draw(ctx, cw, ch, thumbs), [k, k === "work" ? version : 0]);
  return <Slab w={PAGE_W} h={m.h} r={0.07} t={0.07} color="#c9c5b6" map={tex} />;
}

interface PageStackProps {
  /** 0 = assembled, 1 = fully exploded. Read every frame. */
  explode: MutableRefObject<number>;
  /** Per-module intro progress (0..1 each) lets scenes stagger an entrance. */
  intro?: MutableRefObject<number[]>;
  idle?: boolean;
  floatAmp?: number;
}

/** The assembled-or-exploded page: six slabs that stack into a website. */
export function PageStack({ explode, intro, idle = true, floatAmp = 0.03 }: PageStackProps) {
  const refs = useRef<(Group | null)[]>([]);
  const { thumbs, version } = useThumbs();
  const invalidate = useThree((s) => s.invalidate);

  const rest = useMemo(() => {
    let y = PAGE_HEIGHT / 2;
    return PAGE_MODULES.map((m) => {
      const cy = y - m.h / 2;
      y -= m.h + PAGE_GAP;
      return cy;
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    PAGE_MODULES.forEach((m, i) => {
      const g = refs.current[i];
      if (!g) return;
      const ip = intro ? intro.current[i] ?? 1 : 1;
      const ex = clamp(explode.current + (1 - smooth(clamp(ip, 0, 1))) * 1.0, 0, 1.4);
      const dir = i % 2 === 0 ? -1 : 1;
      const spread = 1 + ex * 0.62;
      g.position.set(
        dir * ex * 0.85,
        rest[i] * spread + (idle ? Math.sin(t * 0.9 + i * 0.8) * floatAmp * (0.4 + ex) : 0),
        (i - 2.5) * ex * 1.15
      );
      g.rotation.set(ex * 0.1 * dir, dir * ex * 0.42, dir * ex * -0.06);
      const pop = 1 + (ip < 1 ? (easeOutBack(ip) - 1) * 0.0 : 0);
      g.scale.setScalar(pop);
      g.visible = ip > 0.001;
    });
  });

  useEffect(() => {
    invalidate();
  }, [version, invalidate]);

  return (
    <group>
      {PAGE_MODULES.map((m, i) => (
        <group key={m.key} ref={(el) => (refs.current[i] = el)}>
          <ModuleSlab k={m.key} thumbs={thumbs} version={version} />
        </group>
      ))}
    </group>
  );
}
