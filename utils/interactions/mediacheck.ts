type WidthClass = "SMALL" | "MOBILE" | "TABLET" | "DESKTOP" | "LARGE"
type HeightClass = "SHORT" | "TALL"

const viewportWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.getElementsByTagName("body")[0].clientWidth

const viewportHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.getElementsByTagName("body")[0].clientHeight

/**
 * The breakpoints the scripts read, matching the stylesheet's. Every check is
 * "at or below", and returns undefined outside the browser.
 */
export const MediaCheck = {
  v: {
    w: {
      small: 450,
      mobile: 700,
      mtablet: 800,
      tablet: 1024,
      desktop: 1280,
    },
    h: {
      short: 500,
    },
  },
  width: {
    get: (): WidthClass | undefined => {
      if (typeof window === "undefined") return undefined
      const W = viewportWidth()
      if (W > MediaCheck.v.w.desktop) return "LARGE"
      if (W > MediaCheck.v.w.tablet) return "DESKTOP"
      if (W > MediaCheck.v.w.mobile) return "TABLET"
      if (W > MediaCheck.v.w.small) return "MOBILE"
      return "SMALL"
    },
    small: () => MediaCheck.checkWidth(MediaCheck.v.w.small),
    mobile: () => MediaCheck.checkWidth(MediaCheck.v.w.mobile),
    mtablet: () => MediaCheck.checkWidth(MediaCheck.v.w.mtablet),
    tablet: () => MediaCheck.checkWidth(MediaCheck.v.w.tablet),
    desktop: () => MediaCheck.checkWidth(MediaCheck.v.w.desktop),
  },
  height: {
    get: (): HeightClass | undefined => {
      if (typeof window === "undefined") return undefined
      return viewportHeight() <= MediaCheck.v.h.short ? "SHORT" : "TALL"
    },
    short: () => MediaCheck.checkHeight(MediaCheck.v.h.short),
  },
  checkHeight: (tresh: number): boolean | undefined => {
    if (typeof window === "undefined") return undefined
    return viewportHeight() <= tresh
  },
  checkWidth: (tresh: number): boolean | undefined => {
    if (typeof window === "undefined") return undefined
    return viewportWidth() <= tresh
  },
}

/** The Network Information API, which only Chromium browsers expose. */
type NetworkInformation = { downlink: number; effectiveType: string }
type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

/**
 * FAST or SLOW from the Network Information API; ERROR where it is missing
 * (Safari, Firefox), so the caller can measure the link another way.
 */
export const ConnectionSpeed = (): "FAST" | "SLOW" | "ERROR" => {
  const nav = navigator as NavigatorWithConnection
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  if (!connection) return "ERROR"
  return connection.downlink >= 1 && !connection.effectiveType.includes("2g")
    ? "FAST"
    : "SLOW"
}
