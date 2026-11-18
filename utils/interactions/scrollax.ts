type ScrollaxOptions = {
  /** The element to move, or a selector for it. */
  target?: HTMLElement | string | null
  scroll_movement?: number
  /** Translation per viewport scrolled, as a share of 500px (sign = direction). */
  transform_x?: number
  transform_y?: number
  /** Offsets moved per viewport scrolled, as a share of 500px. */
  move_left?: number
  move_right?: number
  move_top?: number
  move_bottom?: number
}

const resolveTarget = (target: HTMLElement | string | null | undefined) =>
  typeof target === "string"
    ? document.querySelector<HTMLElement>(target)
    : target || null

/**
 * Parallax: moves an element in proportion to how far it is from the top of
 * the viewport, through `transform` and/or its offsets.
 */
export class Scrollax {
  defaultmovement = 0.25
  scrollmovement: number
  scrolltarget: HTMLElement | null = null
  move = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
  transform = {
    x: 0,
    y: 0,
  }
  center = {
    y: 0,
  }
  constructor(obj: ScrollaxOptions) {
    this.scrollmovement =
      obj.scroll_movement !== undefined ? obj.scroll_movement : 0.25

    this.scrolltarget = resolveTarget(obj.target)
    this.center.y = this.scrolltarget?.getBoundingClientRect().top ?? 0

    this.transform.x = obj.transform_x !== undefined ? obj.transform_x : 0
    this.transform.y = obj.transform_y !== undefined ? obj.transform_y : 0
    this.move.left = obj.move_left !== undefined ? obj.move_left : 0
    this.move.right = obj.move_right !== undefined ? obj.move_right : 0
    this.move.top = obj.move_top !== undefined ? obj.move_top : 0
    this.move.bottom = obj.move_bottom !== undefined ? obj.move_bottom : 0

    window.addEventListener("scroll", this.scrollevent, false)
  }
  set(obj: ScrollaxOptions) {
    if (obj.transform_x !== undefined) this.transform.x = obj.transform_x
    if (obj.transform_y !== undefined) this.transform.y = obj.transform_y
    if (obj.move_left !== undefined) this.move.left = obj.move_left
    if (obj.move_right !== undefined) this.move.right = obj.move_right
    if (obj.move_top !== undefined) this.move.top = obj.move_top
    if (obj.move_bottom !== undefined) this.move.bottom = obj.move_bottom

    if (obj.target !== undefined) {
      this.scrolltarget = resolveTarget(obj.target)
      this.center.y = this.scrolltarget?.getBoundingClientRect().top ?? 0
    }
  }
  kill() {
    window.removeEventListener("scroll", this.scrollevent, false)
  }
  trigger() {
    const windowH = window.innerHeight || document.documentElement.clientHeight
    const target = this.scrolltarget
    if (target !== null) {
      const movement = {
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0,
      }

      if (this.move.right > 0) {
        movement.right = Math.round(
          (target.getBoundingClientRect().y / windowH) * 500 * this.move.right,
        )
        target.style.right = `${movement.right}px`
      }
      if (this.move.left > 0) {
        movement.left = Math.round(
          (target.getBoundingClientRect().y / windowH) * 500 * this.move.left,
        )
        target.style.left = `${movement.left}px`
      }

      if (this.move.top > 0) {
        movement.top = Math.round(
          (target.getBoundingClientRect().y / windowH) * 500 * this.move.top,
        )
        target.style.top = `${movement.top}px`
      }
      if (this.move.bottom > 0) {
        movement.bottom = Math.round(
          (target.getBoundingClientRect().y / windowH) * 500 * this.move.bottom,
        )
        target.style.bottom = `${movement.bottom}px`
      }
      if (this.transform.x !== 0 || this.transform.y !== 0) {
        const getScrollMovement = target.getBoundingClientRect().y / windowH

        movement.x =
          Math.round(getScrollMovement * Math.abs(this.transform.x) * 500000) /
          1000
        movement.y =
          Math.round(getScrollMovement * Math.abs(this.transform.y) * 500000) /
          1000
        target.style.transform = `translate(${
          movement.x * Math.sign(this.transform.x)
        }px, ${movement.y * Math.sign(this.transform.y)}px)`
      }
    }
  }
  scrollevent = () => {
    this.trigger()
  }
}
