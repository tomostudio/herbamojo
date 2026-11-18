import type { GeneralSettings, Locale } from "@/types"
import { fetchPageData } from "@/utils/fetchPageData"

import { JOURNAL_SLUGS_QUERY } from "../queries"

/**
 * Every post slug plus every list page number, since the [slug] segment
 * serves both. Page 1 lives at /journal, so numbering starts at 2.
 */
export async function getJournalStaticParams(locale: Locale) {
  const { settingAPI, slugs } = await fetchPageData<{
    settingAPI: GeneralSettings
    slugs: { slug: string }[]
  }>({ slugs: JOURNAL_SLUGS_QUERY(locale) })

  const perPage = settingAPI.journalPerList || 6
  const pageCount = Math.ceil(slugs.length / perPage)

  return [
    ...slugs.map(({ slug }) => ({ slug })),
    ...Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
      slug: String(i + 2),
    })),
  ]
}
