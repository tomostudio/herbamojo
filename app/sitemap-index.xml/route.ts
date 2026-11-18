import { SITE_URL } from "@/utils/fetchMetadata"

export const revalidate = 60

/**
 * The original's sitemap entry point, kept at its original path so anything
 * already pointing here — a search console submission, a crawler's stored
 * state — does not start 404ing after the rebuild.
 */
export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap-0.xml</loc></sitemap></sitemapindex>`

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  })
}
