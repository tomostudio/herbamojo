import type { ReactNode } from "react"

import { cn } from "@/utils/cn"

type ContainerProps = {
  children: ReactNode
  withoutPadding?: boolean
  withoutMaxWidth?: boolean
  outerClassName?: string
  innerClassName?: string
}

const Container = ({
  children,
  withoutPadding,
  withoutMaxWidth,
  outerClassName,
  innerClassName,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        !withoutPadding && "px-[15px] md:px-6 lg:px-[20px]",
        outerClassName,
      )}
    >
      <div
        className={cn(
          !withoutMaxWidth && "mx-auto max-w-[1440px]",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Container
