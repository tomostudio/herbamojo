import Link from "next/link"

import SocialLinks from "@/components/molecules/social-links"
import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { cn } from "@/utils/cn"

type FooterProps = {
  settings: GeneralSettings
  footer: FooterSettings
  locale: Locale
  className?: string
}

const NAV_LINK =
  "inline-block h-[30px] text-black leading-[30px] transition-colors hover:text-white max-mtablet:h-[18px] max-mtablet:leading-[18px]"

const Footer = ({ settings, footer, locale, className }: FooterProps) => {
  const isId = locale === "id"
  const journalSlug = settings.journalSlug.startsWith("/")
    ? settings.journalSlug
    : `/${settings.journalSlug}`
  const authSlug = settings.navigation.authentication[locale].toLowerCase()

  return (
    // `footer` is what the pages' scroll watchers look for.
    <section
      className={cn(
        "footer relative mx-auto h-[170px] w-full bg-green px-[140px] py-10",
        "max-mtablet:h-[calc(100px+env(safe-area-inset-bottom))] max-mtablet:p-5 max-tablet:px-[115px] max-mtablet:pb-[calc(20px+env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto grid min-h-full w-full max-w-[1000px] grid-cols-2 grid-rows-1 items-end max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px] max-mtablet:items-center">
        {!settings.journalDisable && (
          <div className="col-start-1 flex flex-col flex-nowrap content-center items-start justify-center justify-self-start font-amarillo text-[24px] leading-[100%] max-mtablet:text-[16px]">
            <Link
              aria-label="Home"
              href={isId ? "/id" : "/"}
              className={NAV_LINK}
            >
              {settings.navigation.home[locale]}
            </Link>
            <Link
              aria-label="Authentication"
              href={isId ? `/id/${authSlug}` : `/${authSlug}`}
              className={NAV_LINK}
            >
              {settings.navigation.authentication[locale]}
            </Link>
            <Link
              aria-label="Journal"
              href={isId ? `/id${journalSlug}` : journalSlug}
              className={NAV_LINK}
            >
              {settings.navigation.journal[locale]}
            </Link>
          </div>
        )}
        <div className="col-start-2 flex flex-row flex-nowrap content-center items-center justify-end justify-self-end py-[10px] max-mtablet:p-0">
          <SocialLinks
            footer={footer}
            linkClassName="ml-[15px] h-[50px] max-mtablet:ml-[10px] max-mtablet:h-[40px] max-mobile:h-[35px]"
          />
        </div>
      </div>
    </section>
  )
}

export default Footer
