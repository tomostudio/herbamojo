import { defineType } from "sanity"

export default defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    {
      name: "instagramLink",
      title: "Instagram Link",
      description:
        "Full link to the Instagram profile (e.g. https://www.instagram.com/herbamojo). Leave empty to hide the icon.",
      type: "url",
    },
    {
      name: "whatsappNumber",
      title: "WhatsApp Number",
      description:
        "Number visitors can message, in international format without the plus (e.g. 6281234567890). Leave empty to hide the icon.",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      description:
        "Address the email icon opens a new message to. Leave empty to hide the icon.",
      type: "string",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Footer",
      }
    },
  },
})
