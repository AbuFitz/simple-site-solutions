/**
 * Team pages. Only things the people have told us about themselves; no invented history, awards or clients.
 * Add to `story` as each person supplies more.
 */
export interface Member {
  slug: string;
  name: string;
  role: string;
  /** What they do here (from the team list). */
  does: string;
  /** Short first-person-free profile paragraphs. */
  story: string[];
  /** Quick facts shown as a list. */
  facts: { label: string; value: string }[];
}

export const team: Member[] = [
  {
    slug: "farhan-m",
    name: "Farhan M",
    role: "Client Director",
    does: "Client relationships, briefs, communication and project coordination.",
    story: [
      "Farhan is the first person you deal with and the one who keeps a project moving. He turns what a business tells us into a clear brief, and keeps every step in plain English.",
    ],
    facts: [
      { label: "Role", value: "Client Director" },
      { label: "Looks after", value: "Briefs, communication, coordination" },
    ],
  },
  {
    slug: "matt-r",
    name: "Matt R",
    role: "Design Director",
    does: "Website design, interaction, visual systems and digital experience.",
    story: [
      "Matt leads how each site looks and moves. He builds the visual system behind a project so the whole site feels like one thing, from the first screen to the last button.",
    ],
    facts: [
      { label: "Role", value: "Design Director" },
      { label: "Looks after", value: "Design, interaction, visual systems" },
    ],
  },
  {
    slug: "abukar-s",
    name: "Abukar S",
    role: "Creative Director",
    does: "Creative direction, website strategy, design and overall experience.",
    story: [
      "Abukar was born in Yemen and is of Somali heritage. He came to the UK in 2008 and has built his work around a creative way of looking at things: start with the person using the site, then make it look right and work properly.",
      "As Creative Director he sets the direction for OneSimpleSite, shaping the strategy, the design and the overall experience of every project.",
    ],
    facts: [
      { label: "Role", value: "Creative Director" },
      { label: "Looks after", value: "Direction, strategy, design, experience" },
    ],
  },
];

export const getMember = (slug: string) => team.find((m) => m.slug === slug);
