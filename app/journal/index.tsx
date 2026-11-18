import Link from "next/link"

import PageLoadReveal from "@/components/atoms/page-load-reveal"
import { Arrow } from "@/components/atoms/symbols"
import JournalCard, { JOURNAL_GRID } from "@/components/molecules/journal-card"
import PageHeader from "@/components/organisms/page-header"
import Layout from "@/components/templates/layout"
import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { cn } from "@/utils/cn"

import type { JournalListItem } from "./types"

type JournalListProps = {
  locale: Locale
  settings: GeneralSettings
  footer: FooterSettings
  items: JournalListItem[]
  page: number
  totalPages: number
  altTotalPages: number
}

/** The grid and the arrows under it fade in together once the page loads. */
const REVEAL =
  "opacity-0 transition-opacity duration-500 loaded:opacity-100 loaded:delay-300 loaded:duration-1000 loaded:max-mtablet:delay-400 loaded:max-mtablet:duration-1500"

const NAV_ARROW =
  "block w-[60px] justify-self-center text-center [&_.stroke]:transition-[stroke] hover:[&_.stroke]:stroke-green [&_svg]:h-[60px] [&_svg]:w-[60px] max-mtablet:w-10 max-mtablet:justify-self-center max-mtablet:[&_svg]:h-10 max-mtablet:[&_svg]:w-10 max-smaller:w-[25px] max-smaller:[&_svg]:h-[25px] max-smaller:[&_svg]:w-[25px]"

const JournalList = ({
  locale,
  settings,
  footer,
  items,
  page,
  totalPages,
  altTotalPages,
}: JournalListProps) => {
  const isId = locale === "id"
  const mainId = `journallist${isId ? "id" : "en"}${page - 1}`
  const journalSlug = settings.journalSlug.startsWith("/")
    ? settings.journalSlug
    : `/${settings.journalSlug}`
  const basePath = isId ? `/id${journalSlug}` : journalSlug
  // The page number goes in the document title only; the heading on the page
  // stays the plain section name on every page, as in the original.
  const title = settings.navigation.journal[locale]

  // Mirrors the original: page 1 is the bare journal path, and when there is
  // no previous/next page the arrow points home and is disabled.
  const prevHref =
    page <= 1 ? "/" : page === 2 ? `${basePath}/` : `${basePath}/${page - 1}/`
  const nextHref = page >= totalPages ? "/" : `${basePath}/${page + 1}/`

  // The language toggle keeps the page number, unless the other language has
  // fewer pages - then it falls back to that language's first journal page.
  const pageSuffix = page > 1 ? `${page}/` : ""
  const hasAltPage = page <= altTotalPages
  const enHref = hasAltPage ? `${journalSlug}/${pageSuffix}` : `${journalSlug}/`
  const idHref = hasAltPage
    ? `/id${journalSlug}/${pageSuffix}`
    : `/id${journalSlug}/`

  return (
    <Layout
      mainId={mainId}
      locale={locale}
      footerData={{ settingAPI: settings, footerAPI: footer }}
      withoutPadding
      withoutMaxWidth
    >
      <PageLoadReveal parentId={mainId} locale={locale} />
      <PageHeader
        locale={locale}
        urlTargetEn={enHref}
        urlTargetId={idHref}
        headerTitle={settings.navigation.journal}
      />
      <div className="flex min-h-screen flex-col flex-nowrap content-center items-center justify-start before:pointer-events-none before:relative before:block before:h-[100px] before:w-full max-mobile:before:h-[60px] max-mtablet:before:h-[80px]">
        <section className="relative mx-auto hidden w-full px-[140px] py-10 loaded:opacity-100 opacity-0 transition-opacity loaded:delay-100 duration-500 loaded:duration-1000 max-mtablet:block max-mtablet:p-5 max-tablet:px-[115px] max-mtablet:text-center">
          <div className="mx-auto min-h-full w-full max-w-[1000px] max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px] max-mtablet:pt-10 max-mtablet:pb-[30px]">
            <h1 className="m-0 font-amarillo font-bold text-[47px] leading-[47px] tracking-[2px] [word-break:break-word]">
              {title}
            </h1>
          </div>
        </section>
        <section className="relative mx-auto w-full px-[140px] pt-10 pb-[60px] max-mtablet:px-5 max-tablet:px-[115px] max-mtablet:pt-0 max-mtablet:pb-[50px]">
          <div className="mx-auto min-h-full w-full max-w-[1000px] p-0 max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px]">
            <div className="mx-auto w-full">
              <div className={cn(JOURNAL_GRID, REVEAL)}>
                {items.map((journal) => (
                  <JournalCard
                    key={journal._id}
                    href={`${basePath}/${journal.slug.current}`}
                    date={journal.date}
                    title={journal.title}
                    image={journal.thumbImage}
                    black={journal.listColorBlack}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div
                  className={cn(
                    "mx-auto mt-[60px] grid w-full grid-cols-[auto_auto] items-center gap-0 max-smaller:mt-[30px] max-smaller:gap-[30px] max-mtablet:mt-[50px] max-[950px]:gap-[100px] max-mobile:gap-[80px] max-mtablet:gap-0",
                    REVEAL,
                  )}
                >
                  <Link
                    href={prevHref}
                    aria-disabled={page <= 1 || undefined}
                    className={cn(
                      NAV_ARROW,
                      "max-[950px]:justify-self-end max-mobile:justify-self-end",
                      page <= 1 && "pointer-events-none opacity-25",
                    )}
                  >
                    <Arrow />
                  </Link>
                  <Link
                    href={nextHref}
                    aria-disabled={page >= totalPages || undefined}
                    className={cn(
                      NAV_ARROW,
                      "max-[950px]:justify-self-start max-mobile:justify-self-start [&_svg]:[transform:rotate(180deg)]",
                      page >= totalPages && "pointer-events-none opacity-25",
                    )}
                  >
                    <Arrow />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default JournalList
