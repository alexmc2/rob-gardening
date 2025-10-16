// sanity/schemas/documents/product.ts
import { defineField, defineType } from "sanity";
import { Package } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
  groups: [
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
    { name: "commerce", title: "Commerce" },
    { name: "inventory", title: "Inventory" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "commerce",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "media",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              validation: (Rule) => Rule.required().warning("Add descriptive alt text"),
            },
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Price (pence)",
      type: "number",
      group: "commerce",
      description: "Current selling price in pennies (e.g. £15.00 → 1500).",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (pence)",
      type: "number",
      group: "commerce",
      description:
        "Optional original price shown as a strike-through when the product is on sale.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      group: "commerce",
      of: [{ type: "productVariant" }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      group: "inventory",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "meta_title",
      title: "Meta Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "meta_description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),
    orderRankField({ type: "product" }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      subtitle: "slug.current",
    },
  },
});
