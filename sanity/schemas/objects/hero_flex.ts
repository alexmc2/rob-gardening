// sanity/schemas/objects/hero_flex.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Settings2,
  Type as TypeIcon,
} from "lucide-react";

import { COLOR_VARIANTS } from "../blocks/shared/color-variant";
import { fadeInField } from "../blocks/shared/fade-in";

const HERO_VARIANTS: { title: string; value: "fullBleed" | "split" | "card" }[] = [
  { title: "Full Bleed", value: "fullBleed" },
  { title: "Split", value: "split" },
  { title: "Card", value: "card" },
];

const HERO_HEIGHTS: { title: string; value: "auto" | "60vh" | "80vh" | "100vh" | "custom" }[] = [
  { title: "Auto (fit to content)", value: "auto" },
  { title: "60% viewport", value: "60vh" },
  { title: "80% viewport", value: "80vh" },
  { title: "Full viewport", value: "100vh" },
  { title: "Custom", value: "custom" },
];

const WIDTH_MODES: { title: string; value: "auto" | "px" | "percent" }[] = [
  { title: "Auto", value: "auto" },
  { title: "Fixed pixels", value: "px" },
  { title: "Percentage", value: "percent" },
];

const FIT_OPTIONS: { title: string; value: "contain" | "cover" }[] = [
  { title: "Contain", value: "contain" },
  { title: "Cover", value: "cover" },
];

const ALIGN_OPTIONS: { title: string; value: "start" | "center" | "end" }[] = [
  { title: "Start", value: "start" },
  { title: "Center", value: "center" },
  { title: "End", value: "end" },
];

const TEXT_ALIGN_OPTIONS: { title: string; value: "left" | "center" | "right" }[] = [
  { title: "Left", value: "left" },
  { title: "Center", value: "center" },
  { title: "Right", value: "right" },
];

const TITLE_FONT_OPTIONS: { title: string; value: "sans" | "serif" | "display" | "mono" }[] = [
  { title: "Sans", value: "sans" },
  { title: "Serif", value: "serif" },
  { title: "Display", value: "display" },
  { title: "Mono", value: "mono" },
];

const TITLE_SIZE_OPTIONS: {
  title: string;
  value:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
}[] = [
  { title: "XS", value: "xs" },
  { title: "SM", value: "sm" },
  { title: "Base", value: "base" },
  { title: "LG", value: "lg" },
  { title: "XL", value: "xl" },
  { title: "2XL", value: "2xl" },
  { title: "3XL", value: "3xl" },
  { title: "4XL", value: "4xl" },
  { title: "5XL", value: "5xl" },
  { title: "6XL", value: "6xl" },
];

const TITLE_WEIGHT_OPTIONS: {
  title: string;
  value: "300" | "400" | "500" | "600" | "700" | "800";
}[] = [
  { title: "Light", value: "300" },
  { title: "Regular", value: "400" },
  { title: "Medium", value: "500" },
  { title: "Semibold", value: "600" },
  { title: "Bold", value: "700" },
  { title: "Extra Bold", value: "800" },
];

const TITLE_SPACING_OPTIONS: {
  title: string;
  value: "tight" | "snug" | "normal" | "relaxed";
}[] = [
  { title: "Tight", value: "tight" },
  { title: "Snug", value: "snug" },
  { title: "Normal", value: "normal" },
  { title: "Relaxed", value: "relaxed" },
];

const SPACING_SCALE: {
  title: string;
  value: "none" | "micro" | "compact" | "cozy" | "roomy" | "spacious";
}[] = [
  { title: "No padding", value: "none" },
  { title: "Micro", value: "micro" },
  { title: "Compact", value: "compact" },
  { title: "Cozy", value: "cozy" },
  { title: "Roomy", value: "roomy" },
  { title: "Spacious", value: "spacious" },
];

const LOTTIE_SIZE_OPTIONS: {
  title: string;
  value: "small" | "medium" | "large" | "full";
}[] = [
  { title: "Small", value: "small" },
  { title: "Medium", value: "medium" },
  { title: "Large", value: "large" },
  { title: "Full width", value: "full" },
];

const LOTTIE_HEIGHT_OPTIONS: {
  title: string;
  value: "small" | "medium" | "large" | "full";
}[] = [
  { title: "Shallow", value: "small" },
  { title: "Medium", value: "medium" },
  { title: "Tall", value: "large" },
  { title: "Full height", value: "full" },
];

const BACKGROUND_MODES: { title: string; value: "none" | "color" | "image" | "gradient" }[] = [
  { title: "None", value: "none" },
  { title: "Color", value: "color" },
  { title: "Image", value: "image" },
  { title: "Gradient", value: "gradient" },
];

const SHAPE_TYPES: { title: string; value: "rectangle" | "rounded" }[] = [
  { title: "Rectangle", value: "rectangle" },
  { title: "Rounded", value: "rounded" },
];

const SHADOW_OPTIONS: {
  title: string;
  value: "none" | "soft" | "medium" | "strong";
}[] = [
  { title: "None", value: "none" },
  { title: "Soft", value: "soft" },
  { title: "Medium", value: "medium" },
  { title: "Strong", value: "strong" },
];

const CTA_STYLE_OPTIONS: { title: string; value: "primary" | "secondary" | "ghost" }[] = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Ghost", value: "ghost" },
];

const BACKGROUND_TOKEN_OPTIONS = COLOR_VARIANTS.map(({ title, value }) => ({
  title,
  value,
}));

export default defineType({
  name: "hero-flex",
  title: "Hero – Flex",
  type: "object",
  icon: LayoutTemplate,
  groups: [
    { name: "content", title: "Content", icon: TypeIcon },
    { name: "media", title: "Media", icon: ImageIcon },
    { name: "layout", title: "Layout", icon: Settings2 },
    { name: "background", title: "Background", icon: Layers },
  ],
  fields: [
    defineField({
      name: "variant",
      title: "Layout Variant",
      type: "string",
      initialValue: "split",
      options: {
        list: HERO_VARIANTS,
        layout: "radio",
      },
      group: "layout",
      description:
        "Choose how the hero section is structured across the full hero area.",
    }),
    defineField({
      name: "minHeight",
      title: "Hero Height",
      type: "string",
      initialValue: "80vh",
      options: {
        list: HERO_HEIGHTS,
        layout: "radio",
      },
      group: "layout",
      description:
        "Set the minimum height for the entire hero section so it fits the viewport as needed.",
    }),
    defineField({
      name: "minHeightCustom",
      title: "Custom Height (vh)",
      type: "number",
      group: "layout",
      description:
        "When Hero Height is Custom, enter the viewport height the whole hero should use.",
      hidden: ({ parent }) => parent?.minHeight !== "custom",
      validation: (rule) => rule.min(10).max(200),
    }),
    defineField({
      name: "contentSpacing",
      title: "Content Gap",
      type: "string",
      initialValue: "cozy",
      options: {
        list: SPACING_SCALE,
        layout: "radio",
      },
      group: "layout",
      description:
        "Control the spacing between text, media, and calls to action inside the hero content stack.",
    }),
    defineField({
      name: "paddingStrategy",
      title: "Section Padding",
      type: "string",
      initialValue: "cozy",
      options: {
        list: SPACING_SCALE,
        layout: "radio",
      },
      group: "layout",
      description:
        "Adjust mobile-first padding for the entire hero so it breathes against page edges.",
    }),
    defineField({
      name: "paddingStrategyDesktop",
      title: "Desktop Padding",
      type: "string",
      options: {
        list: SPACING_SCALE,
        layout: "radio",
      },
      group: "layout",
      description:
        "Override large-screen padding so the hero can feel tighter on mobile while remaining generous on desktop.",
    }),
    defineField({
      name: "textAlign",
      title: "Desktop Text Alignment",
      type: "string",
      initialValue: "left",
      options: {
        list: TEXT_ALIGN_OPTIONS,
        layout: "radio",
      },
      group: "content",
      description:
        "Controls alignment from tablet upwards; mobile can override below.",
    }),
    defineField({
      name: "mobileOverrides",
      title: "Mobile Overrides",
      type: "object",
      group: "content",
      options: {
        collapsible: true,
        collapsed: true,
      },
      description:
        "Tailor copy and alignment on small screens without changing desktop content.",
      fields: [
        defineField({
          name: "textAlign",
          title: "Mobile Text Alignment",
          type: "string",
          options: {
            list: TEXT_ALIGN_OPTIONS,
            layout: "radio",
          },
          description: "Overrides alignment below the large breakpoint.",
        }),
        defineField({
          name: "title",
          title: "Mobile Title",
          type: "string",
          description: "Optional shorter headline for phones; defaults to the main title.",
        }),
        defineField({
          name: "body",
          title: "Mobile Body",
          type: "array",
          of: [
            defineArrayMember({ type: "block" }),
          ],
          description: "Optional portable text shown on phones; falls back to the main body copy.",
        }),
      ],
    }),
    defineField({
      name: "invertText",
      title: "Invert Text Colors",
      type: "boolean",
      initialValue: false,
      group: "content",
      description:
        "Switch typography to light-on-dark for the entire hero content block.",
    }),
    defineField({
      name: "mobileStack",
      title: "Mobile Content Order",
      type: "string",
      initialValue: "mediaFirst",
      options: {
        list: [
          { title: "Show media first", value: "mediaFirst" },
          { title: "Show text first", value: "textFirst" },
        ],
        layout: "radio",
      },
      group: "layout",
      description:
        "Choose whether media or text appears first when the hero stacks on small screens.",
    }),
    defineField({
      name: "mediaPosition",
      title: "Media Position",
      type: "string",
      initialValue: "right",
      options: {
        list: [
          { title: "Media on left", value: "left" },
          { title: "Media on right", value: "right" },
        ],
        layout: "radio",
      },
      group: "layout",
      hidden: ({ parent }) => parent?.variant !== "split",
      description:
        "Decide whether the media column sits on the left or right when using the Split layout.",
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "content",
      description:
        "Optional small heading that sits above the hero title in the content column.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description:
        "Main headline displayed inside the hero content column.",
    }),
    defineField({
      name: "titleStyles",
      title: "Title Typography",
      type: "object",
      group: "content",
      description:
        "Controls the font styling for the hero title inside the content column.",
      fields: [
        defineField({
          name: "font",
          title: "Font Family",
          type: "string",
          options: {
            list: TITLE_FONT_OPTIONS,
            layout: "radio",
          },
          description:
            "Switch the title font family used in the hero content column.",
        }),
        defineField({
          name: "size",
          title: "Font Size",
          type: "string",
          options: {
            list: TITLE_SIZE_OPTIONS,
            layout: "radio",
          },
          description:
            "Set the base font size for the title inside the hero content column.",
        }),
        defineField({
          name: "weight",
          title: "Font Weight",
          type: "string",
          options: {
            list: TITLE_WEIGHT_OPTIONS,
            layout: "radio",
          },
          description:
            "Adjust the title weight inside the hero content column.",
        }),
        defineField({
          name: "tracking",
          title: "Letter Spacing",
          type: "string",
          options: {
            list: [
              { title: "Tighter", value: "tighter" },
              { title: "Tight", value: "tight" },
              { title: "Normal", value: "normal" },
              { title: "Wide", value: "wide" },
            ],
            layout: "radio",
          },
          description:
            "Control the spacing between letters for the title inside the hero content column.",
        }),
      ],
    }),
    defineField({
      name: "titleBodySpacing",
      title: "Title & Body Spacing",
      type: "string",
      initialValue: "normal",
      options: {
        list: TITLE_SPACING_OPTIONS,
        layout: "radio",
      },
      group: "content",
      description:
        "Fine-tune the vertical spacing between the hero title and body copy in the content column.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
      description:
        "Rich text content that sits under the title within the hero content column.",
    }),
    defineField({
      name: "ctas",
      title: "Calls To Action",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "cta",
          title: "Call To Action",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "Button text displayed within the hero content column.",
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "url",
              description:
                "Destination URL opened from this hero call to action.",
              validation: (rule) =>
                rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: CTA_STYLE_OPTIONS,
                layout: "radio",
              },
              description:
                "Select the button styling applied inside the hero content column.",
            }),
            defineField({
              name: "ariaLabel",
              title: "Accessible Label",
              type: "string",
              description:
                "Optional aria-label announced by screen readers for this hero button.",
            }),
          ],
        }),
      ],
      description:
        "Add one or more buttons that appear beneath the hero body copy.",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "object",
      group: "media",
      options: {
        collapsible: true,
        collapsed: false,
      },
      description:
        "Configure the image or animation displayed inside the hero media area.",
      fields: [
        defineField({
          name: "type",
          title: "Media Type",
          type: "string",
          initialValue: "image",
          options: {
            list: [
              { title: "Image", value: "image" },
              { title: "Image Carousel", value: "carousel" },
              { title: "Lottie Animation", value: "lottie" },
            ],
            layout: "radio",
          },
          description:
            "Choose whether the hero media area renders a single image, an image carousel, or a Lottie animation.",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description:
                "Describe the hero image for assistive technologies inside the media area.",
              validation: (rule) =>
                rule.max(160).warning("Keep alt text under 160 characters."),
            }),
          ],
          hidden: ({ parent }) => parent?.type !== "image",
          description:
            "Upload the primary hero image displayed within the media area.",
        }),
        defineField({
          name: "images",
          title: "Carousel Images",
          type: "array",
          of: [
            defineArrayMember({
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative Text",
                  type: "string",
                  description:
                    "Describe the carousel image for assistive technologies.",
                  validation: (rule) =>
                    rule.max(160).warning("Keep alt text under 160 characters."),
                }),
              ],
            }),
          ],
          hidden: ({ parent }) => parent?.type !== "carousel",
          description:
            "Add two or more images to cycle through within the hero media area.",
          validation: (rule) =>
            rule.min(2).warning("Add at least two images for a carousel experience."),
        }),
        defineField({
          name: "lottie",
          title: "Lottie",
          type: "lottie-asset",
          hidden: ({ parent }) => parent?.type !== "lottie",
          description:
            "Reference the animation that plays inside the hero media area.",
        }),
        defineField({
          name: "lottieSize",
          title: "Lottie Width",
          type: "string",
          options: {
            list: LOTTIE_SIZE_OPTIONS,
            layout: "radio",
          },
          hidden: ({ parent }) => parent?.type !== "lottie",
          description:
            "Match the width presets used in the standalone Lottie block so animations scale consistently.",
          initialValue: "full",
        }),
        defineField({
          name: "lottieHeight",
          title: "Lottie Height",
          type: "string",
          options: {
            list: LOTTIE_HEIGHT_OPTIONS,
            layout: "radio",
          },
          hidden: ({ parent }) => parent?.type !== "lottie",
          description:
            "Control the vertical height of the Lottie container inside the hero media area.",
          initialValue: "full",
        }),
        defineField({
          name: "widthMode",
          title: "Width Mode",
          type: "string",
          initialValue: "auto",
          options: {
            list: WIDTH_MODES,
            layout: "radio",
          },
          description:
            "Control how wide the media appears within its column.",
        }),
        defineField({
          name: "widthValue",
          title: "Width Value",
          type: "number",
          description:
            "Set the width value used with Fixed pixels or Percentage for the media area.",
          hidden: ({ parent }) => parent?.widthMode === "auto",
        }),
        defineField({
          name: "maxWidth",
          title: "Max Width (px)",
          type: "number",
          description:
            "Clamp the maximum width of the media so it stays balanced in the hero media area.",
        }),
        defineField({
          name: "fit",
          title: "Object Fit",
          type: "string",
          initialValue: "cover",
          options: {
            list: FIT_OPTIONS,
            layout: "radio",
          },
          description:
            "Choose how the media scales inside its bounding box in the hero media area.",
        }),
        defineField({
          name: "autoAdvanceInterval",
          title: "Carousel Auto-Advance (ms)",
          type: "number",
          hidden: ({ parent }) => parent?.type !== "carousel",
          description:
            "Override the default 12 second interval between slides in the carousel.",
          validation: (rule) =>
            rule
              .min(2000)
              .warning("Keep the interval above 2 seconds to ensure readability."),
        }),
        defineField({
          name: "align",
          title: "Alignment",
          type: "string",
          initialValue: "center",
          options: {
            list: ALIGN_OPTIONS,
            layout: "radio",
          },
          description:
            "Align the media within its column in the hero layout.",
        }),
      ],
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "object",
      group: "background",
      options: {
        collapsible: true,
        collapsed: true,
      },
      description:
        "Design the backdrop layer that covers the entire hero section.",
      fields: [
        defineField({
          name: "mode",
          title: "Background Mode",
          type: "string",
          initialValue: "none",
          options: {
            list: BACKGROUND_MODES,
            layout: "radio",
          },
          description:
            "Select whether the hero background uses a color, image, or gradient.",
        }),
        defineField({
          name: "token",
          title: "Design Token",
          type: "string",
          options: {
            list: BACKGROUND_TOKEN_OPTIONS,
          },
          hidden: ({ parent }) => parent?.mode !== "color",
          description:
            "Choose a design token from your palette to fill the hero background.",
        }),
        defineField({
          name: "color",
          title: "Custom Color",
          type: "string",
          hidden: ({ parent }) => parent?.mode !== "color",
          description:
            "Override the background with a custom hex value across the hero section.",
        }),
        defineField({
          name: "image",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description:
                "Describe the background image that spans the hero section.",
            }),
          ],
          hidden: ({ parent }) => parent?.mode !== "image",
          description:
            "Upload the image that fills the hero background layer.",
        }),
        defineField({
          name: "overlayOpacity",
          title: "Overlay Opacity",
          type: "number",
          hidden: ({ parent }) => parent?.mode !== "image",
          description:
            "Add a dark overlay over the background image to improve hero text contrast.",
          validation: (rule) => rule.min(0).max(100),
        }),
        defineField({
          name: "gradient",
          title: "Gradient",
          type: "object",
          hidden: ({ parent }) => parent?.mode !== "gradient",
          description:
            "Configure the gradient that fills the entire hero background.",
          fields: [
            defineField({
              name: "angle",
              title: "Angle (deg)",
              type: "number",
              description:
                "Set the gradient angle applied across the hero background.",
              initialValue: 90,
            }),
            defineField({
              name: "from",
              title: "From Color",
              type: "string",
              description:
                "Choose the starting color stop for the hero background gradient.",
            }),
            defineField({
              name: "to",
              title: "To Color",
              type: "string",
              description:
                "Choose the ending color stop for the hero background gradient.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "shape",
      title: "Background Shape",
      type: "object",
      group: "background",
      options: {
        collapsible: true,
        collapsed: true,
      },
      description:
        "Add a floating card-like shape behind the hero content for extra layering.",
      fields: [
        defineField({
          name: "enabled",
          title: "Display Shape",
          type: "boolean",
          initialValue: false,
          description:
            "Toggle the decorative shape that sits underneath the hero content area.",
        }),
        defineField({
          name: "type",
          title: "Shape Type",
          type: "string",
          options: {
            list: SHAPE_TYPES,
            layout: "radio",
          },
          hidden: ({ parent }) => !parent?.enabled,
          description:
            "Set whether the hero support shape is squared or rounded.",
        }),
        defineField({
          name: "radius",
          title: "Corner Radius (px)",
          type: "number",
          hidden: ({ parent }) => !parent?.enabled,
          description:
            "Adjust how round the shape corners appear behind the hero content.",
        }),
        defineField({
          name: "padding",
          title: "Shape Padding (px)",
          type: "number",
          hidden: ({ parent }) => !parent?.enabled,
          description:
            "Control how far the shape extends beyond the content; positive values expand outward, negatives pull inward.",
          validation: (rule) => rule.min(-160).max(160),
        }),
        defineField({
          name: "shadow",
          title: "Shadow",
          type: "string",
          options: {
            list: SHADOW_OPTIONS,
            layout: "radio",
          },
          hidden: ({ parent }) => !parent?.enabled,
          description:
            "Choose the drop shadow intensity applied to the hero shape.",
        }),
        defineField({
          name: "fill",
          title: "Shape Fill",
          type: "string",
          options: {
            list: [
              { title: "Solid Color", value: "color" },
              { title: "Image", value: "image" },
              { title: "Lottie Animation", value: "lottie" },
            ],
            layout: "radio",
          },
          hidden: ({ parent }) => !parent?.enabled,
          description:
            "Select how the hero shape is filled behind the content.",
        }),
        defineField({
          name: "color",
          title: "Shape Color",
          type: "string",
          hidden: ({ parent }) => !parent?.enabled || parent?.fill !== "color",
          description:
            "Pick the color that fills the decorative hero shape.",
        }),
        defineField({
          name: "token",
          title: "Shape Token",
          type: "string",
          options: {
            list: BACKGROUND_TOKEN_OPTIONS,
          },
          hidden: ({ parent }) => !parent?.enabled || parent?.fill !== "color",
          description:
            "Reference a design token to color the hero shape.",
        }),
        defineField({
          name: "image",
          title: "Shape Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description:
                "Describe the image that fills the hero background shape.",
            }),
          ],
          hidden: ({ parent }) => !parent?.enabled || parent?.fill !== "image",
          description:
            "Upload an image that sits within the decorative hero shape.",
        }),
        defineField({
          name: "lottie",
          title: "Shape Animation",
          type: "lottie-asset",
          hidden: ({ parent }) => !parent?.enabled || parent?.fill !== "lottie",
          description:
            "Select the animation that plays inside the decorative hero shape.",
        }),
      ],
    }),
    fadeInField({ group: "layout" }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
      mediaType: "media.type",
    },
    prepare({ title, variant, mediaType }) {
      return {
        title: title || "Hero – Flex",
        subtitle: `${variant ?? "split"} · ${mediaType ?? "image"}`,
      };
    },
  },
});
