"use client"

import type Glide from "@glidejs/glide"
import Link from "next/link"
import { useEffect, useId, useRef } from "react"

import type { ShopItem, ShopLayout } from "@/app/(en)/types"
import SanityImage from "@/components/atoms/sanity-image"
import { cn } from "@/utils/cn"

import SliderArrow from "./slider-arrow"

type ShopSliderProps = {
  items: ShopItem[]
  /**
   * Which markup the original renders. SLIDER mounts glide; SINGLE keeps the
   * arrows but lays the entries out plainly; NOSLIDER drops the arrows too.
   */
  layout: ShopLayout
  /** False turns the slider off below the breakpoint. */
  mobileSlider?: boolean
  perView?: number
  id?: string
  sliderId?: string
}

/** The row of arrows and slides every shop slider is laid out in. */
export const SLIDER_ROW =
  "mt-5 flex w-full flex-row flex-nowrap content-center items-center justify-between max-mtablet:mx-auto max-mtablet:mt-[30px] max-mtablet:mb-0"

/** The track between the two arrows. */
export const SLIDER_TRACK =
  "relative mx-10 min-h-full w-[calc(100%-148px)] [&_*]:focus:outline-none max-tablet:mx-5 max-tablet:w-[calc(100%-108px)] max-mtablet:mx-[60px] max-mtablet:w-[calc(100%-154px)] max-mobile:mx-10 max-mobile:w-[calc(100%-104px)]"

/** How the arrows dim when there is nothing to slide to. */
export const arrowState = (single: boolean, mobileSlider: boolean) =>
  cn(
    single
      ? "pointer-events-none opacity-25"
      : !mobileSlider &&
          "max-mtablet:pointer-events-none max-mtablet:opacity-0",
  )

const ShopSlider = ({
  items,
  layout,
  mobileSlider = true,
  perView = 1,
  id,
  sliderId: sliderIdProp,
}: ShopSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const glideRef = useRef<InstanceType<typeof Glide> | null>(null)
  const domId = useId()
  const sliderId = sliderIdProp ?? `shop-slider-${domId.replace(/:/g, "")}`

  useEffect(() => {
    if (layout !== "SLIDER" || !trackRef.current) return
    // The sliders sit at the bottom of the home page, so Glide is fetched
    // here rather than shipped in the page's first bundle.
    let cancelled = false
    import("@glidejs/glide").then(({ default: Glide }) => {
      if (cancelled) return
      glideRef.current = new Glide(`#${sliderId}`, {
        type: "carousel",
        startAt: 0,
        perView,
        gap: perView > 1 ? 40 : 0,
        breakpoints: { 900: { perView: 1 } },
      }).mount()
    })

    return () => {
      cancelled = true
      glideRef.current?.destroy()
      glideRef.current = null
    }
  }, [layout, perView, sliderId])

  if (items.length === 0) return null

  const single = layout === "SINGLE"
  const arrows = arrowState(single, mobileSlider)

  const entries = items.map((item, index) => (
    <div
      className={cn(
        "relative w-full p-0",
        layout === "SLIDER" && "glide__slide",
        single && (index === 0 ? "mr-0 block" : "mr-0 hidden"),
      )}
      key={item._key}
    >
      <ShopEntry item={item} />
    </div>
  ))

  if (layout === "NOSLIDER") {
    return (
      <div id={id} className={SLIDER_ROW}>
        <div className="relative mx-[54px] flex min-h-full w-[calc(100%-148px)] flex-row flex-wrap content-center items-center justify-center max-mtablet:mx-auto max-mobile:w-[calc(100%-104px)] max-mtablet:w-[calc(100%-154px)] max-tablet:w-[calc(100%-108px)] [&_*]:focus:outline-none">
          {entries}
        </div>
      </div>
    )
  }

  if (single) {
    return (
      <div id={id} className={SLIDER_ROW}>
        <SliderArrow className={arrows} />
        <div className={cn(SLIDER_TRACK, "grid grid-cols-[auto]")}>
          {entries}
        </div>
        <SliderArrow next className={arrows} />
      </div>
    )
  }

  return (
    <div id={id} className={SLIDER_ROW}>
      <SliderArrow
        className={arrows}
        onClick={() => glideRef.current?.go("<")}
      />
      <div id={sliderId} className={cn("glide", SLIDER_TRACK)} ref={trackRef}>
        <div data-glide-el="track" className="glide__track">
          <div
            className={cn(
              "glide__slides",
              !mobileSlider &&
                "max-mtablet:flex max-mtablet:flex-row max-mtablet:flex-nowrap max-mtablet:*:w-full max-mtablet:*:grow",
            )}
          >
            {entries}
          </div>
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

const ShopEntry = ({ item }: { item: ShopItem }) => {
  const image = item.image?.asset ? (
    <SanityImage
      image={item.image}
      alt="herbamojo"
      sizes="125px"
      className="m-auto block h-full w-full"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  ) : null

  const style = { background: item.background || "transparent" }

  return item.link ? (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={item.link}
      style={style}
      aria-label="Shop Slider"
      className="relative block h-[125px] w-full transition-opacity hover:cursor-pointer hover:opacity-50"
    >
      {image}
    </Link>
  ) : (
    <div style={style} className="relative block h-[125px] w-full">
      {image}
    </div>
  )
}

export default ShopSlider
