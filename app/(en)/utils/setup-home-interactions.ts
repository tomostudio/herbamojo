import {
  InViewportClass,
  MediaCheck,
  Scrollax,
  ScrollPassClass,
} from "@/utils/interactions"

type Watcher = { kill: () => void }

const q = (selector: string) => document.querySelector(selector)
const isMobile = () => MediaCheck.width.mtablet()

/**
 * The scroll-driven behaviour of the home page, ported from the original's
 * postload. Each section is watched at its own visibility threshold, and most
 * are watched twice — once for desktop, once for the different point at which
 * the mobile layout should react.
 */
export function setupHomeInteractions(setNav: (index: number) => void) {
  const watchers: Watcher[] = []
  const add = (watcher: Watcher) => {
    watchers.push(watcher)
  }
  const navCount = document.querySelectorAll(
    "div.overlay .right_nav .snap_nav > *",
  ).length

  // The bottle floats along until the sections it belongs to are scrolled
  // past, at which point it parks at the bottom of that wrapper.
  add(
    new ScrollPassClass({
      target: ".bottlesection_wrapper",
      detectbottom: true,
      passed: () => q("div.bottlewrapper")?.classList.add("stuck"),
      notpassed: () => q("div.bottlewrapper")?.classList.remove("stuck"),
    }),
  )

  add(
    new InViewportClass({
      target: "section#home",
      visibility: 0.55,
      enter: () => {
        q("#ShopButton")?.classList.add("hide")
        q("section#home")?.classList.add("inview")
        setNav(0)
      },
      exit: () => q("#ShopButton")?.classList.remove("hide"),
    }),
  )

  add(
    new InViewportClass({
      target: "section#about",
      visibility: 0.55,
      enter: () => {
        setNav(1)
        q("section#about")?.classList.add("inview")
      },
    }),
  )
  add(
    new InViewportClass({
      target: "section#about",
      visibility: 0.25,
      enter: () => {
        if (isMobile()) q("section#about")?.classList.add("inview")
      },
      exit: () => {
        if (isMobile()) q("section#about")?.classList.remove("inview")
      },
    }),
  )

  add(
    new InViewportClass({
      target: "section#benefits",
      visibility: 0.55,
      enter: () => {
        setNav(2)
        if (!isMobile()) q("section#benefits")?.classList.add("inview")
      },
      exit: () => q("section#benefits")?.classList.remove("inview"),
    }),
  )
  document
    .querySelectorAll("section#benefits .content.half>div>div")
    .forEach((benefit, index) => {
      add(
        new InViewportClass({
          target: `section#benefits .content.half>div>div:nth-child(${index + 1})`,
          visibility: 0.75,
          enter: () => {
            if (isMobile() && !benefit.classList.contains("inview")) {
              benefit.classList.add("inview")
            }
          },
          exit: () => {
            if (isMobile()) benefit.classList.remove("inview")
          },
        }),
      )
    })

  add(
    new InViewportClass({
      target: "section#ingredients",
      visibility: 0.55,
      enter: () => {
        setNav(3)
        if (!isMobile()) q("section#ingredients")?.classList.add("inview")
      },
      exit: () => {
        if (!isMobile()) q("section#ingredients")?.classList.remove("inview")
      },
    }),
  )
  add(
    new InViewportClass({
      target: "section#ingredients",
      visibility: 0.25,
      enter: () => {
        if (isMobile()) q("section#ingredients")?.classList.add("inview")
      },
      exit: () => {
        if (isMobile()) q("section#ingredients")?.classList.remove("inview")
      },
    }),
  )

  add(
    new InViewportClass({
      target: "section#shop",
      visibility: 0.25,
      enter: () => {
        setNav(4)
        if (!isMobile()) q("section#shop")?.classList.add("inview")
      },
      exit: () => {
        if (!isMobile()) q("section#shop")?.classList.remove("inview")
      },
    }),
  )
  add(
    new InViewportClass({
      target: "section#shop",
      visibility: 0.1,
      enter: () => {
        if (isMobile()) q("section#shop")?.classList.add("inview")
      },
      exit: () => {
        if (isMobile()) q("section#shop")?.classList.remove("inview")
      },
    }),
  )

  add(
    new InViewportClass({
      target: "section#journal",
      visibility: 0.4,
      enter: () => {
        q("section#journal")?.classList.add("inview")
        if (!isMobile()) setNav(5)
      },
      exit: () => q("section#journal")?.classList.remove("inview"),
    }),
  )

  add(
    new InViewportClass({
      target: "section.footer",
      visibility: 0.05,
      enter: () => {
        q("div.overlay")?.classList.add("stuck")
        setNav(-1)
      },
      exit: () => {
        q("div.overlay")?.classList.remove("stuck")
        setNav(navCount - 1)
      },
    }),
  )

  for (const config of [
    { target: ".paralax1", transform_x: -0.25 },
    { target: ".paralax2", transform_x: 0.25 },
    { target: "#ingredients > .bg", transform_y: 0.15 },
    { target: ".mobile.prlx", transform_y: -0.3 },
    { target: "#about .content .bottle", transform_y: -0.3 },
  ]) {
    add(new Scrollax(config))
  }

  return () => {
    for (const watcher of watchers) watcher.kill()
  }
}
