import { articleCopy } from "./articles";
import { capabilityCopyA } from "./capabilities-a";
import { capabilityCopyB } from "./capabilities-b";
import { industryCopy } from "./industries";
import { pillarCopy } from "./pillars";

const capabilityCopy = [...capabilityCopyA, ...capabilityCopyB];

export const getPillarCopy = (slug: string) => pillarCopy.find((p) => p.slug === slug);
export const getCapabilityCopy = (pillar: string, slug: string) =>
  capabilityCopy.find((c) => c.pillar === pillar && c.slug === slug);
export const getIndustryCopy = (slug: string) => industryCopy.find((i) => i.slug === slug);

export const articles = [...articleCopy].sort((a, b) => b.date.localeCompare(a.date));
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
