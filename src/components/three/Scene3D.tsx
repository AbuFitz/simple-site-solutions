import { Component, lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { getQuality, Quality } from "@/lib/device";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { SceneName, SceneProps } from "./types";

/**
 * Scene3D is the only 3D entry point pages touch, and it imports no three.js itself.
 * - A designed poster (plain HTML/CSS) is always rendered first and stays if WebGL cannot run.
 * - The WebGL engine is code-split and only mounts when the stage is near the viewport.
 * - It renders only while visible, and unmounts (freeing the GPU context) when far away.
 */
const CanvasHost = lazy(() => import("./CanvasHost"));

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface Scene3DProps<S extends SceneName> {
  scene: S;
  sceneProps?: SceneProps[S];
  /** Static, always-visible composition. Becomes the experience when 3D is unavailable. */
  poster: ReactNode;
  className?: string;
  /** Accessible description of what the (decorative) scene shows. */
  label: string;
  /** Mount after first idle even when off-screen, for above-the-fold heroes. */
  eager?: boolean;
  /** Pixels beyond the viewport at which the engine mounts. */
  mountMargin?: number;
  /** Phones get the poster only (render nothing 3D below 1024px). */
  desktopOnly?: boolean;
}

export function Scene3D<S extends SceneName>({
  scene,
  sceneProps,
  poster,
  className = "",
  label,
  eager = false,
  mountMargin = 600,
  desktopOnly = false,
}: Scene3DProps<S>) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const host = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const [quality] = useState<Quality>(() => getQuality());
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || quality === "off") return;
    const nearObs = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: `${mountMargin}px 0px`,
    });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [quality, mountMargin]);

  // Eager scenes still wait for idle so the first paint is never blocked by the engine
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!eager) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setIdle(true), { timeout: 1200 }) : window.setTimeout(() => setIdle(true), 350);
    return () => {
      if (w.requestIdleCallback && (window as Window & { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback)
        (window as Window & { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback!(id);
      else window.clearTimeout(id);
    };
  }, [eager]);

  const shouldMount = quality !== "off" && !failed && (!desktopOnly || wide) && (eager ? idle || near : near);

  // When the engine unmounts, the poster returns
  useEffect(() => {
    if (!shouldMount) setReady(false);
  }, [shouldMount]);

  return (
    <div ref={host} className={`stage ${className.includes("absolute") ? "" : "relative"} ${className}`} role="img" aria-label={label}>
      <div
        aria-hidden="true"
        className="poster-fade absolute inset-0"
        style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : undefined }}
      >
        {poster}
      </div>
      {shouldMount && (
        <Boundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <CanvasHost
              scene={scene}
              sceneProps={sceneProps}
              quality={quality === "high" ? "high" : "low"}
              reduced={reduced}
              visible={visible}
              onReady={() => setReady(true)}
              onLost={() => setReady(false)}
              onFail={() => setFailed(true)}
            />
          </Suspense>
        </Boundary>
      )}
    </div>
  );
}
