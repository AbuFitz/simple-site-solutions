import { useEffect, useMemo } from "react";
import {
  Color,
  DoubleSide,
  ExtrudeGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
  Texture,
} from "three";

/**
 * The recurring object of the whole site: a thin, rounded, matte slab (a "page"),
 * with an unlit face so screenshots and drawn UI keep their true colours.
 */

export function roundedRect(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

interface Geo {
  body: ExtrudeGeometry;
  face: ShapeGeometry;
}

const cache = new Map<string, Geo>();

export function getSlabGeometry(w: number, h: number, r: number, t: number): Geo {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${r.toFixed(3)}|${t.toFixed(3)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const shape = roundedRect(w, h, r);
  const body = new ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: true,
    bevelThickness: Math.min(0.012, t * 0.3),
    bevelSize: Math.min(0.012, t * 0.3),
    bevelSegments: 2,
    curveSegments: 10,
  });
  body.translate(0, 0, -t);
  const face = new ShapeGeometry(shape, 10);
  const pos = face.attributes.position;
  const uv = face.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  const geo = { body, face };
  cache.set(key, geo);
  return geo;
}

export function disposeSlabCache() {
  cache.forEach((g) => {
    g.body.dispose();
    g.face.dispose();
  });
  cache.clear();
}

export interface SlabProps {
  w: number;
  h: number;
  r?: number;
  t?: number;
  /** Body (edge + back) colour. */
  color?: string;
  /** Face texture. When absent the face takes faceColor. */
  map?: Texture | null;
  faceColor?: string;
  opacity?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

/** Group-local slab: front face at z=0, thickness extends to -t. Pass transform props to the wrapping <group>. */
export function Slab({
  w,
  h,
  r = 0.07,
  t = 0.06,
  color = "#d8d4c8",
  map = null,
  faceColor = "#eceae0",
  opacity = 1,
  roughness = 0.62,
  emissive,
  emissiveIntensity = 0,
}: SlabProps) {
  const { body, face } = useMemo(() => getSlabGeometry(w, h, r, t), [w, h, r, t]);

  const bodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
        roughness,
        metalness: 0.04,
        transparent: opacity < 1,
        opacity,
        emissive: emissive ? new Color(emissive) : new Color(0x000000),
        emissiveIntensity,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const faceMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: map ? 0xffffff : new Color(faceColor),
        map: map ?? null,
        toneMapped: false,
        transparent: opacity < 1,
        opacity,
        side: DoubleSide,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Live updates without rebuilding materials
  useEffect(() => {
    bodyMat.color.set(color);
    bodyMat.opacity = opacity;
    bodyMat.transparent = opacity < 1;
    bodyMat.roughness = roughness;
    if (emissive) bodyMat.emissive.set(emissive);
    bodyMat.emissiveIntensity = emissiveIntensity;
    bodyMat.needsUpdate = true;
  }, [bodyMat, color, opacity, roughness, emissive, emissiveIntensity]);

  useEffect(() => {
    faceMat.map = map ?? null;
    faceMat.color.set(map ? "#ffffff" : faceColor);
    faceMat.opacity = opacity;
    faceMat.transparent = opacity < 1;
    faceMat.needsUpdate = true;
  }, [faceMat, map, faceColor, opacity]);

  useEffect(
    () => () => {
      bodyMat.dispose();
      faceMat.dispose();
    },
    [bodyMat, faceMat]
  );

  return (
    <group>
      <mesh geometry={body} material={bodyMat} dispose={null} />
      <mesh geometry={face} material={faceMat} position={[0, 0, 0.0125]} dispose={null} />
    </group>
  );
}
