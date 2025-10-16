// sanity/schemas/blocks/split/split-card.ts
import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";

export default defineType({
  name: "split-card",
  type: "object",
  icon: TextQuote,
  title: "Split Card",
  description:
    "Column with tag line, title and content body. Part of a split cards.",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "imageSize",
      title: "Image Size",
      type: "string",
      initialValue: "md",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => !parent?.image?.asset,
    }),
    defineField({
      name: "imageShape",
      title: "Image Shape",
      type: "string",
      initialValue: "rounded",
      options: {
        list: [
          { title: "Rounded", value: "rounded" },
          { title: "Square", value: "square" },
          { title: "Round", value: "circle" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => !parent?.image?.asset,
    }),
    defineField({
      name: "sizeBasis",
      title: "Card Height Based On",
      type: "string",
      initialValue: "text",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Image", value: "image" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
