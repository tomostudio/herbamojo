import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { fetchPageData } from "@/utils/fetchPageData"

import { JOURNAL_LIST_QUERY } from "../queries"
import type { JournalListItem } from "../types"

/** Shared by /journal (page 1) and /journal/[n], which the original paginates by path. */
export async function getJournalListData(locale: Locale, page: number) {
  const { settingAPI, footerAPI } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
  }>()

  const perPage = settingAPI.journalPerList || 6
  const otherLocale: Locale = locale === "id" ? "en" : "id"
  const { journalData, altData } = await fetchPageData<{
    journalData: { items: JournalListItem[]; total: number }
    altData: { items: JournalListItem[]; total: number }
  }>({
    journalData: JOURNAL_LIST_QUERY(locale, (page - 1) * perPage, perPage),
    altData: JOURNAL_LIST_QUERY(otherLocale, 0, 1),
  })

  return {
    settingAPI,
    footerAPI,
    items: journalData.items,
    totalPages: Math.max(1, Math.ceil(journalData.total / perPage)),
    altTotalPages: Math.max(1, Math.ceil(altData.total / perPage)),
  }
}
