/**
 * Original illustrations for the guides: one idea each, drawn in code in the site's black, grey-white and one green.
 * (No screenshots of other companies' products and no stock photography.)
 */
const INK = "#0b0f0d";
const BONE = "#e6e7e3";
const GREY = "#2a302d";
const MID = "#8b908c";
const G = "#26b07d";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 800 450" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className="gd-art">
    <rect width="800" height="450" fill={INK} />
    {children}
  </svg>
);

const motifs: Record<string, () => JSX.Element> = {
  // DIY: loose blocks being dragged into a page
  "diy-website-builder-or-web-designer": () => (
    <Frame>
      <rect x="430" y="60" width="300" height="330" fill="none" stroke={MID} strokeWidth="2" strokeDasharray="8 8" />
      <rect x="450" y="80" width="260" height="46" fill={BONE} />
      <rect x="450" y="140" width="120" height="110" fill={GREY} />
      <rect x="582" y="140" width="128" height="50" fill={GREY} />
      <rect x="100" y="90" width="160" height="90" fill={G} transform="rotate(-9 180 135)" />
      <rect x="180" y="230" width="150" height="70" fill={BONE} transform="rotate(7 255 265)" />
      <rect x="70" y="300" width="110" height="60" fill={GREY} transform="rotate(-4 125 330)" />
      <path d="M345 255 L420 205" stroke={BONE} strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
    </Frame>
  ),
  // GoDaddy: a fixed grid of template tiles
  "godaddy-website-builder-or-web-designer": () => (
    <Frame>
      {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={110 + c * 150} y={70 + r * 105} width="130" height="85" fill={r === 1 && c === 2 ? G : GREY} />))}
      <rect x="110" y="385" width="580" height="8" fill={BONE} />
    </Frame>
  ),
  // One.com: everything bundled in one stack
  "one-com-website-builder-or-web-designer": () => (
    <Frame>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={250 + i * 22} y={70 + i * 38} width="300" height="150" fill={i === 3 ? G : i % 2 ? GREY : BONE} stroke={INK} strokeWidth="3" />
      ))}
      <rect x="170" y="330" width="460" height="10" fill={MID} />
    </Frame>
  ),
  // Wix: total freedom, blocks anywhere
  "wix-or-web-designer": () => (
    <Frame>
      {[
        [90, 70, 140, 80, GREY, -8],
        [260, 130, 190, 60, BONE, 5],
        [520, 70, 170, 110, G, 10],
        [140, 250, 120, 100, BONE, 12],
        [320, 270, 210, 70, GREY, -6],
        [580, 240, 110, 120, GREY, 4],
      ].map(([x, y, w, h, f, r], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={f as string} transform={`rotate(${r} ${(x as number) + (w as number) / 2} ${(y as number) + (h as number) / 2})`} />
      ))}
    </Frame>
  ),
  // Squarespace: clean, aligned, a little polished
  "squarespace-or-web-designer": () => (
    <Frame>
      <rect x="140" y="60" width="520" height="330" fill={BONE} />
      <rect x="180" y="100" width="260" height="22" fill={INK} />
      <rect x="180" y="136" width="180" height="22" fill={INK} />
      <rect x="180" y="200" width="220" height="150" fill={G} />
      <rect x="420" y="200" width="210" height="70" fill={GREY} />
      <rect x="420" y="280" width="210" height="70" fill={INK} />
    </Frame>
  ),
  // WordPress: a core with plug-in pieces around it
  "wordpress-or-web-designer": () => (
    <Frame>
      <rect x="300" y="150" width="200" height="150" fill={BONE} />
      {[
        [210, 110, 70, 50],
        [520, 100, 90, 60],
        [180, 250, 90, 60],
        [530, 240, 80, 70],
        [330, 330, 140, 50],
        [350, 70, 100, 50],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={i === 3 ? G : GREY} />
      ))}
      {[
        [280, 135],
        [520, 130],
        [270, 280],
        [530, 275],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill={MID} />
      ))}
    </Frame>
  ),
};

export function GuideArt({ slug }: { slug: string }) {
  const M = motifs[slug];
  return M ? <M /> : null;
}
