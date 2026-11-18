import type { Rule } from "sanity"

const DEFAULT_ALT_TEXT = "Herbamojo"

const ALT_TEXT_DESCRIPTION =
  "A short, descriptive phrase or sentence that provides a textual substitute for non-text content, primarily images, on web pages and digital documents. Often used as an accessibility feature"

const PAGE_SEO_TITLE = "Metadata (for Search Engine)"

const PAGE_SEO_DESCRIPTION =
  "Data for search engines and how this page appears when shared. Leave empty to use the Default Metadata from General Settings."

const DEFAULT_SEO_TITLE = "Default Metadata (for Search Engine)"

const DEFAULT_SEO_DESCRIPTION =
  "Default information for search engines, such as page title and description, used when not set on individual pages."

const SEO_DESCRIPTION_FIELD_DESCRIPTION =
  "Enter up to 400 characters to describe this website, in English and Indonesian. This description is what will be displayed below the page’s title on search engines or when this page is being shared (e.g. Google or WhatsApp)"

const SEO_KEYWORDS_FIELD_DESCRIPTION =
  "Enter some keywords to describe this website (separated by commas)"

export const SEO_IMAGE_DESCRIPTION =
  "800 x 600 | PNG / JPEG / WEBP | max 100kb. This image is what will be displayed on search engines or when this page is being shared (e.g. Google or WhatsApp)"

export const JOURNAL_SEO_IMAGE_DESCRIPTION =
  "1200 x 628 | PNG / JPEG / WEBP | max 100kb. This image is what will be displayed on search engines or when this journal is being shared (e.g. Google or WhatsApp)"

export const SEO_GROUP = { name: "seo", title: PAGE_SEO_TITLE }

const withGroup = (group?: string) => (group ? { group } : {})

const withDescription = (description?: string) =>
  description ? { description } : {}

// An image counts as filled only once an asset is uploaded — an object holding
// just the alt text must not pass.
export const requireImageAsset = (rule: Rule) =>
  rule.custom((field?: { asset?: unknown }) =>
    field?.asset ? true : "Required",
  )

export const createAltTextField = () => ({
  title: "Alt Text",
  description: ALT_TEXT_DESCRIPTION,
  name: "alt",
  initialValue: DEFAULT_ALT_TEXT,
  type: "string",
})

export const createCaptionField = () => ({
  name: "caption",
  title: "Caption",
  type: "string",
})

type ImageFieldOptions = {
  name: string
  // Array members are untitled; Studio labels them by type.
  title?: string
  description?: string
  group?: string
  required?: boolean
  // Adds a caption next to the alt text.
  caption?: boolean
  hotspot?: boolean
}

export const createImageField = ({
  name,
  title,
  description,
  group,
  required = false,
  caption = false,
  hotspot = true,
}: ImageFieldOptions) => ({
  name,
  ...(title ? { title } : {}),
  type: "image",
  ...withGroup(group),
  ...withDescription(description),
  ...(hotspot ? { options: { hotspot: true } } : {}),
  ...(required ? { validation: requireImageAsset } : {}),
  fields: [createAltTextField(), ...(caption ? [createCaptionField()] : [])],
})

type SeoFieldOptions = {
  group?: string
  title?: string
  description?: string
  imageDescription?: string
  // Site-wide defaults must be filled; page-level SEO is optional.
  required?: boolean
  hotspot?: boolean
}

export const createSeoField = ({
  group,
  title = PAGE_SEO_TITLE,
  description = PAGE_SEO_DESCRIPTION,
  imageDescription = SEO_IMAGE_DESCRIPTION,
  required = false,
  hotspot = true,
}: SeoFieldOptions = {}) => {
  const requiredRule = required
    ? { validation: (rule: Rule) => rule.required() }
    : {}

  return {
    title,
    description,
    name: "seo",
    type: "object",
    ...withGroup(group),
    fields: [
      {
        // The site is bilingual, so the description is written per language.
        name: "seo_description",
        description: SEO_DESCRIPTION_FIELD_DESCRIPTION,
        type: "localeText",
        title: "Description",
        ...requiredRule,
      },
      {
        name: "seo_keywords",
        description: SEO_KEYWORDS_FIELD_DESCRIPTION,
        type: "string",
        title: "Keywords",
        ...requiredRule,
      },
      createImageField({
        name: "seo_image",
        title: "Image",
        description: imageDescription,
        required,
        hotspot,
      }),
    ],
  }
}

// generalSettings: the fallback every page's metadata falls back to.
export const createDefaultSeoField = ({ group }: { group?: string } = {}) =>
  createSeoField({
    group,
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    required: true,
    hotspot: false,
  })
