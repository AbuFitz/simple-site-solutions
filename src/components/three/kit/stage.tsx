import { useEffect, useMemo } from "react";
import { AdditiveBlending, CanvasTexture, Color, DoubleSide, SRGBColorSpace } from "three";

/** One light rig for the whole site: soft key from upper-left, cool fill, green rim from the right. */
export function Studio({ intensity = 1, rim = true }: { intensity?: number; rim?: boolean }) {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#1a2a23", 0.9 * intensity]} />
      <directionalLight position={[-4, 6, 7]} intensity={2.1 * intensity} color="#fff3df" />
      {rim && <pointLight position={[6, -1, 4]} intensity={46 * intensity} distance={16} decay={2} color="#4df2b2" />}
    </>
  );
}

function radialTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Soft green bloom behind an object (additive, unlit). */
export function Glow({ size = 8, color = "#2fe39d", opacity = 0.34, position = [0, 0, -2] as [number, number, number] }) {
  const tex = useMemo(() => radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)"), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={tex}
        color={new Color(color)}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Flat soft shadow for objects resting on paper. */
export function SoftShadow({
  w,
  h,
  opacity = 0.35,
  position = [0, 0, -0.3] as [number, number, number],
}: {
  w: number;
  h: number;
  opacity?: number;
  position?: [number, number, number];
}) {
  const tex = useMemo(() => radialTexture("rgba(0,0,0,0.9)", "rgba(0,0,0,0)"), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} side={DoubleSide} />
    </mesh>
  );
}
