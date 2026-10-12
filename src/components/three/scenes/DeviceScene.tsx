import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useSceneEnv } from "../CanvasHost";
import { DevicePair } from "../kit/device";
import { Glow, Studio } from "../kit/stage";
import { damp, useFitCamera } from "../kit/hooks";
import { getProject } from "@/data/work";
import type { DeviceSceneProps } from "../types";

/** Case-study hero: the project's real desktop and phone captures, scrolling by themselves. */
export default function DeviceScene({ slug }: DeviceSceneProps) {
  const env = useSceneEnv();
  const project = getProject(slug);
  const root = useRef<Group>(null);
  const scroll = useRef(0);
  const phoneVis = useRef(1);

  useFitCamera(env.compact ? 5.2 : 6.6, 3.4, 1.0, 0.1);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (!env.reduced) {
      const w = (t - 1.2) / 10;
      scroll.current = w < 0 ? 0 : 0.5 - 0.5 * Math.cos(Math.PI * w);
    }
    const r = root.current;
    if (!r) return;
    const k = env.reduced ? 1 : damp(3, dt);
    r.rotation.y += (-0.26 + env.pointer.x * 0.3 - r.rotation.y) * k;
    r.rotation.x += (0.05 - env.pointer.y * 0.12 - r.rotation.x) * k;
    r.position.y = env.reduced ? 0 : Math.sin(t * 0.7) * 0.05;
  });

  if (!project) return null;
  return (
    <>
      <Studio />
      <Glow size={9} opacity={0.22} position={[0, 0, -2.4]} />
      <group ref={root} position={[env.compact ? -0.3 : -0.45, 0, 0]}>
        <DevicePair project={project} wantTall wantPhone scroll={scroll} phoneVis={phoneVis} compact={env.compact} />
      </group>
    </>
  );
}
