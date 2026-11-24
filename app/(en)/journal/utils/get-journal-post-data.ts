import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { fetchPageData } from "@/utils/fetchPageData"

import { JOURNAL_DETAIL_QUERY, JOURNAL_SLUGS_QUERY } from "../queries"
import type { JournalDetail } from "../types"

/**
 * A post and its neighbours in the list, or null when there is no such post.
 * Newest first, so the previous post is the newer one — which the original
 * labels "previous journal" — and the next is older.
 */
export async function getJournalPostData(locale: Locale, slug: string) {
  const { settingAPI, footerAPI, post, slugs } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
    post: JournalDetail | null
    slugs: { slug: string }[]
  }>({
    post: JOURNAL_DETAIL_QUERY(locale, slug),
    slugs: JOURNAL_SLUGS_QUERY(locale),
  })

  if (!post) return null

  const index = slugs.findIndex((entry) => entry.slug === slug)
  const prevSlug = index > 0 ? slugs[index - 1].slug : null
  const nextSlug =
    index >= 0 && index < slugs.length - 1 ? slugs[index + 1].slug : null

  return { settingAPI, footerAPI, post, prevSlug, nextSlug }
}
