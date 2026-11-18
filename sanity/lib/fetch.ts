import { client } from "@/sanity/lib/client"
import type { QueryConfig, QueryEntry } from "@/utils/queryEntry"
import { resolveQueryConfig } from "@/utils/queryEntry"

// A production build prerenders every page across several workers at once,
// which is when the API is most likely to drop a connection, so the budget has
// to outlast a burst rather than just a single blip.
const RETRY_DELAYS_MS = [200, 600, 1500, 3000, 6000, 10000, 15000]

const isBuild = process.env.NEXT_PHASE === "phase-production-build"

/**
 * A build runs seven workers at once, each rendering pages whose queries are
 * unique to them, so deduplication cannot flatten that burst. Capping the
 * requests any one worker has open keeps the total within what the API will
 * hold open, which is what the dropped connections were really about.
 */
const MAX_CONCURRENT = 2
let active = 0
const waiting: Array<() => void> = []

async function acquire() {
  if (active < MAX_CONCURRENT) {
    active++
    return
  }
  await new Promise<void>((resolve) => waiting.push(resolve))
  active++
}

function release() {
  active--
  waiting.shift()?.()
}

/** Identical queries issued at the same moment share one request. */
const inFlight = new Map<string, Promise<unknown>>()

/**
 * Every page asks for the site settings and the footer, so a build repeats
 * those two queries once per page. Holding the answers for the length of the
 * build turns a hundred-odd identical requests into one. Never used at
 * runtime, where each render must be free to see fresh content.
 */
const buildCache = new Map<string, unknown>()

/** A dropped connection or timeout, as opposed to a query the API rejected. */
function isTransient(error: unknown) {
  if (!(error instanceof Error)) return false
  const cause = (error as { cause?: { code?: string } }).cause
  if (cause?.code) return true
  const status = (error as { statusCode?: number }).statusCode
  if (status && status >= 500) return true
  return /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|network/i.test(
    error.message,
  )
}

async function runWithRetry<T>(config: QueryConfig): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      await acquire()
      try {
        return await client.fetch<T>(config.query, config.params)
      } finally {
        release()
      }
    } catch (error) {
      lastError = error
      if (!isTransient(error) || attempt === RETRY_DELAYS_MS.length) break
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAYS_MS[attempt]),
      )
    }
  }
  throw lastError
}

/**
 * The original is a static build and cannot fail at request time. This one
 * queries the CMS while rendering, so a dropped connection would otherwise
 * turn a page into a 500. Transient failures are retried with a short backoff;
 * a rejected query still throws straight away.
 */
export async function sanityFetch<T>(entry: QueryEntry): Promise<T | null> {
  const config = resolveQueryConfig(entry)
  if (!config) return null

  const key = `${config.query}::${JSON.stringify(config.params ?? null)}`

  if (isBuild && buildCache.has(key)) return buildCache.get(key) as T

  let pending = inFlight.get(key) as Promise<T> | undefined
  if (!pending) {
    pending = runWithRetry<T>(config)
    inFlight.set(key, pending)
    pending
      .then((value) => {
        if (isBuild) buildCache.set(key, value)
      })
      .catch(() => {})
      .finally(() => inFlight.delete(key))
  }

  try {
    return await pending
  } catch (error) {
    if (config.failSoft) return null
    throw error
  }
}
