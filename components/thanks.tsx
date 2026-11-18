import { insightCards } from "@/components/lists";
import { Hero, PostCards, Section } from "@/components/ui";
import { getArticles } from "@/lib/cms";

export async function Thanks({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <Hero title={title} lead={lead} />
      <Section tone="grey" title="While you wait">
        <PostCards items={insightCards(await getArticles())} />
      </Section>
    </>
  );
}
