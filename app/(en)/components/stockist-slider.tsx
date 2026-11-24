"use client"

import Glide from "@glidejs/glide"
import Link from "next/link"
import { useEffect, useRef } from "react"

import type { StockistItem } from "@/app/(en)/types"
import { cn } from "@/utils/cn"
import { MediaCheck } from "@/utils/interactions"

import { arrowState, SLIDER_ROW, SLIDER_TRACK } from "./shop-slider"
import SliderArrow from "./slider-arrow"

type StockistSliderProps = {
  groups: StockistItem[][]
  /**
   * The original mounts glide only past two groups; at or below that it keeps
   * the arrows but lays the groups out with CSS.
   */
  layout: "SINGLE" | "SLIDER"
  /**
   * Whether the *online shop* section keeps its mobile slider. The original
   * reuses that flag here rather than reading the stockist's own option.
   */
  mobileSlider?: boolean
}

const ENTRY =
  "relative left-5 mt-[10px] block w-[calc(100%-20px)] indent-[-20px] text-left uppercase first:mt-0 max-mtablet:text-center"

/**
 * Mirrors the original's stockist slider: glide with perView 2 (1 below
 * 900px), an arrow on each side, and each slide holding up to five entries.
 */
const StockistSlider = ({
  groups,
  layout,
  mobileSlider = true,
}: StockistSliderProps) => {
  const glideRef = useRef<InstanceType<typeof Glide> | null>(null)

  useEffect(() => {
    if (layout !== "SLIDER") return

    // Mounted whatever the count, but torn down on mobile, where the slides
    // are laid out by CSS instead. Leaving it mounted there stacks the
    // carousel's clones and makes the shop section far taller than it
    // should be.
    if (groups.length === 0) return

    const sync = () => {
      const mobile = MediaCheck.width.mtablet()
      if (mobile && glideRef.current) {
        glideRef.current.destroy()
        glideRef.current = null
      } else if (!mobile && !glideRef.current) {
        glideRef.current = new Glide("#stockistslider", {
          type: "carousel",
          startAt: 0,
          perView: 2,
          gap: 40,
          breakpoints: { 900: { perView: 1 } },
        }).mount()
      }
    }

    sync()
    window.addEventListener("resize", sync, false)
    return () => {
      window.removeEventListener("resize", sync, false)
      glideRef.current?.destroy()
      glideRef.current = null
    }
  }, [groups.length, layout])

  if (groups.length === 0) return null

  // At two groups or fewer they sit side by side instead of sliding.
  const fewGroups = groups.length <= 2
  const arrows = cn(arrowState(fewGroups, mobileSlider), "max-mtablet:hidden")

  const slides = groups.map((group) => (
    <div
      className={cn(
        "glide__slide relative w-full px-0 py-5 text-[20px] leading-[120%] first:ml-0 max-mtablet:ml-0 max-mtablet:w-full max-mtablet:p-0 max-mobile:text-[18px]",
        fewGroups && "max-[900px]:mt-0!",
      )}
      key={group[0]._key}
    >
      {group.map((entry) =>
        entry.link ? (
          <Link
            href={entry.link}
            key={entry._key}
            className={cn(
              ENTRY,
              "transition-opacity hover:cursor-pointer hover:opacity-50",
            )}
          >
            {entry.content}
          </Link>
        ) : (
          <span key={entry._key} className={ENTRY}>
            {entry.content}
          </span>
        ),
      )}
    </div>
  ))

  const track = cn(
    SLIDER_TRACK,
    "max-mobile:m-0 max-mtablet:m-0 max-mobile:w-full max-mtablet:w-full max-mobile:px-0 max-mtablet:px-10",
    fewGroups &&
      "grid grid-cols-[1fr_1fr] gap-10 max-[900px]:grid-cols-[auto] max-[900px]:gap-[15px]",
  )

  const slidesLayout = cn(
    "justify-between",
    mobileSlider
      ? "max-mtablet:grid max-mtablet:grid-cols-[auto] max-mtablet:justify-stretch max-mtablet:gap-[15px]"
      : "max-mtablet:flex max-mtablet:flex-row max-mtablet:flex-nowrap max-mtablet:*:w-full max-mtablet:*:grow",
  )

  if (layout === "SINGLE") {
    return (
      <div
        id="stockist"
        className={cn(SLIDER_ROW, "mt-5 self-stretch max-mtablet:mt-5")}
      >
        <SliderArrow className={arrows} />
        {/* The trailing space in the id is the original's; it means this
            element is not addressable as #stockistslider, which is why glide
            is never mounted on the SINGLE branch. */}
        <div id="stockistslider " className={cn("glide", track)}>
          {slides}
        </div>
        <SliderArrow next className={arrows} />
      </div>
    )
  }

  return (
    <div
      id="stockist"
      className={cn(SLIDER_ROW, "mt-5 self-stretch max-mtablet:mt-5")}
    >
      <SliderArrow
        className={arrows}
        onClick={() => glideRef.current?.go("<")}
      />
      <div id="stockistslider" className={cn("glide", track)}>
        <div data-glide-el="track" className="glide__track">
          <div className={cn("glide__slides", slidesLayout)}>{slides}</div>
        </div>
      </div>
      <SliderArrow
        next
        className={arrows}
        onClick={() => glideRef.current?.go(">")}
      />
    </div>
  )
}

export default StockistSlider
