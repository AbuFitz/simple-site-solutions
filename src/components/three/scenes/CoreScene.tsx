import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { useSceneEnv } from "../CanvasHost";
import { ModuleSlab } from "../kit/pageStack";
import { PAGE_GAP, PAGE_HEIGHT, PAGE_MODULES } from "../kit/pageTextures";
import { Glow, Studio } from "../kit/stage";
import { Slab } from "../kit/slab";
import { clamp, damp, lerp, smooth, useFitCamera } from "../kit/hooks";
import { projects } from "@/data/work";
import type { CoreSceneProps } from "../types";

interface Pose {
  p: Vector3;
  ry: number;
  s: number;
}

const S = PAGE_MODULES.length;

/** Four poses, one per chapter: layouts (grid), days (ring), no drama (straight line), mobile-first (phone). */
function buildPoses(): Pose[][] {
  const grid: Pose[] = PAGE_MODULES.map((_, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    return { p: new Vector3((col - 0.5) * 3.55, (1 - row) * 2.15, 0), ry: -0.28 + col * 0.0, s: 0.98 };
  });
  const ring: Pose[] = PAGE_MODULES.map((_, i) => {
    const a = (i / S) * Math.PI * 2;
    return { p: new Vector3(Math.sin(a) * 2.9, 0, Math.cos(a) * 2.9), ry: a, s: 0.66 };
  });
  let y = PAGE_HEIGHT / 2;
  const line: Pose[] = PAGE_MODULES.map((m) => {
    const cy = y - m.h / 2;
    y -= m.h + PAGE_GAP;
    return { p: new Vector3(0, cy * 0.92, 0), ry: 0, s: 0.92 };
  });
  y = PAGE_HEIGHT / 2;
  const phone: Pose[] = PAGE_MODULES.map((m) => {
    const cy = y - m.h / 2;
    y -= m.h + PAGE_GAP;
    return { p: new Vector3(0, cy * 0.7, 0.1), ry: -0.18, s: 0.7 };
  });
  return [grid, ring, line, phone];
}

const noise = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};

/** Why us: one object that rearranges itself to make each of four points. Driven entirely by scroll. */
export default function CoreScene({ chapter }: CoreSceneProps) {
  const env = useSceneEnv();
  const root = useRef<Group>(null);
  const mods = useRef<(Group | null)[]>([]);
  const bezel = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const marker = useRef<Group>(null);
  const poses = useMemo(buildPoses, []);
  const invalidate = useThree((s) => s.invalidate);
  const thumbs = useMemo(() => [null, null, null] as (HTMLImageElement | null)[], []);
  const version = useRef(0);

  useFitCamera(7.2, 7.2, env.compact ? 1.0 : 1.04, 0, env.compact ? 0.4 : 0.9);

  // Real thumbnails for the work module
  useEffect(() => {
    const slugs = ["fixnow-mechanics", "brightlearn-tutoring", "true-to-detail"];
    slugs.forEach((slug, i) => {
      const p = projects.find((x) => x.slug === slug);
      if (!p) return;
      const img = new Image();
      img.onload = () => {
        thumbs[i] = img;
        version.current++;
        invalidate();
      };
      img.src = p.img.t;
    });
  }, [thumbs, invalidate]);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const c = clamp(chapter.get(), 0, 3);
    const k = Math.min(2, Math.floor(c));
    const f = smooth(c - k - Math.floor(0) >= 1 ? 1 : c - k);
    const A = poses[k];
    const B = poses[k + 1];
    // Chaos only between "days" and "no drama": things get messy, then settle into a straight line
    const chaos = k === 1 ? Math.sin(Math.PI * f) : 0;
    const wRing = clamp(1 - Math.abs(c - 1), 0, 1);
    const wPhone = clamp(c - 2, 0, 1);

    mods.current.forEach((g, i) => {
      if (!g) return;
      const a = A[i];
      const b = B[i];
      g.position.set(
        lerp(a.p.x, b.p.x, f) + noise(i, 1) * 1.7 * chaos,
        lerp(a.p.y, b.p.y, f) + noise(i, 2) * 1.5 * chaos,
        lerp(a.p.z, b.p.z, f) + noise(i, 3) * 1.4 * chaos
      );
      g.rotation.set(noise(i, 4) * 0.7 * chaos, lerp(a.ry, b.ry, f) + noise(i, 5) * 0.9 * chaos, noise(i, 6) * 0.5 * chaos);
      g.scale.setScalar(lerp(a.s, b.s, f));
    });

    const r = root.current;
    if (r && !env.reduced) {
      const kk = damp(3, dt);
      const spin = wRing * t * 0.32;
      r.rotation.y += (spin + env.pointer.x * 0.35 - r.rotation.y) * (wRing > 0.05 ? 1 : kk);
      r.rotation.x += (0.04 + wRing * 0.32 - env.pointer.y * 0.12 - r.rotation.x) * kk;
    } else if (r) {
      r.rotation.set(0.04, 0, 0);
    }

    if (bezel.current) {
      const v = smooth(wPhone);
      bezel.current.scale.setScalar(Math.max(0.0001, v));
      bezel.current.visible = v > 0.01;
    }
    if (ring.current) {
      ring.current.visible = wRing > 0.02;
      ring.current.scale.setScalar(0.6 + wRing * 0.4);
    }
    if (marker.current) {
      const a = (t * 0.7) % (Math.PI * 2);
      marker.current.position.set(Math.sin(a) * 2.9, 0, Math.cos(a) * 2.9);
    }
  });

  return (
    <>
      <Studio />
      <Glow size={5.6} opacity={0.2} position={[0, 0, -3]} />
      <group ref={root} rotation={[0.04, 0, 0]}>
        {PAGE_MODULES.map((m, i) => (
          <group key={m.key} ref={(el) => (mods.current[i] = el)}>
            <ModuleSlab k={m.key} thumbs={thumbs} version={version.current} />
          </group>
        ))}
        <group ref={bezel} position={[0, 0, -0.14]} visible={false}>
          <Slab w={2.95} h={5.45} r={0.34} t={0.16} color="#0b0e0d" faceColor="#0b0e0d" />
        </group>
        <group ref={ring} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <mesh>
            <ringGeometry args={[2.88, 2.915, 128]} />
            <meshBasicMaterial color="#4df2b2" transparent opacity={0.7} toneMapped={false} />
          </mesh>
        </group>
        <group ref={marker}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#4df2b2" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}
