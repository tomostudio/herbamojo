import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

import { revalidateSecret } from "@/sanity/env"

/**
 * Revalidates the pages a published document appears on.
 *
 * Sanity signs each delivery, and the signature is checked against
 * SANITY_REVALIDATE_SECRET before anything is revalidated — without that the
 * endpoint would let anyone force the whole site to re-render on demand.
 */

type WebhookBody = {
  _type?: string
  _id?: string
  slug?: string
  language?: "en" | "id"
}

/** Which routes a document of each type can appear on. */
function pathsFor(body: WebhookBody): { path: string; layout?: boolean }[] {
  const { _type, slug, language } = body

  switch (_type) {
    // These sit in the root layout, so every page shows them.
    case "generalSettings":
    case "footer":
      return [{ path: "/", layout: true }]

    case "home":
      return [{ path: "/" }, { path: "/id" }]

    case "post": {
      const base = language === "id" ? "/id/journal" : "/journal"
      return [
        // The post itself, the list it appears in and its pagination, the home
        // page's journal strip, and the sitemap that lists it.
        ...(slug ? [{ path: `${base}/${slug}` }] : []),
        { path: base, layout: true },
        { path: language === "id" ? "/id" : "/" },
        { path: "/sitemap.xml" },
        { path: "/sitemap-0.xml" },
      ]
    }

    default:
      return [{ path: "/", layout: true }]
  }
}

export async function POST(request: NextRequest) {
  const secret = revalidateSecret
  if (!secret) {
    return Response.json(
      { revalidated: false, message: "SANITY_REVALIDATE_SECRET is not set" },
      { status: 500 },
    )
  }

  const { isValidSignature, body } = await parseBody<WebhookBody>(
    request,
    secret,
  )

  if (!isValidSignature) {
    return Response.json(
      { revalidated: false, message: "Invalid signature" },
      { status: 401 },
    )
  }
  if (!body?._type) {
    return Response.json(
      { revalidated: false, message: "Body is missing _type" },
      { status: 400 },
    )
  }

  const targets = pathsFor(body)
  for (const { path, layout } of targets) {
    revalidatePath(path, layout ? "layout" : "page")
  }

  return Response.json({
    revalidated: true,
    type: body._type,
    paths: targets.map((t) => t.path),
    now: Date.now(),
  })
}
