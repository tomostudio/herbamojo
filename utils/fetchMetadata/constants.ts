export const SETTINGS_QUERY = `*[_type == "generalSettings"][0]{ webTitle, seo }`

/**
 * Drives the sitemap, robots, metadataBase and og:url. It has to follow the
 * domain the site is actually served from — a staging deploy that advertises
 * the production URLs points crawlers at a different site.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://herbamojo.id"
).replace(/\/$/, "")
