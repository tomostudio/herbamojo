import type { Metadata, Viewport } from "next"
import Script from "next/script"

import Analytics, { AnalyticsNoScript } from "@/components/atoms/analytics"
import TOMOStudioHead from "@/components/atoms/tomo-head"
import type { FooterSettings, GeneralSettings } from "@/types"
import { SITE_URL } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

import Wrapper from "./wrapper"
import "@/styles/main.scss"
import "@/styles/tailwind.css"

// Sets the correct html[lang] before first paint, without making every route
// dynamic the way reading the pathname from headers() in this shared layout
// would (that would break static generation/ISR for the whole site).
const SET_LANG_SCRIPT = `document.documentElement.lang=/^\\/id(\\/|$)/.test(location.pathname)?"id":"en"`

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180]
const FAVICON_SIZES = [16, 32, 96]

// The original emits two viewport tags; this is the first one. The second,
// which the pages actually scroll by, is written out in <head> below.
export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#15C87F",
}

export async function generateMetadata(): Promise<Metadata> {
  const { settingAPI } = await fetchPageData<{ settingAPI: GeneralSettings }>()
  return {
    // Lets every page give Next relative URLs and have them resolved against
    // the live origin in og:image and friends.
    metadataBase: new URL(SITE_URL),
    title: settingAPI?.webTitle ?? "Herbamojo",
    description: settingAPI?.seo?.seo_description?.en,
    authors: [{ name: "Hendhy Hutomo | hendhyhutomo.com" }],
    manifest: "/manifest.json",
    alternates: {
      languages: { en: "/", id: "/id" },
    },
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-[initial]"
      // SET_LANG_SCRIPT corrects `lang` before React hydrates, so on /id the
      // attribute differs from the server HTML on purpose.
      suppressHydrationWarning
    >
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
        <Script id="set-lang" strategy="beforeInteractive">
          {SET_LANG_SCRIPT}
        </Script>
        <Analytics ids={analytics} />
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  )
}
