import StudioClient from "@/components/organisms/studio-client"

export const dynamic = "force-dynamic"
// The Studio fetches its own content in the browser; nothing here is cached.
export const revalidate = 0

export { metadata, viewport } from "next-sanity/studio"

export default function StudioPage() {
  return <StudioClient />
}
