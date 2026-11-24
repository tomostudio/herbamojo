import type { Metadata } from "next"

import { sanityFetch } from "@/sanity/lib/fetch"
import { urlForImage } from "@/sanity/lib/image"
import type { OptionalQueryEntry } from "@/utils/queryEntry"

import { SETTINGS_QUERY, SITE_URL } from "./constants"
import { resolveSeo } from "./helpers"
import type { FetchMetadataOptions, GeneralSettingsDoc, SeoDoc } from "./types"

export { SITE_URL } from "./constants"

export async function fetchMetadata(
  query: OptionalQueryEntry,
  fallbackTitle: string,
  locale: "en" | "id" = "en",
  isHome = false,
  { perFieldFallback = false }: FetchMetadataOptions = {},
): Promise<Metadata> {
  const [settings, pageSeo] = await Promise.all([
    sanityFetch<GeneralSettingsDoc>(SETTINGS_QUERY),
    query ? sanityFetch<SeoDoc>(query) : Promise.resolve(null),
  ])

  const seo = resolveSeo(
    pageSeo,
    settings?.seo ?? null,
    locale,
    perFieldFallback,
  )
  const webTitle = settings?.webTitle ?? fallbackTitle

  const pageTitle = pageSeo?.title || fallbackTitle
  const title = isHome ? webTitle : `${pageTitle} | ${webTitle}`
  const description = seo?.seo_description?.[locale] ?? undefined
  const keywords = seo?.seo_keywords ?? undefined
  const imageUrl = seo?.seo_image?.asset
    ? urlForImage(seo.seo_image).url()
    : undefined

  return {
    title,
    description,
    keywords,
    // The original also emits a plain <meta name="image">.
    other: imageUrl ? { image: imageUrl } : undefined,
    openGraph: {
      // The original hardcodes the site root here on every page.
      url: SITE_URL,
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}
