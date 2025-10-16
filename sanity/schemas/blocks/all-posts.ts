// sanity/schemas/blocks/all-posts.ts
import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";
import { fadeInField } from "./shared/fade-in";

export default defineType({
  name: "all-posts",
  type: "object",
  title: "All Posts",
  description: "A list of all posts",
  icon: Newspaper,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    fadeInField(),
  ],
  preview: {
    prepare() {
      return {
        title: "All Posts",
      };
    },
  },
});
