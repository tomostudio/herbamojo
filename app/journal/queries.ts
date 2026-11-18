const JOURNAL_CARD_PROJECTION = `_id, title, date, slug, listColorBlack, thumbImage`

export const JOURNAL_LIST_QUERY = (
  language: "en" | "id",
  skip: number,
  limit: number,
) => `
{
  "items": *[_type == "post" && language == "${language}" && active == true] | order(date desc, listOrder asc) [${skip}...${skip + limit}]{
    ${JOURNAL_CARD_PROJECTION}
  },
  "total": count(*[_type == "post" && language == "${language}" && active == true])
}`

export const JOURNAL_DETAIL_QUERY = (language: "en" | "id", slug: string) => `
*[_type == "post" && language == "${language}" && slug.current == "${slug}"][0]{
  _id, title, date, slug, headerColorBlack, coverImage, body, excerpt, altSlug,
  "related": related[]->{ ${JOURNAL_CARD_PROJECTION} }
}`

/**
 * A post's SEO in the shape fetchMetadata reads. A description written in the
 * SEO group wins, then the excerpt. It is filed under "en" because the
 * original falls back to the English site description on both languages.
 */
export const JOURNAL_SEO_QUERY = (language: "en" | "id", slug: string) => `
*[_type == "post" && language == "${language}" && slug.current == "${slug}"][0]{
  "seo_description": { "en": coalesce(seo.seo_description.${language}, excerpt) },
  "seo_keywords": seo.seo_keywords,
  "seo_image": seo.seo_image
}`

/**
 * The neighbour links go by position in the list, not by date: two posts can
 * share a date, and comparing dates skips straight past them. Ordered newest
 * first, so the post before this one is the newer one — which the original
 * labels "previous journal" — and the one after is older. `listOrder` breaks
 * ties, since the order two same-day posts appear in does not follow from
 * their content.
 */
export const JOURNAL_SLUGS_QUERY = (language: "en" | "id") => `
*[_type == "post" && language == "${language}" && active == true]
  | order(date desc, listOrder asc){ "slug": slug.current }`
