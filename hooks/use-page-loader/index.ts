"use client"

import { useEffect, useRef } from "react"
import { DisableScroll, LoaderClass } from "@/utils/interactions"

type PostloadArgs = {
  /** Releases the scroll lock the loader holds while the page loads. */
  enableScroll: () => void
}

type UsePageLoaderOptions = {
  /** Id of the element whose <img> children the loader waits for. */
  parentId: string
  locale: "en" | "id"
  defaultDelay: number
  postload: (args: PostloadArgs) => void
}

/**
 * The original hides every page behind `#LoaderWrapper` until all of its images
 * have loaded, then runs a per-page postload. Reproducing that timing matters:
 * the home page's snap scrolling and popup reveal are both scheduled from it.
 */
export function usePageLoader({
  parentId,
  locale,
  defaultDelay,
  postload,
}: UsePageLoaderOptions) {
  const postloadRef = useRef(postload)
  postloadRef.current = postload

  useEffect(() => {
    document.body.classList.remove("loaded")
    document.documentElement.setAttribute("lang", locale)

    const disableScroll = new DisableScroll()
    const enableScroll = () => disableScroll.enable()

    // The loader finishes on an image load event or a timer, either of which
    // can land after a route change. Running postload then would set up the
    // page we just left — on the home page that means a scroll snap nothing
    // will ever tear down, leaving the next page unscrollable.
    let cancelled = false

    const loader = new LoaderClass({
      parent: `#${parentId}`,
      default_delay: defaultDelay,
      postload: () => {
        if (cancelled) return
        postloadRef.current({ enableScroll })
      },
    })
    loader.renderload()
    loader.mountload()

    return () => {
      cancelled = true
      if (loader.timeout.time) clearTimeout(loader.timeout.time)
      enableScroll()
      // Whatever the page left on the body goes with it.
      document.body.classList.remove("__snapon", "__snaphastouch", "menu_open")
    }
  }, [parentId, locale, defaultDelay])
}
