import type { LocaleString, LocaleText, SanityImage } from "@/types"

export type HomeDoc = {
  popup: {
    enable: boolean
    always: boolean
    image?: SanityImage
    content: LocaleString
    buttonText: LocaleString
    link: LocaleString
  }
  hero: {
    title: LocaleString
    background: SanityImage
    backgroundMobile: SanityImage
    know: LocaleString
    your: LocaleString
    strength: LocaleString
    getYours: LocaleString
    shopFloat: LocaleString
  }
  about: {
    title: LocaleString
    background: SanityImage
    description: LocaleText
    pomInfoLine1: LocaleString
    pomInfoLine2: LocaleString
    certNatural: LocaleString
    certHalal: LocaleString
    certQuality: LocaleString
    certQuadra: LocaleString
  }
  benefits: {
    title: LocaleString
    stamina: { line1: LocaleString; line2: LocaleString }
    energy: { line1: LocaleString; line2: LocaleString }
    immune: { line1: LocaleString; line2: LocaleString }
    exercise: { line1: LocaleString; line2: LocaleString }
  }
  ingredients: {
    title: LocaleString
    items: Array<{
      _key: string
      image: SanityImage
      title: LocaleString
      description: LocaleText
    }>
  }
  shop: HomeShop
  journal: {
    title: LocaleString
    viewAll: LocaleString
  }
}

export type ShopItem = {
  _key: string
  image: SanityImage
  link?: string
  background?: string
}

export type StockistItem = {
  _key: string
  content: string
  link?: string
}

/** "NOMOBILE" drops the slider below the mobile breakpoint. */
export type SliderOption = "NORMAL" | "NOMOBILE" | "NOSLIDER"

/** Which of the three markup branches a shop section renders. */
export type ShopLayout = "SINGLE" | "SLIDER" | "NOSLIDER"

/** The Shop section of the home document. */
export type HomeShop = {
  title: LocaleString
  onlineTitle: LocaleString
  offlineTitle: LocaleString
  stockistTitle: LocaleString
  onlineShop: ShopItem[]
  onlineShopSliderOption?: SliderOption
  offlineShop: ShopItem[]
  offlineShopSliderOption?: SliderOption
  stockist: StockistItem[]
  stockistSliderOption?: SliderOption
}

export type JournalCard = {
  _id: string
  title: string
  date: string
  slug: { current: string }
  listColorBlack: boolean
  thumbImage: SanityImage
}
