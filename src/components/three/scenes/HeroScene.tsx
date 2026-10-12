import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { useSceneEnv } from "../CanvasHost";
import { PageStack } from "../kit/pageStack";
import { PAGE_HEIGHT, PAGE_MODULES } from "../kit/pageTextures";
import { Glow, Studio } from "../kit/stage";
import { clamp, damp, smooth, useFitCamera } from "../kit/hooks";
import type { HeroSceneProps } from "../types";

/** Rings on the floor: the platform the page is assembled on. */
function Platform({ y }: { y: number }) {
  const rings = [2.4, 3.6, 4.9];
  return (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {rings.map((r, i) => (
        <mesh key={r}>
          <ringGeometry args={[r - 0.012, r, 96]} />
          <meshBasicMaterial color="#4df2b2" transparent opacity={0.34 - i * 0.09} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Hero: six slabs assemble into one site, then pull apart again as the visitor scrolls on. */
export default function HeroScene({ progress }: HeroSceneProps) {
  const env = useSceneEnv();
  const group = useRef<Group>(null);
  const explode = useRef(1);
  const intro = useRef<number[]>(PAGE_MODULES.map(() => 0));
  const t0 = useRef<number | null>(null);
  const invalidate = useThree((s) => s.invalidate);

  useFitCamera(3.9, PAGE_HEIGHT, env.compact ? 1.2 : 1.5, 0, env.compact ? 0.5 : 0.9);

  useEffect(() => {
    if (env.reduced) {
      explode.current = 0;
      intro.current = PAGE_MODULES.map(() => 1);
      if (group.current) group.current.rotation.set(0.1, -0.4, 0);
      invalidate();
    }
  }, [env.reduced, invalidate]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g || env.reduced) return;
    const now = clock.getElapsedTime();
    if (t0.current === null) t0.current = now + 0.2;
    const e = now - t0.current;
    intro.current = PAGE_MODULES.map((_, i) => clamp((e - i * 0.13) / 1.15, 0, 1));

    const p = progress ? clamp(progress.get(), 0, 1) : 0;
    explode.current = smooth(clamp((p - 0.04) / 0.8, 0, 1)) * 0.95;

    const k = damp(3.2, dt);
    const targetY = -0.42 + Math.sin(now * 0.35) * 0.07 + env.pointer.x * 0.34 + p * 0.5;
    const targetX = 0.1 - env.pointer.y * 0.16 + p * 0.1;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.position.y += (p * 1.4 - g.position.y) * k;
  });

  return (
    <>
      <Studio />
      <Glow size={env.compact ? 7 : 8.5} opacity={0.26} position={[0, 0, -2.4]} />
      <Platform y={-PAGE_HEIGHT / 2 - 0.35} />
      <group ref={group} rotation={[0.1, -0.4, 0]}>
        <PageStack explode={explode} intro={intro} />
      </group>
    </>
  );
}
