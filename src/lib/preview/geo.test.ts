import { beforeEach, describe, expect, it, vi } from "vitest";
import { _clearGeoMemo, embedUrl, largerMapUrl, lookupPlace, lookupPostcode, lookupTown, normalisePostcode } from "./geo";

const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: async () => body } as Response);

describe("postcodes", () => {
  it("normalises UK postcodes and rejects anything else", () => {
    expect(normalisePostcode("wd171aa")).toBe("WD17 1AA");
    expect(normalisePostcode(" SW1A  2AA ")).toBe("SW1A 2AA");
    expect(normalisePostcode("m1 1ae")).toBe("M1 1AE");
    expect(normalisePostcode("EC1A 1BB")).toBe("EC1A 1BB");
    for (const bad of ["", "hello", "12345", "WD17", "WD17 1A", "<script>"]) expect(normalisePostcode(bad)).toBe("");
  });
});

describe("lookups", () => {
  beforeEach(() => {
    sessionStorage.clear();
    _clearGeoMemo();
  });

  it("postcode lookup returns a precise place with a town suggestion", async () => {
    const f = vi.fn(() => ok({ result: { latitude: 51.656881, longitude: -0.398652, admin_district: "Watford", region: "East of England" } }));
    const p = await lookupPostcode("wd171aa", f as unknown as typeof fetch);
    expect(p).toMatchObject({ precise: true, town: "Watford", label: "WD17 1AA, Watford, East of England" });
    expect((f.mock.calls[0] as unknown[])[0]).toContain("/postcodes/WD17%201AA");
    await lookupPostcode("WD17 1AA", f as unknown as typeof fetch);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("unknown postcode (404) and network errors give no place", async () => {
    expect(await lookupPostcode("ZZ99 9ZZ", (() => Promise.resolve({ ok: false, status: 404 } as Response)) as unknown as typeof fetch)).toBeNull();
    expect(await lookupPostcode("WD17 1AB", (() => Promise.reject(new Error("offline"))) as unknown as typeof fetch)).toBeNull();
    expect(await lookupPostcode("nope")).toBeNull();
  });

  it("town lookup gives an area view only and is cached", async () => {
    const f = vi.fn(() => ok([{ lat: "51.6553875", lon: "-0.3957425" }]));
    const p = await lookupTown("Watford", f as unknown as typeof fetch);
    expect(p).toMatchObject({ precise: false });
    await lookupTown("watford", f as unknown as typeof fetch);
    expect(f).toHaveBeenCalledTimes(1);
    expect(await lookupTown("ab")).toBeNull();
    expect(await lookupTown("Nowhere", (() => ok([])) as unknown as typeof fetch)).toBeNull();
  });

  it("lookupPlace prefers a valid postcode and falls back to the town", async () => {
    const calls: string[] = [];
    vi.stubGlobal("fetch", (url: string) => {
      calls.push(url);
      if (url.includes("postcodes.io")) return ok({ result: { latitude: 51.5, longitude: -0.1, admin_district: "Camden" } });
      return ok([{ lat: "52", lon: "-1" }]);
    });
    const a = await lookupPlace({ postcode: "NW1 7AA", town: "London" });
    expect(a?.precise).toBe(true);
    _clearGeoMemo();
    sessionStorage.clear();
    const b = await lookupPlace({ town: "Leicester" });
    expect(b?.precise).toBe(false);
    expect(calls.some((c) => c.includes("nominatim"))).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe("map urls", () => {
  it("only pins when asked and the place is postcode-accurate; always points at openstreetmap.org", () => {
    const town = { lat: 51.65, lon: -0.39, precise: false };
    const pc = { lat: 51.65, lon: -0.39, precise: true };
    expect(embedUrl(town)).toMatch(/^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=/);
    expect(embedUrl(town, { pin: true })).not.toContain("marker=");
    expect(embedUrl(pc)).not.toContain("marker=");
    expect(embedUrl(pc, { pin: true })).toContain("marker=51.65000%2C-0.39000");
    expect(largerMapUrl(pc, { pin: true })).toContain("mlat=51.65000");
    expect(largerMapUrl(pc)).not.toContain("mlat");
    expect(largerMapUrl(town)).toMatch(/^https:\/\/www\.openstreetmap\.org\//);
  });
});
