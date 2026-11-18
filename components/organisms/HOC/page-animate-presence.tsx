"use client"

import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import FrozenRoute from "./frozen-route"

/**
 * Temporary workaround while motion and the App Router disagree: fades the
 * outgoing page out before the next one mounts. The first page load is left
 * alone, since #LoaderWrapper already covers it.
 */
const PageAnimatePresence = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      // The outgoing page keeps its scroll position while it fades.
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  )
}

export default PageAnimatePresence
