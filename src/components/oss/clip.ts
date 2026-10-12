/**
 * Builds a rounded polygon as an SVG path in pixels, with true arcs at every corner,
 * convex or concave. Used for stepped cut-outs, arches and leaf shapes around images.
 */
type Pt = [number, number];

export function roundedPolygon(pts: Pt[], radii: number | number[]): string {
  const n = pts.length;
  const rs = Array.isArray(radii) ? radii : pts.map(() => radii);
  const segs: string[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const v1: Pt = [p0[0] - p1[0], p0[1] - p1[1]];
    const v2: Pt = [p2[0] - p1[0], p2[1] - p1[1]];
    const l1 = Math.hypot(...v1);
    const l2 = Math.hypot(...v2);
    const r = Math.min(rs[i], l1 / 2, l2 / 2);
    const a: Pt = [p1[0] + (v1[0] / l1) * r, p1[1] + (v1[1] / l1) * r];
    const b: Pt = [p1[0] + (v2[0] / l2) * r, p1[1] + (v2[1] / l2) * r];
    const cross = v1[0] * v2[1] - v1[1] * v2[0];
    const sweep = cross < 0 ? 1 : 0;
    segs.push(`${i === 0 ? "M" : "L"}${a[0].toFixed(1)} ${a[1].toFixed(1)}`);
    if (r > 0.5) segs.push(`A${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${sweep} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
    else segs.push(`L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  return segs.join(" ") + "Z";
}

export type Contour = "plain" | "notch-br" | "notch-bl" | "notch-tl" | "notch-tr" | "step-br" | "arch" | "leaf" | "leaf-r" | "pebble";

/** Returns a clip-path path() for a w×h box. `r` is the base corner radius in px. */
export function contourPath(shape: Contour, w: number, h: number, r = 24): string {
  const nw = Math.max(48, Math.min(w * 0.3, 168));
  const nh = Math.max(40, Math.min(h * 0.22, 120));
  switch (shape) {
    case "notch-br":
      return roundedPolygon([[0, 0], [w, 0], [w, h - nh], [w - nw, h - nh], [w - nw, h], [0, h]], r);
    case "notch-bl":
      return roundedPolygon([[0, 0], [w, 0], [w, h], [nw, h], [nw, h - nh], [0, h - nh]], r);
    case "notch-tl":
      return roundedPolygon([[nw, 0], [w, 0], [w, h], [0, h], [0, nh], [nw, nh]], r);
    case "notch-tr":
      return roundedPolygon([[0, 0], [w - nw, 0], [w - nw, nh], [w, nh], [w, h], [0, h]], r);
    case "step-br": {
      const sw = nw * 0.62;
      const sh = nh * 0.8;
      return roundedPolygon(
        [[0, 0], [w, 0], [w, h - sh * 2], [w - sw, h - sh * 2], [w - sw, h - sh], [w - sw * 2, h - sh], [w - sw * 2, h], [0, h]],
        r
      );
    }
    case "arch": {
      const rad = Math.min(w / 2, h / 2);
      return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], [rad, rad, r, r]);
    }
    case "leaf":
      return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], [Math.min(w, h) * 0.42, 6, Math.min(w, h) * 0.42, 6]);
    case "leaf-r":
      return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], [6, Math.min(w, h) * 0.42, 6, Math.min(w, h) * 0.42]);
    case "pebble": {
      const rad = Math.min(w, h) * 0.5;
      return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], rad);
    }
    default:
      return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], r);
  }
}
