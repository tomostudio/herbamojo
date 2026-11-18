import { sanityFetch } from "@/sanity/lib/fetch"
import type { QueriesMap } from "@/utils/queryEntry"

import { BASE_QUERIES } from "./constants"

export async function fetchPageData<T extends Record<string, unknown>>(
  additionalQueries: QueriesMap = {},
): Promise<T> {
  const queries = { ...BASE_QUERIES, ...additionalQueries }
  const keys = Object.keys(queries)

  const results = await Promise.all(
    keys.map((key) => sanityFetch(queries[key])),
  )

  return keys.reduce(
    (acc, key, index) => {
      acc[key] = results[index]
      return acc
    },
    {} as Record<string, unknown>,
  ) as T
}
