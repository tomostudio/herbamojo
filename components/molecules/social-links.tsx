import Link from "next/link"

import {
  EmailIcon,
  InstagramIcon,
  WhatsappIcon,
} from "@/components/atoms/social-icons"
import type { FooterSettings } from "@/types"
import { cn } from "@/utils/cn"

type SocialLinksProps = {
  footer: FooterSettings
  /** Sizing and colour for each link; the icon fills the link's height. */
  linkClassName?: string
}

/**
 * The Instagram / WhatsApp / email icons. The icons' `.fill` and `.stroke`
 * parts are recoloured on hover; the link itself does not fade.
 */
const SocialLinks = ({ footer, linkClassName }: SocialLinksProps) => {
  const className = cn(
    "block [&_.fill]:transition-[fill] [&_.stroke]:transition-[stroke] [&_svg]:h-full [&_svg]:w-auto",
    "hover:[&_.fill]:fill-white hover:[&_.stroke]:stroke-white",
    linkClassName,
  )

  return (
    <>
      {footer.instagramLink && (
        <Link
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          href={footer.instagramLink}
          aria-label="Instagram"
        >
          <InstagramIcon />
        </Link>
      )}
      {footer.whatsappNumber && (
        <Link
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://api.whatsapp.com/send?phone=${footer.whatsappNumber.replace("+", "")}`}
          aria-label="Whatsapp"
        >
          <WhatsappIcon />
        </Link>
      )}
      {footer.email && (
        <Link
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          href={`mailto:${footer.email}`}
          aria-label="Email"
        >
          <EmailIcon />
        </Link>
      )}
    </>
  )
}

export default SocialLinks
