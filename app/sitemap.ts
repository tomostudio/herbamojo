import type { MetadataRoute } from "next"

import { sitemapPaths, sitemapUrls } from "./sitemap-urls"

export const revalidate = 60

/**
 * Next's own sitemap route. The original's paths are served alongside it by
 * sitemap-index.xml and sitemap-0.xml, so links pointing at either still work.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapUrls(await sitemapPaths()).map((url) => ({
    url,
    changeFrequency: "daily",
    priority: 0.7,
  }))
}
