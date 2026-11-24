import type { Metadata } from "next"

import AuthenticationView from "@/app/(en)/authentication"
import type { FooterSettings, GeneralSettings } from "@/types"
import { fetchMetadata, languageAlternates } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  // The original only swaps in the Indonesian description on the home page;
  // every other page keeps the English one.
  return fetchMetadata(null, "Autentikasi", "en", false, {
    alternates: languageAlternates("id", {
      en: "/authentication/",
      id: "/id/autentikasi/",
    }),
  })
}

export default async function AuthenticationPageId() {
  const { settingAPI, footerAPI } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
  }>()
  return (
    <AuthenticationView locale="id" settings={settingAPI} footer={footerAPI} />
  )
}
