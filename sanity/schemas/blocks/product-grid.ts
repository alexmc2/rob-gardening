// sanity/schemas/blocks/product-grid.ts
import { defineField, defineType } from "sanity";
import { ShoppingBag } from "lucide-react";

import { fadeInField } from "./shared/fade-in";

export default defineType({
  name: "product-grid",
  title: "Product Grid",
  type: "object",
  icon: ShoppingBag,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "selection",
      title: "Product Selection",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "mode",
          title: "Mode",
          type: "string",
          initialValue: "manual",
          options: {
            list: [
              { title: "Manual", value: "manual" },
              { title: "Collection", value: "collection" },
            ],
            layout: "radio",
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "products",
          title: "Products",
          type: "array",
          of: [{ type: "reference", to: [{ type: "product" }] }],
          hidden: ({ parent }) => parent?.mode !== "manual",
        }),
        defineField({
          name: "collection",
          title: "Collection",
          type: "reference",
          to: [{ type: "collection" }],
          hidden: ({ parent }) => parent?.mode !== "collection",
        }),
      ],
    }),
    defineField({
      name: "displayOptions",
      title: "Display Options",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "columns",
          title: "Columns",
          type: "number",
          options: {
            list: [
              { title: "Two", value: 2 },
              { title: "Three", value: 3 },
              { title: "Four", value: 4 },
            ],
            layout: "radio",
          },
          initialValue: 3,
        }),
        defineField({
          name: "showComparePrice",
          title: "Show Compare at Price",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "showQuickView",
          title: "Show Quick View Button",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "cardLayout",
          title: "Product Card Layout",
          type: "string",
          options: {
            list: [
              { title: "Card (text inside)", value: "card" },
              { title: "Stacked (text below image)", value: "stacked" },
            ],
            layout: "radio",
          },
          initialValue: "card",
        }),
      ],
    }),
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
    }),
    fadeInField(),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "selection.mode",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Product Grid",
        subtitle: subtitle ? `Selection: ${subtitle}` : undefined,
      };
    },
  },
});
