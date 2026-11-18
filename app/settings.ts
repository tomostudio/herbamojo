import { cn } from "@/utils/cn"

/**
 * Every full-screen section of the home page. Each one fills the viewport
 * (the scroll snap moves between them) until the screen is narrow or short.
 */
export const HOME_SECTION = cn(
  "relative mx-auto flex h-auto min-h-screen w-full flex-col flex-nowrap content-start items-start justify-start snapon:overflow-hidden px-[140px] py-10 text-white",
  "max-mtablet:h-auto max-mtablet:max-h-none max-mtablet:min-h-0 max-mtablet:p-5 max-tablet:px-[115px]",
  "max-mtablet:after:pointer-events-none max-mtablet:after:relative max-mtablet:after:block max-mtablet:after:h-[30px] max-mtablet:after:w-full",
  "h-less:h-auto h-less:max-h-none h-less:min-h-0",
)

export const HOME_WRAPPER =
  "mx-auto flex min-h-full w-full max-w-[1000px] grow flex-col flex-nowrap content-start items-start justify-start max-tablet:max-w-[1050px] max-mtablet:max-w-[1200px]"

export const HOME_H1 = cn(
  "m-0 font-amarillo font-bold text-[60px] leading-[40px] tracking-[2px]",
  "max-mtablet:mt-0 max-mtablet:block max-mtablet:w-full max-mtablet:text-center max-mtablet:text-[47px] max-mtablet:leading-[47px] max-mtablet:[word-break:break-word]",
  "max-mtablet:before:pointer-events-none max-mtablet:before:relative max-mtablet:before:block max-mtablet:before:h-[30px] max-mtablet:before:w-full",
)

export const HOME_H2 =
  "m-0 font-amarillo font-bold text-[40px] leading-[40px] max-mtablet:text-[35px] max-mtablet:leading-[35px] max-smaller:text-[28px] max-smaller:leading-[28px]"

/** A section's body, centred in what is left of the screen under its title. */
export const HOME_CONTENT = cn(
  "mt-10 flex w-full grow flex-col flex-nowrap content-start items-start justify-center",
  "after:pointer-events-none after:relative after:block after:h-[80px] after:w-full after:opacity-0 [@media(min-height:800px)]:after:h-[120px]",
  "max-mtablet:after:hidden! max-mtablet:mx-auto max-mtablet:mt-[50px] max-mtablet:mb-0 max-mtablet:w-[calc(100%-40px)] max-mtablet:pt-0 max-mtablet:pb-[25px] max-mtablet:text-center",
  "h-less:justify-start h-less:after:hidden",
)

/** The left-hand column that leaves room for the floating bottle. */
export const HOME_CONTENT_HALF =
  "w-[calc(50%+100px)] pr-5 max-tablet:w-[calc(50%+125px)] max-mtablet:w-full max-mtablet:pr-0"

/** On short screens the body starts under the title instead of centring. */
export const HOME_CONTENT_SHORT =
  "[@media(max-height:800px)]:justify-start [@media(max-height:800px)]:after:hidden"

/** The home sections, in page order; also the order of the dot navigation. */
export const NAV_SECTIONS = [
  "home",
  "about",
  "benefits",
  "ingredients",
  "shop",
  "journal",
] as const

export type NavSection = (typeof NAV_SECTIONS)[number]

/** Fades a block in once the page has loaded and its section is in view. */
export const revealIn = (group: "home" | "about" | "journal") =>
  ({
    home: "opacity-0 transition-opacity loaded:group-[.inview]/home:opacity-100 loaded:group-[.inview]/home:duration-1500",
    about:
      "opacity-0 transition-opacity duration-500 loaded:group-[.inview]/about:opacity-100 loaded:group-[.inview]/about:duration-1500",
    journal:
      "opacity-0 transition-opacity loaded:group-[.inview]/journal:opacity-100 loaded:group-[.inview]/journal:duration-1500",
  })[group]
