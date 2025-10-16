// sanity/schemas/blocks/gallery/cloudinary-gallery.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { Images } from "lucide-react";
import { fadeInField } from "../shared/fade-in";

export default defineType({
  name: "cloudinary-gallery",
  title: "Cloudinary Gallery",
  type: "object",
  icon: Images,
  description: "Display a carousel of Cloudinary images managed in Sanity.",
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Optional heading shown above the gallery.",
      validation: (rule) =>
        rule
          .max(120)
          .warning("Keep headings under 120 characters."),
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro",
      rows: 3,
      description: "Optional introduction displayed above the carousel.",
      validation: (rule) =>
        rule
          .max(280)
          .warning("Intros should be short and scannable."),
    }),
    defineField({
      name: "folderPrefix",
      type: "string",
      title: "Cloudinary Folder",
      description:
        "Optional folder prefix (for example coop-images/events). When set, the gallery automatically includes every image inside that folder.",
    }),
    defineField({
      name: "dateOrder",
      type: "string",
      title: "Image Order",
      description: "Sort images by creation date before rendering the carousel.",
      options: {
        list: [
          { title: "Newest first", value: "desc" },
          { title: "Oldest first", value: "asc" },
        ],
        layout: "radio",
      },
      initialValue: "desc",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "cloudinary-gallery-image",
        }),
      ],
      description:
        "Optional list of image overrides. Leave empty when using a folder to auto-load images, or add entries to override captions and alt text.",
      validation: (rule) =>
        rule.custom((images, context) => {
          const folderPrefix = (
            context?.parent as { folderPrefix?: string } | undefined
          )?.folderPrefix;
          const imageCount = Array.isArray(images) ? images.length : 0;

          if (!folderPrefix && imageCount === 0) {
            return "Add at least one image or specify a Cloudinary folder.";
          }

          return true;
        }),
    }),
    fadeInField(),
  ],
  preview: {
    select: {
      heading: "heading",
      images: "images",
    },
    prepare({ heading, images }) {
      const count = images?.length ?? 0;
      return {
        title: heading || "Cloudinary Gallery",
        subtitle:
          count > 0 ? `${count} image${count === 1 ? "" : "s"}` : "No images selected",
      };
    },
  },
});
