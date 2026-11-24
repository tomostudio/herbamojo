import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import {
  HOME_CONTENT,
  HOME_CONTENT_HALF,
  HOME_CONTENT_SHORT,
  HOME_H1,
  HOME_SECTION,
  HOME_WRAPPER,
} from "../settings"
import type { HomeDoc } from "../types"

type BenefitsSectionProps = {
  benefits: HomeDoc["benefits"]
  locale: Locale
  sectionRef: (el: HTMLElement | null) => void
}

const BenefitsSection = ({
  benefits,
  locale,
  sectionRef,
}: BenefitsSectionProps) => (
  <section
    id="benefits"
    ref={sectionRef}
    className={cn(HOME_SECTION, "group/benefits")}
  >
    <div className={HOME_WRAPPER}>
      {/* The original renders this heading uppercased, while the nav
                label above keeps its normal casing. */}
      <h1 className={HOME_H1}>{benefits.title[locale].toUpperCase()}</h1>
      <div
        className={cn(
          "content half",
          HOME_CONTENT,
          HOME_CONTENT_HALF,
          HOME_CONTENT_SHORT,
        )}
      >
        <div className="w-full max-w-[500px] max-mtablet:mx-auto">
          {/* On mobile each benefit gets `inview` of its own. */}
          <div className="group/benefit pb-5 opacity-0 transition-opacity duration-500 mtablet:loaded:group-[.inview]/benefits:opacity-100 max-mtablet:w-full max-mtablet:border max-mtablet:border-transparent max-mtablet:px-5 max-mtablet:py-0 mtablet:loaded:group-[.inview]/benefits:[transition:opacity_0.25s_0s] max-mtablet:loaded:[&.inview]:opacity-100 max-mtablet:loaded:[&.inview]:[transition:opacity_1s]">
            <div className="w-full text-left font-amarillo text-white opacity-0 transition-opacity duration-500 mtablet:loaded:group-[.inview]/benefits:opacity-100 max-mtablet:loaded:group-[.inview]/benefit:opacity-100 mtablet:loaded:group-[.inview]/benefits:[transition:opacity_1s_1s] max-mtablet:loaded:group-[.inview]/benefit:[transition:opacity_1s_1s]">
              {[benefits.stamina.line1, benefits.stamina.line2].map((line) => (
                <span
                  key={line.en}
                  className="mr-[10px] block font-amarillo text-[80px] leading-[90%] max-mobile:text-center max-mtablet:text-center max-mobile:text-[30px] max-mtablet:text-[60px]"
                >
                  {line[locale]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default BenefitsSection
