import type { Rule, SlugValue } from "sanity"
import { defineType } from "sanity"

import {
  createImageField,
  JOURNAL_SEO_IMAGE_DESCRIPTION,
  SEO_GROUP,
} from "../shared/fields"

/**
 * One journal entry holds both languages, English above Indonesian in each
 * field. The "Show On" switches decide which versions of the site it appears
 * on; the fields of a language that is switched off are hidden.
 */
const LANGUAGES = [
  { name: "en", title: "English" },
  { name: "id", title: "Indonesian" },
] as const

type Language = (typeof LANGUAGES)[number]["name"]

type PostDocument = {
  showOn?: Partial<Record<Language, boolean>>
}

const isShownOn = (document: unknown, language: Language) =>
  Boolean((document as PostDocument | undefined)?.showOn?.[language])

const requiredWhenShown = (language: Language) => (rule: Rule) =>
  rule.custom((value: unknown, context) =>
    isShownOn(context.document, language) &&
    !(typeof value === "object" ? (value as SlugValue)?.current : value)
      ? "Required while this journal is shown on this language's site"
      : true,
  )

type PerLanguageOptions = {
  name: string
  title: string
  description?: string
  // Fields nested in another object, such as the SEO ones, take no group.
  group?: string
  field: (language: Language) => Record<string, unknown>
}

const perLanguage = ({
  name,
  title,
  description,
  group,
  field,
}: PerLanguageOptions) => ({
  name,
  title,
  ...(description ? { description } : {}),
  type: "object",
  ...(group ? { group } : {}),
  fields: LANGUAGES.map((language) => ({
    name: language.name,
    title: language.title,
    hidden: ({ document }: { document?: unknown }) =>
      !isShownOn(document, language.name),
    ...field(language.name),
  })),
})

export default defineType({
  name: "post",
  title: "Journal",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" },
    SEO_GROUP,
  ],
  fields: [
    {
      name: "showOn",
      title: "Show On",
      description:
        "Which versions of the site this journal appears on. A language switched off has its fields hidden below. With both off the journal is kept but appears on neither site.",
      type: "object",
      group: "content",
      options: { columns: 2 },
      fields: LANGUAGES.map((language) => ({
        name: language.name,
        title: `${language.title} site`,
        type: "boolean",
      })),
      initialValue: { en: true, id: true },
    },
    perLanguage({
      name: "title",
      title: "Title",
      description:
        "Main title, shown on the journal card and over the cover image.",
      group: "content",
      field: (language) => ({
        type: "string",
        validation: requiredWhenShown(language),
      }),
    }),
    perLanguage({
      name: "slug",
      title: "Slug",
      description:
        "Part of a page’s URL that comes after the domain name and identifies the page. It is generated from the title using lowercase letters (a–z), numbers (0–9), and dashes (-), must be at least three characters long, and must not start with a slash (/).",
      group: "content",
      field: (language) => ({
        type: "slug",
        options: { source: `title.${language}`, maxLength: 96 },
        validation: requiredWhenShown(language),
      }),
    }),
    perLanguage({
      name: "date",
      title: "Publish Date",
      description:
        "Shown on the journal, and each site lists its journals newest first by it.",
      group: "content",
      field: (language) => ({
        type: "datetime",
        validation: requiredWhenShown(language),
      }),
    }),
    perLanguage({
      name: "listOrder",
      title: "List Order",
      description:
        "Breaks ties when two journals share a publish date. Lower comes first.",
      group: "content",
      field: () => ({ type: "number" }),
    }),
    perLanguage({
      name: "excerpt",
      title: "Excerpt",
      description:
        "Short summary of the journal, used as its description on search engines and when shared.",
      group: "content",
      field: () => ({ type: "text", rows: 3 }),
    }),
    perLanguage({
      name: "body",
      title: "Body",
      description: "The article itself.",
      group: "content",
      field: () => ({ type: "blockContent" }),
    }),
    {
      name: "related",
      title: "Related Journals",
      description:
        "Journals suggested at the end of this one, in the order listed here. Each language only shows the ones written in it.",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    },
    {
      name: "active",
      title: "Active",
      description:
        "Show this journal in the lists. Turned off, it is hidden from the lists and neighbour links.",
      type: "boolean",
      group: "display",
      initialValue: true,
    },
    createImageField({
      name: "thumbImage",
      title: "Thumbnail",
      description:
        "Width 1200px | Aspect Ratio 16:9 | PNG / JPEG / WEBP. Shown on the journal cards, behind the title.",
      group: "display",
      required: true,
    }),
    perLanguage({
      name: "listColorBlack",
      title: "Black Text on Thumbnail",
      description:
        "Use black instead of white for the title on the card, for light thumbnails.",
      group: "display",
      field: () => ({ type: "boolean", initialValue: false }),
    }),
    createImageField({
      name: "coverImage",
      title: "Cover Image",
      description:
        "Min. Width 1920px | Aspect Ratio 16:9 | PNG / JPEG / WEBP. Shown across the top of the journal, behind the title.",
      group: "display",
      required: true,
    }),
    perLanguage({
      name: "headerColorBlack",
      title: "Black Text on Cover",
      description:
        "Use black instead of white for the title and header over the cover, for light cover images.",
      group: "display",
      field: () => ({ type: "boolean", initialValue: false }),
    }),
    {
      // Not createSeoField: its description and keywords are shared or must be
      // filled in both languages, and a journal may be written in only one.
      name: "seo",
      title: SEO_GROUP.title,
      description:
        "Data for search engines and how this journal appears when shared. Without a description here the Excerpt is used; other fields left empty use the Default Metadata from General Settings.",
      type: "object",
      group: "seo",
      fields: [
        perLanguage({
          name: "seo_description",
          title: "Description",
          description:
            "Up to 400 characters, shown below the title on search engines and when the journal is shared.",
          field: () => ({ type: "text", rows: 3 }),
        }),
        perLanguage({
          name: "seo_keywords",
          title: "Keywords",
          description: "Keywords describing this journal, separated by commas.",
          field: () => ({ type: "string" }),
        }),
        createImageField({
          name: "seo_image",
          title: "Image",
          description: JOURNAL_SEO_IMAGE_DESCRIPTION,
        }),
      ],
    },
  ],
  orderings: [
    {
      title: "English Publish Date, New to Old",
      name: "dateEnDesc",
      by: [{ field: "date.en", direction: "desc" }],
    },
    {
      title: "Indonesian Publish Date, New to Old",
      name: "dateIdDesc",
      by: [{ field: "date.id", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleId: "title.id",
      showEn: "showOn.en",
      showId: "showOn.id",
      dateEn: "date.en",
      dateId: "date.id",
      media: "thumbImage",
    },
    prepare: ({ titleEn, titleId, showEn, showId, dateEn, dateId, media }) => ({
      title: (showEn && titleEn) || (showId && titleId) || titleEn || titleId,
      subtitle: [
        [showEn && "EN", showId && "ID"].filter(Boolean).join(" + ") ||
          "Hidden",
        (showEn && dateEn) || (showId && dateId)
          ? new Date((showEn && dateEn) || dateId).toLocaleDateString()
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
})
