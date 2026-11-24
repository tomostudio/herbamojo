import type { PortableRichText, SanityImage } from "@/types"

export type JournalListItem = {
  _id: string
  title: string
  date: string
  slug: { current: string }
  listColorBlack: boolean
  thumbImage: SanityImage
}

export type JournalDetail = {
  _id: string
  title: string
  date: string
  slug: { current: string }
  headerColorBlack: boolean
  coverImage: SanityImage
  body: PortableRichText
  excerpt?: string
  related: JournalListItem[]
  altSlug?: string
}
