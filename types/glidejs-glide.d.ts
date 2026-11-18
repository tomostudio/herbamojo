declare module "@glidejs/glide" {
  export type GlideOptions = {
    type?: "carousel" | "slider"
    startAt?: number
    perView?: number
    gap?: number
    breakpoints?: Record<number, Partial<GlideOptions>>
  }

  export default class Glide {
    constructor(selector: string, options?: GlideOptions)
    mount(): this
    destroy(): void
    go(direction: string): void
    update(): void
  }
}
