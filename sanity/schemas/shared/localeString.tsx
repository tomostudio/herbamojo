import { defineType } from "sanity"

// A one-line text written in both site languages.
export default defineType({
  name: "localeString",
  title: "Text (EN/ID)",
  type: "object",
  fields: [
    {
      name: "en",
      title: "English",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "id",
      title: "Indonesian",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: "en" },
  },
})
