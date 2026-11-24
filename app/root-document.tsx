import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

import Analytics, { AnalyticsNoScript } from "@/components/atoms/analytics"
import TOMOStudioHead from "@/components/atoms/tomo-head"
import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { SITE_URL } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

import Wrapper from "./wrapper"
import "@/styles/main.scss"
import "@/styles/tailwind.css"

/*
 * The document both root layouts render: app/(en)/layout.tsx for the English
 * site and app/(id)/layout.tsx for /id. They are separate root layouts so each
 * can serve its own <html lang> in the static HTML — one shared layout could
 * only learn the language from headers(), which makes every route dynamic.
 * The cost is that switching language is a full page load.
 */

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180]
const FAVICON_SIZES = [16, 32, 96]

// The original emits two viewport tags; this is the first one. The second,
// which the pages actually scroll by, is written out in <head> below.
export const ROOT_VIEWPORT: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#15C87F",
}

export async function rootMetadata(): Promise<Metadata> {
  const { settingAPI } = await fetchPageData<{ settingAPI: GeneralSettings }>()
  return {
    // Lets every page give Next relative URLs and have them resolved against
    // the live origin in og:image and friends.
    metadataBase: new URL(SITE_URL),
    title: settingAPI?.webTitle ?? "Herbamojo",
    description: settingAPI?.seo?.seo_description?.en,
    authors: [{ name: "Hendhy Hutomo | hendhyhutomo.com" }],
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        ...FAVICON_SIZES.map((size) => ({
          url: `/favicon-${size}x${size}.png`,
          sizes: `${size}x${size}`,
          type: "image/png",
        })),
        {
          url: "/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
      apple: [
        { url: "/apple-icon.png" },
        ...APPLE_ICON_SIZES.map((size) => ({
          url: `/apple-icon-${size}x${size}.png`,
          sizes: `${size}x${size}`,
        })),
      ],
    },
    other: {
      "msapplication-TileImage": "/ms-icon-144x144.png",
      "msapplication-TileColor": "#000000",
    },
  }
}

type RootDocumentProps = { locale: Locale; children: ReactNode }

export default async function RootDocument({
  locale,
  children,
}: RootDocumentProps) {
  const { settingAPI, footerAPI } = await fetchPageData<{
    settingAPI: GeneralSettings
    footerAPI: FooterSettings
  }>()
  const analytics = settingAPI?.analytics
  const webTitle = settingAPI?.webTitle ?? "Herbamojo"

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: webTitle,
        url: SITE_URL,
        logo: `${SITE_URL}/android-icon-512x512.png`,
        sameAs: footerAPI?.instagramLink
          ? [footerAPI.instagramLink]
          : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: webTitle,
        url: SITE_URL,
        description: settingAPI?.seo?.seo_description?.en,
        inLanguage: ["en", "id"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth" className="h-[initial]">
      <head>
        {/* These have no Metadata-API equivalent, so they are written out
            verbatim, in the order the original's html.js emits them. */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap-index.xml" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <TOMOStudioHead />
        <script
          type="application/ld+json"
          // `<` is escaped so CMS text cannot close the script tag early.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: serialised JSON-LD, escaped above
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <AnalyticsNoScript ids={analytics} />
        <Analytics ids={analytics} />
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  )
}
