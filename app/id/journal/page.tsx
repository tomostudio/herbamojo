import type { Metadata } from "next"

import JournalList from "@/app/journal"
import { getJournalListData } from "@/app/journal/utils"
import { fetchMetadata } from "@/utils/fetchMetadata"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  // The original only swaps in the Indonesian description on the home page;
  // every other page keeps the English one.
  return fetchMetadata(null, "Jurnal", "en")
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
