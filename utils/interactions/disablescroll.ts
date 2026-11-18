type DisableScrollOptions = {
  /** The element to lock, or a selector for it. Omitted, the page is locked. */
  target?: Element | string | null
}

/** Event as the old IE-era handlers read it. */
type LegacyEvent = Event & { returnValue: boolean }

/**
 * Locks scrolling — of the page, or of one element — by swallowing wheel,
 * touch and arrow/space key events, and flags the lock with `__disablescroll`
 * (and `__disabletouch` on touch devices) for the stylesheet.
 */
export class DisableScroll {
  scrolldisabled = false
  target: Element | null = null
  constructor(obj?: DisableScrollOptions) {
    if (obj) {
      if (obj.target !== undefined) {
        const target = obj.target || null
        this.target =
          typeof target === "string" ? document.querySelector(target) : target
      }
    }
    this.disable()
  }
  disable() {
    if (!this.scrolldisabled) {
      this.scrolldisabled = true
      if (this.target === null) {
        if (typeof document !== `undefined`) {
          document.body.classList.add("__disablescroll")
          if ("ontouchstart" in document.documentElement) {
            document.body.classList.add("__disabletouch")
          }
        }
        if (window.addEventListener) {
          window.addEventListener("DOMMouseScroll", this.event.disable, false)
          window.addEventListener("wheel", this.event.disable, {
            passive: false,
          })
          window.addEventListener("mousewheel", this.event.disable, {
            passive: false,
          })
          window.addEventListener("keydown", this.event.keydown, false)
        }
        if ("ontouchstart" in document.documentElement) {
          window.addEventListener("touchstart", this.event.disable, {
            passive: false,
          })
          window.addEventListener("touchmove", this.event.disable, {
            passive: false,
          })
          document.addEventListener("touchstart", this.event.disable, {
            passive: false,
          })
          document.addEventListener("touchmove", this.event.disable, {
            passive: false,
          })
        }
      } else {
        const target = this.target
        target.classList.add("__disablescroll")
        if (target.addEventListener) {
          target.addEventListener("DOMMouseScroll", this.event.disable, false)
          target.addEventListener("wheel", this.event.disable, {
            passive: false,
          })
          target.addEventListener("mousewheel", this.event.disable, {
            passive: false,
          })
          target.addEventListener("keydown", this.event.keydown, false)
        }
        if ("ontouchstart" in document.documentElement) {
          target.addEventListener("touchstart", this.event.disableHard, false)
          target.addEventListener("touchmove", this.event.disableHard, false)
        }
      }
    }
  }
  enable = () => {
    this.scrolldisabled = false
    if (this.target === null) {
      if (typeof document !== `undefined`) {
        document.body.classList.remove("__disablescroll")
        document.body.classList.remove("__disabletouch")
      }

      if (window.removeEventListener) {
        window.removeEventListener("DOMMouseScroll", this.event.disable, false)
        window.removeEventListener("wheel", this.event.disable, false)
        window.removeEventListener("mousewheel", this.event.disable, false)
        window.removeEventListener("keydown", this.event.keydown, false)
      }
      if ("ontouchstart" in document.documentElement) {
        window.removeEventListener("touchstart", this.event.disable, false)
        window.removeEventListener("touchmove", this.event.disable, false)
        document.removeEventListener("touchstart", this.event.disable, false)
        document.removeEventListener("touchmove", this.event.disable, false)
      }
    } else {
      const target = this.target
      target.classList.remove("__disablescroll")
      if (target.removeEventListener) {
        target.removeEventListener("DOMMouseScroll", this.event.disable, false)
        target.removeEventListener("wheel", this.event.disable, false)
        target.removeEventListener("mousewheel", this.event.disable, false)
        target.removeEventListener("keydown", this.event.keydown, false)
      }
      if ("ontouchstart" in document.documentElement) {
        target.removeEventListener("touchstart", this.event.disableHard, false)
        target.removeEventListener("touchmove", this.event.disableHard, false)
        target.removeEventListener("touchend", this.event.disableHard, false)
      }
    }
  }
  event = {
    disable(event: Event) {
      const e = (event || window.event) as LegacyEvent
      if (e.preventDefault) {
        e.preventDefault()
        e.stopPropagation()
      }
      e.returnValue = false
    },
    disableHard: (event: Event) => {
      const e = event as LegacyEvent
      e.returnValue = false
      e.cancelBubble = true
      e.preventDefault()
      e.stopPropagation()
    },
    keydown: (event: Event) => {
      const e = event as KeyboardEvent & LegacyEvent
      // Up, down and space.
      if (e.which === 38 || e.which === 40 || e.which === 32) {
        if (e.preventDefault) e.preventDefault()
        e.returnValue = false
      }
    },
  }
}
