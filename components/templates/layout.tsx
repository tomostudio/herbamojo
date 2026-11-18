import type { ReactNode } from "react"

import Container from "@/components/atoms/container"
import Footer from "@/components/organisms/footer"
import type { FooterSettings, GeneralSettings, Locale } from "@/types"
import { cn } from "@/utils/cn"

type LayoutProps = {
  children: ReactNode
  footerData?: { settingAPI: GeneralSettings; footerAPI: FooterSettings } | null
  locale: Locale
  /** The page loaders find their images through this id. */
  mainId?: string
  mainClassName?: string
  footerClassName?: string
  withoutFooter?: boolean
  withoutPadding?: boolean
  withoutMaxWidth?: boolean
}

const Layout = ({
  children,
  footerData,
  locale,
  mainId,
  mainClassName,
  footerClassName,
  withoutFooter,
  withoutPadding,
  withoutMaxWidth,
}: LayoutProps) => {
  return (
    <main
      id={mainId}
      className={cn(
        // Held invisible behind #LoaderWrapper until the page's loader puts
        // `loaded` on the body, then faded in.
        "relative block not-loaded:opacity-0 loaded:transition-opacity not-loaded:transition-none loaded:duration-500",
        mainClassName,
      )}
    >
      <Container
        withoutPadding={withoutPadding}
        withoutMaxWidth={withoutMaxWidth}
      >
        {children}
      </Container>
      {!withoutFooter && footerData && (
        <Footer
          settings={footerData.settingAPI}
          footer={footerData.footerAPI}
          locale={locale}
          className={footerClassName}
        />
      )}
    </main>
  )
}

export default Layout
