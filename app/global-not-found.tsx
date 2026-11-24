import type { Metadata } from "next"

import NotFound, {
  generateMetadata as notFoundMetadata,
} from "@/app/(en)/not-found"
import RootDocument, { ROOT_VIEWPORT, rootMetadata } from "@/app/root-document"

/*
 * URLs that match no route. With a root layout per language there is no
 * single layout left to wrap the 404 in, so this renders the whole document
 * itself — the same 404 the routes show when they call notFound().
 */
export const viewport = ROOT_VIEWPORT

export async function generateMetadata(): Promise<Metadata> {
  const [root, page] = await Promise.all([rootMetadata(), notFoundMetadata()])
  return { ...root, ...page }
}

export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <NotFound />
    </RootDocument>
  )
}
