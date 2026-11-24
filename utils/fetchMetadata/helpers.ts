import type { Metadata } from "next"

import type { Locale } from "@/types"

import type { LanguagePaths, SeoDoc } from "./types"

/**
 * A page's canonical URL and, when it exists on both sites, the hreflang
 * links pairing them — English doubling as x-default. Paths are resolved
 * against metadataBase, and end in a slash as every page URL does.
 */
export function languageAlternates(
  locale: Locale,
  paths: LanguagePaths,
): Metadata["alternates"] {
  return {
    canonical: paths[locale],
    languages:
      paths.en && paths.id
        ? { en: paths.en, id: paths.id, "x-default": paths.en }
        : undefined,
  }
}

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
