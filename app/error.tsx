"use client"

import { useEffect } from "react"

import PageLoadReveal from "@/components/atoms/page-load-reveal"
import ErrorView from "@/components/organisms/error-view"
import Layout from "@/components/templates/layout"

/**
 * Route-level error boundary. It borrows the 404 page's layout, but cannot
 * fetch the CMS the way that page does — an error boundary is a client
 * component, and the failure may well be the fetch itself — so the copy is
 * fixed and the footer is left off.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: an error boundary is the one place the failure should be reported
    console.error(error)
  }, [error])

  return (
    <Layout
      mainId="ErrorPage"
      locale="en"
      withoutFooter
      withoutPadding
      withoutMaxWidth
    >
      <PageLoadReveal parentId="ErrorPage" locale="en" scrollToTop />
      <ErrorView title="Oops" text="Something went wrong.">
        <button type="button" onClick={reset}>
          Try again
        </button>
      </ErrorView>
    </Layout>
  )
}
