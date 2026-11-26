import { Art, type ArtKind } from "@/components/art";

type Props = {
  /** Kept for older call sites; the panel no longer renders 3D. */
  targets?: unknown;
  /** The picture to show. */
  fallback: ArtKind;
  label?: string;
  className?: string;
};

/**
 * A navy picture panel with a system diagram. It replaced the 3D panels when
 * the site moved to a corporate look; pages still pass the same props.
 */
export function SceneBox({ fallback }: Props) {
  return (
    <div aria-hidden className="grid-pattern-dark relative flex h-full min-h-[260px] w-full items-center justify-center overflow-hidden rounded-xl bg-navy p-6 md:min-h-[340px]">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue/30 blur-3xl" />
      <Art kind={fallback} tone="dark" className="relative h-full max-h-[360px] w-full" />
    </div>
  );
}
