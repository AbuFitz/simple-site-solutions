import { forwardRef, MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MeshBasicMaterial, Texture } from "three";
import { getSlabGeometry, Slab } from "./slab";
import { clamp, useDrawnTexture, useImageTexture } from "./hooks";
import type { WorkProject } from "@/data/work";

export const PANE_W = 3.2;
export const PANE_H = 2.0;
export const CHROME_H = 0.17;
const PH_H = 2.08;
const PH_W = PH_H * (520 / 1126);

/** Same palette as the site's original browser frame: secondary bar, muted dots, background-coloured address pill. */
const C = { bar: "#1a1a1a", edge: "#2b2b2b", dot: "rgba(115,115,115,0.45)", pill: "#0a0a0a", pillEdge: "#2b2b2b", text: "#8a8a8a" };

function ChromeBar({ domain }: { domain: string }) {
  const tex = useDrawnTexture(
    768,
    41,
    (ctx, w, h) => {
      ctx.fillStyle = C.bar;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = C.dot;
      [0, 1, 2].forEach((i) => {
        ctx.beginPath();
        ctx.arc(22 + i * 18, h / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      const pw = 340;
      ctx.fillStyle = C.pill;
      ctx.beginPath();
      ctx.roundRect(w / 2 - pw / 2, 8, pw, h - 16, 9);
      ctx.fill();
      ctx.strokeStyle = C.pillEdge;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = C.text;
      ctx.font = '500 15px "Inter", system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(domain, w / 2, h / 2 + 1);
    },
    [domain]
  );
  return (
    <mesh position={[0, PANE_H / 2 + CHROME_H / 2, 0.0135]}>
      <planeGeometry args={[PANE_W, CHROME_H]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** A screen showing a window onto a (possibly very tall) screenshot. scroll: 0 top → 1 bottom. */
function Screen({
  w,
  h,
  r,
  thumb,
  tall,
  scroll,
  z,
}: {
  w: number;
  h: number;
  r: number;
  thumb: Texture | null;
  tall: Texture | null;
  scroll: MutableRefObject<number>;
  z: number;
}) {
  const geo = useMemo(() => getSlabGeometry(w, h, r, 0.05).face, [w, h, r]);
  const mat = useMemo(() => new MeshBasicMaterial({ color: 0x151515, toneMapped: false }), []);
  const last = useRef(-1);

  useFrame(() => {
    const map = tall ?? thumb;
    if (mat.map !== map) {
      mat.map = map;
      mat.color.set(map ? 0xffffff : 0x151515);
      mat.needsUpdate = true;
      last.current = -1;
    }
    if (!tall) return;
    const img = tall.image as { width: number; height: number };
    const visFrac = clamp(img.width / (w / h) / img.height, 0.0001, 1);
    const s = clamp(scroll.current, 0, 1);
    if (Math.abs(last.current - s) < 1e-4) return;
    last.current = s;
    tall.repeat.set(1, visFrac);
    tall.offset.set(0, (1 - visFrac) * (1 - s));
    tall.wrapS = tall.wrapT = 1001; // ClampToEdge
  });

  return <mesh geometry={geo} material={mat} position={[0, 0, z]} dispose={null} />;
}

export interface DevicePairProps {
  project: WorkProject;
  /** Load the long full-page capture (only for the settled, active project). */
  wantTall: boolean;
  /** Load the phone capture. */
  wantPhone: boolean;
  /** 0 top → 1 bottom of the desktop screenshot. */
  scroll: MutableRefObject<number>;
  /** Phone presence 0..1 (scale and fade-in). */
  phoneVis: MutableRefObject<number>;
  compact?: boolean;
}

/** Browser pane plus phone, both showing real captures of the project. Origin = centre of the screen. */
export const DevicePair = forwardRef<Group, DevicePairProps>(function DevicePair(
  { project, wantTall, wantPhone, scroll, phoneVis, compact = false },
  ref
) {
  const thumb = useImageTexture(project.img.t, true);
  const tall = useImageTexture(project.img.d, wantTall);
  const phoneTex = useImageTexture(project.img.m, wantPhone);
  const phone = useRef<Group>(null);
  const phoneOffset = compact ? [1.15, -0.62, 0.7] : [1.72, -0.5, 0.55];

  useFrame(() => {
    const g = phone.current;
    if (!g) return;
    const v = clamp(phoneVis.current, 0, 1);
    g.scale.setScalar(Math.max(0.0001, v) * (compact ? 1.08 : 1));
    g.visible = v > 0.01;
  });

  return (
    <group ref={ref}>
      <group position={[0, CHROME_H / 2, 0]}>
        <Slab w={PANE_W + 0.09} h={PANE_H + CHROME_H + 0.09} r={0.1} t={0.08} color={C.edge} faceColor={C.edge} roughness={0.8} />
      </group>
      <ChromeBar domain={project.domain} />
      <Screen w={PANE_W} h={PANE_H} r={0.0} thumb={thumb} tall={tall} scroll={scroll} z={0.0135} />

      <group ref={phone} position={phoneOffset as [number, number, number]} rotation={[0, -0.12, 0.02]}>
        <Slab w={PH_W + 0.1} h={PH_H + 0.1} r={0.17} t={0.09} color={C.edge} faceColor={C.edge} roughness={0.8} />
        <Screen w={PH_W} h={PH_H} r={0.12} thumb={phoneTex} tall={null} scroll={scroll} z={0.0135} />
      </group>
    </group>
  );
});
