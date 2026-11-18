type ScrollSnapOptions = {
  /** Selector for the sections to snap between. */
  sections_identifier?: string
  /** Selector for the dot navigation; empty for none. */
  snap_identifier?: string
  snap_child_identifier?: string
  snap_active_class?: string
  forceDisable?: boolean
  delay?: number
  init_delay?: number
  sensitivity?: number
  speed?: number
  minimum_speed?: number
  maxduration?: number
  hasfooter?: boolean
  hide_nav_oncover?: boolean
  hide_nav_onfooter?: boolean
  /** Snapping switches off below this viewport width / height. */
  responsive_width?: number
  responsive_height?: number
  afterScrollEvent?: () => void
  beforeScrollEvent?: () => void
}

import { EASINGS } from "./easings"

/** Event as the old IE-era handlers read it. */
type LegacyEvent = { returnValue: boolean }

/**
 * Full-page section snapping: each wheel flick, arrow/space key or swipe
 * scrolls to the next or previous section, with an eased scroll. Switches
 * itself off when a section is taller than the viewport or the viewport is
 * below the responsive thresholds, and flags `__snapon` (and
 * `__snaphastouch`) on the body while active.
 */
export class ScrollSnapClass {
  v: {
    lastpos: number
    xDown: number | null
    yDown: number | null
    hasfooter: boolean
    responsiveWidth: { treshold: number; enable: boolean }
    responsiveHeight: { treshold: number; enable: boolean }
    sections: {
      identifier: string
      all: NodeListOf<HTMLElement> | null
      length: number
      current: number
      targets: number[] | null
    }
    snap: {
      enable: boolean
      pause: boolean
      forceDisable: boolean
      treshold: number
    }
    nav: {
      identifier: string
      scrollingicon: string
      childIdentifier: string
      childClass?: string
      children: NodeListOf<HTMLElement> | null
      current: number | string
      hideonfooter: boolean
      hideoncover: boolean
      customnav: boolean
      activeClass: string
    }
    scroll: {
      snapping: boolean
      initdelay: number
      direction: boolean
      speed: number
      delay: number
      sensitivity: number
      minduration: number
      maxduration: number
    }
    listener: { init: boolean; inittriggered: boolean }
  } = {
    lastpos: 0,
    xDown: null,
    yDown: null,
    hasfooter: false,
    responsiveWidth: {
      treshold: 0,
      enable: true,
    },
    responsiveHeight: {
      treshold: 0,
      enable: true,
    },
    sections: {
      identifier: "",
      all: null,
      length: 0,
      current: 0,
      targets: null,
    },
    snap: {
      enable: true,
      pause: false,
      forceDisable: false,
      treshold: 400,
    },
    nav: {
      identifier: "",
      scrollingicon: "",
      childIdentifier: "> *",
      children: null,
      current: 0,
      hideonfooter: true,
      hideoncover: false,
      customnav: false,
      activeClass: "active",
    },
    scroll: {
      snapping: false,
      initdelay: 0,
      direction: true,
      speed: 500,
      delay: 400,
      sensitivity: 10,
      minduration: 300,
      maxduration: 1500,
    },
    listener: {
      init: false,
      inittriggered: false,
    },
  }
  common = {
    windowHeight: () => {
      return (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName("body")[0].clientHeight
      )
    },
    windowWidth: () => {
      return (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.getElementsByTagName("body")[0].clientWidth
      )
    },
    scrollPosition: () => {
      return window.pageYOffset || document.documentElement.scrollTop
    },
  }
  scrollEvent = {
    before: () => {},
    after: () => {},
  }
  constructor(obj: ScrollSnapOptions) {
    this.kill()

    this.v.snap.pause = false
    this.v.snap.enable = true
    this.v.snap.forceDisable = obj.forceDisable || false
    this.v.sections.identifier =
      typeof obj.sections_identifier === "string"
        ? obj.sections_identifier
        : "section.snap"
    this.v.scroll.delay = obj.delay || 200
    this.v.scroll.initdelay = obj.init_delay || 500
    this.v.scroll.sensitivity = obj.sensitivity || 10
    this.v.scroll.speed = obj.speed || 500
    this.v.scroll.minduration = obj.minimum_speed || 300
    this.v.scroll.maxduration = obj.maxduration || 1500

    this.v.hasfooter = obj.hasfooter !== undefined ? obj.hasfooter : false
    this.v.nav.hideoncover =
      obj.hide_nav_oncover !== undefined ? obj.hide_nav_oncover : false
    this.v.nav.hideonfooter =
      obj.hide_nav_onfooter !== undefined ? obj.hide_nav_onfooter : true
    this.v.responsiveWidth.treshold = obj.responsive_width || 0
    this.v.responsiveHeight.treshold = obj.responsive_height || 0
    this.v.nav.identifier =
      obj.snap_identifier !== undefined ? obj.snap_identifier : ""
    this.v.nav.childClass =
      obj.snap_child_identifier !== undefined
        ? obj.snap_child_identifier
        : "> *"
    this.v.nav.activeClass = obj.snap_active_class || "active"
    if (typeof document !== "undefined") {
      this.v.sections.all = document.querySelectorAll<HTMLElement>(
        this.v.sections.identifier,
      )
    }

    if (obj.afterScrollEvent && typeof obj.afterScrollEvent === "function") {
      this.scrollEvent.after = obj.afterScrollEvent
    }

    if (obj.beforeScrollEvent && typeof obj.beforeScrollEvent === "function") {
      this.scrollEvent.before = obj.beforeScrollEvent
    }
  }
  init() {
    this.kill()
    this.v.snap.pause = false
    this.v.snap.enable = true
    this.v.sections.current = 0
    window.scroll(0, 0)
    this.snap.setup()
    //EVENT LISTENER
    this.event.init()
  }
  kill() {
    this.v.snap.enable = false
    this.event.remove()
    if (typeof document !== "undefined") {
      document.body.classList.remove("__snapon")
      document.body.classList.remove("__snaphastouch")
    }
  }
  pause() {
    this.v.snap.pause = true
  }
  play() {
    this.v.snap.pause = false
    this.snap.setup()
  }
  reset() {
    this.kill()
    this.init()
  }
  snap = {
    setup: () => {
      this.v.snap.pause = false
      this.v.snap.enable = true

      document.body.classList.add("__snapon")

      const all = document.querySelectorAll<HTMLElement>(
        this.v.sections.identifier,
      )
      this.v.sections.all = all

      //SETUP SCROLL POSITIONING FOR EACH SECTION
      this.snap.setuptargets()

      //CHECK ALL SECTIONS AND DISABLE SNAP IF ANY OF THE SECTIONS HAS HEIGHT BIGGER THAN THE WINDOW
      let checkheight = false
      // CHECK IF THERE IS A NAV ATTR ON SECTION
      let navAtrCheck = true
      all.forEach((each) => {
        // CHECK HEIGHT HERE
        if (
          each.clientHeight > this.common.windowHeight() ||
          this.common.windowHeight() < this.v.responsiveHeight.treshold
        ) {
          checkheight = true
        }

        //CHECK CUSTOM NAV POSITIONING
        if (each.getAttribute("nav") != null) {
          const intCheck = Number(each.getAttribute("nav"))
          if (typeof intCheck !== "number") navAtrCheck = false
        } else {
          navAtrCheck = false
        }
      })

      if (checkheight) {
        this.v.snap.enable = false
      }

      if (navAtrCheck) {
        this.v.nav.customnav = true
      }

      //PUSH LENGTH TO GLOBAL VARIABLE
      this.v.sections.length = all.length

      // ------
      //SNAP NAVIGATION SETUP
      //CHECK WHERE TO GO and NAVIGATION
      //CLICK TRIGGER NAV TO GO TO THE SET SECTION

      //SETUP CUSTOM NAV TRIGGER
      // Custom nav positioning was never finished in the original; the
      // targets stay empty and the plain index is used.
      const navtarget: number[] = []

      //SET TRIGGER
      if (this.v.nav.identifier !== "") {
        const children = document.querySelectorAll<HTMLElement>(
          `${this.v.nav.identifier} ${this.v.nav.childIdentifier}`,
        )
        this.v.nav.children = children

        children.forEach((child, index) => {
          child.onclick = null
          child.onclick = () => {
            if (this.v.snap.enable && !this.v.snap.pause) {
              if (!this.v.nav.customnav) {
                this.snap.to(index)
              } else {
                this.snap.to(navtarget[index])
              }
            }
          }
        })
      }

      //CHECK WIDTH AND DISABLE SNAP IF WIDTH IS LESS THAN THE TRESHOLD SET

      if (this.common.windowWidth() < this.v.responsiveWidth.treshold) {
        this.v.snap.enable = false
      }
      if (this.v.snap.enable && !this.v.snap.forceDisable) {
        //CHECK CURRENT POSITION AND ADJUST
        const checkcur = Math.floor(
          this.common.scrollPosition() / this.common.windowHeight(),
        )
        if (checkcur >= this.v.sections.length) {
          this.v.sections.current = this.v.sections.length - 1
        } else {
          this.v.sections.current = checkcur
        }
        this.snap.scrolling()
        // TURN ON CLASS
        document.body.classList.add("__snapon")
      } else {
        // TURN OFF CLASS
        document.body.classList.remove("__snapon")
      }

      if (
        "ontouchstart" in document.documentElement &&
        this.v.snap.enable &&
        !this.v.snap.forceDisable
      ) {
        document.body.classList.add("__snaphastouch")
      } else {
        document.body.classList.remove("__snaphastouch")
      }

      //SETUP SCROLL POSITIONING FOR EACH SECTION
      this.snap.setuptargets()
    },

    setuptargets: () => {
      const targets: number[] = []
      this.v.sections.targets = targets

      this.v.sections.all?.forEach((each, index) => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop
        targets.push(each.getBoundingClientRect().top + scrollTop)

        if (this.v.hasfooter && index + 1 === this.v.sections.length) {
          const footeroffset = each.offsetHeight - this.common.windowHeight()
          targets.push(targets[index] + footeroffset)
        }
      })
    },

    down: () => {
      if (
        this.v.snap.enable &&
        !this.v.scroll.snapping &&
        !this.scrollit.scrolling &&
        !this.v.snap.pause &&
        !this.v.snap.forceDisable
      ) {
        this.v.sections.current++
        if (this.v.sections.current > this.v.sections.length - 1) {
          this.v.sections.current = this.v.sections.length - 1
        } else {
          this.snap.scrolling()
        }
      }
    },
    to: (target: number) => {
      if (
        !this.v.scroll.snapping &&
        !this.scrollit.scrolling &&
        !this.v.snap.pause
      ) {
        this.v.sections.current = target
        this.snap.scrolling()
      }
    },
    up: () => {
      if (
        this.v.snap.enable &&
        !this.v.scroll.snapping &&
        !this.scrollit.scrolling &&
        !this.v.snap.pause &&
        !this.v.snap.forceDisable
      ) {
        this.v.sections.current--
        if (this.v.sections.current < 0) {
          this.v.sections.current = 0
        } else {
          this.snap.scrolling()
        }
      }
    },
    scrolling: () => {
      if (
        !this.v.scroll.snapping &&
        !this.scrollit.scrolling &&
        !this.v.snap.pause
      ) {
        this.v.scroll.snapping = true

        // ADJUST NAVIGATION
        if (!this.v.snap.pause && this.v.nav.identifier !== "") {
          if (
            this.v.hasfooter &&
            this.v.sections.current === this.v.sections.length
          ) {
            this.nav.set(-1)
          } else {
            // The original checks a `nav.customnav` flag here that nothing
            // ever sets, so the plain index is always what is used.
            this.nav.set(this.v.sections.current)
          }
        }

        const topval = this.v.sections.targets?.[this.v.sections.current] ?? 0

        const dist = Math.abs(topval - this.common.scrollPosition())
        let duration = (dist / this.common.windowHeight()) * this.v.scroll.speed
        if (duration < this.v.scroll.minduration)
          duration = this.v.scroll.minduration
        if (duration > this.v.scroll.maxduration)
          duration = this.v.scroll.maxduration

        this.scrollEvent.before()
        this.scrollit.go(topval, duration)

        setTimeout(() => {
          this.v.scroll.snapping = false
        }, duration + this.v.scroll.delay)
      }
    },
  }
  event = {
    init: () => {
      if (!this.v.listener.init) {
        if (this.v.listener.inittriggered) this.event.remove()

        this.v.listener.inittriggered = true
        this.v.listener.init = true
        if (window.addEventListener) {
          window.addEventListener("DOMMouseScroll", this.event.scroll, false)
          window.addEventListener("wheel", this.event.scroll, {
            passive: false,
          })
          window.addEventListener("mousewheel", this.event.scroll, {
            passive: false,
          })
          window.addEventListener("keydown", this.event.keydown, false)
        }

        if ("ontouchstart" in document.documentElement) {
          document.addEventListener("touchstart", this.event.touchstart, false)
          document.addEventListener("touchmove", this.event.touchmove, false)
          document.addEventListener("touchend", this.event.touchend, false)
        }

        window.addEventListener("resize", this.event.resize)

        this.v.snap.pause = false
      }
    },
    remove: () => {
      if (this.v.listener.init) {
        if (window.removeEventListener) {
          window.removeEventListener("DOMMouseScroll", this.event.scroll, false)
          window.removeEventListener("wheel", this.event.scroll, false)
          window.removeEventListener("mousewheel", this.event.scroll, false)
          window.removeEventListener("keydown", this.event.keydown, false)
        }

        if ("ontouchstart" in document.documentElement) {
          document.removeEventListener(
            "touchstart",
            this.event.touchstart,
            false,
          )
          document.removeEventListener("touchmove", this.event.touchmove, false)
          document.removeEventListener("touchend", this.event.touchend, false)
        }
        window.removeEventListener("resize", this.event.resize)
        this.v.listener.init = false
      }
    },
    resizeTimeout: null as ReturnType<typeof setTimeout> | null,
    resizePause: false,
    resize: () => {
      this.event.resizePause = true
      if (this.event.resizeTimeout != null) {
        clearTimeout(this.event.resizeTimeout)
      }
      //SET DELAY AND DISABLE SCROLL ONLY AFTER THE RESIZE EVENT IS RESOLVE
      this.event.resizeTimeout = setTimeout(() => {
        this.snap.setuptargets()
        this.event.resizePause = false
        this.snap.setup()
      }, 250)
    },
    scrolling: false,
    scrollStatus: {
      direction: null as "UP" | "DOWN" | null,
      lastDeltaY: 0,
    },
    scrollResetTimeout: null as ReturnType<typeof setTimeout> | null,
    srtDelay: 500,
    scroll: (event: Event) => {
      if (this.v.snap.enable && !this.v.snap.forceDisable) {
        const e = (event || window.event) as WheelEvent & LegacyEvent
        if (e.preventDefault) e.preventDefault()
        e.returnValue = false
        if (e.deltaY < -this.v.scroll.sensitivity) {
          if (!this.event.scrolling) {
            if (!this.v.snap.pause && !this.event.resizePause) this.snap.up()
            this.event.scrolling = true
            this.event.scrollStatus.direction = "UP"

            // SET TIMEOUT TO RESET SCROLL
            if (this.event.scrollResetTimeout != null) {
              clearTimeout(this.event.scrollResetTimeout)
            }
            this.event.scrollResetTimeout = setTimeout(() => {
              this.event.scrolling = false
              this.event.scrollStatus.direction = null
              this.event.scrollResetTimeout = null
            }, this.event.srtDelay)
          }
        }
        if (e.deltaY > this.v.scroll.sensitivity) {
          if (!this.event.scrolling) {
            if (!this.v.snap.pause && !this.event.resizePause) this.snap.down()
            this.event.scrolling = true
            this.event.scrollStatus.direction = "DOWN"

            // SET TIMEOUT TO RESET SCROLL
            if (this.event.scrollResetTimeout != null) {
              clearTimeout(this.event.scrollResetTimeout)
            }
            this.event.scrollResetTimeout = setTimeout(() => {
              this.event.scrolling = false
              this.event.scrollStatus.direction = null
              this.event.scrollResetTimeout = null
            }, this.event.srtDelay)
          }
        }

        // ADDED SCROLL BREAK, WHICH WILL STOP SNAPPING IF THE USER SCROLLED TOO HARD
        // THIS SCRIPT WILL DISABLE THE SCROLL WHEN SCROLL SNAP IS DETECTED
        // THEN IT WILL DETECT WHEN THE SCROLL SPEED WHEN DOWN OR WHEN THE OTHER DIRECTION, THEN IT WILL ENABLE IT

        const _l = this.event.scrollStatus.lastDeltaY
        if (_l > e.deltaY) {
          if (this.event.scrollStatus.direction === "UP") {
            this.event.scrolling = false
            // RESET TIMEOUT
            if (this.event.scrollResetTimeout != null) {
              clearTimeout(this.event.scrollResetTimeout)
              this.event.scrollResetTimeout = null
            }
            this.event.scrollStatus.direction = "DOWN"
          } else {
            this.event.scrollStatus.direction = "DOWN"
          }
        } else if (_l < e.deltaY) {
          if (this.event.scrollStatus.direction === "DOWN") {
            this.event.scrolling = false
            // RESET TIMEOUT
            if (this.event.scrollResetTimeout != null) {
              clearTimeout(this.event.scrollResetTimeout)
              this.event.scrollResetTimeout = null
            }
            this.event.scrollStatus.direction = "UP"
          } else {
            this.event.scrollStatus.direction = "UP"
          }
        } else {
          this.event.scrollStatus.direction = null
        }

        this.event.scrollStatus.lastDeltaY = e.deltaY
      }
    },
    keydown: (event: Event) => {
      if (this.v.snap.enable && !this.v.snap.forceDisable) {
        const e = (event || window.event) as KeyboardEvent & LegacyEvent
        // Up, down and space.
        if (e.which === 38 || e.which === 40 || e.which === 32) {
          if (e.preventDefault) e.preventDefault()
          e.returnValue = false
        }
        switch (e.which) {
          case 38:
            if (!this.v.snap.pause && !this.event.resizePause) this.snap.up()
            break

          case 40:
          case 32:
            if (!this.v.snap.pause && !this.event.resizePause) this.snap.down()
            break
          default:
            break
        }
      }
    },
    touchstart: (evt: TouchEvent) => {
      if (this.v.snap.enable && !this.v.snap.forceDisable) {
        this.v.xDown = evt.touches[0].clientX
        this.v.yDown = evt.touches[0].clientY
      }
      evt.preventDefault()
    },
    touchmove: (evt: TouchEvent) => {
      if (this.v.snap.enable && !this.v.snap.forceDisable) {
        if (!this.v.xDown || !this.v.yDown) {
          return
        }

        const xUp = evt.touches[0].clientX
        const yUp = evt.touches[0].clientY

        const xDiff = this.v.xDown - xUp
        const yDiff = this.v.yDown - yUp

        // A mostly sideways swipe does nothing.
        if (
          !this.v.snap.pause &&
          !this.event.resizePause &&
          Math.abs(xDiff) <= Math.abs(yDiff)
        ) {
          if (yDiff > 0) {
            this.snap.down()
          } else {
            this.snap.up()
          }
        }
        this.v.xDown = null
        this.v.yDown = null
        evt.preventDefault()
      }
    },
    // Listened to by the original, which never gave it anything to do.
    touchend: () => {},
  }
  nav = {
    // GO TO NAV
    set: (nav: number) => {
      // querySelector throws on an empty selector, so check it first.
      if (this.v.nav.identifier === "") return
      const navElement = document.querySelector(this.v.nav.identifier)
      if (navElement) {
        this.v.nav.current = nav
        const children = document.querySelectorAll<HTMLElement>(
          `${this.v.nav.identifier} ${this.v.nav.childIdentifier}`,
        )
        this.v.nav.children = children

        if (children.length > 0) {
          children.forEach((each, index) => {
            if (index === this.v.nav.current) {
              each.classList.add(this.v.nav.activeClass)
            } else {
              each.classList.remove(this.v.nav.activeClass)
            }
          })

          if (this.v.nav.hideoncover) {
            if (nav === 0) {
              navElement.classList.add("hide_nav")
            } else {
              navElement.classList.remove("hide_nav")
            }
          }

          if (this.v.nav.hideonfooter) {
            if (nav < 0) {
              navElement.classList.add("hide_nav")
            } else {
              navElement.classList.remove("hide_nav")
            }
          }

          if (this.v.nav.scrollingicon !== "") {
            if (this.v.nav.current !== 0) {
              document
                .querySelector(this.v.nav.scrollingicon)
                ?.classList.add("hide_icon")
            } else {
              document
                .querySelector(this.v.nav.scrollingicon)
                ?.classList.remove("hide_icon")
            }
          }
        }
      }
    },
  }
  scrollit = {
    scrolling: false,
    go: (
      destination: number | HTMLElement,
      duration = 200,
      easing: keyof typeof EASINGS = "easeInOutQuad",
      callback?: () => void,
    ) => {
      this.scrollit.scrolling = true

      const start = window.pageYOffset
      const startTime =
        "now" in window.performance ? performance.now() : Date.now()

      const windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName("body")[0].clientHeight

      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      )

      const destinationOffset =
        typeof destination === "number" ? destination : destination.offsetTop

      const destinationOffsetToScroll = Math.round(
        documentHeight - destinationOffset < windowHeight
          ? documentHeight - windowHeight
          : destinationOffset,
      )

      if (!("requestAnimationFrame" in window)) {
        if (callback) {
          callback()
        }
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
          this.scrollit.scrolling = false
          window.scroll(0, destinationOffsetToScroll)
          this.snap.scrolling()
          this.scrollEvent.after()
          if (callback) {
            callback()
          }
          return
        }

        requestAnimationFrame(scroll)
      }

      scroll()
    },
  }
}
