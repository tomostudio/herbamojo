import type { Metadata } from "next"

import Home from "@/app/(en)"
import {
  HOME_JOURNALS_QUERY,
  HOME_QUERY,
  HOME_SEO_QUERY,
} from "@/app/(en)/queries"
import type { HomeDoc, JournalCard } from "@/app/(en)/types"
import type { FooterSettings, GeneralSettings } from "@/types"
import { fetchMetadata, languageAlternates } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return fetchMetadata(HOME_SEO_QUERY, "Herbamojo", "id", true, {
    alternates: languageAlternates("id", { en: "/", id: "/id/" }),
  })
}

export default async function HomePageId() {
  const { settingAPI, footerAPI, home, journals } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
    home: HomeDoc
    journals: JournalCard[]
  }>({
    home: HOME_QUERY,
    journals: HOME_JOURNALS_QUERY("id"),
  })

  return (
    <Home
      locale="id"
      settings={settingAPI}
      footer={footerAPI}
      home={home}
      journals={journals}
    />
  )
}
