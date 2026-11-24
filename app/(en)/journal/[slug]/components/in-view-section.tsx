"use client"

import { type ReactNode, useEffect, useRef } from "react"

type InViewSectionProps = {
  id?: string
  className?: string
  children: ReactNode
}

const InViewSection = ({ id, className, children }: InViewSectionProps) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("inview")
      },
      { threshold: 0.3 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id={id} className={className} ref={ref}>
      {children}
    </section>
  )
}

export default InViewSection
