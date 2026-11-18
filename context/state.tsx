"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

type AppContextValue = {
  historyPath: string[]
}

const AppContext = createContext<AppContextValue | null>(null)

export const ContextWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const [historyPath, setHistoryPath] = useState<string[]>([pathname])
  const lastPathname = useRef(pathname)

  useEffect(() => {
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname
    setHistoryPath((prev) => [...prev, pathname])
  }, [pathname])

  return (
    <AppContext.Provider value={{ historyPath }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within a ContextWrapper")
  }
  return context
}
