"use client"

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { type ReactNode, useContext, useRef } from "react"

/**
 * Temporary workaround while motion and the App Router disagree: it holds on
 * to the router context the page mounted with, so a page that is animating
 * out keeps rendering itself instead of the route it is leaving for.
 */
const FrozenRoute = ({ children }: { children: ReactNode }) => {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context).current

  if (!frozen) return <>{children}</>

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export default FrozenRoute
