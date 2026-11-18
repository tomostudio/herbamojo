import { sanityFetch } from "@/sanity/lib/fetch"
import type { GeneralSettings } from "@/types"
import { SITE_URL } from "@/utils/fetchMetadata"
import { fetchPageData } from "@/utils/fetchPageData"

const POST_PATHS_QUERY = `*[_type == "post" && active == true]{
  "slug": slug.current, language
}`

const STATIC_PATHS = ["/", "/id/", "/authentication/", "/id/autentikasi/"]

type PostPath = { slug: string; language: "en" | "id" }

/** Every page the site serves, in the order the original lists them. */
export async function sitemapPaths(): Promise<string[]> {
  const [posts, { settingAPI }] = await Promise.all([
    sanityFetch<PostPath[]>(POST_PATHS_QUERY),
    fetchPageData<{ settingAPI: GeneralSettings }>(),
  ])

  const all = posts ?? []
  const perPage = settingAPI?.journalPerList || 6
  const paths = [...STATIC_PATHS]

  for (const [language, base] of [
    ["en", "/journal"],
    ["id", "/id/journal"],
  ] as const) {
    const inLanguage = all.filter((post) => post.language === language)
    paths.push(`${base}/`)
    // The list is paginated by path, and every one of those pages is its own
    // entry in the original's sitemap.
    const pageCount = Math.ceil(inLanguage.length / perPage)
    for (let page = 2; page <= pageCount; page++) paths.push(`${base}/${page}/`)
    for (const post of inLanguage) paths.push(`${base}/${post.slug}/`)
  }

  return paths
}

export function sitemapUrls(paths: string[]): string[] {
  return paths.map((path) => `${SITE_URL}${path}`)
}
