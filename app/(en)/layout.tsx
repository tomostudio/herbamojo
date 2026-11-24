import RootDocument, { ROOT_VIEWPORT, rootMetadata } from "@/app/root-document"

/** Root layout of the English site: <html lang="en">. */
export const viewport = ROOT_VIEWPORT

export async function generateMetadata() {
  return rootMetadata()
}

export default function EnRootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="en">{children}</RootDocument>
}
