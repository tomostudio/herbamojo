import type { MetadataRoute } from "next"

import { SITE_URL } from "@/utils/fetchMetadata"

export default function robots(): MetadataRoute.Robots {
  // A staging or preview deploy must not be indexed: it would compete with
  // the real site for the same content.
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  }
}
