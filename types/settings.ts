import type { LocaleString } from "./locale"
import type { SanityImage } from "./sanity"

export type AuthSection = {
  _key: string
  title: LocaleString
  items: Array<LocaleString & { _key: string }>
}

export type GeneralSettings = {
  webTitle: string
  journalDisable: boolean
  journalSlug: string
  journalPerList: number
  navigation: {
    home: LocaleString
    journal: LocaleString
    authentication: LocaleString
  }
  errorText: LocaleString
  journalTranslation: {
    backText: LocaleString
    nextJournal: LocaleString
    nextJournalMobile: LocaleString
    previousJournal: LocaleString
    previousJournalMobile: LocaleString
    relatedJournal: LocaleString
  }
  authenticationSections: AuthSection[]
  analytics?: {
    gtmId?: string
    gtagId?: string
    facebookPixelId?: string
  }
  seo?: {
    seo_description?: LocaleString
    seo_keywords?: string
    seo_image?: SanityImage
  }
}

export type FooterSettings = {
  email?: string
  instagramLink?: string
  whatsappNumber?: string
}
