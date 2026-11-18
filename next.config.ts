import type { NextConfig } from "next";

// Old-site URLs that moved. The six local service URLs are not here: they stay
// live as pages (see app/[local]).
const moved: [from: string, to: string][] = [
  ["/about-us", "/about"],
  ["/our-work", "/work"],
  ["/career", "/careers"],
  ["/contact-us", "/contact"],
  ["/qoute-request", "/contact"],
  ["/terms-and-condition", "/terms"],
  ["/privacy-policy", "/privacy"],
  ["/refund-policy", "/refund"],
  ["/academy", "/india"],
];

const nextConfig: NextConfig = {
  // Cache Components (on in the default template) is left off: every page here
  // is static, and it requires the Node.js runtime, which would limit hosting
  // on Cloudflare Workers.
  // CV uploads on the careers form go through a server action (CVs up to 4 MB).
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  async redirects() {
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
