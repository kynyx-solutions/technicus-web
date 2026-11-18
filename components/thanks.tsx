import { insightCards } from "@/components/lists";
import { Hero, PostCards, Section } from "@/components/ui";

export function Thanks({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <Hero title={title} lead={lead} />
      <Section tone="grey" title="While you wait">
        <PostCards items={insightCards()} />
      </Section>
    </>
  );
}
