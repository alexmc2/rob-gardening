// sanity/schemas/objects/product-variant.ts
import { defineField, defineType } from "sanity";
import { Layers3 } from "lucide-react";

export default defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  icon: Layers3,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceOverride",
      title: "Price Override (pence)",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "options",
      title: "Options",
      description: "Key details such as size or color for this variant.",
      type: "array",
      of: [
        defineField({
          name: "option",
          type: "object",
          title: "Option",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              name: "name",
              value: "value",
            },
            prepare: ({ name, value }) => ({
              title: name,
              subtitle: value,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sku",
    },
  },
});
