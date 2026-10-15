import { TOWN_CENTRES } from "@/data/geo";

/** OpenStreetMap embed, darkened to sit with the site. Loads only when it nears the screen. */
export function AreaMap({ slug, name }: { slug: string; name: string }) {
  const c = TOWN_CENTRES[slug];
  if (!c) return null;
  const [lat, lon] = c;
  const w = slug === "london" ? 0.22 : 0.1;
  const h = w * 0.6;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - w},${lat - h},${lon + w},${lat + h}&layer=mapnik&marker=${lat},${lon}`;
  return (
    <figure className="oss-map">
      <iframe title={`Map of ${name}`} src={src} loading="lazy" referrerPolicy="no-referrer" />
      <figcaption>{name}</figcaption>
    </figure>
  );
}
