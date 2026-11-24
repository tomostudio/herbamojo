/** The [slug] segment serves both posts and numbered list pages (/journal/2). */
export const isListPage = (slug: string) => /^\d+$/.test(slug)
