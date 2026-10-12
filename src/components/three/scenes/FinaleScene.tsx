import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Points } from "three";
import { useSceneEnv } from "../CanvasHost";
import { PageStack } from "../kit/pageStack";
import { PAGE_HEIGHT } from "../kit/pageTextures";
import { Glow, Studio } from "../kit/stage";
import { clamp, damp, useFitCamera } from "../kit/hooks";
import type { FinaleSceneProps } from "../types";

const RINGS = 4;

/** Finale: the finished site goes live. It rises off a beacon that pulses outward. */
export default function FinaleScene({ progress }: FinaleSceneProps) {
  const env = useSceneEnv();
  const root = useRef<Group>(null);
  const rings = useRef<(Group | null)[]>([]);
  const dots = useRef<Points>(null);
  const explode = useRef(0);
  const count = env.quality === "high" ? 140 : 60;

  const dotGeo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 3.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * 7 - 3.5;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFitCamera(env.compact ? 5.6 : 8.4, PAGE_HEIGHT + 1.6, env.compact ? 1.0 : 1.0, 0.1, env.compact ? 0.6 : 1.4);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const p = progress ? clamp(progress.get(), 0, 1) : 1;
    const r = root.current;
    if (r) {
      const k = env.reduced ? 1 : damp(3, dt);
      r.position.y += (-0.2 + p * 0.5 + (env.reduced ? 0 : Math.sin(t * 0.8) * 0.06) - r.position.y) * k;
      r.rotation.y += (-0.32 + env.pointer.x * 0.35 - r.rotation.y) * k;
      r.rotation.x += (0.08 - env.pointer.y * 0.12 - r.rotation.x) * k;
    }
    if (!env.reduced) {
      rings.current.forEach((g, i) => {
        if (!g) return;
        const ph = ((t * 0.28 + i / RINGS) % 1 + 1) % 1;
        g.scale.setScalar(0.45 + ph * 2.6);
        const m = (g.children[0] as import("three").Mesh).material as import("three").MeshBasicMaterial;
        m.opacity = (1 - ph) * 0.55;
      });
      const attr = dots.current?.geometry.attributes.position as BufferAttribute | undefined;
      if (attr) {
        for (let i = 0; i < count; i++) {
          let y = attr.getY(i) + dt * (0.25 + (i % 5) * 0.08);
          if (y > 3.6) y = -3.6;
          attr.setY(i, y);
        }
        attr.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <Studio />
      <Glow size={env.compact ? 8 : 10} opacity={0.3} position={[0, -0.6, -2.4]} />
      <group position={[0, -PAGE_HEIGHT / 2 - 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {Array.from({ length: RINGS }).map((_, i) => (
          <group key={i} ref={(el) => (rings.current[i] = el)} scale={0.45 + (i / RINGS) * 2.6}>
            <mesh>
              <ringGeometry args={[0.98, 1, 96]} />
              <meshBasicMaterial color="#4df2b2" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      <points ref={dots} geometry={dotGeo}>
        <pointsMaterial color="#7dffc6" size={0.045} sizeAttenuation transparent opacity={0.8} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>
      <group ref={root} scale={0.94}>
        <PageStack explode={explode} idle={!env.reduced} floatAmp={0.015} />
      </group>
    </>
  );
}
