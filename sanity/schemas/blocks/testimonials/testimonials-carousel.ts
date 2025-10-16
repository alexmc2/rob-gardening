// sanity/schemas/blocks/testimonials/testimonials-carousel.ts
import { defineField, defineType } from "sanity";
import { Star } from "lucide-react";
import { fadeInField } from "../shared/fade-in";

export default defineType({
  name: "testimonials-carousel",
  title: "Testimonials Carousel",
  type: "object",
  icon: Star,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
      description: "Control vertical spacing above and below the section.",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Background",
      description: "Choose a background colour from the design system.",
    }),
    defineField({
      name: "sectionId",
      type: "string",
      title: "Section Anchor ID",
      description:
        "Optional anchor so navigation links can scroll to this section (e.g. testimonials).",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) {
            return true;
          }

          return /^[a-z0-9-]+$/.test(value)
            ? true
            : "Use lowercase letters, numbers, and hyphens only.";
        }),
    }),
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description: "Optional short label displayed above the main heading.",
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Primary heading shown to visitors (e.g. Our Testimonials).",
      validation: (rule) =>
        rule.required().error("Add a heading so the section has context."),
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro Copy",
      rows: 3,
      description: "Optional supporting copy shown beneath the heading.",
    }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      description: "Choose which testimonials to feature in the carousel.",
      of: [
        defineField({
          name: "testimonial",
          type: "reference",
          to: [{ type: "testimonial" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .required()
          .error("Select at least one testimonial to display."),
    }),
    defineField({
      name: "cta",
      type: "link",
      title: "Call to Action",
      description: "Optional link to a page with more testimonials.",
    }),
    fadeInField(),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "eyebrow",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Testimonials Carousel",
        subtitle: subtitle,
      };
    },
  },
});
