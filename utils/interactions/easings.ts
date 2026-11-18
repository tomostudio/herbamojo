/** Easing curves for the scripted scrolls, t from 0 to 1. */
export const EASINGS = {
  linear(t: number) {
    return t
  },
  easeInQuad(t: number) {
    return t * t
  },
  easeOutQuad(t: number) {
    return t * (2 - t)
  },
  easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  easeInCubic(t: number) {
    return t * t * t
  },
  easeOutCubic(t: number) {
    const u = t - 1
    return u * u * u + 1
  },
  easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
  easeInQuart(t: number) {
    return t * t * t * t
  },
  easeOutQuart(t: number) {
    const u = t - 1
    return 1 - u * u * u * u
  },
  easeInOutQuart(t: number) {
    if (t < 0.5) return 8 * t * t * t * t
    const u = t - 1
    return 1 - 8 * u * u * u * u
  },
  easeInQuint(t: number) {
    return t * t * t * t * t
  },
  easeOutQuint(t: number) {
    const u = t - 1
    return 1 + u * u * u * u * u
  },
  easeInOutQuint(t: number) {
    if (t < 0.5) return 16 * t * t * t * t * t
    const u = t - 1
    return 1 + 16 * u * u * u * u * u
  },
}

export type Easing = keyof typeof EASINGS
