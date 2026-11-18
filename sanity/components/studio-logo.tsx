import Image from "next/image"

/**
 * The Studio's navbar mark. Uses the site's own favicon so the CMS is
 * recognisably the same property as the website, rather than a wordmark that
 * matches nothing else.
 */
export default function StudioLogo() {
  return (
    <Image
      src="/favicon-32x32.png"
      alt="Herbamojo"
      width={24}
      height={24}
      style={{ display: "block", borderRadius: 4 }}
    />
  )
}
