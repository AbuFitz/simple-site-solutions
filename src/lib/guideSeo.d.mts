export interface Guide {
  slug: string; short: string; title: string; metaDescription: string; h1: string; dek: string;
  sections: { h: string; p: string[] }[]; checklist: string[]; faq: { q: string; a: string }[]; related: string[];
}
export interface GuideData { published: string; disclaimer: string; guides: Guide[] }
export const GUIDES_PATH: string;
export const guidePath: (slug: string) => string;
export const guidesHubTitle: string;
export const guidesHubDescription: string;
export function guideJsonLd(g: Guide, data: GuideData, siteUrl: string): Record<string, unknown>[];
export function guidesHubJsonLd(data: GuideData, siteUrl: string): Record<string, unknown>[];
export function staticGuideHtml(g: Guide, data: GuideData): string;
export function staticGuidesHubHtml(data: GuideData): string;
