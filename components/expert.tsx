import Link from "next/link";
import { expertFor } from "@/content/people";

/**
 * The named contact for a pillar. Until a real person is assigned in
 * content/people.ts, this shows a plain invitation to talk to the team.
 */
export function ExpertContact({ pillarSlug, pillarName }: { pillarSlug: string; pillarName: string }) {
  const person = expertFor(pillarSlug);
  return (
    <div className="flex flex-col gap-8 border border-line bg-sky p-8 text-ink md:flex-row md:items-center md:justify-between md:p-10" data-reveal>
      <div>
        <p className="label mb-3 text-blue">{person ? person.role : pillarName}</p>
        <p className="h3">{person ? `Talk to ${person.name}` : `Talk to our ${pillarName.toLowerCase()} team`}</p>
        <p className="mt-3 max-w-xl text-muted">
          {person ? person.bio : "Tell us what you are trying to do. You will hear from someone who does this work, not from a sales desk."}
        </p>
      </div>
      <Link href="/contact" className="btn-dark shrink-0">
        Start a conversation
      </Link>
    </div>
  );
}
