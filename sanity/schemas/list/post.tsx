import type { Rule, SlugValue } from "sanity"
import { defineType } from "sanity"

import {
  createImageField,
  JOURNAL_SEO_IMAGE_DESCRIPTION,
  SEO_GROUP,
} from "../shared/fields"

/**
 * One journal entry holds both languages, English on the left and Indonesian
 * on the right. A language is published once its title is filled in; a
 * journal may be written in only one of them.
 */
const LANGUAGES = [
  { name: "en", title: "English" },
  { name: "id", title: "Indonesian" },
] as const

type Language = (typeof LANGUAGES)[number]["name"]

type PostDocument = {
  title?: Partial<Record<Language, string>>
}

const hasTitle = (document: unknown, language: Language) =>
  Boolean((document as PostDocument | undefined)?.title?.[language])

type SideBySideOptions = {
  name: string
  title: string
  description?: string
  // Fields nested in another object, such as the SEO ones, take no group.
  group?: string
  field: (language: Language) => Record<string, unknown>
}

const sideBySide = ({
  name,
  title,
  description,
  group,
  field,
}: SideBySideOptions) => ({
  name,
  title,
  ...(description ? { description } : {}),
  type: "object",
  ...(group ? { group } : {}),
  options: { columns: 2 },
  fields: LANGUAGES.map((language) => ({
    name: language.name,
    title: language.title,
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
    sideBySide({
      name: "title",
      title: "Title",
      description:
        "Main title, shown on the journal card and over the cover image. Fill in one language to publish the journal only on that version of the site.",
      group: "content",
      field: () => ({ type: "string" }),
    }),
    sideBySide({
      name: "slug",
      title: "Slug",
      description:
        "Part of a page’s URL that comes after the domain name and identifies the page. It is generated from the title using lowercase letters (a–z), numbers (0–9), and dashes (-), must be at least three characters long, and must not start with a slash (/).",
      group: "content",
      field: (language) => ({
        type: "slug",
        options: { source: `title.${language}`, maxLength: 96 },
        validation: (rule: Rule) =>
          rule.custom((value: SlugValue | undefined, context) =>
            hasTitle(context.document, language) && !value?.current
              ? "Required when this language has a title"
              : true,
          ),
      }),
    }),
    {
      name: "date",
      title: "Publish Date",
      description: "Journals are listed newest first by this date.",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    },
    {
      name: "listOrder",
      title: "List Order",
      description:
        "Breaks ties when two journals share a publish date. Lower comes first.",
      type: "number",
      group: "content",
    },
    sideBySide({
      name: "excerpt",
      title: "Excerpt",
      description:
        "Short summary of the journal, used as its description on search engines and when shared.",
      group: "content",
      field: () => ({ type: "text", rows: 3 }),
    }),
    sideBySide({
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
    sideBySide({
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
    sideBySide({
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
        sideBySide({
          name: "seo_description",
          title: "Description",
          description:
            "Up to 400 characters, shown below the title on search engines and when the journal is shared.",
          field: () => ({ type: "text", rows: 3 }),
        }),
        sideBySide({
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
  validation: (rule) =>
    rule.custom((document) =>
      hasTitle(document, "en") || hasTitle(document, "id")
        ? true
        : "Fill in the title in at least one language",
    ),
  orderings: [
    {
      title: "Publish Date, New to Old",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleId: "title.id",
      date: "date",
      media: "thumbImage",
    },
    prepare: ({ titleEn, titleId, date, media }) => ({
      title: titleEn || titleId,
      subtitle: [
        [titleEn && "EN", titleId && "ID"].filter(Boolean).join(" + "),
        date ? new Date(date).toLocaleDateString() : "",
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
})
