"use client"

import Image, { type ImageLoader } from "next/image"
import type { CSSProperties } from "react"

import { urlForImage } from "@/sanity/lib/image"
import type { SanityImage as SanityImageType } from "@/types"
import { cn } from "@/utils/cn"

/**
 * Sanity resizes on its own CDN, so Next hands the requested width straight to
 * it rather than proxying through /_next/image.
 */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  url.searchParams.set("w", String(width))
  url.searchParams.set("q", String(quality ?? 75))
  return url.toString()
}

/** Asset ids carry their dimensions: image-<hash>-<width>x<height>-<ext>. */
function dimensionsFromRef(ref: string | undefined) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z]+$/)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

type SanityImageProps = {
  image: SanityImageType | undefined
  /** Empty for decorative images — the journal cards label themselves. */
  alt: string
  className?: string
  sizes?: string
  /** Above-the-fold images the loader waits on before revealing the page. */
  priority?: boolean
  /** "eager" loads without also preloading, matching the original's images. */
  loading?: "eager" | "lazy"
  style?: CSSProperties
}

/**
 * Keeps the GatsbyImage shape the layouts were designed around: a wrapper
 * that takes the caller's classes (size and position), a spacer holding the
 * aspect ratio, and next/image filling it.
 */
const SanityImage = ({
  image,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  loading,
  style,
}: SanityImageProps) => {
  if (!image?.asset) return null

  const dimensions = dimensionsFromRef(image.asset._ref)
  if (!dimensions) return null

  return (
    <div className={cn("relative block overflow-hidden", className)}>
      <div
        aria-hidden="true"
        style={{
          paddingTop: `${(dimensions.height / dimensions.width) * 100}%`,
        }}
      />
      <Image
        loader={sanityLoader}
        src={urlForImage(image).url()}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={loading}
        style={style}
      />
    </div>
  )
}

export default SanityImage
