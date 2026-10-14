import { KNOWLEDGE, type KnowledgeDoc } from "./knowledge.js";

const STOP = new Set("a an the and or but if of to in on for with at by from is are was were be been am do does did can could should would will you your i me my we our it its this that these those there here what how when where which who whom why please just about any some than then so as not no yes tell give want need like get got have has had".split(" "));

/** Words people use that map onto our own wording. Applied to the question only. */
const SYNONYMS: Record<string, string[]> = {
  cost: ["price", "pricing"], costs: ["price", "pricing"], quote: ["price", "pricing"], charge: ["price", "pricing"], fee: ["price", "pricing"], fees: ["price", "pricing"], expensive: ["price"], cheap: ["price"],
  quick: ["days", "time"], quickly: ["days", "time"], soon: ["days", "time"], turnaround: ["days", "time"], urgent: ["days", "time"], weeks: ["days", "time"],
  rankings: ["seo", "ranking"], google: ["seo"], found: ["seo"], visible: ["seo"],
  human: ["contact", "person"], someone: ["contact", "person"], agent: ["contact", "person"], speak: ["contact", "person"], phone: ["contact"], ring: ["contact"], whatsapp: ["contact"],
  refund: ["payment"], deposit: ["payment"], pay: ["payment"], invoice: ["payment"], vat: ["payment"],
  hosting: ["addons", "host"], maintain: ["addons"], maintenance: ["addons"], update: ["addons"], updates: ["addons"],
  diy: ["compare", "builder"], myself: ["compare", "builder"], godaddy: ["compare"], wix: ["compare"], squarespace: ["compare"], wordpress: ["compare"],
  nationwide: ["areas", "uk"], anywhere: ["areas", "uk"], near: ["areas"], town: ["areas"],
};

export const tokenize = (s: string): string[] =>
  s.toLowerCase().replace(/one\.com/g, "onecom").replace(/[^a-z0-9£\s'-]/g, " ").split(/\s+/).map((w) => w.replace(/^'+|'+$/g, "")).filter((w) => w && !STOP.has(w));

const expand = (tokens: string[]) => tokens.flatMap((t) => [t, ...(SYNONYMS[t] ?? [])]);

export interface Scored { doc: KnowledgeDoc; score: number }

/**
 * Small BM25-style ranker over the knowledge base. A document's terms are its title, text and keywords; keyword
 * and title hits count extra because they are curated. Returns documents best first, dropping zero scores.
 */
export function retrieve(question: string, k = 3, docs: KnowledgeDoc[] = KNOWLEDGE): Scored[] {
  const q = expand(tokenize(question));
  if (!q.length) return [];
  const bag = docs.map((d) => {
    const terms = [...tokenize(d.title), ...tokenize(d.text), ...d.keywords.map((x) => x.toLowerCase().replace(/one\.com/g, "onecom"))];
    const tf = new Map<string, number>();
    for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
    const kw = new Set(d.keywords.map((x) => x.toLowerCase()));
    const title = new Set(tokenize(d.title));
    return { d, tf, len: terms.length, kw, title };
  });
  const avg = bag.reduce((n, b) => n + b.len, 0) / bag.length;
  const df = new Map<string, number>();
  for (const b of bag) for (const t of new Set(b.tf.keys())) df.set(t, (df.get(t) ?? 0) + 1);
  const N = bag.length;
  const k1 = 1.4, bb = 0.6;
  const scored = bag.map((b) => {
    let score = 0;
    for (const t of new Set(q)) {
      const f = b.tf.get(t) ?? 0;
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - bb + (bb * b.len) / avg)));
      if (b.kw.has(t)) score += idf * 0.8;
      if (b.title.has(t)) score += idf * 0.5;
    }
    return { doc: b.d, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}

export type Intent = "price" | "time" | "human" | "start" | "chitchat" | "other";

/** Cheap rules for the few questions where we answer straight from our data. Order matters. */
export function classify(question: string): Intent {
  const t = question.toLowerCase().trim();
  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening)|thanks|thank you|cheers|ok|okay)\b[\s!.?]*$/.test(t)) return "chitchat";
  if (/\b(speak|talk|chat) (to|with) (a |an |someone|somebody|human|person|real|team)|\b(real|actual) person\b|\bhuman\b|\bcall (me|you|us)\b|\bphone number\b/.test(t)) return "human";
  if (/\b(how much|price|prices|pricing|cost|costs|cheapest|quote|what do you charge|packages?)\b/.test(t) && !/\b(seo|hosting|logo|add-?ons?|domain)\b/.test(t)) return "price";
  if (/\b(how long|how quickly|how fast|turnaround|delivery time|how many days|deadline|urgent)\b/.test(t)) return "time";
  if (/\b(get started|start (a|my|the)? ?(project|site|website)|sign up|order|book(ing)? (a|my)|i('d| would) like (a|to)|ready to)\b/.test(t)) return "start";
  return "other";
}
