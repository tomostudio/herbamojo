import type { Metadata } from "next"

import JournalList from "@/app/(en)/journal"
import { getJournalListData } from "@/app/(en)/journal/utils"
import { fetchMetadata, languageAlternates } from "@/utils/fetchMetadata"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  // The original only swaps in the Indonesian description on the home page;
  // every other page keeps the English one.
  return fetchMetadata(null, "Jurnal", "en", false, {
    alternates: languageAlternates("id", {
      en: "/journal/",
      id: "/id/journal/",
    }),
  })
}

export default async function JournalPageId() {
  const { settingAPI, footerAPI, items, totalPages, altTotalPages } =
    await getJournalListData("id", 1)

  return (
    <JournalList
      locale="id"
      settings={settingAPI}
      footer={footerAPI}
      items={items}
      page={1}
      totalPages={totalPages}
      altTotalPages={altTotalPages}
    />
  )
}
