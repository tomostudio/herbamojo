"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { HerbamojoLogo } from "@/components/atoms/symbols"
import { cn } from "@/utils/cn"
import { MediaCheck } from "@/utils/interactions"

type PageHeaderProps = {
  locale: "en" | "id"
  urlTargetEn: string
  urlTargetId: string
  headerTitle?: { en: string; id: string }
  journal?: boolean
  black?: boolean
  hideTitle?: boolean
  alwaysTransparent?: boolean
  journalBackText?: { en: string; id: string }
  className?: string
  wrapperClassName?: string
  logoClassName?: string
}

const PageHeader = ({
  locale,
  urlTargetEn,
  urlTargetId,
  headerTitle,
  journal = false,
  black = false,
  hideTitle = false,
  alwaysTransparent = false,
  journalBackText,
  className,
  wrapperClassName,
  logoClassName,
}: PageHeaderProps) => {
  const isId = locale === "id"
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const scrollEvent = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop
      setStuck(scrollPos > (MediaCheck.width.mobile() ? 80 : 100))
    }
    window.addEventListener("scroll", scrollEvent, false)
    return () => window.removeEventListener("scroll", scrollEvent, false)
  }, [])

  // Past the threshold a journal post's header turns into a green bar; the
  // list pages only do that on narrow screens, and never when transparent.
  const greenBar = journal && stuck
  const greenBarMobile = !journal && !alwaysTransparent && stuck

  const languageClass = (disabled: boolean) =>
    cn(
      "pointer-events-auto inline-block transition-colors first:mr-[10px] max-mobile:text-[16px] max-mobile:leading-[14px] max-mobile:first:mr-[5px]",
      disabled
        ? cn(
            "pointer-events-none",
            greenBar ? "text-black" : "text-green",
            greenBarMobile && "max-mtablet:text-black",
          )
        : cn(
            "hover:cursor-pointer",
            greenBar
              ? "text-white hover:text-black"
              : cn(black ? "text-black" : "text-white", "hover:text-green"),
            greenBarMobile &&
              "max-mtablet:text-white max-mtablet:hover:text-black",
          ),
    )

  return (
    <div
      id="PageHeader"
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-10 w-full bg-transparent px-10 transition-[background] max-mtablet:px-5",
        greenBar && "bg-green",
        greenBarMobile && "max-mtablet:bg-green",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none mx-auto grid min-h-full w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center justify-stretch gap-0 max-mtablet:grid-cols-[1fr_auto_1fr]",
          journal
            ? "h-[80px] max-mobile:h-[60px]"
            : "h-[100px] items-start pt-10 pr-[100px] max-mobile:h-[60px] max-mtablet:h-[80px] max-mtablet:items-center max-mtablet:pt-0 max-mtablet:pr-0 max-tablet:pr-[80px]",
          wrapperClassName,
        )}
      >
        <Link
          aria-label="Language Toggle"
          href={isId ? urlTargetEn : urlTargetId}
          className={cn(
            "col-start-1 row-start-1 block justify-self-start font-amarillo text-[21px] leading-4",
            journal
              ? "mr-[52px] w-[46px] max-mtablet:mr-0 max-mtablet:w-auto"
              : "w-[100px] max-mtablet:w-auto max-tablet:w-[80px]",
          )}
        >
          <span className={languageClass(!isId)}>EN</span>
          <span className={languageClass(isId)}>ID</span>
        </Link>
        {!hideTitle &&
          (journal ? (
            <Link
              aria-label="Back to Journal"
              href={isId ? "/id/journal" : "/journal"}
              className={cn(
                "pointer-events-auto col-start-2 row-start-1 cursor-pointer justify-self-center font-amarillo text-[21px] uppercase leading-4 transition-colors",
                "max-mtablet:col-start-3 max-mtablet:ml-10 max-mobile:w-[80px] max-mtablet:justify-self-end max-mtablet:text-right max-mtablet:font-maison-mono max-mobile:text-[14px] max-mtablet:text-[16px] max-mtablet:normal-case max-mtablet:leading-[120%]",
                greenBar
                  ? "text-white hover:text-black"
                  : cn(black && "text-black", "hover:text-green"),
              )}
            >
              {isId ? journalBackText?.id : journalBackText?.en}
            </Link>
          ) : (
            <div
              className={cn(
                "col-start-2 row-start-1 justify-self-stretch text-left font-amarillo text-[60px] uppercase leading-[40px] tracking-[2px] max-mtablet:hidden",
                black && "text-black",
              )}
            >
              {isId ? headerTitle?.id : headerTitle?.en}
            </div>
          ))}
        <Link
          aria-label="Herbamojo Main Page"
          href={isId ? "/id" : "/"}
          className={cn(
            "pointer-events-auto col-start-3 row-start-1 h-[40px] cursor-pointer justify-self-end max-mtablet:col-start-2 max-mtablet:justify-self-center",
            "[&>svg]:h-full [&_.fill]:transition-[fill]",
            journal
              ? "w-[98px] max-mtablet:w-auto"
              : "h-[60px] max-mtablet:h-[40px]",
            greenBar
              ? "[&_.fill]:fill-white hover:[&_.fill]:fill-black"
              : black
                ? "hover:[&_.fill]:fill-black"
                : "hover:[&_.fill]:fill-white",
            greenBarMobile &&
              !hideTitle &&
              "max-mtablet:[&_.fill]:fill-white max-mtablet:hover:[&_.fill]:fill-black",
            logoClassName,
          )}
        >
          <HerbamojoLogo />
        </Link>
      </div>
    </div>
  )
}

export default PageHeader
