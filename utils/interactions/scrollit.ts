import { EASINGS, type Easing } from "./easings"

/**
 * Scrolls the window to `destination` (a y offset, or an element's offsetTop)
 * over `duration` ms along `easing`, stopping early at the bottom of the
 * page. Ported from the original, which uses it on mobile for the shop
 * buttons.
 */
export const ScrollIt = (
  destination: number | HTMLElement,
  duration = 200,
  easing: Easing = "linear",
  callback?: () => void,
) => {
  const start = window.pageYOffset
  const startTime = "now" in window.performance ? performance.now() : Date.now()

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  )
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight
  const destinationOffset =
    typeof destination === "number" ? destination : destination.offsetTop
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset,
  )

  if (typeof window.requestAnimationFrame !== "function") {
    window.scroll(0, destinationOffsetToScroll)
    callback?.()
    return
  }

  const scroll = () => {
    const now = "now" in window.performance ? performance.now() : Date.now()
    const time = Math.min(1, (now - startTime) / duration)
    const timeFunction = EASINGS[easing](time)
    window.scroll(
      0,
      Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start),
    )

    if (window.pageYOffset === destinationOffsetToScroll) {
      callback?.()
      return
    }

    requestAnimationFrame(scroll)
  }

  scroll()
}
