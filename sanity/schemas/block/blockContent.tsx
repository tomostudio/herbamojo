import { defineArrayMember, defineType } from "sanity"

import { createAltTextField } from "../shared/fields"
import { linkAnnotation } from "./annotations"

// The same tools the old CMS's Main Content field offered: bold, italic,
// links, two heading levels, quotes, both kinds of list, and images.
export default defineType({
  name: "blockContent",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Image",
      description:
        "Min. Width 1300px | PNG / JPEG / WEBP. Shown up to 650px wide in the middle of the article; clicking it opens the full image.",
      fields: [createAltTextField()],
    }),
  ],
})
