type Target = Element | string | null

const resolveTarget = (target: Target | undefined) =>
  typeof target === "string" ? document.querySelector(target) : target || null

type Sides = { top: number; right: number; bottom: number; left: number }

export type InViewportResult = {
  detected: boolean
  /** The share of the element inside the viewport, 0–1. */
  visibility: number
  targetdistance: DOMRect | null
  margin: Sides | null
  /** How much of the element each viewport edge leaves visible, 0–1. */
  visibleCoor: Sides | null
}

export type PassResult = {
  passed: boolean
  target: DOMRect | null
  margin: number
  detectbottom: boolean
}

type InViewportOptions = {
  target?: Target
  margin_top?: number
  margin_right?: number
  margin_bottom?: number
  margin_left?: number
  /** The share of the element that has to be visible to count, 0–1. */
  visibility?: number
  enter?: (result: InViewportResult) => void
  exit?: (result: InViewportResult) => void
  always?: (result: InViewportResult) => void
}

type ScrollPassOptions = {
  target?: Target
  detectbottom?: boolean
  madetectbottomrgin?: boolean
  passed?: (result: PassResult) => void
  notpassed?: (result: PassResult) => void
  always?: (result: PassResult) => void
}

/**
 * Watches an element on scroll and calls enter / exit as it comes into and
 * leaves the viewport, by the visibility threshold; always runs on every
 * scroll.
 */
export class InViewportClass {
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
  scrolltarget: Element | null = null
  visibility = 0.1
  inview = false
  constructor(obj: InViewportOptions) {
    this.margin.top = obj.margin_top || 0
    this.margin.right = obj.margin_right || 0
    this.margin.bottom = obj.margin_bottom || 0
    this.margin.left = obj.margin_left || 0
    this.visibility = obj.visibility !== undefined ? obj.visibility : 0.1

    this.scrolltarget = resolveTarget(obj.target)

    if (
      obj.enter !== null &&
      obj.enter !== undefined &&
      typeof obj.enter === "function"
    )
      this.enter = obj.enter
    if (
      obj.exit !== null &&
      obj.exit !== undefined &&
      typeof obj.exit === "function"
    )
      this.exit = obj.exit
    if (
      obj.always !== null &&
      obj.always !== undefined &&
      typeof obj.always === "function"
    )
      this.always = obj.always

    window.addEventListener("scroll", this.trigger, false)
    this.trigger()
  }
  set(obj: InViewportOptions) {
    if (obj.margin_top) this.margin.top = obj.margin_top || 0
    if (obj.margin_right) this.margin.right = obj.margin_right || 0
    if (obj.margin_bottom) this.margin.bottom = obj.margin_bottom || 0
    if (obj.margin_left) this.margin.left = obj.margin_left || 0
    if (obj.visibility)
      this.visibility = obj.visibility !== undefined ? obj.visibility : 0.1

    if (obj.target) {
      this.scrolltarget = resolveTarget(obj.target)
    }

    if (
      obj.enter !== null &&
      obj.enter !== undefined &&
      typeof obj.enter === "function"
    )
      this.enter = obj.enter
    if (
      obj.exit !== null &&
      obj.exit !== undefined &&
      typeof obj.exit === "function"
    )
      this.exit = obj.exit
    if (
      obj.always !== null &&
      obj.always !== undefined &&
      typeof obj.always === "function"
    )
      this.always = obj.always

    this.trigger()
  }
  kill = () => {
    window.removeEventListener("scroll", this.trigger, false)
  }
  enter(_result: InViewportResult) {}
  exit(_result: InViewportResult) {}
  always(_result: InViewportResult) {}
  trigger = () => {
    if (this.scrolltarget !== null) {
      const inview = InViewportDetect(
        this.scrolltarget,
        this.margin.top,
        this.margin.right,
        this.margin.bottom,
        this.margin.left,
        this.visibility,
      )
      this.always(inview)
      if (inview.detected) {
        if (!this.inview) {
          this.inview = true
          this.enter(inview)
        }
      } else {
        if (this.inview) {
          this.inview = false
          this.exit(inview)
        }
      }
    }
  }
}

/**
 * Watches whether an element has been scrolled past — its bottom above the
 * bottom of the viewport, or its top above the top — and calls passed /
 * notpassed as that changes.
 */
export class ScrollPassClass {
  scrolltarget: Element | null = null
  scrollpassed = false
  detectbottom = true
  constructor(obj: ScrollPassOptions) {
    this.scrolltarget = resolveTarget(obj.target)
    this.detectbottom = obj.detectbottom || true

    if (
      obj.passed !== null &&
      obj.passed !== undefined &&
      typeof obj.passed === "function"
    )
      this.passed = obj.passed
    if (
      obj.notpassed !== null &&
      obj.notpassed !== undefined &&
      typeof obj.notpassed === "function"
    )
      this.notpassed = obj.notpassed
    if (
      obj.always !== null &&
      obj.always !== undefined &&
      typeof obj.always === "function"
    )
      this.always = obj.always

    window.addEventListener("scroll", this.trigger, false)
    this.trigger()
  }
  set(obj: ScrollPassOptions) {
    if (obj.madetectbottomrgin) this.detectbottom = obj.detectbottom || true

    if (obj.target) {
      this.scrolltarget = resolveTarget(obj.target)
    }
    if (
      obj.passed !== null &&
      obj.passed !== undefined &&
      typeof obj.passed === "function"
    )
      this.passed = obj.passed
    if (
      obj.notpassed !== null &&
      obj.notpassed !== undefined &&
      typeof obj.notpassed === "function"
    )
      this.notpassed = obj.notpassed
    if (
      obj.always !== null &&
      obj.always !== undefined &&
      typeof obj.always === "function"
    )
      this.always = obj.always

    this.trigger()
  }
  kill = () => {
    window.removeEventListener("scroll", this.trigger, false)
  }
  passed(_result: PassResult) {}
  notpassed(_result: PassResult) {}
  always(_result: PassResult) {}
  trigger = () => {
    if (this.scrolltarget !== null) {
      const passdetect = PassDetect(this.scrolltarget, this.detectbottom)
      this.always(passdetect)
      if (passdetect.passed !== null && passdetect.passed !== undefined) {
        if (this.scrollpassed && !passdetect.passed) {
          this.scrollpassed = passdetect.passed
          this.notpassed(passdetect)
        } else if (!this.scrollpassed && passdetect.passed) {
          this.scrollpassed = passdetect.passed
          this.passed(passdetect)
        }
      }
    }
  }
}
export const PassDetect = (
  target: Target = null,
  detectbottom = true,
): PassResult => {
  const returnobj: PassResult = {
    passed: false,
    target: null,
    margin: 0,
    detectbottom: true,
  }
  const vh =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight
  const element = resolveTarget(target)
  if (element !== null) {
    const _t = element.getBoundingClientRect()
    returnobj.target = _t
    returnobj.detectbottom = detectbottom

    if (detectbottom) {
      if (_t.bottom < vh) {
        returnobj.passed = true
      } else {
        returnobj.passed = false
      }
    } else {
      if (_t.top < 0) {
        returnobj.passed = true
      } else {
        returnobj.passed = false
      }
    }
  }
  return returnobj
}

export const InViewportDetect = (
  target: Target = null,
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
  visibility = 0.5,
): InViewportResult => {
  const returnobj: InViewportResult = {
    detected: false,
    visibility: 0,
    targetdistance: null,
    margin: null,
    visibleCoor: null,
  }
  const element = resolveTarget(target)
  if (element !== null) {
    const visibleMultipler = 1 - Math.min(visibility, 1)

    const distance = element.getBoundingClientRect()
    returnobj.targetdistance = distance

    const margin = {
      top: top - distance.height * visibleMultipler,
      left: left - distance.width * visibleMultipler,
      bottom:
        (window.innerHeight || document.documentElement.clientHeight) +
        distance.height * visibleMultipler -
        bottom,
      right:
        (window.innerWidth || document.documentElement.clientWidth) +
        distance.width * visibleMultipler -
        right,
    }

    returnobj.margin = margin

    let detected = false
    if (
      distance.top >= margin.top &&
      distance.left >= margin.left &&
      distance.bottom <= margin.bottom &&
      distance.right <= margin.right
    ) {
      detected = true
    }
    //CALCULATE VISIBLE FROM
    const visibleLeft = Math.max(
      Math.min((distance.width - left + distance.left) / distance.width, 1),
      0,
    )
    const visibleRight = Math.max(
      Math.min(
        (distance.width +
          ((window.innerWidth || document.documentElement.clientWidth) -
            right -
            distance.right)) /
          distance.width,
        1,
      ),
      0,
    )
    const visibleTop = Math.max(
      Math.min((distance.height - top + distance.top) / distance.height, 1),
      0,
    )
    const visibleBottom = Math.max(
      Math.min(
        (distance.height +
          ((window.innerHeight || document.documentElement.clientHeight) -
            bottom -
            distance.bottom)) /
          distance.height,
        1,
      ),
      0,
    )

    //CALCULATE GET THE OVERALL MINIMUM VISIBLITY
    const visible = Math.min(
      visibleLeft,
      visibleRight,
      visibleTop,
      visibleBottom,
    )

    returnobj.visibleCoor = {
      left: visibleLeft,
      right: visibleRight,
      top: visibleTop,
      bottom: visibleBottom,
    }

    returnobj.visibility = visible
    returnobj.detected = detected
  } else {
    returnobj.detected = false
  }
  return returnobj
}
