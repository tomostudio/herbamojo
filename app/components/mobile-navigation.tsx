import SocialLinks from "@/components/molecules/social-links"
import type { FooterSettings, Locale, LocaleString } from "@/types"
import { cn } from "@/utils/cn"

import type { NavSection } from "../settings"

type MobileNavigationProps = {
  locale: Locale
  footer: FooterSettings
  navSections: readonly NavSection[]
  sectionTitles: Record<NavSection, LocaleString>
  onOpen: () => void
  onClose: () => void
  onSelect: (section: NavSection) => void
}

/**
 * The menu button and the full-screen menu on narrow screens. Whether it is
 * open is read from `menu_open` on the body.
 */
const MobileNavigation = ({
  locale,
  footer,
  navSections,
  sectionTitles,
  onOpen,
  onClose,
  onSelect,
}: MobileNavigationProps) => (
  <div
    id="MobileNavigation"
    className="hidden loaded:opacity-100 opacity-0 loaded:[transition:opacity_1.25s_2.25s] max-mtablet:block"
  >
    <div className="fixed top-0 right-0 z-12 flex h-[80px] flex-row flex-nowrap content-center items-center justify-center p-5">
      <div
        className="group/menu pointer-events-auto w-[26px] cursor-pointer"
        onClick={onOpen}
      >
        {[
          "group-hover/menu:after:animate-[mobilemenuin1_0.5s_ease_1_forwards]",
          "group-hover/menu:after:animate-[mobilemenuin2_0.5s_ease_1_forwards]",
          "group-hover/menu:after:animate-[mobilemenuin3_0.5s_ease_1_forwards]",
        ].map((hover, index) => (
          <span
            key={hover}
            className={cn(
              "relative block h-1 w-[26px] bg-white group-hover/menu:bg-green group-hover/menu:[transition:background_0s_0.5s]",
              "after:absolute after:top-0 after:right-0 after:left-auto after:block after:h-full after:w-0 after:animate-[mobilemenuout_0.25s_ease_1_forwards] after:bg-green",
              hover,
              index < 2 && "mb-1",
            )}
          />
        ))}
      </div>
    </div>
    <div className="fixed z-12 h-screen not-menu-open:h-0 w-screen overflow-hidden bg-green transition-all duration-400">
      <div className="pointer-events-none fixed top-0 right-0 z-12 flex h-[80px] flex-row flex-nowrap content-center items-center justify-center p-5">
        <div
          className="group/close not-menu-open:pointer-events-none! pointer-events-auto relative h-[26px] w-[26px] cursor-pointer not-menu-open:opacity-0 [transition:opacity_0.4s_0.2s] not-menu-open:[transition:opacity_0.2s]"
          onClick={onClose}
        >
          {[
            "[transform:translate(-50%,-50%)_rotate(45deg)] after:[transition:background_0.25s,width_0.4s_0.2s]",
            "[transform:translate(-50%,-50%)_rotate(-45deg)] after:[transition:background_0.25s,width_0.4s_0.4s]",
          ].map((line) => (
            <span
              key={line}
              className={cn(
                "absolute top-1/2 left-1/2 block h-1 w-[26px] transition-[background]",
                "after:absolute after:top-0 after:right-auto after:left-0 after:z-5 after:block after:h-full after:w-full after:bg-white group-hover/close:after:bg-black",
                line,
                "not-menu-open:after:w-0 not-menu-open:after:[transition:background_0.25s,width_0s_0.5s]",
              )}
            />
          ))}
        </div>
      </div>
      {/* The visible height, not 100vh, which on mobile browsers runs under
          the address bar — the original sized this to innerHeight by script. */}
      <div className="relative hidden h-dvh w-screen max-mtablet:block">
        <div className="absolute top-1/2 left-1/2 flex h-full max-h-[800px] w-full grow-0 flex-col flex-nowrap content-center items-center justify-between overflow-auto p-[50px] font-amarillo text-[48px] leading-[64px] [transform:translate(-50%,-50%)] before:pointer-events-none before:relative before:block before:h-[3vh] before:min-h-[20px] before:w-full after:pointer-events-none after:relative after:block after:h-[3vh] after:min-h-[20px] after:w-full">
          {navSections.map((section) => (
            <span
              key={section}
              onClick={() => onSelect(section)}
              className="cursor-pointer text-black transition-colors hover:text-white"
            >
              {sectionTitles[section][locale]}
            </span>
          ))}
          <div className="w-full before:pointer-events-none before:relative before:block before:h-[4vh] before:max-h-[40px] before:min-h-[20px] before:w-full">
            <div className="flex w-full flex-row flex-nowrap content-center items-center justify-center">
              <SocialLinks
                footer={footer}
                linkClassName="mx-[10px] h-[50px] w-[50px] grow-0 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full max-mobile:mx-[5px] max-mobile:h-[35px] max-mobile:w-[35px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default MobileNavigation
