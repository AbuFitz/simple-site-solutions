import QRCode from "qrcode";
import type { OrderLine } from "./orders.js";
import { wifiPayload } from "../../src/lib/shop-rules.js";

export interface QrFile {
  filename: string;
  content: Buffer;
}

const slugify = (s: string) => s.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "link";

/** Static QR codes (error correction M, quiet zone 2) as SVG, plus a large PNG when requested. */
export async function qrFiles(text: string, name: string, opts: { png?: boolean } = {}): Promise<QrFile[]> {
  const svg = await QRCode.toString(text, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
  const files: QrFile[] = [{ filename: `${name}.svg`, content: Buffer.from(svg, "utf8") }];
  if (opts.png) files.push({ filename: `${name}.png`, content: await QRCode.toBuffer(text, { errorCorrectionLevel: "M", margin: 2, width: 1200 }) });
  return files;
}

/** The text a line's QR code must encode, or null if the line has none. */
export function payloadForLine(line: OrderLine): { text: string; label: string }[] {
  const p = line.personalisation;
  switch (line.slug) {
    case "review-card":
    case "review-stand":
    case "review-kit":
      return p.reviewLink ? [{ text: p.reviewLink, label: "review" }] : [];
    case "smart-business-card":
    case "sticker-pack":
      return p.link ? [{ text: p.link, label: "link" }] : [];
    case "qr-table-sign":
      if (p.purpose === "wifi") return p.ssid && p.security ? [{ text: wifiPayload(p.ssid, p.security, p.password && p.password !== "[removed after fulfilment]" ? p.password : ""), label: "wifi" }] : [];
      return p.link ? [{ text: p.link, label: p.purpose || "link" }] : [];
    case "digital-qr-pack":
      return ["url1", "url2", "url3"].filter((k) => p[k]).map((k, i) => ({ text: p[k], label: `code-${i + 1}-${slugify(p[k])}` }));
    default:
      return [];
  }
}

export async function filesForLines(lines: OrderLine[], opts: { png: boolean }): Promise<QrFile[]> {
  const out: QrFile[] = [];
  let n = 0;
  for (const l of lines) {
    for (const item of payloadForLine(l)) {
      n++;
      out.push(...(await qrFiles(item.text, `${String(n).padStart(2, "0")}-${l.slug}-${item.label}`, { png: opts.png })));
    }
  }
  return out;
}
