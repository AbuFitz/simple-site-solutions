/**
 * Real-world location lookups for the website preview. Everything here is a live lookup against open services,
 * made by the visitor's own browser: postcodes.io (UK postcodes, Ordnance Survey and ONS open data) and
 * OpenStreetMap Nominatim (place names). Nothing is invented: no result means no map.
 */

export interface Place {
  lat: number;
  lon: number;
  /** True when it came from a full postcode, so a pin is honest. A town name only gives an area view. */
  precise: boolean;
  /** Human label such as "Watford, Hertfordshire", when the service provided one. */
  label?: string;
  /** Town or district suggested by a postcode lookup. */
  town?: string;
}

const POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;

/** "wd171aa" -> "WD17 1AA". Returns "" if it isn't shaped like a UK postcode. */
export function normalisePostcode(raw: string): string {
  const m = raw.toUpperCase().replace(/[^A-Z0-9 ]/g, "").trim().match(POSTCODE);
  return m ? `${m[1]} ${m[2]}` : "";
}

export const looksLikePostcodeStart = (raw: string) => /^[A-Za-z]{1,2}\d/.test(raw.trim());

const memo = new Map<string, Promise<Place | null>>();

const finite = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

function cached<T>(key: string): T | undefined {
  try {
    const v = sessionStorage.getItem(key);
    return v === null ? undefined : (JSON.parse(v) as T);
  } catch {
    return undefined;
  }
}
function store(key: string, v: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export async function lookupPostcode(raw: string, fetcher: typeof fetch = fetch): Promise<Place | null> {
  const pc = normalisePostcode(raw);
  if (!pc) return null;
  const key = `oss_geo_pc_${pc}`;
  const hit = cached<Place | null>(key);
  if (hit !== undefined) return hit;
  try {
    const r = await fetcher(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    if (!r.ok) {
      if (r.status === 404) store(key, null);
      return null;
    }
    const j = (await r.json()) as { result?: { latitude: number; longitude: number; admin_district?: string; admin_county?: string; parish?: string; region?: string } };
    const x = j.result;
    if (!x || !finite(x.latitude) || !finite(x.longitude)) return null;
    const town = (x.admin_district || x.parish || "").replace(/^(.*) (?:District|Borough)$/, "$1");
    const place: Place = { lat: x.latitude, lon: x.longitude, precise: true, town: town || undefined, label: [pc, x.admin_district || x.parish, x.region].filter(Boolean).join(", ") };
    store(key, place);
    return place;
  } catch {
    return null;
  }
}

export async function lookupTown(town: string, fetcher: typeof fetch = fetch): Promise<Place | null> {
  const t = town.trim();
  if (t.length < 3) return null;
  const key = `oss_geo_t_${t.toLowerCase()}`;
  const hit = cached<Place | null>(key);
  if (hit !== undefined) return hit;
  try {
    const r = await fetcher(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=gb&q=${encodeURIComponent(t)}`, { headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    const j = (await r.json()) as { lat: string; lon: string; display_name?: string }[];
    const first = j[0];
    const lat = Number(first?.lat);
    const lon = Number(first?.lon);
    const place: Place | null = first && finite(lat) && finite(lon) ? { lat, lon, precise: false, label: first.display_name } : null;
    store(key, place);
    return place;
  } catch {
    return null;
  }
}

/** A postcode wins (it can carry a pin); otherwise the town gives an area view. One lookup per value per page load. */
export function lookupPlace(input: { postcode?: string; town?: string }): Promise<Place | null> {
  const pc = normalisePostcode(input.postcode ?? "");
  const key = pc ? `pc:${pc}` : `t:${(input.town ?? "").trim().toLowerCase()}`;
  const hit = memo.get(key);
  if (hit) return hit;
  const p = (async () => {
    if (pc) {
      const byPc = await lookupPostcode(pc);
      if (byPc) return byPc;
    }
    return input.town ? lookupTown(input.town) : null;
  })();
  memo.set(key, p);
  return p;
}

export const _clearGeoMemo = () => memo.clear();

/**
 * OpenStreetMap embed URL. With `pin` (and a postcode-accurate place) the map zooms in and shows a marker.
 * Otherwise it shows the surrounding area with no marker, so nobody's address is published by accident.
 */
export function embedUrl(place: Place, opts: { pin?: boolean } = {}): string {
  const pinned = Boolean(opts.pin && place.precise);
  const [dx, dy] = pinned ? [0.01, 0.006] : place.precise ? [0.03, 0.018] : [0.05, 0.03];
  const bbox = [place.lon - dx, place.lat - dy, place.lon + dx, place.lat + dy].map((n) => n.toFixed(5)).join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${pinned ? `&marker=${place.lat.toFixed(5)}%2C${place.lon.toFixed(5)}` : ""}`;
}

export const largerMapUrl = (place: Place, opts: { pin?: boolean } = {}) =>
  `https://www.openstreetmap.org/?${opts.pin && place.precise ? `mlat=${place.lat.toFixed(5)}&mlon=${place.lon.toFixed(5)}` : ""}#map=${opts.pin && place.precise ? 17 : 13}/${place.lat.toFixed(5)}/${place.lon.toFixed(5)}`;
