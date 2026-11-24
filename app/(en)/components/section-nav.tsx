import Link from "next/link"

import SocialLinks from "@/components/molecules/social-links"
import type { FooterSettings, Locale, LocaleString } from "@/types"
import { cn } from "@/utils/cn"

import type { NavSection } from "../settings"

type SectionNavProps = {
  locale: Locale
  footer: FooterSettings
  navSections: readonly NavSection[]
  sectionTitles: Record<NavSection, LocaleString>
  onSelect: (section: NavSection) => void
}

/**
 * The desktop overlay: the language toggle, the dot navigation and the social
 * links, fixed over every section.
 */
const SectionNav = ({
  locale,
  footer,
  navSections,
  sectionTitles,
  onSelect,
}: SectionNavProps) => (
  <>
    {/* `overlay` is what the footer watcher pins to the bottom. */}
    <div className="overlay pointer-events-none fixed top-0 left-0 z-10 h-screen w-screen p-10 loaded:opacity-100 opacity-0 transition-opacity loaded:[transition:opacity_1.25s_2.25s] max-mtablet:hidden [&.stuck]:absolute [&.stuck]:top-auto [&.stuck]:bottom-0 [&.stuck]:left-0 [&.stuck]:overflow-hidden">
      <div className="pointer-events-none relative mx-auto grid min-h-full w-full max-w-[1200px] grid-cols-2 grid-rows-1">
        <div className="col-start-1 block justify-self-start">
          {(["en", "id"] as const).map((lang) => (
            <Link
              key={lang}
              aria-label={lang === "en" ? "English" : "Indonesia"}
              href={lang === "en" ? "/" : "/id"}
              className={cn(
                "pointer-events-auto inline-block align-top font-amarillo text-[21px] text-white leading-4 transition-colors first:mr-[10px]",
                lang === locale
                  ? "pointer-events-none text-green"
                  : "hover:cursor-pointer hover:text-green",
              )}
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </div>
        {/* `right_nav` and `snap_nav` are how the snap finds its dots. */}
        <div className="right_nav col-start-2 flex flex-col flex-nowrap content-center items-center justify-between justify-self-end">
          <div className="snap_nav pointer-events-auto relative flex h-auto w-[35px] flex-col flex-nowrap content-center items-center justify-between before:absolute before:top-1/2 before:left-1/2 before:block before:h-[calc(100%-50px)] before:w-[2px] before:bg-green before:[transform:translate(-50%,-50%)]">
            {navSections.map((section, index) => (
              <span
                key={section}
                // The original ships "active" on the About item; setNav
                // moves it to Home as soon as the page has loaded.
                className={cn(
                  section === "about" && "active",
                  "group/dot pointer-events-auto relative block h-9 w-9 rounded-[36px] hover:cursor-pointer",
                  index === navSections.length - 1
                    ? "mb-0"
                    : "h-less:mb-[calc((100vh-296px)/5)] h-mid:mb-[calc((100vh-481px)/5)] mb-10",
                  "after:absolute after:top-1/2 after:left-1/2 after:block after:h-[18px] after:w-[18px] after:rounded-[35px] after:bg-green after:transition-all after:[transform:translate(-50%,-50%)]",
                  "before:absolute before:top-1/2 before:left-1/2 before:block before:h-[10px] before:w-[10px] before:rounded-[36px] before:border-2 before:border-green before:bg-black before:transition-all before:[transform:translate(-50%,-50%)]",
                  "hover:before:h-9 hover:before:w-9 [&.active]:before:h-9 [&.active]:before:w-9",
                )}
                onClick={() => onSelect(section)}
              >
                <span className="pointer-events-none absolute top-1/2 right-[35px] left-auto text-right font-amarillo text-[21px] text-white leading-4 opacity-0 transition-all [transform:translate(0px,-50%)] group-hover/dot:right-[55px] group-hover/dot:opacity-100">
                  {sectionTitles[section][locale]}
                </span>
              </span>
            ))}
          </div>
          <div className="h-less:hidden">
            <SocialLinks
              footer={footer}
              linkClassName="pointer-events-auto mt-[25px] h-[40px] first:mt-0 [&_.fill]:fill-green [&_.stroke]:stroke-green h-mid:mt-[15px] h-mid:first:mt-0"
            />
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SectionNav
