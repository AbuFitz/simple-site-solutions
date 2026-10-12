/** Procedural UI drawings for the "page" slabs. Brand-true wireframes, no invented content. */

export const PAGE_W = 3.2;
const PX = 320; // pixels per world unit

export interface PageModule {
  key: "nav" | "hero" | "services" | "work" | "trust" | "cta";
  h: number;
}

export const PAGE_MODULES: PageModule[] = [
  { key: "nav", h: 0.34 },
  { key: "hero", h: 1.5 },
  { key: "services", h: 1.05 },
  { key: "work", h: 1.15 },
  { key: "trust", h: 0.62 },
  { key: "cta", h: 0.85 },
];

export const PAGE_GAP = 0.07;
export const PAGE_HEIGHT = PAGE_MODULES.reduce((a, m) => a + m.h, 0) + PAGE_GAP * (PAGE_MODULES.length - 1);

export const texSize = (m: PageModule) => ({ w: Math.round(PAGE_W * PX), h: Math.round(m.h * PX) });

const C = {
  paper: "#ece9df",
  ink: "#0c100e",
  inkSoft: "rgba(12,16,14,0.13)",
  inkMid: "rgba(12,16,14,0.34)",
  green: "#1fa878",
  glow: "#4df2b2",
};

const DISPLAY = '800 {s}px "Inter", system-ui, sans-serif';
const MONO = '500 {s}px "Inter", system-ui, sans-serif';
const f = (tpl: string, s: number) => tpl.replace("{s}", String(s));

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h = 12, fill = C.inkSoft) {
  ctx.fillStyle = fill;
  rr(ctx, x, y, w, h, h / 2);
  ctx.fill();
}

function mark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const u = s / 26;
  ctx.fillStyle = "rgba(12,16,14,0.28)";
  rr(ctx, x, y + 15 * u, 26 * u, 7 * u, 2.4 * u);
  ctx.fill();
  ctx.fillStyle = "rgba(12,16,14,0.55)";
  rr(ctx, x, y + 7.5 * u, 26 * u, 7 * u, 2.4 * u);
  ctx.fill();
  ctx.fillStyle = C.green;
  rr(ctx, x, y, 26 * u, 7 * u, 2.4 * u);
  ctx.fill();
}

export type Thumbs = (HTMLImageElement | null)[];

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, thumbs: Thumbs) => void;

const nav: Draw = (ctx, w, h) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = C.inkSoft;
  ctx.lineWidth = 2;
  rr(ctx, 14, 14, w - 28, h - 28, (h - 28) / 2);
  ctx.stroke();
  mark(ctx, 44, h / 2 - 13, 28);
  ctx.fillStyle = C.ink;
  ctx.font = f(DISPLAY, 30);
  ctx.textBaseline = "middle";
  ctx.fillText("onesimplesite", 86, h / 2 + 1);
  ctx.font = f(MONO, 19);
  ctx.fillStyle = C.inkMid;
  ["Work", "Process", "Pricing"].forEach((t, i) => ctx.fillText(t, 470 + i * 118, h / 2 + 1));
  ctx.fillStyle = C.green;
  rr(ctx, w - 190, h / 2 - 25, 150, 50, 25);
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.font = f(MONO, 19);
  ctx.fillText("Start →", w - 160, h / 2 + 1);
};

const hero: Draw = (ctx, w, h) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.inkMid;
  ctx.font = f(MONO, 17);
  ctx.fillText("WEBSITES FOR LOCAL UK BUSINESSES", 56, 74);
  ctx.fillStyle = C.ink;
  ctx.font = f(DISPLAY, 84);
  ctx.fillText("Websites that", 52, 168);
  ctx.fillStyle = C.green;
  ctx.fillText("converts.", 52, 252);
  bar(ctx, 56, 292, 470, 13);
  bar(ctx, 56, 318, 360, 13);
  ctx.fillStyle = C.green;
  rr(ctx, 56, 366, 190, 58, 29);
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.font = f(MONO, 19);
  ctx.fillText("Get started →", 80, 402);
  ctx.strokeStyle = C.inkMid;
  ctx.lineWidth = 2;
  rr(ctx, 262, 366, 170, 58, 29);
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.fillText("Pricing", 306, 402);
  // image block
  const x = 660, y = 56, bw = 308, bh = 372;
  ctx.save();
  rr(ctx, x, y, bw, bh, 26);
  ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + bw, y + bh);
  g.addColorStop(0, "#0e1a15");
  g.addColorStop(1, "#1f6f52");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, bw, bh);
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 2;
  for (let i = -bh; i < bw; i += 26) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + bh);
    ctx.lineTo(x + i + bh, y);
    ctx.stroke();
  }
  ctx.fillStyle = C.glow;
  ctx.beginPath();
  ctx.arc(x + bw * 0.68, y + bh * 0.3, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  rr(ctx, x + 28, y + bh - 112, bw - 56, 84, 16);
  ctx.fill();
  bar(ctx, x + 50, y + bh - 88, 150, 12, "rgba(12,16,14,0.7)");
  bar(ctx, x + 50, y + bh - 60, 110, 10, "rgba(12,16,14,0.2)");
  ctx.restore();
};

const services: Draw = (ctx, w, h) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.ink;
  ctx.font = f(DISPLAY, 44);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Built from what works", 56, 82);
  for (let i = 0; i < 3; i++) {
    const x = 56 + i * 316;
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 2;
    rr(ctx, x, 120, 292, 190, 22);
    ctx.stroke();
    ctx.fillStyle = i === 1 ? C.green : C.inkSoft;
    rr(ctx, x + 26, 146, 46, 46, 14);
    ctx.fill();
    bar(ctx, x + 26, 216, 150, 14, "rgba(12,16,14,0.66)");
    bar(ctx, x + 26, 246, 220, 11);
    bar(ctx, x + 26, 268, 170, 11);
  }
};

const work: Draw = (ctx, w, h, thumbs) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.ink;
  ctx.font = f(DISPLAY, 44);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Websites that deliver", 56, 82);
  for (let i = 0; i < 3; i++) {
    const x = 56 + i * 316;
    ctx.save();
    rr(ctx, x, 118, 292, 182, 18);
    ctx.clip();
    const img = thumbs[i];
    if (img && img.complete && img.naturalWidth) {
      const s = Math.max(292 / img.naturalWidth, 182 / img.naturalHeight);
      ctx.drawImage(img, x, 118, img.naturalWidth * s, img.naturalHeight * s);
    } else {
      ctx.fillStyle = ["#1b2b24", "#cbd7f4", "#3a1b14"][i];
      ctx.fillRect(x, 118, 292, 182);
    }
    ctx.restore();
    ctx.strokeStyle = C.inkSoft;
    ctx.lineWidth = 2;
    rr(ctx, x, 118, 292, 182, 18);
    ctx.stroke();
    bar(ctx, x, 322, 130, 12, "rgba(12,16,14,0.6)");
    bar(ctx, x, 346, 90, 10);
  }
};

const trust: Draw = (ctx, w, h) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  const items = [["5–10", "days"], ["£199", "from"], ["Mobile", "first"], ["Local", "SEO"]];
  items.forEach(([a, b], i) => {
    const x = 56 + i * 238;
    ctx.fillStyle = i === 0 ? C.green : C.ink;
    ctx.font = f(DISPLAY, 50);
    ctx.fillText(a, x, 98);
    ctx.fillStyle = C.inkMid;
    ctx.font = f(MONO, 17);
    ctx.fillText(b.toUpperCase(), x, 136);
  });
  ctx.fillStyle = C.inkSoft;
  ctx.fillRect(56, 158, w - 112, 2);
};

const cta: Draw = (ctx, w, h) => {
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#1fa878");
  g.addColorStop(1, "#4df2b2");
  ctx.fillStyle = g;
  rr(ctx, 28, 20, w - 56, h - 40, 30);
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.font = f(DISPLAY, 50);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Let's build something", 72, 122);
  ctx.fillText("that converts.", 72, 180);
  ctx.fillStyle = C.ink;
  rr(ctx, w - 330, h / 2 - 32, 258, 64, 32);
  ctx.fill();
  ctx.fillStyle = "#4df2b2";
  ctx.font = f(MONO, 20);
  ctx.fillText("Start your project →", w - 306, h / 2 + 7);
};

export const drawers: Record<PageModule["key"], Draw> = { nav, hero, services, work, trust, cta };
