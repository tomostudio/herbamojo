"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { Suspense, useEffect } from "react"

import PageAnimatePresence from "@/components/organisms/HOC/page-animate-presence"
import PageLoader from "@/components/organisms/page-loader"
import { ContextWrapper } from "@/context/state"

const EXCLUDED_PREFIXES = ["/admin"]

const Wrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  useEffect(() => {
    if (!("ontouchstart" in document.documentElement)) {
      document.body.classList.add("onhover")
    }
  }, [])

  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return <>{children}</>
  }

  return (
    <ContextWrapper>
      <div id="MainLayout">
        {/* There is no site-wide header: each page brings its own, since
            they differ per page. The loading overlay takes its place here,
            outside the transition, so it never remounts between routes. */}
        <PageLoader />
        <Suspense fallback={null}>
          <PageAnimatePresence>{children}</PageAnimatePresence>
        </Suspense>
      </div>
    </ContextWrapper>
  )
}

export default Wrapper
