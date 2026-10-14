import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { useSceneEnv } from "../CanvasHost";
import { DevicePair } from "../kit/device";
import { Studio } from "../kit/stage";
import { clamp, damp, smooth, useFitCamera } from "../kit/hooks";
import { projects } from "@/data/work";
import type { WorkSceneProps } from "../types";

const N = projects.length;
const SETTLE_MS = 420;
/** The auto-scroll through the full-page capture runs once per visit, then the scene goes fully idle. */
const SCROLL_SECONDS = 9;

const wrapDelta = (i: number, pos: number) => {
  const d = i - pos;
  return ((((d + N / 2) % N) + N) % N) - N / 2;
};

/** Work: the projects on a rack. Renders only while something moves; loads big captures only for the settled project. */
export default function WorkScene({ index, drag, onPick, wake }: WorkSceneProps) {
  const env = useSceneEnv();
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  const groups = useRef<(Group | null)[]>([]);
  const scrolls = useMemo(() => projects.map(() => ({ current: 0 })), []);
  const phoneVis = useMemo(() => projects.map(() => ({ current: 0 })), []);
  const posRef = useRef(index);
  const cont = useRef(index);
  const settledAt = useRef<number | null>(null);
  const scrollDone = useRef(false);

  // Only the project that has stopped moving loads its heavy captures
  const [settled, setSettled] = useState(index);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(index), SETTLE_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  useFitCamera(env.compact ? 4.3 : 9.4, env.compact ? 3.2 : 3.5, 1.0, 0.08);

  useEffect(() => {
    if (wake) wake.current = invalidate;
    return () => {
      if (wake) wake.current = null;
    };
  }, [wake, invalidate]);

  useEffect(() => {
    const cur = ((cont.current % N) + N) % N;
    let d = index - cur;
    d = ((((d + N / 2) % N) + N) % N) - N / 2;
    cont.current += d;
    settledAt.current = null;
    scrollDone.current = false;
    invalidate();
  }, [index, invalidate]);

  useEffect(() => () => void (gl.domElement.style.cursor = ""), [gl]);

  useFrame(({ clock }, dt) => {
    const compact = env.compact;
    const target = cont.current - drag.current;
    const diff = target - posRef.current;
    if (env.reduced || Math.abs(diff) < 0.0008) posRef.current = target;
    else posRef.current += diff * damp(7, dt);
    const moving = Math.abs(target - posRef.current) > 0.0008 || drag.current !== 0;

    // Auto-scroll of the active project, once, after it settles
    const activeIdx = ((index % N) + N) % N;
    let scrolling = false;
    if (!moving && !env.reduced && !scrollDone.current && settled === index) {
      if (settledAt.current === null) settledAt.current = clock.elapsedTime;
      const w = (clock.elapsedTime - settledAt.current - 1.2) / SCROLL_SECONDS;
      if (w >= 1) {
        scrollDone.current = true;
        scrolls[activeIdx].current = 0;
      } else if (w >= 0) {
        scrolls[activeIdx].current = (0.5 - 0.5 * Math.cos(2 * Math.PI * w)) * 0.9; // down, then back up, once
        scrolling = true;
      } else scrolling = true;
    }
    if (moving) settledAt.current = null;

    projects.forEach((_, i) => {
      const g = groups.current[i];
      if (!g) return;
      const d = wrapDelta(i, posRef.current);
      const ad = Math.abs(d);
      const side = Math.sign(d);
      g.visible = ad < 3.4;
      if (!g.visible) return;
      const x = side * Math.pow(ad, 0.9) * (compact ? 3.05 : 3.55) - (compact ? 0.38 : 0.5) * (1 - Math.min(ad, 1));
      g.position.set(x + env.pointer.x * 0.1 * (1 - Math.min(ad, 1)), 0.12, -Math.min(ad, 2.6) * 1.25);
      g.rotation.set(0, clamp(-d * 0.36, -0.85, 0.85) + env.pointer.x * 0.05, 0);
      g.scale.setScalar(1 - Math.min(ad, 2.6) * 0.055);
      phoneVis[i].current = smooth(clamp(1 - ad * 1.15, 0, 1));
      if (i !== activeIdx) scrolls[i].current += (0 - scrolls[i].current) * 0.2;
    });

    // Keep drawing only while something is actually changing (the auto-scroll at ~30fps)
    if (moving) invalidate();
    else if (scrolling) window.setTimeout(invalidate, 30);
  });

  return (
    <>
      <Studio rim={false} />
      {projects.map((p, i) => {
        const isSettled = wrapDelta(i, settled) === 0;
        const nearSettled = Math.abs(wrapDelta(i, settled)) <= 1;
        return (
          <group
            key={p.slug}
            ref={(el) => {
              groups.current[i] = el;
            }}
            onClick={(e) => {
              if (e.delta > 6) return;
              if (Math.abs(wrapDelta(i, posRef.current)) > 0.3) {
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
            <DevicePair
              project={p}
              wantTall={isSettled}
              wantPhone={nearSettled}
              scroll={scrolls[i]}
              phoneVis={phoneVis[i]}
              compact={env.compact}
            />
          </group>
        );
      })}
    </>
  );
}
