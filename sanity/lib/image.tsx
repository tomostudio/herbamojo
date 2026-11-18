import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url"

import { dataset, projectId } from "@/sanity/env"

const imageBuilder = createImageUrlBuilder({ projectId, dataset })

export const urlForImage = (source: SanityImageSource) => {
  return imageBuilder.image(source).auto("format").fit("max")
}
