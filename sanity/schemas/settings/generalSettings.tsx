import { defineType } from "sanity"

import { createDefaultSeoField } from "../shared/fields"

/** A label shown on both the English and Indonesian site. */
const label = (name: string, title: string, description?: string) => ({
  name,
  title,
  ...(description ? { description } : {}),
  type: "localeString",
})

export default defineType({
  name: "generalSettings",
  title: "General",
  type: "document",
  initialValue: () => ({
    webTitle: "HERBAMOJO",
  }),
  groups: [
    { name: "general", title: "General" },
    { name: "seo", title: "Default Metadata (for Search Engine)" },
    { name: "navigation", title: "Navigation" },
    { name: "journal", title: "Journal" },
    { name: "authentication", title: "Authentication Page" },
    { name: "analytics", title: "Analytics" },
  ],
  fields: [
    {
      name: "webTitle",
      title: "Website Title",
      description:
        "Main website title displayed in browser tabs and search results; pages add their own name in front of it.",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required(),
    },
    label(
      "errorText",
      "404 Error Text",
      "Message under the large “404” on the page-not-found screen.",
    ),
    createDefaultSeoField({ group: "seo" }),
    {
      name: "navigation",
      title: "Navigation Labels",
      description: "Link labels in the footer, shared by every page.",
      type: "object",
      group: "navigation",
      fields: [
        label("home", "Home"),
        label(
          "authentication",
          "Authentication",
          "Also used as the page heading, in capitals.",
        ),
        label("journal", "Journal", "Also used as the Journal page heading."),
      ],
    },
    {
      name: "journalDisable",
      title: "Disable Journal",
      description:
        "Hide the journal: removes its section from the Home page and its link from the navigation.",
      type: "boolean",
      group: "journal",
      initialValue: false,
    },
    {
      name: "journalSlug",
      title: "Journal Slug",
      description:
        "Path the journal lives under (e.g. journal for /journal). The Indonesian journal is the same path under /id.",
      type: "string",
      group: "journal",
      initialValue: "journal",
    },
    {
      name: "journalPerList",
      title: "Journals per Page",
      description: "How many journals each page of the journal list shows.",
      type: "number",
      group: "journal",
      initialValue: 6,
    },
    {
      name: "journalTranslation",
      title: "Journal Labels",
      description: "Labels on the journal pages.",
      type: "object",
      group: "journal",
      fields: [
        label(
          "backText",
          "Back to Journal",
          "Header link from a journal back to the list.",
        ),
        label(
          "previousJournal",
          "Previous Journal",
          "Link left of the title on the cover (desktop).",
        ),
        label(
          "nextJournal",
          "Next Journal",
          "Link right of the title on the cover (desktop).",
        ),
        label(
          "previousJournalMobile",
          "Previous Journal (Mobile)",
          "Button under the article on mobile.",
        ),
        label(
          "nextJournalMobile",
          "Next Journal (Mobile)",
          "Button under the article on mobile.",
        ),
        label(
          "relatedJournal",
          "Related Journals",
          "Heading over the related journals.",
        ),
      ],
    },
    {
      name: "authenticationSections",
      title: "Authentication Sections",
      description:
        "The steps of the Authentication page, in order. Each step shows its title in the heading and its items as callouts around the bottle.",
      type: "array",
      group: "authentication",
      of: [
        {
          type: "object",
          name: "authSection",
          fields: [
            label(
              "title",
              "Title",
              "Shown in green before “Authentication” in the heading.",
            ),
            {
              name: "items",
              title: "Items",
              description:
                "Callouts pointing at the bottle on desktop; listed under the bottle on mobile.",
              type: "array",
              of: [{ type: "localeString" }],
            },
          ],
          preview: {
            select: { title: "title.en" },
          },
        },
      ],
    },
    {
      name: "analytics",
      title: "Analytics",
      description:
        "Tracking IDs. Leave a field empty to switch that tracker off.",
      type: "object",
      group: "analytics",
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: "gtmId",
          title: "Google Tag Manager ID",
          description: "e.g. GTM-XXXXXXX",
          type: "string",
        },
        {
          name: "gtagId",
          title: "Google Analytics (gtag) ID",
          description: "e.g. G-XXXXXXXXXX or UA-XXXXXXXX-X",
          type: "string",
        },
        {
          name: "facebookPixelId",
          title: "Facebook Pixel ID",
          type: "string",
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "General",
      }
    },
  },
})
