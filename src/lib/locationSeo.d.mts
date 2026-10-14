export interface Faq { q: string; a: string }
export interface Sector { name: string; line: string }
export interface Loc {
  slug: string; name: string; county: string; h1: string; title: string; metaDescription: string;
  intro: string[]; local: string; sectors: Sector[]; areas: string[]; neighbours: string[]; faq: Faq[];
}
export interface LocData {
  ukLine: string;
  shared: { localSeo: { title: string; body: string }[]; steps: { title: string; body: string }[]; faq: Faq[] };
  locations: Loc[];
}
export const HUB_PATH: string;
export const locationPath: (slug: string) => string;
export const faqFor: (loc: Loc, data: LocData) => Faq[];
export const hubTitle: string;
export const hubDescription: string;
export function locationJsonLd(loc: Loc, data: LocData, siteUrl: string): Record<string, unknown>[];
export function hubJsonLd(data: LocData, siteUrl: string): Record<string, unknown>[];
export function staticLocationHtml(loc: Loc, data: LocData): string;
export function staticHubHtml(data: LocData): string;
