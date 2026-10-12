import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { useSceneEnv } from "../CanvasHost";
import { DevicePair } from "../kit/device";
import { SoftShadow, Studio } from "../kit/stage";
import { clamp, damp, smooth, useFitCamera } from "../kit/hooks";
import { projects } from "@/data/work";
import type { WorkSceneProps } from "../types";

const N = projects.length;

const wrapDelta = (i: number, pos: number) => {
  const d = i - pos;
  return ((((d + N / 2) % N) + N) % N) - N / 2;
};

function Item({
  i,
  posRef,
  indexRef,
  onPick,
}: {
  i: number;
  posRef: React.MutableRefObject<number>;
  indexRef: React.MutableRefObject<number>;
  onPick?: (i: number) => void;
}) {
  const env = useSceneEnv();
  const gl = useThree((s) => s.gl);
  const root = useRef<Group>(null);
  const scroll = useRef(0);
  const phoneVis = useRef(0);
  const since = useRef<number | null>(null);
  const [want, setWant] = useState({ tall: false, phone: false });

  useFrame(({ clock }) => {
    const g = root.current;
    if (!g) return;
    const d = wrapDelta(i, posRef.current);
    const ad = Math.abs(d);
    const side = Math.sign(d);
    const compact = env.compact;

    const x = side * Math.pow(ad, 0.9) * (compact ? 3.05 : 3.55) - (compact ? 0.38 : 0.5) * (1 - Math.min(ad, 1));
    const z = -Math.min(ad, 2.6) * 1.25;
    g.position.set(x + env.pointer.x * 0.12 * (1 - Math.min(ad, 1)), 0.12 + (ad < 0.5 ? Math.sin(clock.elapsedTime * 0.8) * 0.025 : 0), z);
    g.rotation.set(0, clamp(-d * 0.36, -0.85, 0.85) + env.pointer.x * 0.07, 0);
    g.scale.setScalar(1 - Math.min(ad, 2.6) * 0.055);
    g.visible = ad < 3.4;

    const idxDelta = Math.abs(wrapDelta(i, indexRef.current));
    const near = idxDelta <= 1.5;
    if (want.tall !== near) setWant({ tall: near, phone: near });

    // Auto-scroll the real site inside the active pane
    const active = idxDelta < 0.01 && ad < 0.25;
    if (active) {
      if (since.current === null) since.current = clock.elapsedTime;
      if (!env.reduced) {
        const w = (clock.elapsedTime - since.current - 1.4) / 9;
        scroll.current = w < 0 ? 0 : 0.5 - 0.5 * Math.cos(Math.PI * w);
      }
    } else {
      since.current = null;
      scroll.current += (0 - scroll.current) * 0.08;
    }
    phoneVis.current = smooth(clamp(1 - ad * 1.15, 0, 1));
  });

  useEffect(() => {
    // Pointer cursor affordance on side items
    return () => {
      gl.domElement.style.cursor = "";
    };
  }, [gl]);

  return (
    <group
      ref={root}
      onClick={(e) => {
        if (e.delta > 6) return;
        const d = wrapDelta(i, posRef.current);
        if (Math.abs(d) > 0.3) {
          e.stopPropagation();
          onPick?.(i);
        }
      }}
      onPointerOver={() => {
        if (Math.abs(wrapDelta(i, posRef.current)) > 0.3) gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = "";
      }}
    >
      <SoftShadow w={4.8} h={3.6} opacity={0.34} position={[0.3, -0.45, -0.3]} />
      <DevicePair
        project={projects[i]}
        wantTall={want.tall}
        wantPhone={want.phone}
        scroll={scroll}
        phoneVis={phoneVis}
        compact={env.compact}
      />
    </group>
  );
}

/** Work: nine real projects on a rack. Each shows a live-scrolling capture and a phone capture. */
export default function WorkScene({ index, drag, onPick }: WorkSceneProps) {
  const env = useSceneEnv();
  const posRef = useRef(index);
  const cont = useRef(index);
  const indexRef = useRef(index);

  useFitCamera(env.compact ? 5.3 : 9.4, 3.5, 1.0, 0.08);

  useEffect(() => {
    indexRef.current = index;
    const cur = ((cont.current % N) + N) % N;
    let d = index - cur;
    d = ((((d + N / 2) % N) + N) % N) - N / 2;
    cont.current += d;
  }, [index]);

  useFrame((_, dt) => {
    const target = cont.current - drag.current;
    if (env.reduced) posRef.current = target;
    else posRef.current += (target - posRef.current) * damp(6.5, dt);
  });

  return (
    <>
      <Studio rim={false} />
      {projects.map((_, i) => (
        <Item key={i} i={i} posRef={posRef} indexRef={indexRef} onPick={onPick} />
      ))}
    </>
  );
}
