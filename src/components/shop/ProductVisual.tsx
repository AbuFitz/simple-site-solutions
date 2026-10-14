import { useId } from "react";
import type { VisualKey } from "@/data/shop";

/**
 * Original product illustrations drawn in SVG for this site. They are not photographs of the finished
 * products and the QR patterns are decorative (not scannable). Cards show a caption saying so.
 */
const GREEN = "#27b07d";
const INK = "#0a0a0a";
const PAPER = "#f4f4f1";

function qrCells(seed: number, n = 21): boolean[][] {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const g: boolean[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => rnd() > 0.52));
  const finder = (r: number, c: number) => {
    for (let y = -1; y <= 7; y++)
      for (let x = -1; x <= 7; x++) {
        const rr = r + y;
        const cc = c + x;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        const edge = x === -1 || y === -1 || x === 7 || y === 7;
        const ring = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        g[rr][cc] = !edge && (ring || core);
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);
  return g;
}

function Qr({ x, y, size, seed = 7, fg = INK, bg = "#fff" }: { x: number; y: number; size: number; seed?: number; fg?: string; bg?: string }) {
  const cells = qrCells(seed);
  const n = cells.length;
  const u = size / (n + 2);
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.04} fill={bg} />
      {cells.flatMap((row, r) => row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={x + u + c * u} y={y + u + r * u} width={u + 0.3} height={u + 0.3} fill={fg} /> : null)))}
    </g>
  );
}

function Nfc({ x, y, s = 1, color = GREEN }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round">
      <path d="M4 18 Q10 12 4 6" />
      <path d="M11 22 Q21 12 11 2" />
      <path d="M18 26 Q32 12 18 -2" />
    </g>
  );
}

function Stars({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const star = "M10 1.5 12.6 7 18.5 7.7 14.2 11.8 15.3 17.6 10 14.8 4.7 17.6 5.8 11.8 1.5 7.7 7.4 7Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#f5b800">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={star} transform={`translate(${i * 22} 0)`} />
      ))}
    </g>
  );
}

const Bars = ({ x, y, w, h = 7, c = "#cfcfca", gap = 14, n = 2 }: { x: number; y: number; w: number; h?: number; c?: string; gap?: number; n?: number }) => (
  <g fill={c}>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={x} y={y + i * gap} width={i === n - 1 ? w * 0.6 : w} height={h} rx={h / 2} />
    ))}
  </g>
);

function Scene({ kind }: { kind: VisualKey }) {
  switch (kind) {
    case "review-card":
      return (
        <g transform="rotate(-6 200 150)">
          <rect x="85" y="55" width="230" height="145" rx="14" fill={PAPER} />
          <Stars x={105} y={72} s={0.85} />
          <Bars x={105} y={105} w={110} c="#bdbdb6" n={2} />
          <Qr x={225} y={92} size={72} seed={11} />
          <Nfc x={110} y={158} s={0.9} />
          <rect x="85" y="190" width="230" height="10" rx="5" fill={GREEN} />
        </g>
      );
    case "review-stand":
      return (
        <g>
          <path d="M120 250 L280 250 L268 268 L132 268Z" fill="#1c1c1c" />
          <path d="M150 70 L250 70 L262 245 L138 245Z" fill={PAPER} />
          <rect x="150" y="70" width="100" height="26" fill={GREEN} />
          <Stars x={160} y={108} s={0.6} />
          <Qr x={166} y={132} size={68} seed={5} />
          <Nfc x={182} y={212} s={0.7} />
        </g>
      );
    case "review-kit":
      return (
        <g>
          <path d="M92 250 L212 250 L204 266 L100 266Z" fill="#1c1c1c" />
          <path d="M112 66 L192 66 L202 246 L102 246Z" fill={PAPER} />
          <rect x="112" y="66" width="80" height="22" fill={GREEN} />
          <Qr x={122} y={104} size={60} seed={5} />
          <Nfc x={134} y={190} s={0.6} />
          <g transform="rotate(8 280 190)">
            <rect x="230" y="150" width="130" height="82" rx="9" fill={PAPER} />
            <Stars x={242} y={160} s={0.5} />
            <Qr x={300} y={176} size={48} seed={11} />
            <Nfc x={244} y={200} s={0.55} />
          </g>
          <g transform="rotate(-4 300 130)">
            <rect x="232" y="104" width="130" height="82" rx="9" fill="#e8e8e3" />
            <Stars x={244} y={114} s={0.5} />
            <Qr x={302} y={128} size={48} seed={11} />
          </g>
        </g>
      );
    case "nfc-card":
      return (
        <g transform="rotate(5 200 150)">
          <rect x="80" y="70" width="240" height="140" rx="14" fill="#161616" stroke="#2a2a2a" strokeWidth="2" />
          <rect x="80" y="70" width="8" height="140" rx="4" fill={GREEN} />
          <rect x="108" y="96" width="92" height="9" rx="4.5" fill="#f0f0f0" />
          <rect x="108" y="114" width="66" height="6" rx="3" fill="#8b8b86" />
          <Nfc x={108} y={165} s={0.9} />
          <Qr x={232} y={118} size={70} seed={21} fg="#0a0a0a" bg="#f4f4f1" />
        </g>
      );
    case "table-sign":
      return (
        <g>
          <path d="M115 258 L285 258 L275 272 L125 272Z" fill="#1c1c1c" />
          <path d="M140 62 L260 62 L272 252 L128 252Z" fill={PAPER} />
          <rect x="140" y="62" width="120" height="30" fill={INK} />
          <g fill="none" stroke={GREEN} strokeWidth="3.4" strokeLinecap="round" transform="translate(178 70)">
            <path d="M0 8 Q22 -6 44 8" />
            <path d="M8 14 Q22 5 36 14" />
            <circle cx="22" cy="20" r="1.8" fill={GREEN} />
          </g>
          <Qr x={160} y={108} size={80} seed={3} />
          <Bars x={156} y={204} w={88} c="#bdbdb6" n={2} />
        </g>
      );
    case "stickers":
      return (
        <g>
          <rect x="60" y="50" width="280" height="200" rx="6" fill="none" stroke="#2a2a2a" strokeWidth="3" />
          <line x1="200" y1="50" x2="200" y2="250" stroke="#2a2a2a" strokeWidth="3" />
          <circle cx="132" cy="140" r="52" fill={PAPER} />
          <circle cx="132" cy="140" r="52" fill="none" stroke={GREEN} strokeWidth="5" />
          <Qr x={104} y={112} size={56} seed={9} />
          <g transform="rotate(-5 270 160)">
            <rect x="222" y="108" width="96" height="104" rx="12" fill={GREEN} />
            <rect x="234" y="120" width="72" height="8" rx="4" fill={INK} opacity=".8" />
            <Qr x={238} y={136} size={64} seed={13} />
          </g>
        </g>
      );
    case "digital-pack":
      return (
        <g>
          <g transform="rotate(-8 140 150)">
            <rect x="80" y="70" width="110" height="140" rx="8" fill="#e8e8e3" />
            <Qr x={96} y={90} size={78} seed={4} />
            <rect x="96" y="178" width="60" height="7" rx="3.5" fill="#bdbdb6" />
          </g>
          <g transform="rotate(4 220 150)">
            <rect x="150" y="60" width="120" height="150" rx="8" fill={PAPER} />
            <Qr x={167} y={80} size={86} seed={17} />
            <rect x="167" y="176" width="70" height="7" rx="3.5" fill="#bdbdb6" />
            <rect x="167" y="190" width="44" height="7" rx="3.5" fill="#bdbdb6" />
          </g>
          <g transform="translate(250 200)">
            <rect width="54" height="26" rx="13" fill={GREEN} />
            <text x="27" y="18" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill={INK}>
              SVG
            </text>
          </g>
          <g transform="translate(250 232)">
            <rect width="54" height="26" rx="13" fill="#2a2a2a" />
            <text x="27" y="18" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#f0f0f0">
              PNG
            </text>
          </g>
        </g>
      );
  }
}

export function ProductVisual({ kind, className = "" }: { kind: VisualKey; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Illustration of the product (not a photograph)" className={className} preserveAspectRatio="xMidYMid slice" width="400" height="300">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="75%">
          <stop offset="0" stopColor="#1d1d1d" />
          <stop offset="1" stopColor="#0f0f0f" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#ffffff" opacity=".07" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-dots)`} />
      <ellipse cx="200" cy="268" rx="130" ry="9" fill="#000" opacity=".35" />
      <Scene kind={kind} />
    </svg>
  );
}
