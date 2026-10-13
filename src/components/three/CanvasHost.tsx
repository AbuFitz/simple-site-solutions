import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import type { SceneEnv, SceneName, SceneProps } from "./types";
import { disposeSlabCache } from "./kit/slab";

const scenes: Record<SceneName, React.LazyExoticComponent<React.ComponentType<never>>> = {
  work: lazy(() => import("./scenes/WorkScene")) as never,
};

const DEBUG = typeof window !== "undefined" && window.location.search.includes("debug3d");

const EnvContext = createContext<SceneEnv | null>(null);
export const useSceneEnv = () => {
  const env = useContext(EnvContext);
  if (!env) throw new Error("useSceneEnv outside CanvasHost");
  return env;
};

/** Reads pointer / touch-drag over the stage and smooths it into env.pointer. */
function InputRig({ env, visible }: { env: SceneEnv; visible: boolean }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const target = useRef({ x: 0, y: 0 });
  const touching = useRef(false);

  useEffect(() => {
    const el = gl.domElement.parentElement as HTMLElement;
    const set = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.current.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "mouse") set(e);
      else if (touching.current) set(e);
      else return;
      invalidate();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        touching.current = true;
        set(e);
      }
    };
    const up = () => {
      touching.current = false;
      target.current.x = 0;
      target.current.y = 0;
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") up();
    };
    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl, invalidate]);

  useFrame((_, dt) => {
    if (!visible || env.reduced) return;
    const k = 1 - Math.pow(0.001, dt);
    env.pointer.x += (target.current.x - env.pointer.x) * k * 0.35;
    env.pointer.y += (target.current.y - env.pointer.y) * k * 0.35;
    // On-demand scenes only keep drawing while the tilt is still settling
    if (Math.abs(target.current.x - env.pointer.x) + Math.abs(target.current.y - env.pointer.y) > 0.004) invalidate();
  });
  return null;
}

/** Watches aspect to flip scenes into their compact (phone) composition. */
function CompactWatch({ env }: { env: SceneEnv }) {
  const size = useThree((s) => s.size);
  env.compact = size.width / Math.max(size.height, 1) < 0.9 || size.width < 520;
  return null;
}

interface HostProps<S extends SceneName> {
  scene: S;
  sceneProps?: SceneProps[S];
  quality: "high" | "low";
  reduced: boolean;
  visible: boolean;
  onReady: () => void;
  onLost: () => void;
  onFail: () => void;
}

export default function CanvasHost<S extends SceneName>({
  scene,
  sceneProps,
  quality,
  reduced,
  visible,
  onReady,
  onLost,
  onFail: _onFail,
}: HostProps<S>) {
  const env = useMemo<SceneEnv>(() => ({ quality, reduced, compact: false, pointer: { x: 0, y: 0 } }), [quality, reduced]);
  const Scene = scenes[scene] as React.ComponentType<Record<string, unknown>>;
  const [, force] = useState(0);
  const readyFired = useRef(false);

  useEffect(() => () => disposeSlabCache(), []);

  return (
    <EnvContext.Provider value={env}>
      <Canvas
        className="!absolute inset-0"
        flat
        dpr={[1, quality === "high" ? 1.75 : 1.25]}
        // Static composition for reduced motion: draw on demand, never loop
        frameloop={!visible ? "never" : reduced || scene === "work" ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 28, near: 0.1, far: 80, position: [0, 0, 14] }}
        onCreated={({ gl, invalidate }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
          const c = gl.domElement;
          c.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onLost();
          });
          c.addEventListener("webglcontextrestored", () => {
            force((n) => n + 1);
            invalidate();
            onReady();
          });
        }}
      >
        <CompactWatch env={env} />
        <InputRig env={env} visible={visible} />
        <Suspense fallback={null}>
          <Scene {...((sceneProps ?? {}) as Record<string, unknown>)} />
        </Suspense>
        <Lifecycle
          visible={visible}
          onReady={() => {
            if (readyFired.current) return;
            readyFired.current = true;
            onReady();
          }}
        />
      </Canvas>
    </EnvContext.Provider>
  );
}

/** Keeps on-demand (reduced motion) canvases drawing, and fires once real frames have landed. */
function Lifecycle({ visible, onReady }: { visible: boolean; onReady: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const frames = useRef(0);
  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const id = window.setInterval(() => {
      invalidate();
      if (++n > 8) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [visible, invalidate]);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 4) onReady();
    if (DEBUG) (window as unknown as { __oss3d: unknown }).__oss3d = { frames: frames.current, calls: gl.info.render.calls, tris: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures };
  });
  return null;
}
