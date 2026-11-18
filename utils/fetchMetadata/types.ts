import type { SanityImage } from "@/types"

export type SeoDoc = {
  seo_description?: { en?: string; id?: string }
  seo_keywords?: string
  seo_image?: SanityImage
} | null

export type GeneralSettingsDoc = {
  webTitle?: string
  seo?: SeoDoc
} | null

export type FetchMetadataOptions = {
  /**
   * Fill each SEO field the page leaves empty from the general settings,
   * instead of using the general settings only when the page has no SEO
   * document at all. The journal posts work this way.
   */
  perFieldFallback?: boolean
}
