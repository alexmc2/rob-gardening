// sanity/schemas/blocks/split/split-image.ts
import { defineField, defineType } from "sanity";
import { Image } from "lucide-react";

export default defineType({
  name: "split-image",
  type: "object",
  icon: Image,
  description: "Column with an image and optional theme variants.",
  fields: [
    defineField({
      name: "image",
      title: "Default Image",
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
      name: "imageLight",
      title: "Light Mode Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
      description: "Overrides the default image when the section has a light background.",
    }),
    defineField({
      name: "imageDark",
      title: "Dark Mode Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
      description: "Overrides the default image when the section has a dark background.",
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
          { title: "Extra Large", value: "xl" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "imageShape",
      title: "Image Shape",
      type: "string",
      initialValue: "rounded",
      options: {
        list: [
          { title: "Rounded Corners", value: "rounded" },
          { title: "Squared", value: "square" },
          { title: "Circle", value: "circle" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      initialValue: "auto",
      options: {
        list: [
          { title: "Auto", value: "auto" },
          { title: "Square", value: "square" },
          { title: "Portrait", value: "portrait" },
          { title: "Landscape", value: "landscape" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "image.alt",
    },
    prepare({ title }) {
      return {
        title: title || "Split Image",
      };
    },
  },
});
