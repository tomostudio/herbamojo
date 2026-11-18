import Link from "next/link"

import SanityImage from "@/components/atoms/sanity-image"
import type { SanityImage as SanityImageType } from "@/types"
import { cn } from "@/utils/cn"
import { formatDate } from "@/utils/formatDate"

type JournalCardProps = {
  href: string
  date: string
  title: string
  image: SanityImageType | undefined
  black?: boolean
}

/** The grid the cards sit in, wherever a list of them is shown. */
export const JOURNAL_GRID =
  "grid w-full grid-cols-2 gap-[15px] max-[950px]:grid-cols-1 max-mtablet:grid-cols-2 max-mtablet:gap-[7px] max-mobile:grid-cols-1"

const JournalCard = ({ href, date, title, image, black }: JournalCardProps) => (
  <Link
    href={href}
    className={cn(
      "relative block h-[calc((100vh-270px)/2)] max-h-[250px] w-full overflow-hidden text-white transition-colors",
      "max-[950px]:h-[175px] max-[1050px]:max-h-[220px] max-[950px]:min-h-0 max-[950px]:pt-0 min-desktop:max-h-[225px] min-desktop:pt-0",
      "max-mtablet:h-0 max-mtablet:max-h-[250px] max-mtablet:min-h-[200px] max-mtablet:pt-[56.25%]",
      "max-mobile:h-[20vh] max-mobile:max-h-[175px] max-mobile:min-h-[125px] max-mobile:pt-0",
      "after:absolute after:top-0 after:left-0 after:z-1 after:block after:h-full after:w-full after:bg-green after:opacity-0 after:transition-opacity",
      "hover:text-black hover:after:opacity-50",
      black && "text-black",
    )}
  >
    <div className="absolute top-0 left-0 z-2 flex h-full w-full flex-col flex-nowrap content-center items-center justify-center px-10 pt-[15px] pb-5 max-[1200px]:p-5 max-mobile:p-5">
      <span className="mt-0 block text-center font-light font-maison-mono text-[13px] leading-4">
        {formatDate(date)}
      </span>
      <h2 className="m-0 mt-[10px] block text-center font-amarillo font-bold text-[40px] leading-[40px] max-smaller:text-[25px] max-smaller:leading-[100%] max-mtablet:mt-[5px] max-[1200px]:text-[35px] max-[1200px]:leading-[35px]">
        {title}
      </h2>
    </div>
    <SanityImage
      image={image}
      alt=""
      sizes="(min-width: 900px) 33vw, 100vw"
      className="absolute top-0 left-0 z-0 h-full w-full [&>img]:object-cover"
    />
  </Link>
)

export default JournalCard
