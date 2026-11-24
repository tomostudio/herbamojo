import RootDocument, { ROOT_VIEWPORT, rootMetadata } from "@/app/root-document"

/** Root layout of the Indonesian site (/id): <html lang="id">. */
export const viewport = ROOT_VIEWPORT

export async function generateMetadata() {
  return rootMetadata()
}

export default function IdRootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="id">{children}</RootDocument>
}
