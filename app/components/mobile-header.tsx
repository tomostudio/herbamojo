import Image from "next/image"
import Link from "next/link"

import herbamojoLogo from "@/public/assets/symbols/herbamojologo.svg"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

/** The bar across the top of the Home page on narrow screens. */
const MobileHeader = ({ locale }: { locale: Locale }) => {
  const isId = locale === "id"
  return (
    <div
      id="MobileHeader"
      className="pointer-events-none fixed top-0 left-0 z-11 hidden h-[80px] w-full p-5 loaded:opacity-100 opacity-0 loaded:[transition:opacity_1.25s_2.25s] max-mtablet:grid max-mtablet:grid-cols-[1fr_auto_1fr] max-mtablet:items-center"
    >
      <Link
        aria-label="Language Toggle"
        href={isId ? "/" : "/id"}
        className="col-start-1 row-start-1 block justify-self-start"
      >
        {(["en", "id"] as const).map((lang) => (
          <span
            key={lang}
            className={cn(
              "pointer-events-auto inline-block font-amarillo text-[21px] text-white leading-4 transition-colors first:mr-[10px] max-mobile:text-[16px] max-mobile:leading-[14px] max-mobile:first:mr-[5px]",
              lang === locale
                ? "pointer-events-none text-green"
                : "hover:cursor-pointer hover:text-green",
            )}
          >
            {lang.toUpperCase()}
          </span>
        ))}
      </Link>
      <span className="pointer-events-auto col-start-2 row-start-1 h-[40px] justify-self-center transition-opacity">
        <Image src={herbamojoLogo} alt="herbamojo" className="h-full w-auto" />
      </span>
    </div>
  )
}

export default MobileHeader
