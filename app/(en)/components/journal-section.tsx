import Link from "next/link"

import JournalCard, { JOURNAL_GRID } from "@/components/molecules/journal-card"
import type { Locale } from "@/types"
import { cn } from "@/utils/cn"

import {
  HOME_CONTENT,
  HOME_H1,
  HOME_SECTION,
  HOME_WRAPPER,
  revealIn,
} from "../settings"
import type { HomeDoc, JournalCard as JournalCardType } from "../types"

type JournalSectionProps = {
  journal: HomeDoc["journal"]
  journals: JournalCardType[]
  journalSlug: string
  locale: Locale
  sectionRef: (el: HTMLElement | null) => void
}

const JournalSection = ({
  journal,
  journals,
  journalSlug,
  locale,
  sectionRef,
}: JournalSectionProps) => {
  const isId = locale === "id"
  return (
    <section
      id="journal"
      ref={sectionRef}
      className={cn(HOME_SECTION, "group/journal")}
    >
      <div className={cn(HOME_WRAPPER, "p-0")}>
        <h1 className={HOME_H1}>{journal.title[locale]}</h1>
        <div
          className={cn(
            HOME_CONTENT,
            "mx-auto mt-10 w-full after:h-5 max-mtablet:mt-10 max-mtablet:w-full [@media(min-height:800px)]:after:h-5",
          )}
        >
          <div
            className={cn(
              JOURNAL_GRID,
              revealIn("journal"),
              "loaded:group-[.inview]/journal:delay-200",
            )}
          >
            {journals.map((journal) => (
              <JournalCard
                key={journal._id}
                href={
                  isId
                    ? `/id${journalSlug}/${journal.slug.current}`
                    : `${journalSlug}/${journal.slug.current}`
                }
                date={journal.date}
                title={journal.title}
                image={journal.thumbImage}
                black={journal.listColorBlack}
              />
            ))}
          </div>
          {journals.length >= 4 && (
            <Link
              href={isId ? `/id${journalSlug}` : journalSlug}
              aria-label="Go to Journal"
              className={cn(
                "mx-auto mt-10 mb-0 font-amarillo text-[21px] text-white leading-4 max-mtablet:mt-5 max-mobile:text-[16px] max-mobile:leading-[14px]",
                revealIn("journal"),
                "loaded:group-[.inview]/journal:delay-500",
              )}
            >
              <span className="opacity-50 transition-opacity hover:opacity-100">
                {journal.viewAll[locale]}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default JournalSection
