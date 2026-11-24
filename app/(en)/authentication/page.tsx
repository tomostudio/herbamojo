import type { Metadata } from "next"

import AuthenticationView from "@/app/(en)/authentication"
import type { FooterSettings, GeneralSettings } from "@/types"
import { fetchMetadata, languageAlternates } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return fetchMetadata(null, "Authentication", "en", false, {
    alternates: languageAlternates("en", {
      en: "/authentication/",
      id: "/id/autentikasi/",
    }),
  })
}

export default async function AuthenticationPage() {
  const { settingAPI, footerAPI } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
  }>()
  return (
    <AuthenticationView locale="en" settings={settingAPI} footer={footerAPI} />
  )
}
