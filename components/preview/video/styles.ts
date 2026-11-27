// Class names for video.css. This repo's Turbopack rule treats every .css file
// as global (no CSS modules), so classes are prefixed with "vid-" instead and
// this proxy maps `s.hero` to "vid-hero".
export const s = new Proxy({} as Record<string, string>, {
  get: (_, key) => (typeof key === "string" ? `vid-${key}` : undefined),
});
