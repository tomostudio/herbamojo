import { IN_LANGUAGE, JOURNAL_CARD_PROJECTION } from "@/app/journal/queries"
import type { Locale } from "@/types"

/** The lists default to empty so a home document without them renders. */
export const HOME_QUERY = `*[_type == "home"][0]{
  ...,
  "ingredients": ingredients{ ..., "items": coalesce(items, []) },
  "shop": shop{
    ...,
    "onlineShop": coalesce(onlineShop, []),
    "offlineShop": coalesce(offlineShop, []),
    "stockist": coalesce(stockist, [])
  }
}`

/** Metadata only needs the seo object, and must be null when unset so
 * fetchMetadata can fall back to the general settings. */
export const HOME_SEO_QUERY = `*[_type == "home"][0].seo`

export const HOME_JOURNALS_QUERY = (language: Locale) => `
*[${IN_LANGUAGE(language)}] | order(date desc) [0...4]{
  ${JOURNAL_CARD_PROJECTION(language)}
}`
