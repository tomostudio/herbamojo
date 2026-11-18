import { defineType, type PreviewValue } from "sanity"

import { createImageField, createSeoField, SEO_GROUP } from "../shared/fields"

/** A logo in one of the shop sliders. */
const shopItem = {
  type: "object",
  name: "shopItem",
  fields: [
    createImageField({
      name: "image",
      title: "Logo",
      description:
        "PNG / WEBP with a transparent background. Shown up to 125px tall, so keep the logo itself tightly cropped.",
      required: true,
      hotspot: false,
    }),
    {
      name: "link",
      title: "Link",
      description:
        "Where the logo leads, opened in a new tab (e.g. https://www.tokopedia.com/herbamojo). Leave empty for a logo that does not link.",
      type: "url",
    },
    {
      name: "background",
      title: "Background Color",
      description:
        "Colour behind the logo, as a CSS colour (e.g. #FFFFFF). Leave as transparent for logos that already sit well on black.",
      type: "string",
      initialValue: "transparent",
    },
  ],
  preview: {
    select: { media: "image", subtitle: "link" },
    prepare: ({
      media,
      subtitle,
    }: {
      media?: PreviewValue["media"]
      subtitle?: string
    }) => ({
      title: "Shop item",
      media,
      subtitle,
    }),
  },
}

/**
 * Layout switch carried over from the old CMS. "Disable Slider" only takes
 * effect when both the online and offline sections are set to it — that is the
 * original's rule, not an oversight here.
 */
const sliderOption = (name: string, withMobileOption: boolean) => ({
  name,
  title: "Slider Option",
  description: withMobileOption
    ? "Normal, enable slider normally. Desktop Only, will remove slider on mobile. Disable slider will disable slider and display the shop in a normal layout form (Disable Slider will only be triggered if online and offline is disabled)."
    : "Normal, enable slider normally. Disable slider will disable slider and display the shop in a normal layout form.",
  type: "string",
  initialValue: "NORMAL",
  options: {
    list: [
      { title: "Normal", value: "NORMAL" },
      ...(withMobileOption
        ? [{ title: "Desktop Only", value: "NOMOBILE" }]
        : []),
      { title: "Disable Slider", value: "NOSLIDER" },
    ],
    layout: "radio",
  },
})

/** The heading of a section, which also labels it in the navigation. */
const sectionTitle = (description: string) => ({
  name: "title",
  title: "Title",
  description,
  type: "localeString",
})

/** Two lines of a benefit, stacked on top of each other. */
const benefit = (name: string, title: string) => ({
  name,
  title,
  description: "Shown as two stacked lines in the Benefits section.",
  type: "object",
  fields: [
    { name: "line1", title: "Line 1", type: "localeString" },
    { name: "line2", title: "Line 2", type: "localeString" },
  ],
})

export default defineType({
  name: "home",
  title: "Home",
  type: "document",
  groups: [
    SEO_GROUP,
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "benefits", title: "Benefits" },
    { name: "ingredients", title: "Ingredients" },
    { name: "shop", title: "Shop" },
    { name: "journal", title: "Journal" },
    { name: "popup", title: "Popup" },
  ],
  fields: [
    createSeoField({ group: "seo" }),
    {
      name: "hero",
      title: "Hero",
      description:
        "First section of the Home page: the “Know Your Strength” headline over the product photo.",
      type: "object",
      group: "hero",
      fields: [
        sectionTitle(
          "Label of the first item in the section navigation and the mobile menu. Not shown on the section itself.",
        ),
        createImageField({
          name: "background",
          title: "Image Desktop",
          description:
            "Min. Width 1600px | Portrait (around 5:6) | PNG / JPEG / WEBP. Fills the left half of the screen and is cropped from its right edge.",
          required: true,
        }),
        createImageField({
          name: "backgroundMobile",
          title: "Image Mobile",
          description:
            "Width 1500px | Aspect Ratio 1:1 | PNG / JPEG / WEBP. Shown behind the headline on mobile, fitted inside the screen.",
          required: true,
        }),
        {
          name: "know",
          title: "Headline Line 1",
          description: "First word of the headline (“Know”).",
          type: "localeString",
        },
        {
          name: "your",
          title: "Headline Line 2",
          description: "Second word of the headline (“Your”).",
          type: "localeString",
        },
        {
          name: "strength",
          title: "Headline Line 3",
          description:
            "Third word of the headline (“Strength”), shown in green on mobile.",
          type: "localeString",
        },
        {
          name: "getYours",
          title: "CTA Button",
          description:
            "Label of the button under the headline that scrolls to the Shop section.",
          type: "localeString",
        },
        {
          name: "shopFloat",
          title: "Floating Shop Button",
          description:
            "Label of the button under the floating bottle, shown once the Hero has been scrolled past (desktop only).",
          type: "localeString",
        },
      ],
    },
    {
      name: "about",
      title: "About",
      description:
        "Introduces Herbamojo: logo, description, registration numbers and certifications.",
      type: "object",
      group: "about",
      fields: [
        sectionTitle(
          "Heading of the section, also its label in the section navigation and the mobile menu.",
        ),
        createImageField({
          name: "background",
          title: "Image",
          description:
            "Min. Width 1300px | Aspect Ratio 2:3 | PNG / JPEG / WEBP. Shown on the right of the section on desktop; hidden on mobile.",
          required: true,
        }),
        {
          name: "description",
          title: "Description",
          description: "Paragraph under the Herbamojo logo.",
          type: "localeText",
        },
        {
          name: "pomInfoLine1",
          title: "Registration Info Line 1",
          description:
            "First line of the small print under the description (e.g. POM numbers).",
          type: "localeString",
        },
        {
          name: "pomInfoLine2",
          title: "Registration Info Line 2",
          description: "Second line of the small print under the description.",
          type: "localeString",
        },
        {
          name: "certNatural",
          title: "Certification: Natural",
          description: "Caption under the Natural icon.",
          type: "localeString",
        },
        {
          name: "certHalal",
          title: "Certification: Halal",
          description: "Caption under the Halal icon.",
          type: "localeString",
        },
        {
          name: "certQuality",
          title: "Certification: High Quality Extracts",
          description: "Caption under the High Quality Extracts icon.",
          type: "localeString",
        },
        {
          name: "certQuadra",
          title: "Certification: Quadra Extraction System",
          description: "Caption under the Quadra Extraction System icon.",
          type: "localeString",
        },
      ],
    },
    {
      name: "benefits",
      title: "Benefits",
      description:
        "The benefit lines shown beside the floating bottle. The site currently shows Stamina.",
      type: "object",
      group: "benefits",
      fields: [
        sectionTitle(
          "Heading of the section, shown in capitals, also its label in the section navigation and the mobile menu.",
        ),
        benefit("stamina", "Stamina"),
        benefit("energy", "Energy"),
        benefit("immune", "Immune"),
        benefit("exercise", "Exercise"),
      ],
    },
    {
      name: "ingredients",
      title: "Ingredients",
      description: "The ingredient selector.",
      type: "object",
      group: "ingredients",
      fields: [
        sectionTitle(
          "Heading of the section, also its label in the section navigation and the mobile menu.",
        ),
        {
          name: "items",
          title: "Ingredients",
          description:
            "Each ingredient is numbered in the order listed here, and its image fills the background while it is selected.",
          type: "array",
          of: [
            {
              type: "object",
              name: "ingredient",
              fields: [
                {
                  name: "title",
                  title: "Name",
                  description: "Ingredient name, shown in the list.",
                  type: "localeString",
                },
                {
                  name: "description",
                  title: "Description",
                  description:
                    "What the ingredient does, shown beside the number on desktop and under the name on mobile.",
                  type: "localeText",
                },
                createImageField({
                  name: "image",
                  title: "Image",
                  description:
                    "Width 1600px | Landscape | PNG / JPEG / WEBP. Placed on the right of the section and dimmed behind the text.",
                  required: true,
                }),
              ],
              preview: {
                select: { title: "title.en", media: "image" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "shop",
      title: "Shop",
      description:
        "Where to buy Herbamojo: online marketplaces, offline stores and stockists.",
      type: "object",
      group: "shop",
      fields: [
        sectionTitle(
          "Heading of the section, also its label in the section navigation and the mobile menu.",
        ),
        {
          name: "onlineTitle",
          title: "Online Shop Title",
          description: "Heading over the Online Shop slider.",
          type: "localeString",
        },
        sliderOption("onlineShopSliderOption", true),
        {
          name: "onlineShop",
          title: "Online Shop",
          description:
            "Marketplace logos in the Online Shop slider, in the order listed here.",
          type: "array",
          of: [shopItem],
        },
        {
          name: "offlineTitle",
          title: "Offline Shop Title",
          description: "Heading over the Offline Shop slider.",
          type: "localeString",
        },
        sliderOption("offlineShopSliderOption", true),
        {
          name: "offlineShop",
          title: "Offline Shop",
          description:
            "Store logos in the Offline Shop slider, in the order listed here.",
          type: "array",
          of: [shopItem],
        },
        {
          name: "stockistTitle",
          title: "Stockist Title",
          description: "Heading over the Stockist list.",
          type: "localeString",
        },
        sliderOption("stockistSliderOption", false),
        {
          name: "stockist",
          title: "Stockist List",
          description:
            "Stockist names, shown five to a slide in the order listed here.",
          type: "array",
          of: [
            {
              type: "object",
              name: "stockistItem",
              fields: [
                {
                  name: "content",
                  title: "Name",
                  description: "Stockist name and location, shown in capitals.",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "link",
                  title: "Link",
                  description:
                    "Optional link for the name (e.g. a map or store page).",
                  type: "url",
                },
              ],
              preview: {
                select: { title: "content", subtitle: "link" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "journal",
      title: "Journal",
      description: "The latest four journals, at the end of the Home page.",
      type: "object",
      group: "journal",
      fields: [
        sectionTitle(
          "Heading of the section, also its label in the section navigation and the mobile menu.",
        ),
        {
          name: "viewAll",
          title: "View All Label",
          description:
            "Link under the journal cards to the Journal page, shown once there are four or more.",
          type: "localeString",
        },
      ],
    },
    {
      name: "popup",
      title: "Popup",
      description:
        "Promotional popup shown over the Home page once it has loaded.",
      type: "object",
      group: "popup",
      fields: [
        {
          name: "enable",
          title: "Enable",
          description: "Show the popup.",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "always",
          title: "Show on Every Visit",
          description:
            "By default the popup shows only on a visitor’s first visit. Turn this on to show it every time.",
          type: "boolean",
          initialValue: false,
        },
        createImageField({
          name: "image",
          title: "Image",
          description:
            "Width 1200px | Aspect Ratio 2:1 | PNG / JPEG / WEBP. Fills the popup behind the text.",
        }),
        {
          name: "content",
          title: "Heading",
          description: "Text in the middle of the popup.",
          type: "localeString",
        },
        {
          name: "buttonText",
          title: "Button Label",
          type: "localeString",
        },
        {
          name: "link",
          title: "Button Link",
          description:
            "Where the button leads, per language. A full URL (https://…) or a page on this site (e.g. /journal).",
          type: "localeString",
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Home",
      }
    },
  },
})
