"use client"

import { useEffect, useRef, useState } from "react"

import Layout from "@/components/templates/layout"
import { usePageLoader } from "@/hooks"
import type {
  FooterSettings,
  GeneralSettings,
  Locale,
  LocaleString,
} from "@/types"
import { MediaCheck, ScrollIt, ScrollSnapClass } from "@/utils/interactions"

import AboutSection from "./components/about-section"
import BenefitsSection from "./components/benefits-section"
import FloatingBottle from "./components/floating-bottle"
import HeroSection from "./components/hero-section"
import IngredientSelector from "./components/ingredient-selector"
import JournalSection from "./components/journal-section"
import MobileHeader from "./components/mobile-header"
import MobileNavigation from "./components/mobile-navigation"
import Popup from "./components/popup"
import SectionNav from "./components/section-nav"
import ShopSection from "./components/shop-section"
import { NAV_SECTIONS, type NavSection } from "./settings"
import type { HomeDoc, JournalCard } from "./types"
import { setupHomeInteractions } from "./utils"

/** Time the load reveal runs for before scrolling is handed over. */
const LOAD_ANIMATION_DELAY = 2000
/** The popup waits out the load reveal plus this before becoming clickable. */
const POPUP_REVEAL_DELAY = 750
const LOADER_DEFAULT_DELAY = 500
/** The mobile glide to the shop takes this long per screen travelled… */
const SHOP_SCROLL_PER_SCREEN = 500
/** …within these bounds. */
const SHOP_SCROLL_MIN = 250
const SHOP_SCROLL_MAX = 1000

type HomeProps = {
  locale: Locale
  settings: GeneralSettings
  footer: FooterSettings
  home: HomeDoc
  journals: JournalCard[]
}

const Home = ({ locale, settings, footer, home, journals }: HomeProps) => {
  const isId = locale === "id"
  const [menuOpen, setMenuOpen] = useState(false)
  const [popupReveal, setPopupReveal] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const snapNavRef = useRef<Element[]>([])
  const teardownRef = useRef<(() => void) | null>(null)
  const scrollSnapRef = useRef<ScrollSnapClass | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Read by the loader's postload, which fires long after this render, so it
  // must be a ref rather than the state above.
  const popupRevealRef = useRef(false)
  const mainId = isId ? "homeID" : "homeEN"

  // Whether the popup shows is decided on mount, not after a delay: the delay
  // in the original is only the reveal animation, driven by the loader.
  useEffect(() => {
    if (!home.popup.enable) return
    if (!window.localStorage.getItem("popupRevealed") || home.popup.always) {
      popupRevealRef.current = true
      setPopupReveal(true)
    }
  }, [home.popup.enable, home.popup.always])

  // Section snapping and the popup reveal are both scheduled off the loader
  // finishing, not off mount: the page stays behind #LoaderWrapper until every
  // image has loaded, and only then does the reveal countdown start.
  usePageLoader({
    parentId: mainId,
    locale,
    defaultDelay: LOADER_DEFAULT_DELAY,
    postload: ({ enableScroll }) => {
      window.scrollTo(0, 0)

      const snap: ScrollSnapClass = new ScrollSnapClass({
        sections_identifier: `main.home#${mainId} section`,
        snap_identifier: "",
        speed: 500,
        maxduration: 1000,
        responsive_width: 800,
        responsive_height: 500,
        hasfooter: false,
      })
      scrollSnapRef.current = snap

      snapNavRef.current = Array.from(
        document.querySelectorAll("div.overlay .right_nav .snap_nav > *"),
      )
      const setNav = (index: number) => {
        for (const nav of snapNavRef.current) nav.classList.remove("active")
        snapNavRef.current[index]?.classList.add("active")
      }
      setNav(0)
      snapNavRef.current.forEach((nav, index) => {
        ;(nav as HTMLElement).onclick = () => snap.snap.to(index)
      })

      teardownRef.current = setupHomeInteractions(setNav)

      snap.init()
      snap.pause()
      document.body.classList.add("loaded")

      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      revealTimerRef.current = popupRevealRef.current
        ? setTimeout(() => {
            popupRef.current?.classList.remove("loading")
            enableScroll()
            popupRef.current?.classList.add("click")
            window.localStorage.setItem("popupRevealed", "true")
          }, LOAD_ANIMATION_DELAY + POPUP_REVEAL_DELAY)
        : setTimeout(() => {
            enableScroll()
            snap.play()
            // Snapping switches itself off if a section measures taller than
            // the viewport, and nothing re-measures afterwards. Webfonts land
            // late enough to make that reading wrong, so take it again once
            // they have — the original re-measures here for the same reason.
            document.fonts?.ready.then(() => snap.play())
          }, LOAD_ANIMATION_DELAY)
    },
  })

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      teardownRef.current?.()
      teardownRef.current = null
      scrollSnapRef.current?.kill()
      scrollSnapRef.current = null
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle("menu_open", menuOpen)
    return () => document.body.classList.remove("menu_open")
  }, [menuOpen])

  // Closing drops the `popup` class and hands scrolling back to the snap; the
  // wrapper itself stays mounted, as in the original.
  const closePopup = () => {
    if (!popupRef.current?.classList.contains("popup")) return
    popupRef.current.classList.remove("popup")
    scrollSnapRef.current?.play()
  }

  // Snap handles desktop; on mobile it switches itself off, and the page is
  // scrolled by hand instead.
  const snapTo = (id: NavSection) => {
    const index = NAV_SECTIONS.indexOf(id)
    if (!scrollSnapRef.current || index < 0 || MediaCheck.width.mtablet())
      return false
    scrollSnapRef.current.snap.to(index)
    return true
  }
  const sectionTop = (id: NavSection) => {
    const el = sectionRefs.current[id]
    return el ? el.getBoundingClientRect().top + window.scrollY : null
  }

  // The mobile menu jumps straight to the section it closes onto.
  const scrollToSection = (id: NavSection) => {
    setMenuOpen(false)
    if (snapTo(id)) return
    const top = sectionTop(id)
    if (top !== null) window.scrollTo(0, top)
  }

  // The shop buttons glide there instead, taking longer the further it is.
  const goToShop = () => {
    if (snapTo("shop")) return
    const top = sectionTop("shop")
    if (top === null) return
    const screens = Math.abs(top - window.scrollY) / window.innerHeight
    const duration = Math.min(
      Math.max(screens * SHOP_SCROLL_PER_SCREEN, SHOP_SCROLL_MIN),
      SHOP_SCROLL_MAX,
    )
    ScrollIt(top, duration)
  }

  const journalSlug = settings.journalSlug.startsWith("/")
    ? settings.journalSlug
    : `/${settings.journalSlug}`
  // Each section's title also labels it in the dot navigation and the mobile
  // menu.
  const sectionTitles: Record<NavSection, LocaleString> = {
    home: home.hero.title,
    about: home.about.title,
    benefits: home.benefits.title,
    ingredients: home.ingredients.title,
    shop: home.shop.title,
    journal: home.journal.title,
  }
  const navSections = NAV_SECTIONS.filter(
    (section) => section !== "journal" || !settings.journalDisable,
  )
  const sectionRef = (id: NavSection) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <Layout
      mainId={mainId}
      // The scroll snap collects `main.home#<id> section`.
      mainClassName="home"
      locale={locale}
      footerData={{ settingAPI: settings, footerAPI: footer }}
      withoutPadding
      withoutMaxWidth
    >
      <MobileHeader locale={locale} />
      <MobileNavigation
        locale={locale}
        footer={footer}
        navSections={navSections}
        sectionTitles={sectionTitles}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        onSelect={scrollToSection}
      />

      <div className="relative overflow-x-hidden">
        <SectionNav
          locale={locale}
          footer={footer}
          navSections={navSections}
          sectionTitles={sectionTitles}
          onSelect={scrollToSection}
        />

        {/* The bottle floats over these three sections. */}
        <div className="bottlesection_wrapper pointer-events-none relative z-5 [&>section]:pointer-events-auto">
          <FloatingBottle
            label={home.hero.shopFloat[locale]}
            onShop={goToShop}
          />
          <HeroSection
            hero={home.hero}
            webTitle={settings.webTitle}
            locale={locale}
            sectionRef={sectionRef("home")}
            onShop={goToShop}
          />
          <AboutSection
            about={home.about}
            locale={locale}
            sectionRef={sectionRef("about")}
          />
          <BenefitsSection
            benefits={home.benefits}
            locale={locale}
            sectionRef={sectionRef("benefits")}
          />
        </div>

        <IngredientSelector
          ingredients={home.ingredients.items}
          locale={locale}
          title={home.ingredients.title[locale]}
          sectionRef={sectionRef("ingredients")}
        />

        <ShopSection
          shop={home.shop}
          locale={locale}
          sectionRef={sectionRef("shop")}
        />

        {!settings.journalDisable && (
          <JournalSection
            journal={home.journal}
            journals={journals}
            journalSlug={journalSlug}
            locale={locale}
            sectionRef={sectionRef("journal")}
          />
        )}
      </div>

      {popupReveal && (
        <Popup
          popup={home.popup}
          locale={locale}
          ref={popupRef}
          onClose={closePopup}
        />
      )}
    </Layout>
  )
}

export default Home
