export type SanityImageAsset = {
  _ref?: string
  _type?: "reference"
}

export type SanityImage = {
  _type?: "image"
  asset?: SanityImageAsset
  alt?: string
}
