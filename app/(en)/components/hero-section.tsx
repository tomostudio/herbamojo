import Image from "next/image"

import SanityImage from "@/components/atoms/sanity-image"
import herbamojoLogo from "@/public/assets/symbols/herbamojologo.svg"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import { HOME_H1, HOME_SECTION, HOME_WRAPPER, revealIn } from "../settings"
import type { HomeDoc } from "../types"

/** The hero's three words come in one after another. */
const HERO_WORD_DELAY = [
  "loaded:group-[.inview]/home:delay-550",
  "loaded:group-[.inview]/home:delay-850",
  "loaded:group-[.inview]/home:delay-1150",
]

type HeroSectionProps = {
  hero: HomeDoc["hero"]
  webTitle: string
  locale: Locale
  sectionRef: (el: HTMLElement | null) => void
  onShop: () => void
}

const HeroSection = ({
  hero,
  webTitle,
  locale,
  sectionRef,
  onShop,
}: HeroSectionProps) => (
  <section
    id="home"
    ref={sectionRef}
    className={cn(
      HOME_SECTION,
      "group/home after:hidden! relative h-less:h-[450px] max-mtablet:flex max-mtablet:h-screen max-mtablet:flex-col max-mtablet:flex-nowrap max-mtablet:content-center max-mtablet:items-center max-mtablet:justify-stretch",
    )}
  >
    <div
      className={cn(
        HOME_WRAPPER,
        "relative flex-row content-center items-center max-mtablet:h-full max-mtablet:min-h-0 max-mtablet:grow max-mtablet:flex-col max-mtablet:content-center max-mtablet:items-center max-mtablet:justify-stretch",
      )}
    >
      <h1
        className={cn(
          HOME_H1,
          "pointer-events-none invisible absolute top-0 left-0 opacity-0",
        )}
      >
        {webTitle}
      </h1>
      <span className="absolute top-0 left-0 inline-block w-[140px] max-mtablet:hidden">
        <Image src={herbamojoLogo} alt="herbamojo" className="h-auto w-full" />
      </span>
      <div
        className={cn(
          "relative mt-10 w-full grow max-mtablet:mt-0 max-mtablet:pt-0 max-mtablet:text-center",
          "before:pointer-events-none before:relative before:block before:h-[7.5vh] before:max-h-[200px] before:min-h-[50px] before:w-full",
          "max-mtablet:flex max-mtablet:h-full max-mtablet:flex-col max-mtablet:flex-nowrap max-mtablet:content-center max-mtablet:items-center max-mtablet:justify-between max-mtablet:p-0 max-mtablet:after:relative max-mtablet:after:block max-mtablet:after:h-5 max-mtablet:after:w-full max-mtablet:before:h-[30px]",
          "max-mobile:after:top-0 max-mobile:after:left-0 max-mobile:after:h-[7.5vh] max-mobile:after:max-h-[150px] max-mobile:after:min-h-[100px] max-mobile:before:h-[60px]",
        )}
      >
        {[hero.know, hero.your, hero.strength].map((word, index) => (
          <span
            key={word.en}
            className={cn(
              "mr-[10px] inline-block font-amarillo text-[120px] leading-[90%] max-mtablet:relative max-mtablet:mx-auto max-mtablet:my-0 max-mtablet:block max-mtablet:text-center max-mobile:text-[70px] max-mtablet:text-[100px]",
              "max-mobile:after:pointer-events-none max-mobile:after:relative max-mobile:after:block max-mobile:after:w-full",
              index === 2
                ? "max-mtablet:text-green max-mobile:after:h-[2.5vh] max-mtablet:after:h-[2.5vh] max-mobile:after:min-h-[30px] max-mtablet:after:min-h-[30px]"
                : "max-mobile:after:h-[7.5vh] max-mobile:after:min-h-[40px]",
              revealIn("home"),
              HERO_WORD_DELAY[index],
            )}
          >
            {word[locale]}
          </span>
        ))}
        <span
          id="GetButton"
          onClick={onShop}
          className="absolute bottom-[-20px] left-0 mr-[10px] inline-block cursor-pointer border-[3px] border-green px-10 py-2 font-amarillo text-[30px] text-green leading-[28px] opacity-0 [transform:translate(0%,100%)] [transition:opacity_0.25s,border_0.25s,color_0.25s,background_0.25s] hover:bg-green hover:text-white loaded:group-[.inview]/home:opacity-100 max-mtablet:relative max-mtablet:top-auto max-mtablet:right-0 max-mtablet:bottom-0 max-mtablet:left-0 max-mtablet:mx-auto max-mtablet:my-0 max-mtablet:w-auto max-mtablet:max-w-full max-mtablet:border-2 max-mtablet:border-white max-mtablet:text-[25px] max-mtablet:text-white max-mtablet:leading-[24px] max-mtablet:hover:border-green loaded:group-[.inview]/home:[transition:opacity_1.5s_1.45s,border_0.25s,color_0.25s,background_0.25s] max-mtablet:[transform:translate(0%,0%)]"
        >
          {hero.getYours[locale]}
        </span>
      </div>
    </div>
    <div className="absolute top-0 left-0 -z-1 h-full w-[55%] opacity-0 transition-opacity [transform:translate(-75px,0)] loaded:group-[.inview]/home:opacity-100 max-mtablet:right-0 max-mtablet:w-full max-mtablet:overflow-hidden loaded:group-[.inview]/home:[transform:translate(0,0)] loaded:group-[.inview]/home:[transition:transform_1.5s_1.6s,opacity_1.5s_1.75s] max-mtablet:[transform:translate(0px,0)] max-mtablet:loaded:group-[.inview]/home:[transition:opacity_1.5s_1.75s]">
      {/* `paralax1` and `prlx` are what the parallax script moves. */}
      <SanityImage
        className="paralax1 relative left-[-12.5%] h-full w-[125%] max-mtablet:hidden [&_img]:object-cover [&_img]:object-right"
        image={hero.background}
        alt="herbamojo"
        sizes="100vw"
        priority
      />
      <SanityImage
        className="mobile prlx relative top-auto m-auto hidden h-full w-[calc(100vw-80px)] max-mtablet:block [&_img]:object-contain [&_img]:object-center"
        image={hero.backgroundMobile}
        alt="herbamojo"
        sizes="100vw"
        priority
      />
    </div>
  </section>
)

export default HeroSection
