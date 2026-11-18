"use client"

import gsap from "gsap"
import lottie, { type AnimationItem } from "lottie-web"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import PageHeader from "@/components/organisms/page-header"
import Layout from "@/components/templates/layout"
import { usePageLoader } from "@/hooks"
import capsule from "@/public/assets/aut/capsule.png"
import bottleBack from "@/public/assets/aut/herbamojo_bottle_back.jpg"
import bottleFront from "@/public/assets/aut/herbamojo_bottle_front.jpg"
import bottleSeal from "@/public/assets/aut/herbamojo_bottle_seal.png"
import bottleSide from "@/public/assets/aut/herbamojo_bottle_side.jpg"
import jamu from "@/public/assets/aut/jamu.png"
import type {
  AuthSection,
  FooterSettings,
  GeneralSettings,
  Locale,
} from "@/types"
import { cn } from "@/utils/cn"
import {
  ConnectionSpeed,
  InViewportClass,
  ScrollSnapClass,
  transformValue,
} from "@/utils/interactions"

const INFO_REVEAL_TRESHOLD = 55
/** Time the load reveal runs for before scrolling is handed over. */
const LOAD_ANIMATION_DELAY = 3500
// The original passes 0 here, which the loader reads as unset and replaces
// with its own 250.
const LOADER_DEFAULT_DELAY = 250
/** How long the old heading fades before the new one is swapped in. */
const TITLE_SWAP_DELAY = 300
/** Resizes settle this long before the heading is re-measured. */
const RESIZE_DEBOUNCE = 500
/** The devices the original re-tests by hand when it cannot read the link. */
const IS_MOBILE_UA =
  /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i
const PROBE_IMAGE = "/assets/images/herbamojo_productshot3.jpg"
const PROBE_BYTES = 93.67 * 1024
const PROBE_MIN_KBPS = 200

/** Which `.content_info` entries are flipped, per section, as in the original. */
const FLIPPED: Record<number, number[]> = {
  0: [2, 3],
  1: [1],
  2: [0],
  3: [0],
  4: [],
}

/** Section copy fades in one line after another during the load reveal. */
const ITEM_REVEAL = [
  "loaded:not-revealed:[transition:opacity_1.5s_1.75s]",
  "loaded:not-revealed:[transition:opacity_1.5s_2s]",
  "loaded:not-revealed:[transition:opacity_1.5s_2.25s]",
  "loaded:not-revealed:[transition:opacity_1.5s_2.5s]",
  "loaded:not-revealed:[transition:opacity_1.5s_2.75s]",
]

/**
 * The callouts around the bottle, staggered by their place in the section:
 * the label fades, then its line draws. The first set times the load reveal,
 * the second every reveal after it, as sections scroll into view.
 */
const INFO_STAGGER = [
  {
    label:
      "revealed:group-[.reveal]/info:[transition:opacity_0.75s_0.2s] loaded:not-revealed:[transition:opacity_1s_1.7s]",
    line: "revealed:group-[.reveal]/info:after:[transition:width_0.75s_0.3s] loaded:not-revealed:after:[transition:width_1s_1.8s]",
  },
  {
    label:
      "revealed:group-[.reveal]/info:[transition:opacity_0.75s_0.4s] loaded:not-revealed:[transition:opacity_1s_1.9s]",
    line: "revealed:group-[.reveal]/info:after:[transition:width_0.75s_0.5s] loaded:not-revealed:after:[transition:width_1s_2s]",
  },
  {
    label:
      "revealed:group-[.reveal]/info:[transition:opacity_0.75s_0.6s] loaded:not-revealed:[transition:opacity_1s_2.1s]",
    line: "revealed:group-[.reveal]/info:after:[transition:width_0.75s_0.7s] loaded:not-revealed:after:[transition:width_1s_2.2s]",
  },
  {
    label:
      "revealed:group-[.reveal]/info:[transition:opacity_0.75s_0.8s] loaded:not-revealed:[transition:opacity_1s_2.3s]",
    line: "revealed:group-[.reveal]/info:after:[transition:width_0.75s_0.9s] loaded:not-revealed:after:[transition:width_1s_2.4s]",
  },
  {
    label:
      "revealed:group-[.reveal]/info:[transition:opacity_0.75s_1s] loaded:not-revealed:[transition:opacity_1s_2.5s]",
    line: "revealed:group-[.reveal]/info:after:[transition:width_0.75s_1.1s] loaded:not-revealed:after:[transition:width_1s_2.6s]",
  },
]

const SHORT_SPACER = "w-[15vh] min-w-[100px] max-w-[150px]"
const LONG_SPACER = "w-[25vh] min-w-[125px] max-w-[250px]"

/**
 * Where each callout sits, per section and item: its height on the bottle,
 * the label's width, the gap to the bottle and how much of it the line draws.
 */
const INFO_LAYOUT: Record<
  number,
  { top: string; label?: string; spacer: string; line: string }[]
> = {
  0: [
    { top: "top-[10%]", spacer: SHORT_SPACER, line: "after:w-[60%]" },
    {
      top: "top-[41%]",
      label: "w-[200px]",
      spacer: LONG_SPACER,
      line: "after:w-[45%]",
    },
    { top: "top-[50%]", spacer: LONG_SPACER, line: "after:w-[80%]" },
    { top: "top-[75%]", spacer: LONG_SPACER, line: "after:w-[90%]" },
  ],
  1: [
    {
      top: "top-[55%]",
      label: "w-[225px]",
      spacer: LONG_SPACER,
      line: "after:w-[80%]",
    },
    {
      top: "top-[55%]",
      label: "w-[200px]",
      spacer: LONG_SPACER,
      line: "after:w-[85%]",
    },
    {
      top: "top-[74%]",
      label: "w-[200px]",
      spacer: LONG_SPACER,
      line: "after:w-[80%]",
    },
  ],
  2: [
    {
      top: "top-[10%]",
      label: "w-[225px]",
      spacer: SHORT_SPACER,
      line: "after:w-[80%]",
    },
    {
      top: "top-[30%]",
      label: "w-[200px]",
      spacer: LONG_SPACER,
      line: "after:w-[60%]",
    },
  ],
  3: [
    {
      top: "top-[55%]",
      label: "w-[225px]",
      spacer: LONG_SPACER,
      line: "after:w-[90%]",
    },
  ],
  4: [
    {
      top: "top-[27.5%] mr-[-12.5%]",
      label: "w-[150px]",
      spacer: LONG_SPACER,
      line: "after:w-full",
    },
  ],
}

/** The fixed, centred box each layer of the bottle artwork is drawn in. */
const CENTER_OBJECT = cn(
  "pointer-events-none absolute top-1/2 left-1/2 z-1 h-[calc(100vh-250px)] max-h-[600px] min-h-[450px] w-[calc(100vw-80px)] max-w-[750px] will-change-[opacity] [transform:translate(-50%,-50%)]",
  "max-mtablet:top-[150px] max-mobile:h-[calc(100vh-400px)] max-mtablet:h-[calc(100vh-325px)] max-mtablet:max-h-[450px] max-mobile:min-h-[40vh] max-mtablet:min-h-[300px] max-mtablet:[transform:translate(-50%,0%)]",
  "[@media_only_screen_and_(min-height:700px)_and_(max-width:800px)]:min-h-[50vh]",
)

const CENTER_IMAGE =
  "absolute top-1/2 left-1/2 h-full w-full max-w-none object-contain object-center [transform:translate(-50%,-50%)]"

type AuthenticationViewProps = {
  locale: Locale
  settings: GeneralSettings
  footer: FooterSettings
}

const convertFrom = ({ start = 1, range = 100, value = 1 }) =>
  Math.round(range * value + start)

const ratio = (start: number, end: number, value: number): number =>
  transformValue({ start, end, value }) ?? 0

const AuthenticationView = ({
  locale,
  settings,
  footer,
}: AuthenticationViewProps) => {
  const isId = locale === "id"
  const sections = settings.authenticationSections
  const [activeIndex, setActiveIndex] = useState(0)
  // The dots track the section separately from the heading: once the footer
  // comes into view the original clears them, while the heading keeps showing
  // whichever section was last read.
  const [navIndex, setNavIndex] = useState(0)
  const lottieRef = useRef<AnimationItem | null>(null)
  const frame = useRef({ current: 1, target: 1 })
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollSnapRef = useRef<ScrollSnapClass | null>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const authTitle = settings.navigation.authentication
  const mainId = `aut${isId ? "id" : "en"}`
  const activeTitle = sections[activeIndex]?.title[locale] ?? ""
  // The heading on screen lags the section while it fades out and back in.
  const [shownTitle, setShownTitle] = useState(activeTitle)
  const [titleSwapping, setTitleSwapping] = useState(false)

  // The page reveals itself the same way the home page does: the loader holds
  // it until the images are in, then after the reveal delay scrolling is
  // released and `revealed` goes on the body, which the stylesheet keys the
  // section and info animations off.
  //
  // Snapping is switched off for good here (`forceDisable`); the snap is only
  // kept for the dots, which scroll to their section with its eased timing.
  usePageLoader({
    parentId: mainId,
    locale,
    defaultDelay: LOADER_DEFAULT_DELAY,
    postload: ({ enableScroll }) => {
      window.scrollTo(0, 0)
      const snap = new ScrollSnapClass({
        sections_identifier: `main#${mainId} section`,
        snap_identifier: "",
        speed: 500,
        maxduration: 1000,
        responsive_width: 800,
        responsive_height: 500,
        hasfooter: false,
        forceDisable: true,
      })
      scrollSnapRef.current = snap
      snap.init()
      snap.pause()
      document.body.classList.add("loaded")
      const timer = setTimeout(() => {
        enableScroll()
        snap.play()
        document.body.classList.add("revealed")
      }, LOAD_ANIMATION_DELAY)
      revealTimerRef.current = timer
    },
  })

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      scrollSnapRef.current?.kill()
      scrollSnapRef.current = null
      document.body.classList.remove("revealed")
    }
  }, [])

  // A new section's heading fades out, is swapped, then fades back in.
  // Sections sharing a heading pass without a fade.
  useEffect(() => {
    if (activeTitle === shownTitle) {
      setTitleSwapping(false)
      return
    }
    setTitleSwapping(true)
    const timer = setTimeout(() => {
      setShownTitle(activeTitle)
      setTitleSwapping(false)
    }, TITLE_SWAP_DELAY)
    return () => clearTimeout(timer)
  }, [activeTitle, shownTitle])

  // In English the heading box eases to the width of the new word, so
  // "AUTHENTICATION" slides along behind it. The box needs a measured width
  // for that, taken again whenever the window settles at a new size. The
  // Indonesian heading reads the other way round and stays at its natural
  // width.
  useLayoutEffect(() => {
    const box = titleRef.current
    const word = box?.firstElementChild
    if (isId || !box || !word || !shownTitle) return
    const fit = () => {
      box.style.width = `${word.clientWidth}px`
    }
    fit()
    let timer: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(fit, RESIZE_DEBOUNCE)
    }
    window.addEventListener("resize", onResize)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener("resize", onResize)
    }
  }, [isId, shownTitle])

  // Bottle animation, driven by scroll position through sections 2 - 4. On a
  // slow connection it is skipped entirely and `noAnimation` on #BgContent
  // brings up the three static bottle shots instead — the animation JSON and
  // its frames are far too much to pull down over a poor link.
  useEffect(() => {
    const container = document.getElementById("LottieContainer")
    if (!container) return

    let anim: AnimationItem | null = null
    let cancelled = false

    const start = () => {
      if (cancelled) return
      anim = lottie.loadAnimation({
        container,
        name: "Bottle Animation",
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/animationdata/autbottle_split.json",
      })
      anim.setSpeed(2)
      lottieRef.current = anim
    }

    const skip = () => {
      if (cancelled) return
      document.getElementById("BgContent")?.classList.add("noAnimation")
    }

    const speed = ConnectionSpeed()
    if (speed === "SLOW") {
      skip()
    } else if (speed === "ERROR" && IS_MOBILE_UA.test(navigator.userAgent)) {
      // Safari exposes no Network Information API, so the original times a
      // known-size image instead and lets the animation through if the link
      // turns out to be quick enough.
      // `Image` here is next/image; the DOM constructor is on window.
      const probe = new window.Image()
      const started = Date.now()
      probe.onload = () => {
        const elapsed = Date.now() - started
        const kbps = ((PROBE_BYTES * 8) / elapsed / 1024) * 1000
        if (
          kbps > PROBE_MIN_KBPS &&
          !document.body.classList.contains("loaded")
        )
          start()
        else skip()
      }
      probe.onerror = skip
      probe.src = `${PROBE_IMAGE}?n=${Math.random()}`
    } else {
      start()
    }

    return () => {
      cancelled = true
      anim?.destroy()
      lottieRef.current = null
    }
  }, [])

  useEffect(() => {
    const watchers: InViewportClass[] = []
    const reveal = (id: string, on: boolean) => {
      document.getElementById(id)?.classList.toggle("reveal", on)
    }
    const fade = (selector: string, opacity: number) => {
      gsap.to(selector, { opacity, duration: 0.1 })
    }
    const step = (value: number) => {
      const anim = lottieRef.current
      if (!anim) return
      frame.current.target = value
      requestAnimationFrame(() => anim.goToAndStop(value, true))
    }

    sections.forEach((_, index) => {
      const target = `main.authentication .sectionwrapper > section:nth-child(${index + 1})`
      watchers.push(
        new InViewportClass({
          target,
          visibility: 0.55,
          enter: () => {
            setActiveIndex(index)
            setNavIndex(index)
          },
          always: ({ visibleCoor }) => {
            if (!visibleCoor) return
            const fromBtm = Math.round(visibleCoor.bottom * 10000) / 100
            const fromTop = Math.round(visibleCoor.top * 10000) / 100
            reveal(
              `info${index + 1}`,
              Math.min(fromTop, fromBtm) > INFO_REVEAL_TRESHOLD,
            )

            if (index === 2) {
              fade("#LottieContainer", ratio(15, 70, fromTop))
            }
            if (index === 3) {
              const opacity =
                fromBtm < 100 ? ratio(70, 100, fromBtm) : ratio(20, 60, fromTop)
              fade("#SealImage", opacity)
            }
            if (index === 4) {
              fade("#CapsuleImage", ratio(70, 100, fromBtm))
            }

            // Frames 1-35, 36-70 and 71-105 across sections 2, 3 and 4.
            if (index >= 1 && index <= 3 && fromBtm > 0 && fromBtm < 100) {
              step(
                convertFrom({
                  start: 1 + (index - 1) * 35,
                  range: 35,
                  value: fromBtm / 100,
                }),
              )
            }
          },
        }),
      )
    })

    // The overlay holding the heading and the dots is fixed for the whole
    // scroll, which would leave it floating over the footer. Pinning it to the
    // bottom of its own container hands the footer back, and the dots go blank
    // because no section is being read any more.
    watchers.push(
      new InViewportClass({
        target: "section.footer",
        visibility: 0.05,
        enter: () => {
          document.querySelector("div.overlay")?.classList.add("stuck")
          setNavIndex(-1)
        },
        exit: () => {
          document.querySelector("div.overlay")?.classList.remove("stuck")
          setNavIndex(sections.length - 1)
        },
      }),
    )

    return () => {
      for (const w of watchers) w.kill()
    }
  }, [sections])

  const scrollToSection = (index: number) => {
    scrollSnapRef.current?.snap.to(index)
  }

  return (
    <Layout
      mainId={mainId}
      // The scroll watchers address the sections through this class.
      mainClassName="authentication"
      locale={locale}
      footerData={{ settingAPI: settings, footerAPI: footer }}
      footerClassName="z-2"
      withoutPadding
      withoutMaxWidth
    >
      <PageHeader
        locale={locale}
        urlTargetEn="/authentication"
        urlTargetId="/id/autentikasi"
        headerTitle={authTitle}
        hideTitle
        alwaysTransparent
        className="not-loaded:opacity-0 loaded:not-revealed:[transition:opacity_2s_1.25s] not-loaded:[transition:opacity_0.5s_0s]"
        wrapperClassName="max-[1200px]:pr-0 max-tablet:pr-0"
        logoClassName="max-tablet:h-[50px] max-mtablet:h-[40px]"
      />
      <div className="sectionwrapper relative z-2">
        {sections.map((section: AuthSection, index) => (
          <section
            key={section._key}
            className={cn(
              "relative mx-auto min-h-screen w-full p-0 pt-[150px] max-mtablet:min-h-[50vh]",
              "before:relative before:hidden before:w-full max-mtablet:before:block max-mobile:before:h-[calc(100vh-400px)] max-mtablet:before:h-[calc(100vh-325px)] max-mtablet:before:max-h-[450px] max-mobile:before:min-h-[40vh] max-mtablet:before:min-h-[300px]",
              "[@media_only_screen_and_(min-height:850px)_and_(max-width:800px)]:before:min-h-[50vh]",
              index === 4 && "max-mtablet:pb-[100px]",
            )}
          >
            <div className="flex flex-col flex-nowrap content-center items-center justify-center p-10 pt-[60px] text-center">
              {section.items.map((item, itemIndex) => {
                const isJamu = index === 0 && itemIndex === 1
                return (
                  <div
                    key={item._key}
                    className={cn(
                      "mb-[15px] hidden w-3/4 min-w-[200px] max-w-[325px] font-amarillo text-[21px] leading-4 not-loaded:opacity-0! last:mb-0 max-mtablet:block",
                      ITEM_REVEAL[itemIndex],
                      isJamu &&
                        "max-mtablet:flex max-mtablet:flex-row max-mtablet:flex-nowrap max-mtablet:content-center max-mtablet:items-center max-mtablet:justify-center",
                    )}
                  >
                    {isJamu ? (
                      <>
                        <span className="max-w-[120px]">{item[locale]}</span>
                        <Image
                          src={jamu}
                          alt="Herbamojo"
                          className="relative ml-[10px] h-[50px] w-[50px] max-w-none"
                        />
                      </>
                    ) : (
                      item[locale]
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
        {/* `overlay` is what the footer watcher pins to the bottom. */}
        <div className="overlay pointer-events-none fixed top-0 left-0 z-10 h-full w-full overflow-x-hidden p-10 [&.stuck]:absolute [&.stuck]:top-auto [&.stuck]:bottom-0 [&.stuck]:left-0 [&.stuck]:overflow-hidden">
          <div
            id="PageHeading"
            className={cn(
              "pointer-events-auto fixed top-10 left-1/2 flex w-[calc(100%-80px)] max-w-[1200px] flex-row flex-nowrap content-start items-start justify-start px-[100px] font-amarillo text-[60px] leading-[40px] tracking-[2px] [transform:translateX(-50%)] [&_span]:block",
              "max-tablet:text-[47px] max-tablet:leading-[60%] max-tablet:tracking-[1px]",
              "max-mtablet:top-[70px] max-mtablet:flex-col max-mtablet:content-center max-mtablet:items-center max-mtablet:justify-center max-mtablet:text-[35px] max-mtablet:leading-[30px]",
              "not-loaded:opacity-0 loaded:not-revealed:[transition:opacity_2s_0.75s] not-loaded:[transition:opacity_0.5s_0s]",
            )}
          >
            <span
              id="AutTitle"
              ref={titleRef}
              className={cn(
                "w-auto text-green",
                isId
                  ? "order-2 transition-opacity duration-500"
                  : "whitespace-nowrap [transition:opacity_0.5s_0s,width_0.5s_0s]",
                titleSwapping && "opacity-0",
                titleSwapping &&
                  !isId &&
                  "[transition:opacity_0.25s_0s,width_0.5s_0s]",
              )}
            >
              <span
                className={cn(
                  "w-auto",
                  !isId &&
                    "inline-block! whitespace-nowrap text-green [transition:opacity_0.5s_0s,width_0.5s_0s]",
                )}
              >
                {shownTitle}
              </span>
            </span>
            <span
              className={cn(
                "text-white",
                // Off the Indonesian order, the tablet indent outranks the
                // mobile reset in the original, so it carries on down.
                isId ? "order-1 mr-5 ml-0" : "ml-5 max-tablet:ml-[12px]",
              )}
            >
              {authTitle[locale]?.toUpperCase()}
            </span>
          </div>
          <div
            id="AutSnapNav"
            className="pointer-events-auto absolute top-auto bottom-10 left-1/2 flex h-[35px] w-auto flex-row flex-nowrap content-center items-center justify-between not-loaded:opacity-0 [transform:translateX(-50%)] loaded:not-revealed:[transition:opacity_2s_1.25s] not-loaded:[transition:opacity_0.5s_0s] before:absolute before:top-1/2 before:left-1/2 before:block before:h-[2px] before:w-[calc(100%-50px)] before:bg-green max-mobile:bottom-[calc(20px+env(safe-area-inset-bottom))] max-mobile:before:w-[calc(100%-30px)] before:[transform:translate(-50%,-50%)]"
          >
            {sections.map((section: AuthSection, index) => (
              <span
                key={section._key}
                onClick={() => scrollToSection(index)}
                className={cn(
                  "pointer-events-auto relative block h-9 w-9 rounded-[36px] hover:cursor-pointer max-mobile:h-7 max-mobile:w-7",
                  index === sections.length - 1
                    ? "mr-0"
                    : "mr-10 max-smaller:mr-[calc((100vw-300px)/4)] max-mobile:mr-[calc((75vw-300px)/4)] max-mtablet:mr-[calc((50vw-180px)/4)]",
                  "after:absolute after:top-1/2 after:left-1/2 after:block after:h-[18px] after:w-[18px] after:rounded-[35px] after:bg-green after:transition-all max-mobile:after:h-[14px] max-mobile:after:w-[14px] after:[transform:translate(-50%,-50%)]",
                  "before:absolute before:top-1/2 before:left-1/2 before:block before:h-[10px] before:w-[10px] before:rounded-[36px] before:border-2 before:border-green before:bg-black before:transition-all before:[transform:translate(-50%,-50%)]",
                  navIndex === index
                    ? "cursor-pointer before:h-9 before:w-9 max-mobile:before:h-7 max-mobile:before:w-7"
                    : "hover:before:h-9 hover:before:w-9 max-mobile:hover:before:h-7 max-mobile:hover:before:w-7",
                )}
              >
                <span className="pointer-events-none absolute top-1/2 right-[35px] left-auto text-right font-amarillo text-[21px] text-white leading-4 opacity-0 transition-all [transform:translate(0px,-50%)]">
                  {index + 1}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        id="BgContent"
        className="pointer-events-none fixed top-0 bottom-auto left-0 z-1 h-full w-full overflow-hidden bg-black not-loaded:opacity-0! loaded:not-revealed:[transition:opacity_2s_0.25s] not-loaded:[transition:opacity_0.5s_0s]"
      >
        <div
          id="InfoContainer"
          className={cn(
            CENTER_OBJECT,
            "max-mtablet:pointer-events-none! z-10 max-w-[1000px] transition-opacity duration-500 max-mtablet:opacity-0",
          )}
        >
          {sections.map((section: AuthSection, index) => (
            // `reveal` is put on these by the scroll watchers above.
            <div
              id={`info${index + 1}`}
              key={section._key}
              className="group/info absolute top-1/2 left-1/2 h-full w-full [transform:translate(-50%,-50%)]"
            >
              {section.items.map((item, itemIndex) => {
                const flip = FLIPPED[index]?.includes(itemIndex)
                const layout = INFO_LAYOUT[index]?.[itemIndex]
                const stagger = INFO_STAGGER[itemIndex]
                return (
                  <div
                    key={item._key}
                    className={cn(
                      "absolute flex flex-row flex-nowrap content-center items-center justify-stretch [transform:translate(0%,-50%)]",
                      flip ? "right-auto left-1/2" : "right-1/2 left-auto",
                      "not-loaded:opacity-0 [transition:opacity_0.5s_0s] revealed:group-[.reveal]/info:pointer-events-auto group-[:not(.reveal)]/info:opacity-0",
                      stagger?.label,
                      layout?.top,
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-auto max-w-[250px] flex-row flex-nowrap content-center items-center px-5 font-amarillo text-[21px] text-white uppercase leading-4 [&>*]:block",
                        flip
                          ? "order-2 justify-start text-left"
                          : "justify-end text-right",
                        layout?.label,
                      )}
                    >
                      {index === 0 && itemIndex === 1 ? (
                        <>
                          <div>{item[locale]}</div>
                          <Image
                            src={jamu}
                            alt="Herbamojo"
                            className="relative ml-[10px] h-[40px] w-auto max-w-none"
                          />
                        </>
                      ) : (
                        <div>{item[locale]}</div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "relative h-5 w-[200px] font-amarillo text-[21px] text-white uppercase leading-4",
                        "before:absolute before:top-1/2 before:block before:h-3 before:w-3 before:rounded-[25px] before:bg-green before:[transform:translate(0%,-50%)]",
                        "after:absolute after:top-1/2 after:block after:h-[2px] not-loaded:after:w-0! after:bg-green group-[:not(.reveal)]/info:after:w-0! after:[transform:translate(0%,-50%)] after:[transition:width_0.75s_0s]",
                        flip
                          ? "order-1 before:right-0 before:left-auto after:right-0 after:left-auto"
                          : "before:left-0 after:left-0",
                        stagger?.line,
                        layout?.spacer,
                        layout?.line ?? "after:w-full",
                      )}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div
          id="CapsuleImage"
          className={cn(CENTER_OBJECT, "pointer-events-none z-3 opacity-0")}
        >
          <Image
            src={capsule}
            alt="Herbamojo"
            className={cn(CENTER_IMAGE, "h-[75%] max-mtablet:h-[90%]")}
          />
        </div>
        <div
          id="SealImage"
          className={cn(CENTER_OBJECT, "pointer-events-none z-2 opacity-0")}
        >
          <Image
            src={bottleSeal}
            alt="Herbamojo"
            className={cn(CENTER_IMAGE, "h-[80%]")}
          />
        </div>
        {[
          { id: "BottleFront", src: bottleFront },
          { id: "BottleSide", src: bottleSide },
          { id: "BottleBack", src: bottleBack },
        ].map(({ id, src }) => (
          // Shown only when #BgContent gets `noAnimation` on a slow link.
          <div
            key={id}
            id={id}
            className={cn(
              CENTER_OBJECT,
              "in-[.noAnimation]:block hidden opacity-0",
            )}
          >
            <Image src={src} alt="Herbamojo" className={CENTER_IMAGE} />
          </div>
        ))}
        <div id="LottieContainer" className={CENTER_OBJECT} />
      </div>
    </Layout>
  )
}

export default AuthenticationView
