import type { OptionalQueryEntry, QueryConfig, QueryEntry } from "./types"

export function resolveQueryConfig(
  entry: QueryEntry | OptionalQueryEntry,
): QueryConfig | null {
  if (!entry) return null

  if (typeof entry === "string") {
    return { query: entry, params: {}, failSoft: false }
  }

  return {
    query: entry.query,
    params: entry.params ?? {},
    failSoft: entry.failSoft ?? false,
  }
}

export type {
  OptionalQueryEntry,
  QueriesMap,
  QueryConfig,
  QueryEntry,
  QueryParams,
} from "./types"
