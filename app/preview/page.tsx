import Link from "next/link";

const options = [
  { href: "/", name: "Editorial (current home page)", text: "Warm paper, serif headlines and hairline rules, with a dot-field hero that reacts to the pointer and ink-fill service cards." },
  { href: "/preview/cinematic", name: "Cinematic dark 3D", text: "A live 3D network, pinned scroll scenes, huge type and sideways-scrolling case studies." },
  { href: "/preview/kinetic", name: "Bold kinetic type", text: "Giant moving headlines, rotating words, strong colour blocks and cards that grow to fill the screen." },
  { href: "/preview/video", name: "Video-led premium", text: "Full-screen imagery under strong type, parallax photo sections and large photographic case studies." },
  { href: "/preview/bento", name: "Live bento grid", text: "A grid of living tiles: code that types itself, a world map, a case study carousel, practices that flip open." },
  { href: "/preview/ask", name: "AI-first homepage", text: "One prompt: what are you trying to build? The page answers with the right practices, matching work and a next step." },
  { href: "/preview/story", name: "Scroll story", text: "One product built as you scroll: sketch, wireframe, interface, code, then a live system, each stage with its practice." },
  { href: "/preview/blueprint", name: "Engineering blueprint", text: "A made-by-engineers look: visible grid, technical drawings, a live status panel and a terminal you can type into." },
];

/** Index of the three design directions, for comparing them side by side. */
export default function PreviewIndex() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] px-6 py-20 text-white md:px-16">
      <p className="text-sm tracking-[0.2em] text-white/50 uppercase">Technicus · design directions</p>
      <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">Pick a direction</h1>
      <ul className="mt-16 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => (
          <li key={o.href} className="bg-[#0b0b0c]">
            <Link href={o.href} className="group block h-full p-8 transition-colors hover:bg-white hover:text-black">
              <span className="block text-2xl font-semibold">{o.name}</span>
              <span className="mt-3 block text-white/60 group-hover:text-black/60">{o.text}</span>
              <span className="mt-10 block text-sm">Open preview →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-white/40">
        The current site is unchanged at <Link href="/" className="underline">/</Link>.
      </p>
    </main>
  );
}
