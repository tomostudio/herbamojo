import type { Metadata } from "next"

import PageLoadReveal from "@/components/atoms/page-load-reveal"
import ErrorView from "@/components/organisms/error-view"
import Layout from "@/components/templates/layout"
import type { FooterSettings, GeneralSettings } from "@/types"
import { fetchMetadata } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

/**
 * The root layout carries the title and description, but not the keywords,
 * image or Open Graph tags the original emits here too.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { settingAPI } = await fetchPageData<{ settingAPI: GeneralSettings }>()
  return fetchMetadata(null, settingAPI?.webTitle ?? "Herbamojo", "en", true)
}

export default async function NotFound() {
  const { settingAPI, footerAPI } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
  }>()

  return (
    <Layout
      mainId="ErrorPage"
      locale="en"
      footerData={{ settingAPI, footerAPI }}
      withoutPadding
      withoutMaxWidth
    >
      <PageLoadReveal parentId="ErrorPage" locale="en" scrollToTop />
      <ErrorView title="404" text={settingAPI.errorText.en} />
    </Layout>
  )
}
