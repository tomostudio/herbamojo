import type { Metadata } from "next"
import { notFound } from "next/navigation"

import JournalList from "@/app/(en)/journal"
import JournalPost from "@/app/(en)/journal/[slug]"
import { JOURNAL_SEO_QUERY } from "@/app/(en)/journal/queries"
import {
  getJournalAlternates,
  getJournalListData,
  getJournalPostData,
  getJournalStaticParams,
  isListPage,
} from "@/app/(en)/journal/utils"
import { fetchMetadata } from "@/utils/fetchMetadata"

export const revalidate = 60

/** Prerenders every post and list page at build time, as the original did. */
export async function generateStaticParams() {
  return getJournalStaticParams("id")
}

export async function generateMetadata({
  params,
}: PageProps<"/id/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const alternates = await getJournalAlternates("id", slug)
  if (isListPage(slug))
    return fetchMetadata(null, `Jurnal ${slug}`, "en", false, { alternates })
  return fetchMetadata(JOURNAL_SEO_QUERY("id", slug), "Jurnal", "en", false, {
    perFieldFallback: true,
    alternates,
  })
}

export default async function JournalDetailPageId({
  params,
}: PageProps<"/id/journal/[slug]">) {
  const { slug } = await params

  if (isListPage(slug)) {
    const page = Number(slug)
    const list = await getJournalListData("id", page)
    if (page < 2 || page > list.totalPages) notFound()
    return (
      <JournalList
        locale="id"
        settings={list.settingAPI}
        footer={list.footerAPI}
        items={list.items}
        page={page}
        totalPages={list.totalPages}
        altTotalPages={list.altTotalPages}
      />
    )
  }

  const data = await getJournalPostData("id", slug)
  if (!data) notFound()

  return (
    <JournalPost
      locale="id"
      settings={data.settingAPI}
      footer={data.footerAPI}
      post={data.post}
      prevSlug={data.prevSlug}
      nextSlug={data.nextSlug}
    />
  )
}
