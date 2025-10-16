// sanity/schemas/objects/cloudinary-gallery-image.ts
import { defineField, defineType } from "sanity";
import { Image } from "lucide-react";

export default defineType({
  name: "cloudinary-gallery-image",
  title: "Cloudinary Gallery Image",
  type: "object",
  icon: Image,
  description:
    "Reference an existing Cloudinary asset by its public ID and optionally override metadata such as alt text or captions.",
  fields: [
    defineField({
      name: "cloudinaryPublicId",
      title: "Cloudinary Public ID",
      type: "string",
      description:
        "Paste the Cloudinary public ID, for example coop-images/example-image.",
      validation: (rule) =>
        rule
          .required()
          .error("Cloudinary public ID is required to fetch the image."),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description:
        "Optional override for the alternative text. Leave blank to fall back to the Cloudinary public ID.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Keep alternative text concise and descriptive."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption displayed alongside the image.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Keep captions under 160 characters."),
    }),
    defineField({
      name: "overrideUrl",
      title: "Override URL",
      type: "url",
      description:
        "Optional URL to use instead of the value returned from the API route.",
    }),
    defineField({
      name: "widthOverride",
      title: "Width Override",
      type: "number",
      description: "Optional width to use instead of the Cloudinary metadata.",
      validation: (rule) => rule.positive().warning("Width should be a positive number."),
    }),
    defineField({
      name: "heightOverride",
      title: "Height Override",
      type: "number",
      description: "Optional height to use instead of the Cloudinary metadata.",
      validation: (rule) => rule.positive().warning("Height should be a positive number."),
    }),
    defineField({
      name: "createdAtOverride",
      title: "Created At Override",
      type: "datetime",
      description:
        "Optional timestamp used for ordering if the Cloudinary value is unavailable.",
    }),
  ],
  preview: {
    select: {
      title: "cloudinaryPublicId",
      subtitle: "caption",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Cloudinary Image",
        subtitle: subtitle || "No caption",
      };
    },
  },
});
