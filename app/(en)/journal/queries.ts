import type { Locale } from "@/types"

/**
 * One journal document holds both languages (title.en, title.id, …). Its
 * showOn switches decide which sites it is on, so these pick that language's
 * half and flatten it back into the single-language shape the pages read.
 */
const SHOWN_ON = (language: Locale) =>
  `_type == "post" && showOn.${language} == true && defined(slug.${language}.current)`

/** Journals listed on a language's site: shown there, and active. */
export const IN_LANGUAGE = (language: Locale) =>
  `${SHOWN_ON(language)} && active == true`

export const JOURNAL_CARD_PROJECTION = (language: Locale) => `
  _id, thumbImage,
  "date": date.${language},
  "title": title.${language},
  "slug": slug.${language},
  "listColorBlack": coalesce(listColorBlack.${language}, false)`

export const JOURNAL_LIST_QUERY = (
  language: Locale,
  skip: number,
  limit: number,
) => `
{
  "items": *[${IN_LANGUAGE(language)}] | order(date.${language} desc, listOrder.${language} asc) [${skip}...${skip + limit}]{
    ${JOURNAL_CARD_PROJECTION(language)}
  },
  "total": count(*[${IN_LANGUAGE(language)}])
}`

const OTHER_LANGUAGE = { en: "id", id: "en" } as const

/**
 * `altSlug` is the same journal's slug in the other language, for the EN/ID
 * toggle — null when it is not shown there, so the toggle goes to that list.
 */
export const JOURNAL_DETAIL_QUERY = (language: Locale, slug: string) => ({
  query: `
*[${SHOWN_ON(language)} && slug.${language}.current == $slug][0]{
  _id, coverImage,
  "date": date.${language},
  "title": title.${language},
  "slug": slug.${language},
  "headerColorBlack": coalesce(headerColorBlack.${language}, false),
  "body": body.${language},
  "excerpt": excerpt.${language},
  "altSlug": select(showOn.${OTHER_LANGUAGE[language]} == true => slug.${OTHER_LANGUAGE[language]}.current),
  "related": coalesce(related[@->showOn.${language} == true && defined(@->slug.${language}.current)]->{ ${JOURNAL_CARD_PROJECTION(language)} }, [])
}`,
  params: { slug },
})

/**
 * A post's SEO in the shape fetchMetadata reads. Its title becomes the page
 * title ("{title} | HERBAMOJO"). A description written in the
 * SEO group wins, then the excerpt. It is filed under "en" because the
 * original falls back to the English site description on both languages.
 */
export const JOURNAL_SEO_QUERY = (language: Locale, slug: string) => ({
  query: `
*[${SHOWN_ON(language)} && slug.${language}.current == $slug][0]{
  "title": title.${language},
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
  | order(date.${language} desc, listOrder.${language} asc){ "slug": slug.${language}.current }`
