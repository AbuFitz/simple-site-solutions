import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Group, TubeGeometry, Vector3 } from "three";
import { useSceneEnv } from "../CanvasHost";
import { Glow, Studio } from "../kit/stage";
import { Slab } from "../kit/slab";
import { clamp, damp, easeOutBack, useDrawnTexture, useFitCamera } from "../kit/hooks";
import type { PathSceneProps } from "../types";

const LABELS = ["PACKAGE", "DETAILS", "BUILD", "REVIEW", "LIVE"];

function StepSlab({ n, group }: { n: number; group: (el: Group | null) => void }) {
  const tex = useDrawnTexture(
    512,
    320,
    (ctx, w, h) => {
      ctx.fillStyle = "#ece9df";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0c100e";
      ctx.font = '800 150px "Inter", system-ui, sans-serif';
      ctx.textBaseline = "alphabetic";
      ctx.fillText(`0${n + 1}`, 38, 190);
      ctx.fillStyle = "#1fa878";
      ctx.fillRect(40, 232, 74, 8);
      ctx.fillStyle = "rgba(12,16,14,0.55)";
      ctx.font = '500 30px "Inter", system-ui, sans-serif';
      ctx.fillText(LABELS[n], 40, 282);
    },
    [n]
  );
  return (
    <group ref={group} visible={false}>
      <Slab w={1.5} h={0.94} r={0.11} t={0.08} color="#c9c5b6" map={tex} />
    </group>
  );
}

/** Process: a route through five steps. The route lights up and the traveller advances as you scroll. */
export default function PathScene({ progress }: PathSceneProps) {
  const env = useSceneEnv();
  const invalidate = useThree((s) => s.invalidate);
  const nodes = useRef<(Group | null)[]>([]);
  const traveller = useRef<Group>(null);
  const root = useRef<Group>(null);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-2.1, 3.3, 0),
          new Vector3(1.9, 1.9, -0.8),
          new Vector3(-1.7, 0.3, 0.5),
          new Vector3(1.9, -1.4, -0.5),
          new Vector3(-0.5, -3.2, 0.4),
        ],
        false,
        "catmullrom",
        0.5
      ),
    []
  );
  const base = useMemo(() => new TubeGeometry(curve, 160, 0.055, 8, false), [curve]);
  const lit = useMemo(() => new TubeGeometry(curve, 160, 0.09, 10, false), [curve]);
  const litCount = lit.index!.count;
  const stops = useMemo(() => [0, 1, 2, 3, 4].map((i) => ({ t: i / 4, p: curve.getPointAt(i / 4) })), [curve]);

  useEffect(
    () => () => {
      base.dispose();
      lit.dispose();
    },
    [base, lit]
  );

  useFitCamera(env.compact ? 6.6 : 7.4, 8.2, 1.02, 0, 0.6);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const p = clamp(progress.get(), 0, 1);
    lit.setDrawRange(0, Math.max(6, Math.floor((litCount * p) / 6) * 6));

    nodes.current.forEach((g, i) => {
      if (!g) return;
      const s = stops[i];
      const on = clamp((p - s.t + 0.06) / 0.1, 0, 1);
      g.visible = on > 0.001;
      g.position.set(s.p.x + (i % 2 === 0 ? 1.15 : -1.15), s.p.y, s.p.z + on * 0.4);
      g.scale.setScalar(easeOutBack(on));
      g.rotation.set(0, (i % 2 === 0 ? -0.35 : 0.35) + (env.reduced ? 0 : Math.sin(t * 0.6 + i) * 0.04), 0);
    });

    if (traveller.current) {
      const pt = curve.getPointAt(clamp(p, 0, 0.9999));
      traveller.current.position.copy(pt);
      traveller.current.rotation.y = t * 1.2;
    }
    if (root.current && !env.reduced) {
      const k = damp(3, dt);
      root.current.rotation.y += (env.pointer.x * 0.25 - root.current.rotation.y) * k;
      root.current.rotation.x += (-env.pointer.y * 0.1 - root.current.rotation.x) * k;
    }
  });

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  return (
    <>
      <Studio />
      <Glow size={5.2} opacity={0.16} position={[0, 0, -3]} />
      <group ref={root}>
        <mesh geometry={base} dispose={null}>
          <meshStandardMaterial color="#26302b" roughness={0.7} />
        </mesh>
        <mesh geometry={lit} dispose={null}>
          <meshBasicMaterial color="#4df2b2" toneMapped={false} />
        </mesh>
        {stops.map((s, i) => (
          <StepSlab key={i} n={i} group={(el) => (nodes.current[i] = el)} />
        ))}
        <group ref={traveller}>
          <mesh>
            <octahedronGeometry args={[0.17, 0]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <Glow size={1.8} opacity={0.9} position={[0, 0, 0]} />
        </group>
      </group>
    </>
  );
}
