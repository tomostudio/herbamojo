import type { Metadata } from "next"

import type { Locale } from "@/types"
import { languageAlternates } from "@/utils/fetchMetadata"

import { getJournalListData } from "./get-journal-list-data"
import { getJournalPostData } from "./get-journal-post-data"
import { isListPage } from "./is-list-page"

const JOURNAL_PATH = { en: "/journal", id: "/id/journal" } as const

/**
 * Canonical and hreflang links for a /journal/[slug] page. A numbered list
 * page pairs with the same page number on the other site when it has that
 * many; a post pairs with its translation when it is shown there.
 */
export async function getJournalAlternates(
  locale: Locale,
  slug: string,
): Promise<Metadata["alternates"]> {
  const other: Locale = locale === "en" ? "id" : "en"
  let otherSlug: string | null | undefined

  if (isListPage(slug)) {
    const { altTotalPages } = await getJournalListData(locale, Number(slug))
    otherSlug = Number(slug) <= altTotalPages ? slug : null
  } else {
    const data = await getJournalPostData(locale, slug)
    if (!data) return undefined
    otherSlug = data.post.altSlug
  }

  return languageAlternates(locale, {
    [locale]: `${JOURNAL_PATH[locale]}/${slug}/`,
    [other]: otherSlug ? `${JOURNAL_PATH[other]}/${otherSlug}/` : undefined,
  })
}
