// sanity/schemas/blocks/shop-browser.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { ShoppingBag } from "lucide-react";

import { fadeInField } from "./shared/fade-in";

const SORT_OPTIONS = [
  { title: "Featured", value: "featured" },
  { title: "Price: Low to High", value: "price-asc" },
  { title: "Price: High to Low", value: "price-desc" },
  { title: "Alphabetical", value: "title-asc" },
] as const;

export default defineType({
  name: "shop-browser",
  title: "Shop Browser",
  type: "object",
  icon: ShoppingBag,
  groups: [
    { name: "content", title: "Content" },
    { name: "filters", title: "Filters" },
    { name: "display", title: "Display" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "content",
      description: "Optional banner content that introduces the shop before the product list.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Show hero banner",
          type: "boolean",
          description: "Toggle on to add an intro block above the product list.",
          initialValue: false,
        }),
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Short label above the heading. Leave blank to hide.",
          hidden: ({ parent }) => parent?.enabled !== true,
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          description: "Main hero title shown when the banner is enabled.",
          hidden: ({ parent }) => parent?.enabled !== true,
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const heroParent = (context?.parent ?? {}) as { enabled?: boolean };

              if (heroParent.enabled) {
                return value ? true : "Add a hero heading or switch the banner off.";
              }

              return true;
            }),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          rows: 3,
          description: "Supporting copy beneath the heading.",
          hidden: ({ parent }) => parent?.enabled !== true,
        }),
      ],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "object",
      description: "Controls the summary card shown above the product results.",
      group: "content",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "summaryTemplate",
          title: "Summary template",
          type: "string",
          description: "Use {{showing}} and {{total}} placeholders to display product counts.",
        }),
      ],
    }),
    defineField({
      name: "toolbar",
      title: "Toolbar",
      type: "object",
      description: "Controls the sort and view switches shoppers see above the grid.",
      group: "display",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "sortLabel",
          title: "Sort label",
          type: "string",
        }),
        defineField({
          name: "sortOptions",
          title: "Sort options",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "sortOption",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  options: {
                    list: [...SORT_OPTIONS],
                  },
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
          validation: (Rule) => Rule.max(SORT_OPTIONS.length).warning("Unexpected sort option detected."),
        }),
        defineField({
          name: "views",
          title: "View labels",
          type: "object",
          fields: [
            defineField({ name: "gridLabel", title: "Grid label", type: "string" }),
            defineField({ name: "listLabel", title: "List label", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "grid",
      title: "Grid options",
      type: "object",
      description: "Adjust the layout of the product cards.",
      group: "display",
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
        }),
        defineField({
          name: "showComparePrice",
          title: "Show compare at price",
          type: "boolean",
        }),
        defineField({
          name: "showQuickView",
          title: "Show quick view button",
          type: "boolean",
        }),
        defineField({
          name: "cardLayout",
          title: "Product card layout",
          type: "string",
          options: {
            list: [
              { title: "Card (text inside)", value: "card" },
              { title: "Stacked (text below image)", value: "stacked" },
            ],
            layout: "radio",
          },
        }),
      ],
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "object",
      description: "Customize the message shown when no products match the current filters.",
      group: "display",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "selection",
      title: "Product selection",
      type: "object",
      description: "Choose which products feed the browser: every product, a curated list, or a single collection.",
      group: "filters",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "mode",
          title: "Mode",
          type: "string",
          initialValue: "all",
          options: {
            list: [
              { title: "All products", value: "all" },
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
          description: "Pick individual products to feature when Manual mode is selected.",
          hidden: ({ parent }) => parent?.mode !== "manual",
        }),
        defineField({
          name: "collection",
          title: "Product category",
          type: "reference",
          to: [{ type: "collection" }],
          description: "Select the single product category to feature when Collection mode is selected.",
          hidden: ({ parent }) => parent?.mode !== "collection",
        }),
      ],
    }),
    defineField({
      name: "categoryFilters",
      title: "Filter categories",
      type: "array",
      description: "Pick product categories to expose as filter pills. Leave empty to include every category with products.",
      group: "filters",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    }),
    defineField({ name: "padding", type: "section-padding", group: "display" }),
    defineField({ name: "colorVariant", type: "color-variant", group: "display" }),
    fadeInField({ group: "display" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Shop Browser",
      };
    },
  },
  initialValue: {
    hero: {
      enabled: false,
    },
    overview: {
      label: "Shop overview",
      summaryTemplate: "Showing {{showing}} of {{total}} products",
    },
    toolbar: {
      sortLabel: "Sort by",
      sortOptions: SORT_OPTIONS.map((option) => ({
        _type: 'sortOption',
        label: option.title,
        value: option.value,
      })),
      views: {
        gridLabel: "Grid",
        listLabel: "List",
      },
    },
    emptyState: {
      heading: "No products yet",
      body: "Add products in Sanity to populate your shop. Once products are published, they will appear here automatically.",
    },
    selection: {
      mode: "all",
    },
    grid: {
      columns: 3,
      showComparePrice: true,
      showQuickView: false,
      cardLayout: "card",
    },
  },
});
