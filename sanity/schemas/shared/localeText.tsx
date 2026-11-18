import { defineType } from "sanity"

// A paragraph written in both site languages.
export default defineType({
  name: "localeText",
  title: "Paragraph (EN/ID)",
  type: "object",
  fields: [
    {
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "id",
      title: "Indonesian",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: "en" },
  },
})
