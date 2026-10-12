import { useEffect, useLayoutEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, SRGBColorSpace, Texture, TextureLoader } from "three";

/** Pulls the camera back so a w×h box (world units at z=0) fits the viewport with breathing room. */
export function useFitCamera(w: number, h: number, margin = 1.08, offsetY = 0, elev = 0) {
  const camera = useThree((s) => s.camera) as import("three").PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const t = Math.tan((camera.fov * Math.PI) / 360);
    const distH = h / 2 / t;
    const distW = w / 2 / (t * aspect);
    camera.position.set(0, offsetY + elev, Math.max(distH, distW) * margin);
    camera.lookAt(0, offsetY, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, w, h, margin, offsetY, elev, invalidate]);
}

const loader = new TextureLoader();

/** Loads an image into a texture, sets colour space and filtering, and disposes on cleanup or url change. */
export function useImageTexture(url: string | null | undefined, enabled = true): Texture | null {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const [tex, setTex] = useState<Texture | null>(null);

  useEffect(() => {
    if (!url || !enabled) {
      setTex(null);
      return;
    }
    let cancelled = false;
    let loaded: Texture | null = null;
    loader.load(url, (t) => {
      if (cancelled) {
        t.dispose();
        return;
      }
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      loaded = t;
      setTex(t);
      invalidate();
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
      setTex(null);
    };
  }, [url, enabled, gl, invalidate]);

  return tex;
}

/** Creates a CanvasTexture from a draw function. Redraws once web fonts are ready. */
export function useDrawnTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  deps: unknown[] = []
): CanvasTexture {
  const invalidate = useThree((s) => s.invalidate);
  const [tex] = useState(() => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearFilter;
    t.generateMipmaps = false;
    t.anisotropy = 4;
    return t;
  });

  useEffect(() => {
    const canvas = tex.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height);
      tex.needsUpdate = true;
      invalidate();
    };
    paint();
    let alive = true;
    document.fonts?.ready.then(() => alive && paint());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, width, height, ...deps]);

  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  const x = clamp(t, 0, 1);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** Frame-rate independent damping factor. */
export const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
