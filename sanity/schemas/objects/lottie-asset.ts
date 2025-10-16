// sanity/schemas/objects/lottie-asset.ts
import { defineField, defineType } from "sanity";
import { Sparkle } from "lucide-react";

export default defineType({
  name: "lottie-asset",
  title: "Lottie Asset",
  type: "object",
  icon: Sparkle,
  fields: [
    defineField({
      name: "file",
      title: "Animation JSON",
      type: "file",
      description:
        "Upload the Lottie JSON file that renders inside the hero media area.",
      options: {
        accept: "application/json",
      },
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      description:
        "Start the animation automatically when it enters view in the hero media area.",
      initialValue: true,
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      description:
        "Repeat the animation continuously while visible in the hero media area.",
      initialValue: true,
    }),
    defineField({
      name: "speed",
      title: "Playback Speed",
      type: "number",
      description:
        "Adjust how quickly the animation plays inside the hero media area.",
      validation: (rule) => rule.min(0.1).max(4).precision(2),
      initialValue: 1,
    }),
    defineField({
      name: "ariaLabel",
      title: "Accessible Label",
      type: "string",
      description:
        "Add a short description announced by screen readers for this animation in the hero media area.",
    }),
  ],
  preview: {
    select: {
      fileName: "file.asset.originalFilename",
      speed: "speed",
    },
    prepare({ fileName, speed }) {
      return {
        title: fileName || "Lottie Animation",
        subtitle: `Speed: ${speed ?? 1}x`,
      };
    },
  },
});
