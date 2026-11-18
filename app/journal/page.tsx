import type { Metadata } from "next"

import JournalList from "@/app/journal"
import { fetchMetadata } from "@/utils/fetchMetadata"

import { getJournalListData } from "./utils"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return fetchMetadata(null, "Journal", "en")
}

export default async function JournalPage() {
  const { settingAPI, footerAPI, items, totalPages, altTotalPages } =
    await getJournalListData("en", 1)

  return (
    <JournalList
      locale="en"
      settings={settingAPI}
      footer={footerAPI}
      items={items}
      page={1}
      totalPages={totalPages}
      altTotalPages={altTotalPages}
    />
  )
}
