import { Arrow, ArrowSmaller } from "@/components/atoms/symbols"
import { cn } from "@/utils/cn"

type SliderArrowProps = {
  /** The right-hand arrow is the left one turned around. */
  next?: boolean
  onClick?: () => void
  className?: string
}

/**
 * The outlined arrow beside each shop slider; narrow screens get the smaller
 * solid chevron instead.
 */
const SliderArrow = ({
  next = false,
  onClick,
  className,
}: SliderArrowProps) => (
  <div
    onClick={onClick}
    className={cn(
      "group/arrow flex h-[34px] w-[34px] shrink-0 grow-0 cursor-pointer flex-row flex-nowrap content-center items-center justify-center max-mobile:h-3 max-mtablet:h-[17px] max-mobile:w-3 max-mtablet:w-[17px]",
      next && "[transform:rotate(180deg)]",
      className,
    )}
  >
    <Arrow className="h-auto w-full max-mtablet:hidden [&_.stroke]:transition-[stroke] group-hover/arrow:[&_.stroke]:stroke-green max-mtablet:[&_.stroke]:stroke-green max-mtablet:group-hover/arrow:[&_.stroke]:stroke-white" />
    <ArrowSmaller className="hidden h-auto w-full max-mtablet:block [&_.fill]:transition-[fill] max-mtablet:group-hover/arrow:[&_.fill]:fill-white" />
  </div>
)

export default SliderArrow
