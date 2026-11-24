import type { PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import Link from "next/link"

import PageLoadReveal from "@/components/atoms/page-load-reveal"
import SanityImage from "@/components/atoms/sanity-image"
import { ArrowDouble } from "@/components/atoms/symbols"
import JournalCard, { JOURNAL_GRID } from "@/components/molecules/journal-card"
import PageHeader from "@/components/organisms/page-header"
import Layout from "@/components/templates/layout"
import { urlForImage } from "@/sanity/lib/image"
import type {
  FooterSettings,
  GeneralSettings,
  Locale,
  SanityImage as SanityImageType,
} from "@/types"
import { cn } from "@/utils/cn"
import { formatDate } from "@/utils/formatDate"

import type { JournalDetail as JournalDetailType } from "../types"
import InViewSection from "./components/in-view-section"

/**
 * Each numbered point is its own single-item list carrying the number it
 * starts at, matching how the source markdown was rendered originally.
 */
const portableTextComponents: PortableTextComponents = {
  // The article body is `white-space: pre-wrap`, so a newline inside a
  // paragraph is already a line break. Rendering it as <br /> — the default —
  // adds a second one plus a stray tab.
  hardBreak: false,
  types: {
    // As gatsby-remark-images rendered them: a block of up to 650px in the
    // middle of the article, linking to the full image.
    image: ({ value }: { value: SanityImageType }) =>
      value?.asset ? (
        <Link
          href={urlForImage(value).url()}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full max-w-[650px]!"
        >
          <SanityImage
            image={value}
            alt={value.alt ?? ""}
            sizes="(min-width: 700px) 650px, 100vw"
          />
        </Link>
      ) : null,
  },
  list: {
    number: ({ value, children }) => {
      const start = (value?.children?.[0] as { start?: number } | undefined)
        ?.start
      // The original's HTML puts each <li> on its own line, and under
      // `white-space: pre-wrap` those newlines are blank lines around the
      // point. Without them each list draws a third of its height.
      return (
        <ol start={start && start > 1 ? start : undefined}>
          {"\n"}
          {children}
          {"\n"}
        </ol>
      )
    },
  },
}

/** Typography for the article body, which arrives as Portable Text. */
const ARTICLE = cn(
  "relative w-full px-10 max-tablet:px-0 [&_*]:select-text",
  "[&>*]:mx-auto [&>*]:my-10 [&>*]:max-w-full [&>*]:whitespace-pre-wrap [&>*]:first:mt-0 [&>*]:last:mb-0",
  "max-tablet:[&>*]:my-5 max-tablet:[&>*]:last:mb-0 max-tablet:[&>*]:first:mt-0",
  "[&_p]:font-maison-mono [&_p]:text-[20px] [&_p]:leading-[34px] max-mobile:[&_p]:text-[14px] max-tablet:[&_p]:text-[16px] max-mobile:[&_p]:leading-[22px] max-tablet:[&_p]:leading-[28px]",
  "[&_:is(ol,ul)]:ps-10 [&_:is(ol,ul)]:font-maison-mono [&_:is(ol,ul)]:text-[20px] [&_:is(ol,ul)]:leading-[34px] max-mobile:[&_:is(ol,ul)]:text-[14px] max-tablet:[&_:is(ol,ul)]:text-[16px] max-mobile:[&_:is(ol,ul)]:leading-[22px] max-tablet:[&_:is(ol,ul)]:leading-[28px] [&_ol]:list-decimal [&_ul]:list-disc",
  "[&_li]:mx-auto [&_li]:my-10 [&_li]:first:mt-0 [&_li]:last:mb-0 max-tablet:[&_li]:my-5 max-tablet:[&_li]:last:mb-0 max-tablet:[&_li]:first:mt-0",
  "[&_strong]:font-bold",
  "[&_a]:text-green [&_a]:italic [&_a]:transition-colors hover:[&_a]:text-inherit",
  "[&_h1]:font-amarillo [&_h1]:font-bold [&_h1]:text-[48px] [&_h1]:leading-[48px] max-mobile:[&_h1]:text-[28px] max-mobile:[&_h1]:leading-[28px]",
  "[&_h2]:font-amarillo [&_h2]:font-bold [&_h2]:text-[40px] [&_h2]:leading-[50px] max-mobile:[&_h2]:text-[20px] max-tablet:[&_h2]:text-[32px] max-mobile:[&_h2]:leading-[24px] max-tablet:[&_h2]:leading-[42px]",
  "[&_blockquote]:ms-[100px]! [&_blockquote]:me-[100px]! [&_blockquote]:font-maison-mono [&_blockquote]:text-[24px] [&_blockquote]:italic [&_blockquote]:leading-[34px] max-mobile:[&_blockquote]:ms-10! max-tablet:[&_blockquote]:ms-[75px]! max-mobile:[&_blockquote]:me-5! max-tablet:[&_blockquote]:me-[75px]! max-tablet:[&_blockquote]:text-[20px]",
)

/** The arrows over the cover, either side of the title. */
const COVER_NAV =
  "absolute top-1/2 block max-w-[150px] text-center font-amarillo text-[28px] text-black leading-[28px] opacity-0 [transform:translate(0px,-50%)] [transition:opacity_0.5s,color_0.25s] hover:text-green loaded:opacity-100 loaded:[transition:opacity_1s_0.6s,color_0.25s] max-tablet:max-w-[100px] max-tablet:text-[24px] max-tablet:leading-[24px] max-mtablet:hidden"

/** The two buttons under the article on narrow screens. */
const MOBILE_NAV =
  "flex h-auto min-w-[180px] flex-row flex-nowrap content-center items-center justify-center border-2 border-green px-[25px] py-[7px] text-green [transition:background_0.25s,color_0.25s] [&_.fill]:transition-[fill] [&>svg]:h-[12px] hover:bg-green hover:text-white hover:[&_.fill]:fill-white max-mobile:min-w-[105px] max-mobile:border max-mobile:px-5 max-mobile:py-[5px] max-mobile:[&>svg]:h-[8px]"

const MOBILE_NAV_LABEL =
  "h-[24px] font-amarillo text-[24px] uppercase leading-[24px] max-mobile:h-[16px] max-mobile:text-[16px] max-mobile:leading-[16px]"

/** Fades in once the related section is scrolled to. */
const RELATED_REVEAL =
  "opacity-0 transition-opacity duration-500 loaded:group-[.inview]/related:opacity-100 loaded:group-[.inview]/related:duration-1000"

type JournalDetailProps = {
  locale: Locale
  settings: GeneralSettings
  footer: FooterSettings
  post: JournalDetailType
  prevSlug: string | null
  nextSlug: string | null
}

const JournalDetail = ({
  locale,
  settings,
  footer,
  post,
  prevSlug,
  nextSlug,
}: JournalDetailProps) => {
  const isId = locale === "id"
  const mainId = `journal${post._id}`
  const journalSlug = settings.journalSlug.startsWith("/")
    ? settings.journalSlug
    : `/${settings.journalSlug}`
  const basePath = isId ? `/id${journalSlug}` : journalSlug
  const prevHref = prevSlug ? `${basePath}/${prevSlug}` : null
  const nextHref = nextSlug ? `${basePath}/${nextSlug}` : null
  const onlyArticle = !prevHref && !nextHref
  // At either end of the journal one of the two arrows has nowhere to go. It
  // is dimmed and takes no pointer events, and points at this post itself —
  // which is what the original's empty `to` resolves to.
  const selfHref = `${basePath}/${post.slug.current}`
  const { journalTranslation } = settings

  const urlTargetEn = isId
    ? post.altSlug
      ? `${journalSlug}/${post.altSlug}`
      : journalSlug
    : `${journalSlug}/${post.slug.current}`
  const urlTargetId = isId
    ? `/id${journalSlug}/${post.slug.current}`
    : post.altSlug
      ? `/id${journalSlug}/${post.altSlug}`
      : `/id${journalSlug}`

  return (
    <Layout
      mainId={mainId}
      locale={locale}
      mainClassName="bg-paper"
      footerData={{ settingAPI: settings, footerAPI: footer }}
      withoutPadding
      withoutMaxWidth
    >
      <PageLoadReveal parentId={mainId} locale={locale} scrollToTop />
      <PageHeader
        locale={locale}
        urlTargetEn={urlTargetEn}
        urlTargetId={urlTargetId}
        black={post.headerColorBlack}
        journal
        journalBackText={journalTranslation.backText}
      />
      <div className="flex min-h-screen flex-col flex-nowrap content-center items-center justify-start">
        <section
          className={cn(
            "relative mx-auto h-0 max-h-[75vh] w-full grow-0 p-0 pt-[56.25%] text-white max-mobile:pt-[75%] max-mtablet:pt-[62.5%] min-desktop:h-[75vh] min-desktop:pt-0",
            post.headerColorBlack && "text-black",
          )}
        >
          <div className="absolute top-0 left-0 z-5 h-full w-full p-10 pt-[80px] max-mtablet:p-5 max-mobile:pt-[60px] max-mtablet:pt-[80px]">
            <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col flex-nowrap content-center items-center justify-center px-[150px] text-center max-mtablet:px-0 max-tablet:px-[100px]">
              <div className="mb-5 cursor-default select-all font-light font-maison-mono text-[36px] leading-[40px] loaded:opacity-100 opacity-0 transition-opacity loaded:delay-100 duration-500 loaded:duration-1500 max-mtablet:mb-[15px] max-mtablet:font-normal max-mobile:text-[13px] max-mtablet:text-[16px] max-tablet:text-[32px] max-mobile:leading-[15px] max-mtablet:leading-[20px] max-tablet:leading-[36px]">
                {formatDate(post.date)}
              </div>
              <div className="cursor-default select-all pb-[60px] font-amarillo text-[90px] leading-[80px] loaded:opacity-100 opacity-0 transition-opacity loaded:delay-100 duration-500 loaded:duration-1500 max-mobile:pb-[30px] max-mtablet:pb-[35px] max-tablet:pb-[56px] max-mobile:text-[42px] max-mtablet:text-[48px] max-tablet:text-[75px] max-mobile:leading-[42px] max-mtablet:leading-[48px] max-tablet:leading-[75px]">
                {post.title}
              </div>
              <Link
                href={prevHref ?? selfHref}
                aria-disabled={!prevHref || undefined}
                className={cn(
                  COVER_NAV,
                  "right-auto left-0",
                  !prevHref && "pointer-events-none opacity-25!",
                )}
              >
                {journalTranslation.previousJournal[locale]}
              </Link>
              <Link
                href={nextHref ?? selfHref}
                aria-disabled={!nextHref || undefined}
                className={cn(
                  COVER_NAV,
                  "right-0 left-auto",
                  !nextHref && "pointer-events-none opacity-25!",
                )}
              >
                {journalTranslation.nextJournal[locale]}
              </Link>
            </div>
          </div>
          <SanityImage
            image={post.coverImage}
            alt=""
            sizes="100vw"
            preload
            className="absolute top-0 left-0 z-1 h-full w-full [&>img]:object-cover"
          />
        </section>

        <section className="relative mx-auto w-full grow px-[100px] pt-[60px] pb-10 text-black loaded:opacity-100 opacity-0 transition-opacity loaded:delay-600 duration-500 loaded:duration-1500 max-mtablet:px-5 max-tablet:px-[115px] max-mtablet:py-10">
          <div className="mx-auto min-h-full w-full max-w-[1080px] max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px]">
            <div className={ARTICLE}>
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            </div>
          </div>
        </section>

        {!onlyArticle && (
          <InViewSection
            id="MobileNav"
            className="relative mx-auto hidden w-full grow-0 px-[140px] py-10 opacity-0 transition-opacity duration-500 max-mtablet:block max-mtablet:p-5 max-tablet:px-[115px] max-mtablet:pt-0 max-mobile:pb-10 max-mtablet:pb-[60px] loaded:[&.inview]:opacity-100 loaded:[&.inview]:duration-1500"
          >
            <div className="mx-auto flex min-h-full w-full max-w-[1000px] flex-row flex-nowrap content-center items-center justify-center max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px]">
              <Link
                href={prevHref ?? selfHref}
                className={cn(
                  MOBILE_NAV,
                  "mr-[50px]",
                  !prevHref && "pointer-events-none opacity-25",
                )}
                // Gatsby's Link marks a target matching the current page, and
                // the disabled arrow points at this post.
                aria-current={prevHref ? undefined : "page"}
              >
                <ArrowDouble />
                <span
                  className={cn(
                    MOBILE_NAV_LABEL,
                    "ml-[15px] inline-block max-mobile:ml-[10px]",
                  )}
                >
                  {journalTranslation.previousJournalMobile[locale]}
                </span>
              </Link>
              <Link
                href={nextHref ?? selfHref}
                className={cn(
                  MOBILE_NAV,
                  "[&>svg]:[transform:rotate(180deg)]",
                  !nextHref && "pointer-events-none opacity-25",
                )}
                aria-current={nextHref ? undefined : "page"}
              >
                <span
                  className={cn(
                    MOBILE_NAV_LABEL,
                    "mr-[15px] max-mobile:mr-[10px]",
                  )}
                >
                  {journalTranslation.nextJournalMobile[locale]}
                </span>
                <ArrowDouble />
              </Link>
            </div>
          </InViewSection>
        )}

        {post.related.length > 0 && (
          <InViewSection
            id="Related"
            className="group/related relative mx-auto w-full grow-0 px-[140px] pt-0 pb-20 text-black max-mtablet:px-5 max-tablet:px-[115px] max-mtablet:pt-0 max-tablet:pt-10 max-mtablet:pb-[60px]"
          >
            <div className="mx-auto min-h-full w-full max-w-[1000px] p-0 max-mtablet:max-w-[1200px] max-tablet:max-w-[1050px]">
              <div className="mx-auto w-full">
                <h1
                  className={cn(
                    "mt-0 mb-10 text-center font-amarillo font-bold text-[48px] text-inherit leading-[48px] max-mtablet:mb-5 max-mobile:text-[24px] max-mobile:leading-[24px]",
                    RELATED_REVEAL,
                  )}
                >
                  {journalTranslation.relatedJournal[locale]}
                </h1>
                <div
                  className={cn(
                    JOURNAL_GRID,
                    RELATED_REVEAL,
                    "loaded:group-[.inview]/related:delay-300",
                  )}
                >
                  {post.related.map((journal) => (
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
              </div>
            </div>
          </InViewSection>
        )}
      </div>
    </Layout>
  )
}

export default JournalDetail
