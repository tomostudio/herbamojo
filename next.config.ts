import type { NextConfig } from "next"

/** What the original's Netlify _headers file applies to every response. */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
]

const nextConfig: NextConfig = {
  // The original Gatsby build emits trailing slashes on every page URL.
  trailingSlash: true,
  // Its "development" export points at raw TypeScript source, which
  // Turbopack's dev server otherwise refuses to load — taking the Studio,
  // and every route compiled after it, down with a 500.
  transpilePackages: ["@sanity/workbench"],
  experimental: {
    // There is a root layout per language (app/(en), app/(id)), so URLs that
    // match no route are rendered by app/global-not-found.tsx instead.
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // The original caches these for a year. Next already does that for
        // its own build output; these are the files served straight from
        // public/, which were being re-fetched on every visit.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async redirects() {
    // Page one of the journal lives at the bare path; the original redirects
    // the numbered form to it rather than serving or 404ing it.
    return [
      { source: "/journal/1", destination: "/journal", permanent: true },
      { source: "/id/journal/1", destination: "/id/journal", permanent: true },
    ]
  },
}

export default nextConfig
