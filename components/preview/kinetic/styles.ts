// Class names for kinetic.css. Every class there is prefixed "kin-", so
// s.heroTitle is "kin-heroTitle". (CSS modules are not available: the repo's
// Tailwind loader turns *.module.css into global CSS.)
export const s = new Proxy({} as Record<string, string>, { get: (_, k) => `kin-${String(k)}` });
