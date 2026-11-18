// People: article authors and the leadership team.
//
// No individual is listed yet because none has been supplied. Articles are
// published under the editorial team until named experts take them over.
// To add a person, add an entry here; their author page and, if `leader` is
// true, their place on the Leadership page follow automatically.

export type Person = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  linkedin?: string;
  /** Path of a photo under /public, if there is one. */
  photo?: string;
  /** Shown on the Leadership page. */
  leader?: boolean;
  /** Pillar slugs this person is the named contact for. */
  expertFor?: string[];
};

export const people: Person[] = [
  {
    slug: "technicus-editorial",
    name: "Technicus Editorial",
    role: "Editorial team",
    bio: "Articles and guides written and reviewed by the strategy, design and engineering teams at Technicus.",
    expertise: ["Strategy", "Design", "Engineering", "AI and data", "Cloud and security"],
  },
];

export const getPerson = (slug: string) => people.find((p) => p.slug === slug);
export const leaders = () => people.filter((p) => p.leader);
export const expertFor = (pillarSlug: string) => people.find((p) => p.expertFor?.includes(pillarSlug));
