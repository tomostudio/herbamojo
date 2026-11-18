import { sitemapPaths, sitemapUrls } from "../sitemap-urls"

export const revalidate = 60

const NS = [
  'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"',
  'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
  'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"',
].join(" ")

/** The url set, with the changefreq and priority the original emits. */
export async function GET() {
  const entries = sitemapUrls(await sitemapPaths())
    .map(
      (url) =>
        `<url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`,
    )
    .join("")

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset ${NS}>${entries}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  )
}
