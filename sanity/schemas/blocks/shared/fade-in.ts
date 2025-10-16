// sanity/schemas/blocks/shared/fade-in.ts
import { defineField } from "sanity";

type FadeInOverrides = Record<string, unknown>;

export const fadeInField = (overrides?: FadeInOverrides) =>
  defineField({
    name: "enableFadeIn",
    title: "Enable Fade-In",
    type: "boolean",
    description:
      "Disable if this block should render without the default fade-in animation.",
    initialValue: true,
    ...overrides,
  });
