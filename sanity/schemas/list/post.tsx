import { defineType } from "sanity"

import {
  createImageField,
  createSeoField,
  JOURNAL_SEO_IMAGE_DESCRIPTION,
  SEO_GROUP,
} from "../shared/fields"

export default defineType({
  name: "post",
  title: "Journal",
  type: "document",
  groups: [
    SEO_GROUP,
    { name: "content", title: "Content" },
    { name: "display", title: "Display" },
  ],
  fields: [
    createSeoField({
      group: "seo",
      description:
        "Data for search engines and how this journal appears when shared. Without a description here the Excerpt is used; other fields left empty use the Default Metadata from General Settings.",
      imageDescription: JOURNAL_SEO_IMAGE_DESCRIPTION,
    }),
    {
      name: "language",
      title: "Language",
      description:
        "Which version of the site this journal appears on. Each language is its own journal entry.",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Indonesian", value: "id" },
        ],
        layout: "radio",
      },
      initialValue: "en",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      description:
        "Main title, shown on the journal card and over the cover image.",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      description:
        "Part of a page’s URL that comes after the domain name and identifies the page. It is generated from the page title using lowercase letters (a–z), numbers (0–9), and dashes (-), must be at least three characters long, and must not start with a slash (/).",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "altSlug",
      title: "Alternate Language Slug",
      description:
        "Slug of this same journal in the other language, so the EN/ID toggle lands on its translation. Leave empty to send the toggle to the journal list.",
      type: "string",
      group: "content",
    },
    {
      name: "date",
      title: "Publish Date",
      description: "Journals are listed newest first by this date.",
      type: "datetime",
      group: "content",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "listOrder",
      title: "List Order",
      description:
        "Breaks ties when two journals share a publish date. Lower comes first.",
      type: "number",
      group: "content",
    },
    {
      name: "excerpt",
      title: "Excerpt",
      description:
        "Short summary of the journal, used as its description on search engines and when shared.",
      type: "text",
      rows: 3,
      group: "content",
    },
    {
      name: "body",
      title: "Body",
      description: "The article itself.",
      type: "blockContent",
      group: "content",
    },
    {
      name: "related",
      title: "Related Journals",
      description:
        "Journals suggested at the end of this one, in the order listed here.",
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
    {
      name: "listColorBlack",
      title: "Black Text on Thumbnail",
      description:
        "Use black instead of white for the title on the card, for light thumbnails.",
      type: "boolean",
      group: "display",
      initialValue: false,
    },
    createImageField({
      name: "coverImage",
      title: "Cover Image",
      description:
        "Min. Width 1920px | Aspect Ratio 16:9 | PNG / JPEG / WEBP. Shown across the top of the journal, behind the title.",
      group: "display",
      required: true,
    }),
    {
      name: "headerColorBlack",
      title: "Black Text on Cover",
      description:
        "Use black instead of white for the title and header over the cover, for light cover images.",
      type: "boolean",
      group: "display",
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: "Publish Date, New to Old",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      language: "language",
      media: "thumbImage",
    },
    prepare: ({ title, date, language, media }) => ({
      title,
      subtitle: `${language?.toUpperCase()} · ${date ? new Date(date).toLocaleDateString() : ""}`,
      media,
    }),
  },
})
