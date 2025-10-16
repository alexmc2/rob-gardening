// components/blocks/hero/hero-flex.mocks.ts
import type { HeroFlexProps } from "@/components/blocks/hero/hero-flex";

const placeholderImageMetadata = {
  lqip: null,
  dimensions: {
    width: 1440,
    height: 900,
  },
};

export const heroFlexSplitExample: HeroFlexProps = {
  _type: "hero-flex",
  _key: "split-demo",
  variant: "split",
  minHeight: "80vh",
  contentSpacing: "cozy",
  paddingStrategy: "cozy",
  textAlign: "left",
  invertText: false,
  mobileStack: "mediaFirst",
  mediaPosition: "right",
  eyebrow: "Product",
  title: "Design without creative limits",
  titleStyles: {
    font: "display",
    size: "2xl",
    weight: "700",
    tracking: "normal",
  },
  titleBodySpacing: "snug",
  body: [
    {
      _type: "block",
      _key: "body-block",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "body-span",
          text: "Mix imagery and animation while keeping text perfectly legible across breakpoints.",
        },
      ],
    },
  ],
  ctas: [
    {
      _key: "primary",
      label: "Start a project",
      href: "/contact",
      style: "primary",
    },
    {
      _key: "secondary",
      label: "Explore features",
      href: "/features",
      style: "ghost",
    },
  ],
  media: {
    type: "lottie",
    align: "center",
    fit: "contain",
    widthMode: "percent",
    widthValue: 80,
    lottie: {
      autoplay: true,
      loop: true,
      speed: 1,
      ariaLabel: "Abstract neon spheres pulsing",
      file: {
        asset: {
          _id: "demo-lottie",
          url: "/lotties/demo.json",
        },
      },
    },
  },
  background: {
    mode: "gradient",
    gradient: {
      angle: 135,
      from: "#0f172a",
      to: "#312e81",
    },
  },
  shape: {
    enabled: true,
    type: "rounded",
    radius: 48,
    padding: 32,
    shadow: "medium",
    fill: "color",
    token: "card",
    color: "#ffffff14",
  },
};

export const heroFlexFullBleedExample: HeroFlexProps = {
  _type: "hero-flex",
  _key: "fullbleed-demo",
  variant: "fullBleed",
  minHeight: "100vh",
  paddingStrategy: "roomy",
  textAlign: "center",
  invertText: true,
  eyebrow: "Campaign",
  title: "Moments that move people",
  titleStyles: {
    font: "display",
    size: "3xl",
    weight: "700",
    tracking: "normal",
  },
  titleBodySpacing: "tight",
  body: [
    {
      _type: "block",
      _key: "fullbleed-body",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "fullbleed-span",
          text: "Blend motion, imagery, and typography without juggling multiple hero variants.",
        },
      ],
    },
  ],
  ctas: [
    {
      _key: "cta-primary",
      label: "View showcase",
      href: "/work",
      style: "primary",
    },
  ],
  media: {
    type: "lottie",
    align: "center",
    fit: "cover",
    lottie: {
      autoplay: true,
      loop: true,
      ariaLabel: "Soft gradient waves",
      speed: 1,
      file: {
        asset: {
          _id: "hero-flex-wave",
          url: "/lotties/waves.json",
        },
      },
    },
  },
  background: {
    mode: "color",
    color: "#09090b",
  },
  shape: {
    enabled: true,
    type: "rounded",
    radius: 36,
    padding: 24,
    shadow: "soft",
    fill: "color",
    color: "#111827cc",
  },
};

export const heroFlexCardExample: HeroFlexProps = {
  _type: "hero-flex",
  _key: "card-demo",
  variant: "card",
  minHeight: "80vh",
  paddingStrategy: "roomy",
  textAlign: "left",
  invertText: false,
  mobileStack: "textFirst",
  mediaPosition: "left",
  eyebrow: "Platform",
  title: "Build branded landing pages in hours",
  titleStyles: {
    font: "sans",
    size: "xl",
    weight: "700",
    tracking: "normal",
  },
  titleBodySpacing: "normal",
  body: [
    {
      _type: "block",
      _key: "card-body",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "card-span",
          text: "Use token-driven backgrounds, smart sizing controls, and flexible layout modes to match any campaign brief.",
        },
      ],
    },
  ],
  ctas: [
    {
      _key: "card-primary",
      label: "Get started",
      href: "/signup",
      style: "primary",
    },
    {
      _key: "card-secondary",
      label: "Contact sales",
      href: "mailto:hello@example.com",
      style: "secondary",
    },
  ],
  media: {
    type: "image",
    align: "center",
    fit: "contain",
    widthMode: "px",
    widthValue: 440,
    image: {
      asset: {
        _id: "demo-image",
        url: "https://cdn.sanity.io/images/demo/demo/hero-flex-card.png",
        metadata: placeholderImageMetadata,
      },
      alt: "Placeholder dashboard preview",
    },
  },
  background: {
    mode: "color",
    token: "background",
  },
  shape: {
    enabled: true,
    type: "rounded",
    radius: 56,
    padding: 32,
    shadow: "medium",
    fill: "color",
    color: "#ffffffeb",
  },
};
