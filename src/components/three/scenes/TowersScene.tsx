import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { useSceneEnv } from "../CanvasHost";
import { Glow, Studio } from "../kit/stage";
import { Slab } from "../kit/slab";
import { clamp, damp, easeOutCubic, useDrawnTexture, useFitCamera } from "../kit/hooks";
import { drawers } from "../kit/pageTextures";
import { packages } from "@/data/packages";
import type { TowersSceneProps } from "../types";

const W = 2.5;
const D = 1.4;

function Tower({
  x,
  pages,
  selected,
  index,
  onSelect,
  topTex,
  t0,
}: {
  x: number;
  pages: number;
  selected: boolean;
  index: number;
  onSelect?: (i: number) => void;
  topTex: import("three").Texture;
  t0: React.MutableRefObject<number | null>;
}) {
  const env = useSceneEnv();
  const gl = useThree((s) => s.gl);
  const sheets = useRef<(Group | null)[]>([]);
  const gap = useRef(0.02);

  useFrame(({ clock }, dt) => {
    const now = clock.getElapsedTime();
    if (t0.current === null) t0.current = now;
    const e = now - t0.current;
    const targetGap = selected ? 0.3 : 0.045;
    gap.current += (targetGap - gap.current) * (env.reduced ? 1 : damp(5, dt));
    sheets.current.forEach((g, i) => {
      if (!g) return;
      const drop = env.reduced ? 1 : easeOutCubic(clamp((e - 0.15 - (index * 0.12 + i * 0.06)) / 0.7, 0, 1));
      const y = i * (0.075 + gap.current) + (1 - drop) * 3.2;
      g.position.set(0, y, 0);
      g.rotation.y = (i % 2 ? 1 : -1) * 0.035 * (i + 1) * (selected ? 0.4 : 1) * drop;
      g.visible = drop > 0.001;
    });
  });

  const tint = selected ? "#ece9df" : "#a9a698";
  return (
    <group
      position={[x, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(index);
      }}
      onPointerOver={() => (gl.domElement.style.cursor = "pointer")}
      onPointerOut={() => (gl.domElement.style.cursor = "")}
    >
      {Array.from({ length: pages }).map((_, i) => {
        const top = i === pages - 1;
        return (
          <group key={i} ref={(el) => (sheets.current[i] = el)} rotation={[0, 0, 0]}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
              <Slab
                w={W}
                h={D}
                r={0.07}
                t={0.07}
                color={selected ? "#c9c5b6" : "#7e7c71"}
                faceColor={tint}
                map={top ? topTex : null}
                emissive={selected && top ? "#1fa878" : undefined}
                emissiveIntensity={0.0}
              />
            </group>
          </group>
        );
      })}
    </group>
  );
}

/** Pricing: each package is a stack of page-sheets, as tall as the pages it includes. */
export default function TowersScene({ selected, onSelect }: TowersSceneProps) {
  const env = useSceneEnv();
  const t0 = useRef<number | null>(null);
  const root = useRef<Group>(null);
  const topTex = useDrawnTexture(1024, 576, (ctx, w, h) => {
    drawers.hero(ctx, w, 480, [null, null, null]);
    ctx.fillStyle = "#ece9df";
    ctx.fillRect(0, 480, w, h - 480);
  });
  const spread = env.compact ? 3.1 : 3.9;
  const xs = useMemo(() => [-spread, 0, spread], [spread]);

  useFitCamera(env.compact ? 7.4 : 8.6, env.compact ? 5.2 : 4.6, 1.0, 0.9, 3.2);

  useFrame((_, dt) => {
    if (!root.current || env.reduced) return;
    const k = damp(3, dt);
    root.current.rotation.y += (-0.18 + env.pointer.x * 0.28 - root.current.rotation.y) * k;
    root.current.rotation.x += (env.pointer.y * 0.06 - root.current.rotation.x) * k;
  });

  return (
    <>
      <Studio />
      <Glow size={7} opacity={0.16} position={[0, 0.8, -3]} />
      <group ref={root} rotation={[0, -0.18, 0]}>
        {packages.map((p, i) => (
          <Tower
            key={p.id}
            x={xs[i]}
            pages={p.pages}
            selected={selected === i}
            index={i}
            onSelect={onSelect}
            topTex={topTex}
            t0={t0}
          />
        ))}
      </group>
    </>
  );
}
