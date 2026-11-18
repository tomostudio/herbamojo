"use client"

import { usePageLoader } from "@/hooks"

type PageLoadRevealProps = {
  parentId: string
  locale: "en" | "id"
  /** The journal templates use 250ms; the home page overrides this to 500. */
  defaultDelay?: number
  /** The journal detail page scrolls back to the top once loaded. */
  scrollToTop?: boolean
}

/**
 * Drops the loading overlay once the page's images are in. Pages with no work
 * to schedule off the load use this instead of calling the hook themselves.
 */
const PageLoadReveal = ({
  parentId,
  locale,
  defaultDelay = 250,
  scrollToTop = false,
}: PageLoadRevealProps) => {
  usePageLoader({
    parentId,
    locale,
    defaultDelay,
    postload: ({ enableScroll }) => {
      if (scrollToTop) window.scroll(0, 0)
      document.body.classList.add("loaded")
      enableScroll()
    },
  })

  return null
}

export default PageLoadReveal
