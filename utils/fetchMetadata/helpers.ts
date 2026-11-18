import type { SeoDoc } from "./types"

/**
 * The SEO a page ends up with. By default the general settings stand in only
 * when the page has no SEO at all; with `perFieldFallback` each field the
 * page leaves empty is filled from them on its own.
 */
export function resolveSeo(
  pageSeo: SeoDoc,
  generalSeo: SeoDoc,
  locale: "en" | "id",
  perFieldFallback: boolean,
): SeoDoc {
  if (!perFieldFallback) return pageSeo ?? generalSeo

  return {
    seo_description: {
      [locale]:
        pageSeo?.seo_description?.[locale] ||
        generalSeo?.seo_description?.[locale],
    },
    seo_keywords: pageSeo?.seo_keywords || generalSeo?.seo_keywords,
    seo_image: pageSeo?.seo_image?.asset
      ? pageSeo.seo_image
      : generalSeo?.seo_image,
  }
}
