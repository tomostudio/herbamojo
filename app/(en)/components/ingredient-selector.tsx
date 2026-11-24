"use client"

import { useCallback, useEffect, useRef } from "react"

import {
  HOME_CONTENT,
  HOME_CONTENT_SHORT,
  HOME_H1,
  HOME_SECTION,
  HOME_WRAPPER,
} from "@/app/(en)/settings"
import type { HomeDoc } from "@/app/(en)/types"
import SanityImage from "@/components/atoms/sanity-image"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

type IngredientSelectorProps = {
  ingredients: HomeDoc["ingredients"]["items"]
  locale: Locale
  title: string
  sectionRef: (el: HTMLElement | null) => void
}

/** How long the display stays faded out while the ingredient swaps over. */
const CHANGE_DELAY = 500

/** The names fade in one after another as the section comes into view. */
const NAME_REVEAL = [
  "group-[.inview]/ingredients:delay-250",
  "group-[.inview]/ingredients:delay-500",
  "group-[.inview]/ingredients:delay-750",
  "group-[.inview]/ingredients:delay-1000",
  "group-[.inview]/ingredients:delay-1250",
  "group-[.inview]/ingredients:delay-1500",
  "group-[.inview]/ingredients:delay-1750",
]

/**
 * Each ingredient's artwork is cropped and placed by hand, by its position in
 * the list: desktop size, then where it sits in the wider crop on mobile.
 */
const ARTWORK = [
  "max-h-[70vh] max-w-[80%] max-mtablet:[transform:translate(-70%,-50%)]",
  "right-[-10%] max-h-[90vh] max-w-[90%] max-mtablet:[transform:translate(-30%,-50%)]",
  "w-full max-w-[550px] max-mtablet:w-full! max-mtablet:[transform:translate(-70%,-50%)]",
  "max-h-[80vh] max-w-full max-mtablet:[transform:translate(-50%,-50%)]",
  "max-mtablet:[transform:translate(-30%,-50%)]",
  "max-h-[80vh] max-w-full max-mtablet:[transform:translate(-70%,-50%)]",
  "max-h-[70vh] max-w-[80%] max-mtablet:w-[120%]! max-mtablet:[transform:translate(-50%,-50%)]",
]

/**
 * Renders the whole #ingredients section; the parallax script moves its
 * `.bg`, so that has to stay a direct child of the section.
 *
 * Selection is driven through the DOM rather than React state, because the
 * swap is a two-stage animation: the display and background fade out behind a
 * `transition` class, and only once that has played does the number, the
 * description and the visible image change.
 */
const IngredientSelector = ({
  ingredients,
  locale,
  title,
  sectionRef,
}: IngredientSelectorProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const changingRef = useRef(false)
  const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only touches refs and the DOM, so it stays stable across renders.
  const toggle = useCallback((index: number) => {
    const root = rootRef.current
    if (!root) return

    const displayContainer = root.querySelector("#ing_display")
    const displayNumber = root.querySelector("#ing_display_number")
    const displayDesc = root.querySelector("#ing_display_description")
    const displayBg = root.querySelector("#ing_bg")
    const buttons = root.querySelectorAll("#ing_sel > *")
    const backgrounds = root.querySelectorAll("#ing_bg > *")

    for (const button of buttons) button.classList.remove("active")
    buttons[index]?.classList.add("active")

    if (!changingRef.current) {
      changingRef.current = true
      displayBg?.classList.add("transition")
      displayContainer?.classList.add("transition")
    }

    if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current)
    changeTimeoutRef.current = setTimeout(() => {
      changingRef.current = false
      if (displayNumber) displayNumber.textContent = String(index + 1)
      if (displayDesc) {
        displayDesc.textContent =
          buttons[index]?.getAttribute("data-desc") ?? ""
      }
      displayContainer?.classList.remove("transition")

      for (const background of backgrounds)
        background.classList.remove("active")
      backgrounds[index]?.classList.add("active")

      displayBg?.classList.remove("transition")
      changeTimeoutRef.current = null
    }, CHANGE_DELAY)
  }, [])

  // Selects the first ingredient, as the original does once the page loads.
  useEffect(() => {
    toggle(0)
    return () => {
      if (changeTimeoutRef.current) clearTimeout(changeTimeoutRef.current)
    }
  }, [toggle])

  // Each description panel is sized to its own content so the accordion has
  // something to animate between, and so the open one on mobile is exactly as
  // tall as its text. The panels start at height 0 in the stylesheet and the
  // closed ones are pinned there with !important, so this measurement is the
  // only thing that opens the active panel — without it the description spills
  // out of a zero-height box and lands on top of the next ingredient.
  useEffect(() => {
    const resize = () => {
      const descriptions = rootRef.current?.querySelectorAll(
        "#ing_sel > span > div:last-child > div",
      )
      if (!descriptions) return
      for (const description of descriptions) {
        const parent = description.parentElement
        if (!parent) continue
        parent.style.height = `${description.clientHeight}px`
      }
    }
    resize()
    // Measured before the webfonts land the descriptions come out the wrong
    // height, and the collapsed panels keep that value. The original measures
    // from the loader's postload, once everything has settled.
    document.fonts?.ready.then(resize)
    window.addEventListener("resize", resize, false)
    return () => window.removeEventListener("resize", resize, false)
  }, [])

  return (
    <section
      id="ingredients"
      ref={(el) => {
        rootRef.current = el
        sectionRef(el)
      }}
      className={cn(HOME_SECTION, "group/ingredients relative")}
    >
      <div className={cn(HOME_WRAPPER, "relative max-mtablet:block")}>
        <h1 className={cn(HOME_H1, "shrink-0 grow-0")}>{title}</h1>
        <div
          className={cn(
            HOME_CONTENT,
            HOME_CONTENT_SHORT,
            "max-mtablet:block max-mtablet:w-full",
          )}
        >
          <div
            id="ing_sel"
            className="block w-[300px] shrink-0 grow-0 text-left font-amarillo text-[40px] leading-[100%] focus:outline-none max-mtablet:mx-auto max-mtablet:w-full max-mobile:max-w-[350px] max-mtablet:max-w-[450px] max-mtablet:text-center"
          >
            {ingredients.map((node, id) => (
              <span
                key={node._key}
                className={cn(
                  // `active` is moved between these by toggle() above.
                  "active group/ing relative block opacity-0 transition-opacity group-[.inview]/ingredients:opacity-100 group-[.inview]/ingredients:duration-1000",
                  NAME_REVEAL[id],
                  id === ingredients.length - 1
                    ? "mb-0"
                    : "mb-[25px] max-mobile:mb-5 max-mtablet:mb-10",
                )}
                data-desc={node.description[locale]}
              >
                <div
                  onClick={() => toggle(id)}
                  className="group/title cursor-pointer group-[.active]/ing:pointer-events-none"
                >
                  <span className="transition-opacity [-webkit-text-fill-color:rgba(255,255,255,0)] [-webkit-text-stroke:1px_white] group-hover/title:opacity-0 group-[.active]/ing:opacity-0 group-hover/title:[transition:opacity_0.25s_0.0833s]">
                    {node.title[locale]}
                  </span>
                  <span className="absolute top-0 left-0 z-5 h-full w-full text-white opacity-0 transition-all group-hover/title:text-white group-hover/title:opacity-100 group-[.active]/ing:text-green! group-[.active]/ing:opacity-100">
                    {node.title[locale]}
                  </span>
                </div>
                <div className="hidden max-mtablet:pointer-events-none max-mtablet:block max-mtablet:h-0 max-mtablet:w-full max-mtablet:text-center max-mtablet:font-maison-mono max-mtablet:text-[14px] max-mtablet:leading-[120%] max-mtablet:opacity-0 max-mtablet:transition-all max-mtablet:duration-400 max-mtablet:group-[:not(.active)]/ing:h-0! max-mtablet:group-[.active]/ing:opacity-100">
                  <div className="relative w-full pt-5">
                    {node.description[locale]}
                  </div>
                </div>
              </span>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute top-0 right-0 left-auto h-full w-[calc(100%-300px)] opacity-0 [transition:opacity_0.5s] group-[.inview]/ingredients:opacity-100 max-mtablet:hidden group-[.inview]/ingredients:[transition:opacity_1.5s_1s]">
          {/* toggle() fades this out behind `transition` while it swaps. */}
          <div
            id="ing_display"
            className="flex h-full flex-col flex-nowrap content-center items-center justify-center px-[75px] [transition:opacity_0.4s_0.1s] max-tablet:px-[50px] [&.transition]:opacity-0 [&.transition]:[transition:opacity_0.2s]"
          >
            <div
              id="ing_display_number"
              className="pointer-events-auto block w-full text-center font-amarillo text-[350px] text-green leading-[250px]"
            >
              1
            </div>
            <div
              id="ing_display_description"
              className="pointer-events-auto mt-10 block w-full text-center font-maison-mono text-[18px] leading-[28px]"
            >
              {ingredients[0]?.description[locale]}
            </div>
          </div>
        </div>
      </div>
      {/* `bg` is what the parallax script moves. */}
      <div className="bg pointer-events-none absolute top-0 left-0 -z-1 h-full w-full overflow-hidden opacity-50 group-[:not(.inview)]/ingredients:opacity-0 group-[.inview]/ingredients:[transition:opacity_1s] group-[:not(.inview)]/ingredients:[transition:opacity_0.5s] max-mtablet:group-[.inview]/ingredients:[transition:opacity_1.5s_1s]">
        <div
          id="ing_bg"
          className="relative right-auto left-0 mt-0 h-full w-full animate-[ingbg-transitionin_0.6s_0.2s_ease-out_1_both] [transform:translate(100px,0%)] max-mtablet:animate-[ingbg-transitioninm_1s_0s_ease-out_1_both] max-mtablet:[transform:translate(0px,0%)] [&.transition]:animate-[ingbg-transitionout_0.4s_ease-in_1_both] max-mtablet:[&.transition]:animate-[ingbg-transitionoutm_0.4s_0s_ease-in_1_both]"
        >
          {ingredients.map((node, id) => (
            <SanityImage
              key={node._key}
              image={node.image}
              alt="herbamojo"
              sizes="(min-width: 900px) 50vw, 100vw"
              loading="eager"
              className={cn(
                "absolute top-1/2 right-0 left-auto hidden max-h-screen min-h-[50vh] w-full max-w-full [transform:translate(0%,-50%)] [&.active]:block [&_img]:object-scale-down [&_img]:object-[right_center]",
                "max-mtablet:right-auto max-mtablet:left-1/2 max-mtablet:max-h-[75vh]! max-mtablet:min-h-[30vh] max-mtablet:w-[150%]! max-mtablet:max-w-none! max-mtablet:[transform:translate(-50%,-50%)]",
                ARTWORK[id],
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default IngredientSelector
