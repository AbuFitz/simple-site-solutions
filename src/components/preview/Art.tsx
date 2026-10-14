import type { ArtId, ResolvedPalette } from "@/lib/preview/types";

/**
 * Original vector motifs, one per trade, drawn from the palette. They stand in for photography
 * until the business has its own, and are always labelled as placeholders by the surrounding template.
 */
export function Art({ id, palette, className = "" }: { id: ArtId; palette: ResolvedPalette; className?: string }) {
  const { accent, ink, surface, bg } = palette;
  const soft = `${ink}1f`;
  const mid = `${ink}55`;
  const common = { viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice", className, role: "img" as const, "aria-hidden": true };

  switch (id) {
    case "pipes":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M-10 ${60 + i * 90} H${120 + i * 40} a30 30 0 0 1 30 30 V${150 + i * 10} a30 30 0 0 0 30 30 H420`}
              fill="none"
              stroke={i === 1 ? accent : mid}
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={150 + i * 40} cy={90 + i * 90 - (i === 0 ? 30 : 0)} r="13" fill={bg} stroke={ink} strokeWidth="3" />
          ))}
          <circle cx="330" cy="70" r="26" fill={accent} opacity=".25" />
        </svg>
      );
    case "circuit":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {[40, 100, 160, 220].map((y, i) => (
            <path key={y} d={`M0 ${y} H${90 + i * 30} l30 30 H${220 + i * 20} l-30 -30 H400`} fill="none" stroke={i === 2 ? accent : mid} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {[[120, 70], [180, 130], [270, 190], [350, 40], [60, 250]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill={bg} stroke={i % 2 ? ink : accent} strokeWidth="5" />
              <circle cx={x} cy={y} r="4" fill={i % 2 ? ink : accent} />
            </g>
          ))}
          <path d="M300 60 l-26 52 h22 l-12 50 40 -64 h-24 l18 -38z" fill={accent} />
        </svg>
      );
    case "gears": {
      const gear = (cx: number, cy: number, r: number, teeth: number, fill: string, rot = 0) => {
        const pts: string[] = [];
        for (let i = 0; i < teeth * 2; i++) {
          const a = (i / (teeth * 2)) * Math.PI * 2 + rot;
          const rr = i % 2 ? r : r * 1.22;
          pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
        }
        return (
          <g>
            <polygon points={pts.join(" ")} fill={fill} />
            <circle cx={cx} cy={cy} r={r * 0.42} fill={surface} />
          </g>
        );
      };
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {gear(150, 160, 70, 12, accent)}
          {gear(285, 100, 46, 9, mid, 0.2)}
          {gear(300, 225, 32, 7, soft, 0.5)}
          <path d="M20 270 H380" stroke={ink} strokeWidth="6" strokeLinecap="round" opacity=".35" />
        </svg>
      );
    }
    case "bubbles":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {[[110, 190, 78], [250, 120, 56], [320, 220, 38], [190, 70, 28], [60, 80, 22], [340, 60, 18]].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={i % 2 ? `${accent}33` : `${accent}55`} stroke={accent} strokeWidth="3" />
              <path d={`M${x - r * 0.55} ${y - r * 0.15} a${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.4} -${r * 0.45}`} fill="none" stroke={bg} strokeWidth={Math.max(3, r * 0.1)} strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );
    case "stripes":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          <g transform="translate(200 150) rotate(-12)">
            <rect x="-170" y="-46" width="340" height="92" rx="46" fill={bg} stroke={ink} strokeWidth="5" />
            <clipPath id="pole">
              <rect x="-166" y="-42" width="332" height="84" rx="42" />
            </clipPath>
            <g clipPath="url(#pole)">
              {Array.from({ length: 16 }).map((_, i) => (
                <polygon key={i} points={`${-210 + i * 48},-60 ${-186 + i * 48},-60 ${-146 + i * 48},60 ${-170 + i * 48},60`} fill={i % 2 ? accent : ink} opacity={i % 2 ? 1 : 0.9} />
              ))}
            </g>
          </g>
          <circle cx="70" cy="60" r="12" fill={accent} />
          <circle cx="340" cy="250" r="9" fill={ink} opacity=".5" />
        </svg>
      );
    case "notebook":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          <rect x="60" y="34" width="280" height="232" rx="14" fill={bg} stroke={ink} strokeWidth="4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="84" x2="316" y1={80 + i * 25} y2={80 + i * 25} stroke={mid} strokeWidth="2" />
          ))}
          <line x1="110" x2="110" y1="40" y2="262" stroke={accent} strokeWidth="3" />
          <text x="130" y="70" fontSize="30" fontWeight="700" fill={accent} fontFamily="Inter, system-ui, sans-serif">2x + 3 = 11</text>
          <path d="M290 230 l60 -60 l16 16 l-60 60 l-22 6z" fill={accent} />
        </svg>
      );
    case "tiles":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {[[40, 40, 150, 120], [200, 40, 160, 70], [200, 120, 70, 70], [280, 120, 80, 70], [40, 170, 100, 90], [150, 200, 210, 60]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="16" fill={i === 0 ? accent : i % 2 ? soft : `${accent}33`} stroke={i === 0 ? "none" : mid} strokeWidth="2" />
          ))}
          <circle cx="115" cy="100" r="22" fill={bg} opacity=".85" />
        </svg>
      );
    case "bricks":
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {Array.from({ length: 7 }).map((_, r) =>
            Array.from({ length: 6 }).map((__, c) => {
              const off = r % 2 ? -35 : 0;
              const hl = (r === 3 && c === 2) || (r === 4 && c === 3);
              return <rect key={`${r}-${c}`} x={c * 70 + off + 4} y={r * 42 + 6} width="64" height="36" rx="5" fill={hl ? accent : r % 3 === 0 ? mid : soft} />;
            })
          )}
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect width="400" height="300" fill={surface} />
          {[150, 110, 70, 30].map((r, i) => (
            <circle key={r} cx="230" cy="150" r={r} fill={i === 3 ? accent : "none"} stroke={i === 3 ? "none" : i % 2 ? mid : accent} strokeWidth="6" />
          ))}
        </svg>
      );
  }
}
