import Image from "next/image"

import SanityImage from "@/components/atoms/sanity-image"
import productShot from "@/public/assets/static/herbamojo_productshot_2_112020.png"
import certHalal from "@/public/assets/symbols/halal.svg"
import herbamojoLogo from "@/public/assets/symbols/herbamojologo.svg"
import certNatural from "@/public/assets/symbols/natural.svg"
import certQuadra from "@/public/assets/symbols/quadra.svg"
import certQuality from "@/public/assets/symbols/quality.svg"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import {
  HOME_CONTENT,
  HOME_CONTENT_HALF,
  HOME_CONTENT_SHORT,
  HOME_H1,
  HOME_SECTION,
  HOME_WRAPPER,
  revealIn,
} from "../settings"
import type { HomeDoc } from "../types"

const CERTIFICATIONS = [
  { src: certNatural, label: "certNatural" },
  { src: certHalal, label: "certHalal" },
  { src: certQuality, label: "certQuality" },
  { src: certQuadra, label: "certQuadra" },
] as const

type AboutSectionProps = {
  about: HomeDoc["about"]
  locale: Locale
  sectionRef: (el: HTMLElement | null) => void
}

const AboutSection = ({ about, locale, sectionRef }: AboutSectionProps) => (
  <section
    id="about"
    ref={sectionRef}
    className={cn(HOME_SECTION, "group/about relative")}
  >
    <div className={HOME_WRAPPER}>
      <h1 className={HOME_H1}>{about.title[locale]}</h1>
      {/* The scroll watchers address the bottle through these. */}
      <div
        className={cn(
          "content half",
          HOME_CONTENT,
          HOME_CONTENT_HALF,
          HOME_CONTENT_SHORT,
          "after:invisible after:h-[5vh] after:max-h-[100px] [@media(min-height:800px)]:after:h-[5vh]",
        )}
      >
        <div
          className={cn(
            "block w-[300px] max-mtablet:mx-auto max-mtablet:w-full max-mobile:max-w-[300px] max-mtablet:max-w-[400px]",
            revealIn("about"),
          )}
        >
          <Image
            src={herbamojoLogo}
            alt="herbamojo"
            className="h-auto w-full"
          />
        </div>
        <div
          className={cn(
            "bottle hidden max-mtablet:pointer-events-none max-mtablet:relative max-mtablet:z-20 max-mtablet:mt-[50px] max-mtablet:block max-mtablet:w-full max-mtablet:px-5",
            revealIn("about"),
            "max-mtablet:loaded:group-[.inview]/about:delay-250",
          )}
        >
          <Image
            src={productShot}
            alt="Herbamojo"
            className="pointer-events-auto mx-auto h-auto w-full max-w-[300px] object-contain object-center"
          />
        </div>
        <div
          className={cn(
            "mt-[35px] block mtablet:pt-0 font-maison-mono text-[15px] text-white leading-[180%] max-mtablet:mx-auto max-mtablet:mt-[50px] max-mtablet:mb-0 max-mtablet:w-full max-mobile:max-w-[350px] max-mtablet:max-w-[450px] max-mtablet:font-bold",
            revealIn("about"),
            "loaded:group-[.inview]/about:delay-250 max-mtablet:loaded:group-[.inview]/about:delay-500",
          )}
        >
          {about.description[locale]}
        </div>
        <div
          className={cn(
            "mt-4 block mtablet:pt-0 font-maison-mono text-[12px] text-white leading-[140%] mtablet:after:pointer-events-none mtablet:after:relative mtablet:after:block mtablet:after:h-[10vh] mtablet:after:max-h-[60px] mtablet:after:min-h-[25px] mtablet:after:w-full max-mtablet:mx-auto max-mtablet:mt-5 max-mtablet:mb-0 max-mtablet:w-full max-mobile:max-w-[350px] max-mtablet:max-w-[450px] max-mtablet:font-bold max-mtablet:after:hidden",
            revealIn("about"),
            "loaded:group-[.inview]/about:delay-250 max-mtablet:loaded:group-[.inview]/about:delay-500",
          )}
        >
          {about.pomInfoLine1[locale]}
          <br />
          {about.pomInfoLine2[locale]}
        </div>
        <div
          className={cn(
            "grid w-full max-w-[500px] grid-cols-6 grid-rows-[auto] items-start justify-items-start gap-[15px] max-tablet:max-w-[350px] max-tablet:grid-cols-4",
            "max-mtablet:mx-auto max-mtablet:mt-[35px] max-mtablet:mb-0 max-mtablet:flex max-mtablet:w-full max-mtablet:max-w-[450px] max-mtablet:flex-row max-mtablet:flex-wrap max-mtablet:content-center max-mtablet:items-start max-mtablet:justify-center",
            "max-mobile:mt-[50px] max-mobile:grid max-mobile:max-w-[350px] max-mobile:grid-cols-3 max-mobile:justify-items-center max-mobile:gap-[30px]",
            revealIn("about"),
            "loaded:group-[.inview]/about:delay-500 max-mtablet:loaded:group-[.inview]/about:delay-750",
          )}
        >
          {CERTIFICATIONS.map(({ src, label }) => (
            <div
              key={label}
              className="inline-flex w-[50px] grow-0 flex-col flex-nowrap content-center items-center justify-center max-mobile:m-0 max-mtablet:m-[15px] max-mtablet:w-[65px]"
            >
              <Image src={src} alt="herbamojo" className="h-auto w-full" />
              <span className="mt-[10px] block w-full text-center font-amarillo text-[9px] text-white leading-[140%] max-mtablet:text-[12px]">
                {about[label][locale]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="absolute top-0 right-0 left-auto -z-1 h-full w-[calc(50%-200px)] overflow-hidden max-mtablet:hidden max-tablet:w-[calc(50%-250px)]">
      <div className="relative h-full min-h-full w-full opacity-0 [transform:translate(-25%,0%)] loaded:group-[.inview]/about:opacity-100 loaded:group-[.inview]/about:[transform:translate(-35%,0%)] loaded:group-[.inview]/about:[transition:opacity_1.5s_0.75s,transform_1.5s_0.75s]">
        <SanityImage
          className="paralax2 relative ml-[-25%] h-full w-[200%]"
          image={about.background}
          alt="herbamojo"
          sizes="100vw"
        />
      </div>
    </div>
  </section>
)

export default AboutSection
