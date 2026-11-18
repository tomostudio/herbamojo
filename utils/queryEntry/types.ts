export type QueryParams = Record<string, unknown>

export type QueryEntry =
  | string
  | {
      query: string
      params?: QueryParams
      failSoft?: boolean
    }

export type OptionalQueryEntry = QueryEntry | null | undefined

export type QueryConfig = {
  query: string
  params: QueryParams
  failSoft: boolean
}

export type QueriesMap = Record<string, QueryEntry>
