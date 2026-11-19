import type { Locale } from "@/types"

/**
 * One journal document holds both languages side by side (title.en,
 * title.id, …). A journal is on a language's site once it has a slug in that
 * language, so these pick that language's half and flatten it back into the
 * single-language shape the pages read.
 */
const IN_LANGUAGE = (language: Locale) =>
  `_type == "post" && active == true && defined(slug.${language}.current)`

export const JOURNAL_CARD_PROJECTION = (language: Locale) => `
  _id, date, thumbImage,
  "title": title.${language},
  "slug": slug.${language},
  "listColorBlack": coalesce(listColorBlack.${language}, false)`

export const JOURNAL_LIST_QUERY = (
  language: Locale,
  skip: number,
  limit: number,
) => `
{
  "items": *[${IN_LANGUAGE(language)}] | order(date desc, listOrder asc) [${skip}...${skip + limit}]{
    ${JOURNAL_CARD_PROJECTION(language)}
  },
  "total": count(*[${IN_LANGUAGE(language)}])
}`

/** `altSlug` is the same journal's slug in the other language, for the EN/ID toggle. */
export const JOURNAL_DETAIL_QUERY = (language: Locale, slug: string) => ({
  query: `
*[_type == "post" && slug.${language}.current == $slug][0]{
  _id, date, coverImage,
  "title": title.${language},
  "slug": slug.${language},
  "headerColorBlack": coalesce(headerColorBlack.${language}, false),
  "body": body.${language},
  "excerpt": excerpt.${language},
  "altSlug": slug.${language === "id" ? "en" : "id"}.current,
  "related": coalesce(related[defined(@->slug.${language}.current)]->{ ${JOURNAL_CARD_PROJECTION(language)} }, [])
}`,
  params: { slug },
})

/**
 * A post's SEO in the shape fetchMetadata reads. A description written in the
 * SEO group wins, then the excerpt. It is filed under "en" because the
 * original falls back to the English site description on both languages.
 */
export const JOURNAL_SEO_QUERY = (language: Locale, slug: string) => ({
  query: `
*[_type == "post" && slug.${language}.current == $slug][0]{
  "seo_description": { "en": coalesce(seo.seo_description.${language}, excerpt.${language}) },
  "seo_keywords": seo.seo_keywords.${language},
  "seo_image": seo.seo_image
}`,
  params: { slug },
})

/**
 * The neighbour links go by position in the list, not by date: two posts can
 * share a date, and comparing dates skips straight past them. Ordered newest
 * first, so the post before this one is the newer one — which the original
 * labels "previous journal" — and the one after is older. `listOrder` breaks
 * ties, since the order two same-day posts appear in does not follow from
 * their content.
 */
export const JOURNAL_SLUGS_QUERY = (language: Locale) => `
*[${IN_LANGUAGE(language)}]
  | order(date desc, listOrder asc){ "slug": slug.${language}.current }`
