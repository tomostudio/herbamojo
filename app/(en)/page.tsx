import type { Metadata } from "next"

import Home from "@/app/(en)"
import type { FooterSettings, GeneralSettings } from "@/types"
import { fetchMetadata, languageAlternates } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

import { HOME_JOURNALS_QUERY, HOME_QUERY, HOME_SEO_QUERY } from "./queries"
import type { HomeDoc, JournalCard } from "./types"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return fetchMetadata(HOME_SEO_QUERY, "Herbamojo", "en", true, {
    alternates: languageAlternates("en", { en: "/", id: "/id/" }),
  })
}

export default async function HomePage() {
  const { settingAPI, footerAPI, home, journals } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
    home: HomeDoc
    journals: JournalCard[]
  }>({
    home: HOME_QUERY,
    journals: HOME_JOURNALS_QUERY("en"),
  })

  return (
    <Home
      locale="en"
      settings={settingAPI}
      footer={footerAPI}
      home={home}
      journals={journals}
    />
  )
}
