/** Whether any page has finished loading since the site was opened. */
export let firstload = false

type LoaderOptions = {
  /** Selector of the element whose images are waited for; null for all. */
  parent?: string | null
  checkimage?: boolean
  intervalcheck?: () => void
  intervalcheck_function?: () => void
  postload?: () => void
  firstload_delay?: number
  default_delay?: number
  reload_delay?: number
}

/**
 * Holds a page behind the loading screen until a minimum time has passed and
 * every image under `parent` has loaded (or failed), then calls postload.
 */
export class LoaderClass {
  loadcheck = {
    time: false,
    data: false,
    page: false,
    reload: false,
    images: false,
  }
  delay = {
    firstload: 0,
    default: 250,
    reload: 250,
  }
  timeout: { time: ReturnType<typeof setTimeout> | null } = {
    time: null,
  }
  images: {
    check: boolean
    init: boolean
    list: NodeListOf<HTMLImageElement> | null
    loaded: number
  } = {
    check: true,
    init: false,
    list: null,
    loaded: 0,
  }
  parent: string | null
  constructor(obj: LoaderOptions) {
    this.loadcheck.time = false
    this.loadcheck.data = false
    this.loadcheck.page = false
    this.loadcheck.reload = false
    this.loadcheck.images = false
    this.images.check = obj.checkimage !== undefined ? obj.checkimage : true

    this.parent = obj.parent !== null ? (obj.parent ?? null) : null

    if (
      obj.intervalcheck !== null &&
      obj.intervalcheck !== undefined &&
      typeof obj.intervalcheck === "function" &&
      obj.intervalcheck_function
    )
      this.intervalcheck = obj.intervalcheck_function
    if (
      obj.postload !== null &&
      obj.postload !== undefined &&
      typeof obj.postload === "function"
    )
      this.postload = obj.postload

    if (obj.firstload_delay) this.delay.firstload = obj.firstload_delay
    if (obj.default_delay) this.delay.default = obj.default_delay
    if (obj.reload_delay) this.delay.reload = obj.reload_delay

    if (!this.images.check) this.loadcheck.images = true
  }
  intervalcheck() {}
  postload() {}
  reset() {
    this.loadcheck.page = false
  }
  load() {
    this.intervalcheck()
    if (
      this.loadcheck.time &&
      this.loadcheck.data &&
      this.loadcheck.reload &&
      this.loadcheck.images &&
      !this.loadcheck.page
    ) {
      if (this.delay.firstload > 0) {
        if (firstload) {
          this.loadcheck.page = true

          firstload = true
          setTimeout(this.loadfinish, this.delay.firstload)
        } else {
          this.loadcheck.page = true

          this.loadfinish()
        }
      } else {
        this.loadcheck.page = true

        this.loadfinish()
      }
    }
  }
  loadfinish() {
    if (
      this.loadcheck.time &&
      this.loadcheck.data &&
      this.loadcheck.reload &&
      this.loadcheck.images &&
      this.loadcheck.page
    )
      this.postload()
  }
  mountload() {
    this.loadcheck.data = true

    this.load()
    if (!this.images.init && this.images.check) {
      this.loadcheck.images = false
      this.images.init = true
      if (this.parent !== null) {
        const parent = document.querySelector(this.parent)
        if (parent) this.images.list = parent.querySelectorAll("img")
      } else {
        if (document.querySelectorAll("img"))
          this.images.list = document.querySelectorAll("img")
      }
      this.imageload()
    }
  }
  imageload() {
    if (this.images.check) {
      if (this.images.list && this.images.list.length > 0) {
        this.images.list.forEach((image) => {
          //ADD CONDITIONAL TO CHECK IF IMAGE HAS VALID SRC
          if (
            image.src !== null &&
            image.src !== "" &&
            image.src !== undefined
          ) {
            const eachimageloaded = (e: Event) => {
              e.target?.removeEventListener("load", eachimageloaded, false)
              e.target?.removeEventListener("error", eachimageerror, false)
              this.images.loaded++
              this.imageloadfinish()
            }
            const eachimageerror = (e: Event) => {
              e.target?.removeEventListener("load", eachimageloaded, false)
              e.target?.removeEventListener("error", eachimageerror, false)
              this.images.loaded++
              // biome-ignore lint/suspicious/noConsole: kept from the original, which reports images that fail to load
              console.log("fail to load", e.target)
              this.imageloadfinish()
            }
            // Check if image is already loaded or set to lazy.
            if (
              image.complete ||
              image.loading === "lazy" ||
              image.ariaHidden
            ) {
              this.images.loaded++
              this.imageloadfinish()
            } else {
              image.addEventListener("load", eachimageloaded, false)
              image.addEventListener("error", eachimageerror, false)
            }
          } else {
            this.images.loaded++
            this.imageloadfinish()
          }
        }, this)
      } else {
        this.loadcheck.images = true
        this.images.init = false
        this.load()
      }
    }
  }
  imageloadfinish() {
    if (this.images.loaded >= (this.images.list?.length ?? 0)) {
      this.loadcheck.images = true
      this.images.init = false
      this.load()
    }
  }
  renderload() {
    if (firstload) {
      if (!this.loadcheck.time) {
        if (this.timeout.time != null) clearTimeout(this.timeout.time)
        this.timeout.time = setTimeout(() => {
          this.loadcheck.time = true
          this.loadcheck.reload = true

          this.load()
        }, this.delay.default)
      } else {
        if (this.timeout.time != null) clearTimeout(this.timeout.time)
        this.timeout.time = setTimeout(() => {
          this.loadcheck.reload = true

          this.load()
        }, this.delay.reload)
      }
    } else {
      if (this.timeout.time != null) clearTimeout(this.timeout.time)
      this.timeout.time = setTimeout(() => {
        this.loadcheck.time = true
        this.loadcheck.reload = true

        this.load()
        firstload = true
      }, this.delay.firstload)
    }
  }
}
