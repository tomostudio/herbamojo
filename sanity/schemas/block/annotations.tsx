import { defineField } from "sanity"

// The link mark for rich text.
export const linkAnnotation = defineField({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    {
      name: "href",
      title: "URL",
      description:
        "Full link (https://…) or a page on this site (e.g. /journal).",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
    },
    {
      name: "blank",
      title: "Open in new tab",
      type: "boolean",
      initialValue: true,
    },
  ],
})
