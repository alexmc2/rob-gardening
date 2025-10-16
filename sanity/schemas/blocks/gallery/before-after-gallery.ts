// sanity/schemas/blocks/gallery/before-after-gallery.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { SquareSplitVertical } from "lucide-react";
import { fadeInField } from "../shared/fade-in";

export default defineType({
  name: "before-after-gallery",
  title: "Before & After Gallery",
  type: "object",
  icon: SquareSplitVertical,
  description:
    "Showcase transformation stories with a draggable before and after slider.",
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
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Optional heading shown above the gallery.",
      validation: (rule) =>
        rule
          .max(120)
          .warning("Keep headings under 120 characters so they stay scannable."),
    }),
    defineField({
      name: "intro",
      type: "text",
      title: "Intro",
      rows: 3,
      description: "Optional short description displayed above the gallery.",
      validation: (rule) =>
        rule
          .max(280)
          .warning("Aim for short introductions no longer than a tweet."),
    }),
    defineField({
      name: "sliderSize",
      type: "string",
      title: "Slider Size",
      description:
        "Control the maximum height of the comparison slider on larger screens.",
      initialValue: "comfortable",
      options: {
        layout: "radio",
        list: [
          { title: "Compact", value: "compact" },
          { title: "Comfortable", value: "comfortable" },
          { title: "Spacious", value: "spacious" },
          { title: "Full Height", value: "full" },
        ],
      },
    }),
    defineField({
      name: "items",
      title: "Comparisons",
      type: "array",
      of: [
        defineArrayMember({
          name: "comparison",
          title: "Comparison",
          type: "object",
          preview: {
            select: {
              title: "title",
              beforeLabel: "beforeLabel",
              afterLabel: "afterLabel",
            },
            prepare({ title, beforeLabel, afterLabel }) {
              const heading = title || "Before & After";
              const before = beforeLabel || "Before";
              const after = afterLabel || "After";

              return {
                title: heading,
                subtitle: `${before} → ${after}`,
              };
            },
          },
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              description: "Optional title displayed above the slider.",
              validation: (rule) =>
                rule.max(120).warning("Keep titles under 120 characters."),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
              description:
                "Optional short description that provides context for the transformation.",
              validation: (rule) =>
                rule
                  .max(320)
                  .warning("Aim for concise descriptions under 320 characters."),
            }),
            defineField({
              name: "beforeLabel",
              type: "string",
              title: "Before Label",
              description:
                "Caption shown on the left side of the slider to describe the before state.",
              initialValue: "Before",
              validation: (rule) =>
                rule
                  .max(30)
                  .warning("Keep labels short so they remain legible on the slider."),
            }),
            defineField({
              name: "afterLabel",
              type: "string",
              title: "After Label",
              description:
                "Caption shown on the right side of the slider to describe the after state.",
              initialValue: "After",
              validation: (rule) =>
                rule
                  .max(30)
                  .warning("Keep labels short so they remain legible on the slider."),
            }),
            defineField({
              name: "beforeImage",
              title: "Before Image",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  description: "Describe the scene shown in the before image.",
                  validation: (rule) =>
                    rule
                      .required()
                      .error("Alternative text is required for accessibility."),
                }),
              ],
              validation: (rule) =>
                rule.required().error("Add a before image to complete the comparison."),
            }),
            defineField({
              name: "afterImage",
              title: "After Image",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  description: "Describe the scene shown in the after image.",
                  validation: (rule) =>
                    rule
                      .required()
                      .error("Alternative text is required for accessibility."),
                }),
              ],
              validation: (rule) =>
                rule.required().error("Add an after image to complete the comparison."),
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .error("Add at least one comparison before publishing this gallery."),
    }),
    fadeInField(),
  ],
  preview: {
    select: {
      heading: "heading",
      count: "items",
    },
    prepare({ heading, count }) {
      const comparisons = count?.length ?? 0;
      return {
        title: heading || "Before & After Gallery",
        subtitle:
          comparisons > 0
            ? `${comparisons} comparison${comparisons === 1 ? "" : "s"}`
            : "No comparisons added",
      };
    },
  },
});
