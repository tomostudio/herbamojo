import Script from "next/script"

import type { GeneralSettings } from "@/types"

type AnalyticsIds = NonNullable<GeneralSettings["analytics"]>

/** The data layer is seeded with this before Tag Manager loads, as originally. */
const gtmDataLayer = `window.dataLayer=window.dataLayer||[];window.dataLayer.push({platform:'gatsby'})`

const gtmSnippet = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}')`

// send_page_view is off because Tag Manager reports the page views.
const gtagSnippet = (id: string) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{"send_page_view":false})`

const fbSnippet = (id: string) =>
  `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView')`

/** Held to production, as Tag Manager was in the original config. */
const enabled = () => process.env.NODE_ENV === "production"

/**
 * The trackers the original loads. Their ids live in the CMS, so they can be
 * changed or switched off without a deploy — an empty field drops that
 * tracker.
 */
const Analytics = ({ ids }: { ids?: AnalyticsIds }) => {
  if (!enabled() || !ids) return null

  return (
    <>
      {ids.gtmId && (
        <>
          <Script id="gtm-datalayer" strategy="afterInteractive">
            {gtmDataLayer}
          </Script>
          <Script id="gtm" strategy="afterInteractive">
            {gtmSnippet(ids.gtmId)}
          </Script>
        </>
      )}
      {ids.gtagId && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ids.gtagId}`}
          />
          <Script id="gtag" strategy="afterInteractive">
            {gtagSnippet(ids.gtagId)}
          </Script>
        </>
      )}
      {ids.facebookPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {fbSnippet(ids.facebookPixelId)}
        </Script>
      )}
    </>
  )
}

/** Tag Manager's no-JS fallback, which belongs immediately inside <body>. */
export const AnalyticsNoScript = ({ ids }: { ids?: AnalyticsIds }) => {
  if (!enabled() || !ids?.gtmId) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${ids.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        aria-hidden="true"
        title="Google Tag Manager"
      />
    </noscript>
  )
}

export default Analytics
