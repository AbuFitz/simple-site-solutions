/**
 * Case-study content. Only what we can stand behind: what the site is for, and what we built.
 * No outcomes, traffic, enquiry or revenue figures are published for any project.
 */
import { shots } from "@/assets/redesign";

export interface CaseTheme {
  bg: string; // header plate
  fg: string; // header title
  meta: string; // header facts
  briefBg: string;
  briefFg: string;
  accent: string;
  phonesBg: string;
  phonesFg: string;
  fullBg: string;
  nextBg: string;
  nextFg: string;
}

export interface CaseStudy {
  theme: CaseTheme;
  hero: { src: string; alt: string };
  phone: { src: string; alt: string };
  brief?: { lead: string; accent: string; body: string };
  phones?: { images: { src: string; alt: string }[]; title: string };
  full?: { src: string; alt: string; label: string; caption: string };
  duo?: { images: { src: string; alt: string }[]; title: string; text: string };
  builtDetail?: { title: string; text: string }[];
  palette?: { colors: string[]; note: string };
  /** Image and size used in the "next project" band. */
  nextShot?: { src: string; alt: string };
}

const ORANGE = "#E84A0C";
const NAVY = "#141B29";
const CREAM = "#F5F3EF";
const INK = "#0E1311";
const BONE = "#EFEBE3";

export const caseStudies: Record<string, CaseStudy> = {
  "true-to-detail": {
    theme: { bg: ORANGE, fg: "#FFF3EA", meta: INK, briefBg: INK, briefFg: BONE, accent: ORANGE, phonesBg: ORANGE, phonesFg: INK, fullBg: INK, nextBg: ORANGE, nextFg: "#FFF3EA" },
    hero: { src: shots.ttdHero, alt: "True To Detail website, home page" },
    phone: { src: shots.ttdMHero, alt: "True To Detail website on a phone" },
    brief: {
      lead: "Mobile detailing delivered to your driveway. ",
      accent: "No drop-off. No waiting.",
      body: "The promise on the site is the brief. We designed for someone on a phone who wants to compare packages and book without a phone call: dark, loud and simple, with big type, one orange action and a clear ladder of packages.",
    },
    phones: {
      images: [
        { src: shots.ttdMHero, alt: "True To Detail home page on a phone" },
        { src: shots.ttdM2, alt: "True To Detail package picker on a phone" },
        { src: shots.ttdM3, alt: "True To Detail package details on a phone" },
      ],
      title: "Built for the phone in your hand.",
    },
    full: { src: shots.ttdPacks, alt: "True To Detail packages page on desktop", label: "Packages.", caption: "A four-step ladder with one highlighted, so the choice is easy to see." },
    duo: {
      images: [
        { src: shots.ttdWhy, alt: "True To Detail, why choose them" },
        { src: shots.ttdFaq, alt: "True To Detail, questions answered" },
      ],
      title: "Answers before the call.",
      text: "Why choose them, and the questions people ask before they enquire, sit on the page instead of behind a phone number.",
    },
    builtDetail: [
      { title: "Service pages", text: "Wash, interior, exterior and full detail, each with its own page." },
      { title: "Area pages", text: "Local pages so customers searching nearby can find the business." },
      { title: "Quote and booking", text: "Dedicated routes for requesting a quote and booking." },
      { title: "Customer system", text: "A link into a separate customer and job system." },
    ],
    palette: { colors: ["#0C0C0C", ORANGE, "#FFFFFF"], note: "Palette read from the live site on 15 October 2026" },
    nextShot: { src: shots.ttdHero, alt: "True To Detail website, home page" },
  },
  "brightlearn-tutoring": {
    theme: { bg: CREAM, fg: NAVY, meta: NAVY, briefBg: NAVY, briefFg: CREAM, accent: "#6C9DFF", phonesBg: "#2A74F4", phonesFg: "#FFFFFF", fullBg: NAVY, nextBg: BONE, nextFg: INK },
    hero: { src: shots.blHero, alt: "BrightLearn Tutoring website, home page" },
    phone: { src: shots.blM1, alt: "BrightLearn Tutoring programmes on a phone" },
    brief: {
      lead: "Maths that finally feels ",
      accent: "simple.",
      body: "That is the line on the site's home page, and it is the brief. A calm, structured site for parents choosing an online maths tutor: what is taught, how lessons work, what they cost and how to enquire, in plain language.",
    },
    phones: {
      images: [
        { src: shots.blMHero, alt: "BrightLearn Tutoring home page on a phone" },
        { src: shots.blM1, alt: "BrightLearn Tutoring programmes on a phone" },
      ],
      title: "Calm on a small screen.",
    },
    full: { src: shots.blProg, alt: "BrightLearn Tutoring programmes on desktop", label: "Programmes.", caption: "Each programme laid out side by side, so parents can compare what is taught and what it costs." },
    builtDetail: [
      { title: "Programme and pricing pages", text: "Each programme and its prices in one place." },
      { title: "Guides, topic pages and a blog", text: "Plain-language material for parents." },
      { title: "Short teaching clips", text: "Clips from TikTok and YouTube shown on the site." },
      { title: "Safeguarding and legal pages", text: "The policies a parent expects to find." },
    ],
    nextShot: { src: shots.blHero, alt: "BrightLearn Tutoring website, home page" },
  },
};
