// components/blocks/hero/hero-flex.tsx
import type { CSSProperties, ReactNode } from "react";

import Image from "next/image";
import { stegaClean } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

import { urlFor } from "@/sanity/lib/image";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button1";
import { HeroFlexLottie } from "./hero-flex-lottie";
import { HeroFullCarousel } from "./hero-full-carousel";

const SECTION_HORIZONTAL_CLASS = "px-4 sm:px-6 lg:px-12";

const SECTION_PADDING_MAP = {
  none: {
    base: "py-0",
    sm: "sm:py-0",
    lg: "lg:py-0",
  },
  micro: {
    base: "py-6",
    sm: "sm:py-8",
    lg: "lg:py-10",
  },
  compact: {
    base: "py-10",
    sm: "sm:py-12",
    lg: "lg:py-16",
  },
  cozy: {
    base: "py-16",
    sm: "sm:py-20",
    lg: "lg:py-24",
  },
  roomy: {
    base: "py-20",
    sm: "sm:py-24",
    lg: "lg:py-32",
  },
  spacious: {
    base: "py-24",
    sm: "sm:py-32",
    lg: "lg:py-40",
  },
} as const;

const SECTION_DESKTOP_OVERRIDE_MAP = {
  none: "lg:py-0",
  micro: "lg:py-10",
  compact: "lg:py-16",
  cozy: "lg:py-24",
  roomy: "lg:py-32",
  spacious: "lg:py-40",
} as const;

const CONTENT_GAP_MAP = {
  none: "gap-0",
  micro: "gap-4 md:gap-5",
  compact: "gap-6 md:gap-8",
  cozy: "gap-8 md:gap-10",
  roomy: "gap-10 md:gap-12",
  spacious: "gap-12 md:gap-16",
} as const;

const TITLE_BODY_GAP_MAP = {
  tight: "gap-y-2 md:gap-y-3",
  snug: "gap-y-3 md:gap-y-4",
  normal: "gap-y-4 md:gap-y-6",
  relaxed: "gap-y-6 md:gap-y-8",
} as const;

const TEXT_ALIGN_MOBILE_CLASS_MAP = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

const TEXT_ALIGN_DESKTOP_CLASS_MAP = {
  left: "lg:items-start lg:text-left",
  center: "lg:items-center lg:text-center",
  right: "lg:items-end lg:text-right",
} as const;

const MEDIA_CONTAINER_ALIGN_MAP = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const;

const MEDIA_SELF_ALIGN_MAP = {
  start: "self-start",
  center: "self-center",
  end: "self-end",
} as const;

const TITLE_SIZE_CLASS_MAP = {
  xs: "text-3xl sm:text-4xl md:text-5xl",
  sm: "text-4xl sm:text-5xl md:text-6xl",
  base: "text-4xl sm:text-6xl md:text-7xl",
  lg: "text-5xl sm:text-7xl lg:text-[4.5rem]",
  xl: "text-6xl sm:text-[3.8rem] lg:text-[4.8rem]",
  "2xl": "text-6xl sm:text-[4.2rem] lg:text-[5.2rem]",
  "3xl": "text-6xl sm:text-[4.6rem] lg:text-[5.6rem]",
  "4xl": "text-6xl sm:text-[5rem] lg:text-[6rem]",
  "5xl": "text-7xl sm:text-[5.4rem] lg:text-[6.4rem]",
  "6xl": "text-7xl sm:text-[5.8rem] lg:text-[6.8rem]",
} as const;

const TITLE_WEIGHT_CLASS_MAP = {
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
  "800": "font-extrabold",
} as const;

const TITLE_TRACKING_CLASS_MAP = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
} as const;

const CTA_VARIANT_MAP = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
} as const;

const SHADOW_CLASS_MAP = {
  none: "",
  soft: "shadow-lg shadow-black/10",
  medium: "shadow-xl shadow-black/15",
  strong: "shadow-2xl shadow-black/20",
} as const;

const LOTTIE_WIDTH_CLASS_MAP = {
  small: "max-w-[18rem] sm:max-w-[22rem] md:max-w-[28rem]",
  medium: "max-w-[26rem] sm:max-w-[32rem] md:max-w-[40rem]",
  large: "max-w-[34rem] sm:max-w-[44rem] md:max-w-[56rem]",
  full: "w-full max-w-none",
} as const;

const LOTTIE_HEIGHT_STYLE_MAP = {
  small: "clamp(10rem, 24vh, 16rem)",
  medium: "clamp(12rem, 30vh, 20rem)",
  large: "clamp(14rem, 38vh, 26rem)",
  full: "clamp(16rem, 46vh, 32rem)",
} as const;

type SpacingScale = keyof typeof SECTION_PADDING_MAP;
type ContentSpacingScale = keyof typeof CONTENT_GAP_MAP;
type TitleSpacingScale = keyof typeof TITLE_BODY_GAP_MAP;
type TextAlignOption = keyof typeof TEXT_ALIGN_MOBILE_CLASS_MAP;
type MediaAlignOption = keyof typeof MEDIA_CONTAINER_ALIGN_MAP;
type TitleSizeOption = keyof typeof TITLE_SIZE_CLASS_MAP;
type TitleWeightOption = keyof typeof TITLE_WEIGHT_CLASS_MAP;
type TitleTrackingOption = keyof typeof TITLE_TRACKING_CLASS_MAP;
type ShadowOption = keyof typeof SHADOW_CLASS_MAP;
type LottieSizeOption = keyof typeof LOTTIE_WIDTH_CLASS_MAP;
type LottieHeightOption = keyof typeof LOTTIE_HEIGHT_STYLE_MAP;

type HeroFlexCta = {
  _key: string;
  label?: string | null;
  href?: string | null;
  style?: keyof typeof CTA_VARIANT_MAP | null;
  ariaLabel?: string | null;
};

type ImageAssetMetadata = {
  lqip?: string | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
  } | null;
} | null;

type ImageAsset = {
  _id?: string | null;
  url?: string | null;
  mimeType?: string | null;
  metadata?: ImageAssetMetadata;
} | null;

type ImageHotspot = {
  x?: number | null;
  y?: number | null;
  height?: number | null;
  width?: number | null;
} | null;

type ImageCrop = {
  top?: number | null;
  bottom?: number | null;
  left?: number | null;
  right?: number | null;
} | null;

type SanityImageWithMetadata = {
  asset?: ImageAsset;
  hotspot?: ImageHotspot;
  crop?: ImageCrop;
  alt?: string | null;
};

type HeroFlexLottieAsset = {
  file?: {
    asset?: {
      _id?: string | null;
      url?: string | null;
    } | null;
  } | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  speed?: number | null;
  ariaLabel?: string | null;
};

type HeroFlexMedia = {
  type?: "image" | "carousel" | "lottie" | null;
  image?: SanityImageWithMetadata | null;
  images?: SanityImageWithMetadata[] | null;
  lottie?: HeroFlexLottieAsset | null;
  lottieSize?: LottieSizeOption | null;
  lottieHeight?: LottieHeightOption | null;
  widthMode?: "auto" | "px" | "percent" | null;
  widthValue?: number | null;
  maxWidth?: number | null;
  fit?: "contain" | "cover" | null;
  align?: MediaAlignOption | null;
  autoAdvanceInterval?: number | null;
};

type HeroFlexBackground = {
  mode?: "none" | "color" | "image" | "gradient" | null;
  token?: string | null;
  color?: string | null;
  image?: SanityImageWithMetadata | null;
  overlayOpacity?: number | null;
  gradient?: {
    angle?: number | null;
    from?: string | null;
    to?: string | null;
  } | null;
};

type HeroFlexShape = {
  enabled?: boolean | null;
  type?: "rectangle" | "rounded" | null;
  radius?: number | null;
  padding?: number | null;
  shadow?: ShadowOption | null;
  fill?: "color" | "image" | "lottie" | null;
  color?: string | null;
  token?: string | null;
  image?: SanityImageWithMetadata | null;
  lottie?: HeroFlexLottieAsset | null;
};

type HeroFlexTitleStyles = {
  font?: "sans" | "serif" | "display" | "mono" | null;
  size?: TitleSizeOption | null;
  weight?: TitleWeightOption | null;
  tracking?: TitleTrackingOption | null;
};

type HeroFlexMobileOverrides = {
  textAlign?: TextAlignOption | null;
  title?: string | null;
  body?: PortableTextBlock[] | unknown[] | null;
} | null;

type HeroFlexBlock = {
  _type: "hero-flex";
  _key: string;
  variant?: "fullBleed" | "split" | "card" | null;
  minHeight?: "auto" | "60vh" | "80vh" | "100vh" | "custom" | null;
  minHeightCustom?: number | null;
  contentSpacing?: ContentSpacingScale | null;
  paddingStrategy?: SpacingScale | null;
  paddingStrategyDesktop?: SpacingScale | null;
  textAlign?: TextAlignOption | null;
  invertText?: boolean | null;
  mobileStack?: "mediaFirst" | "textFirst" | null;
  mediaPosition?: "left" | "right" | null;
  eyebrow?: string | null;
  title?: string | null;
  titleStyles?: HeroFlexTitleStyles | null;
  titleBodySpacing?: TitleSpacingScale | null;
  body?: PortableTextBlock[] | unknown[] | null;
  ctas?: HeroFlexCta[] | null;
  media?: HeroFlexMedia | null;
  background?: HeroFlexBackground | null;
  shape?: HeroFlexShape | null;
  mobileOverrides?: HeroFlexMobileOverrides;
};

export type HeroFlexProps = HeroFlexBlock & {
  children?: ReactNode;
};

function sanitizeString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const cleaned = stegaClean(value);

  if (typeof cleaned !== "string") {
    return undefined;
  }

  const trimmed = cleaned.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveSectionDimensions(
  minHeight?: HeroFlexBlock["minHeight"],
  custom?: number | null
): { minHeight?: string } {
  if (minHeight === "auto") {
    return {};
  }

  if (minHeight === "custom") {
    if (typeof custom === "number" && custom > 0) {
      const value = `${custom}vh`;
      return { minHeight: value };
    }

    return { minHeight: "80vh" };
  }

  if (!minHeight) {
    return { minHeight: "80vh" };
  }

  return { minHeight };
}

function resolvePaddingClass(
  padding?: SpacingScale | null,
  desktopOverride?: SpacingScale | null
) {
  const fallbackKey: SpacingScale = "cozy";
  const baseKey = padding && SECTION_PADDING_MAP[padding] ? padding : fallbackKey;
  const { base, sm, lg } = SECTION_PADDING_MAP[baseKey];

  const classes = [SECTION_HORIZONTAL_CLASS, base, sm, lg];

  if (desktopOverride && SECTION_DESKTOP_OVERRIDE_MAP[desktopOverride]) {
    classes.push(SECTION_DESKTOP_OVERRIDE_MAP[desktopOverride]);
  }

  return cn(classes);
}

function resolveContentGapClass(spacing?: ContentSpacingScale | null) {
  if (!spacing) {
    return CONTENT_GAP_MAP.cozy;
  }

  return CONTENT_GAP_MAP[spacing] ?? CONTENT_GAP_MAP.cozy;
}

function resolveTitleSpacingClass(spacing?: TitleSpacingScale | null) {
  if (!spacing) {
    return TITLE_BODY_GAP_MAP.normal;
  }

  return TITLE_BODY_GAP_MAP[spacing] ?? TITLE_BODY_GAP_MAP.normal;
}

type TitleClassResult = {
  className: string;
  style?: CSSProperties;
};

function resolveTitleClasses(styles?: HeroFlexTitleStyles | null): TitleClassResult {
  const font = styles?.font ?? "sans";
  const size = styles?.size ?? "lg";
  const weight = styles?.weight ?? "700";
  const tracking = styles?.tracking ?? "normal";

  const fontClass =
    font === "display"
      ? "font-[var(--font-display)]"
      : font === "serif"
        ? "font-serif"
        : font === "mono"
          ? "font-mono"
          : "font-sans";

  const sizeClass = TITLE_SIZE_CLASS_MAP[size] ?? TITLE_SIZE_CLASS_MAP.lg;
  const weightClass = TITLE_WEIGHT_CLASS_MAP[weight] ?? TITLE_WEIGHT_CLASS_MAP["700"];
  const trackingClass =
    TITLE_TRACKING_CLASS_MAP[tracking] ?? TITLE_TRACKING_CLASS_MAP.normal;

  const className = cn(fontClass, sizeClass, weightClass, trackingClass);

  return { className };
}

function resolveBackgroundStyles(background?: HeroFlexBackground | null): {
  className: string;
  style: CSSProperties;
  overlay?: {
    opacity: number;
  };
} {
  if (!background || background.mode === "none" || !background.mode) {
    return { className: "", style: {} };
  }

  if (background.mode === "color") {
    const token = sanitizeString(background.token);
    const color = sanitizeString(background.color);

    if (token) {
      return {
        className: "",
        style: { backgroundColor: `var(--color-${token})` },
      };
    }

    if (color) {
      return {
        className: "",
        style: { backgroundColor: color },
      };
    }

    return { className: "", style: {} };
  }

  if (background.mode === "gradient") {
    const angle = typeof background.gradient?.angle === "number"
      ? background.gradient?.angle
      : 90;
    const from = sanitizeString(background.gradient?.from) ?? "rgba(15,15,15,1)";
    const to = sanitizeString(background.gradient?.to) ?? "rgba(0,0,0,0.6)";

    return {
      className: "",
      style: {
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
      },
    };
  }

  if (background.mode === "image") {
    return { className: "", style: {} };
  }

  return { className: "", style: {} };
}

function renderBackgroundImage(
  background?: HeroFlexBackground | null
): ReactNode {
  if (!background || background.mode !== "image") {
    return null;
  }

  const image = background.image;
  if (!image?.asset?._id) {
    return null;
  }

  const overlayOpacity = Math.max(
    0,
    Math.min(background.overlayOpacity ?? 0, 100)
  );
  const overlayAlpha = overlayOpacity / 100;

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={urlFor(image).width(2400).height(1600).fit("max").url()}
          alt={sanitizeString(image.alt) ?? "Hero background"}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          placeholder={image.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image.asset?.metadata?.lqip ?? undefined}
        />
      </div>
      {overlayAlpha > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayAlpha }}
          aria-hidden
        />
      )}
    </>
  );
}

type MediaRenderResult = {
  node: ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};

function renderMediaContent(
  media: HeroFlexMedia | null | undefined,
  variant: NonNullable<HeroFlexBlock["variant"]>
): MediaRenderResult | null {
  if (!media) {
    return null;
  }

  if (media.type === "carousel") {
    const images = Array.isArray(media.images)
      ? media.images.filter((item): item is NonNullable<typeof item> => !!item?.asset?._id)
      : [];

    if (images.length === 0) {
      return null;
    }

    const objectFit = media.fit === "contain" ? "contain" : "cover";
    const autoAdvanceInterval =
      typeof media.autoAdvanceInterval === "number" && media.autoAdvanceInterval > 0
        ? media.autoAdvanceInterval
        : undefined;

    if (variant === "fullBleed") {
      return {
        node: (
          <div className="absolute inset-0 overflow-hidden">
            <HeroFullCarousel
              images={images}
              autoAdvanceInterval={autoAdvanceInterval}
              objectFit={objectFit}
            />
          </div>
        ),
      };
    }

    const firstImage = images[0];
    const dimensions = firstImage?.asset?.metadata?.dimensions;
    const aspectRatio =
      dimensions?.width && dimensions?.height && dimensions.width > 0 && dimensions.height > 0
        ? `${dimensions.width}/${dimensions.height}`
        : undefined;

    const wrapperStyle: CSSProperties = {
      aspectRatio: aspectRatio ?? "4/3",
    };

    return {
      node: (
        <HeroFullCarousel
          images={images}
          autoAdvanceInterval={autoAdvanceInterval}
          objectFit={objectFit}
        />
      ),
      wrapperClassName: cn(
        "relative w-full overflow-hidden rounded-3xl",
        objectFit === "contain" ? "bg-white" : undefined
      ),
      wrapperStyle,
    };
  }

  if (media.type === "lottie") {
    const src = sanitizeString(media.lottie?.file?.asset?.url);

    if (!src) {
      return null;
    }

    const sizeKey = (media.lottieSize ?? "full") as LottieSizeOption;
    const heightKey = (media.lottieHeight ?? "full") as LottieHeightOption;

    const player = (
      <HeroFlexLottie
        src={src}
        loop={media.lottie?.loop}
        autoplay={media.lottie?.autoplay}
        speed={media.lottie?.speed}
        ariaLabel={sanitizeString(media.lottie?.ariaLabel)}
        className="h-full w-full"
        objectFit={media.fit ?? "cover"}
      />
    );

    if (variant === "fullBleed") {
      return {
        node: <div className="absolute inset-0 overflow-hidden">{player}</div>,
      };
    }

    const wrapperClassName = cn(
      "relative flex w-full items-center justify-center overflow-hidden",
      LOTTIE_WIDTH_CLASS_MAP[sizeKey]
    );
    const wrapperStyle: CSSProperties = {
      height: LOTTIE_HEIGHT_STYLE_MAP[heightKey],
    };

    return {
      node: player,
      wrapperClassName,
      wrapperStyle,
    };
  }

  const image = media.image;
  if (!image?.asset?._id) {
    return null;
  }

  const dimensions = image.asset?.metadata?.dimensions;
  const width = dimensions?.width ? Math.min(dimensions.width, 2400) : 1600;
  const height = dimensions?.height ? Math.min(dimensions.height, 1600) : 1200;
  const builder = urlFor(image).width(width).quality(80);
  const imageUrl =
    media.fit === "contain"
      ? builder.fit("max").url()
      : builder.height(height).fit("crop").url();

  if (variant === "fullBleed") {
    return {
      node: (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={sanitizeString(image.alt) ?? "Hero background"}
            fill
            className={cn(
              "object-cover",
              media.fit === "contain" ? "object-contain" : "object-cover"
            )}
            sizes="100vw"
            priority
            placeholder={image.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={image.asset?.metadata?.lqip ?? undefined}
          />
        </div>
      ),
    };
  }

  return {
    node: (
      <Image
        src={imageUrl}
        alt={sanitizeString(image.alt) ?? "Hero media"}
        width={width}
        height={height}
        className={cn(
          "h-full w-full rounded-3xl",
          media.fit === "contain" ? "object-contain" : "object-cover"
        )}
        sizes="(min-width: 1024px) 40vw, 90vw"
        placeholder={image.asset?.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image.asset?.metadata?.lqip ?? undefined}
      />
    ),
    wrapperClassName: "relative w-full overflow-hidden",
  };
}

function resolveMediaStyle(media?: HeroFlexMedia | null): CSSProperties | undefined {
  if (!media) {
    return undefined;
  }

  const style: CSSProperties = {};

  if (media.widthMode === "px" && typeof media.widthValue === "number") {
    style.width = `${Math.max(media.widthValue, 0)}px`;
  }

  if (media.widthMode === "percent" && typeof media.widthValue === "number") {
    style.width = `${Math.max(media.widthValue, 0)}%`;
  }

  if (typeof media.maxWidth === "number" && media.maxWidth > 0) {
    style.maxWidth = `${media.maxWidth}px`;
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

function renderShapeLayer(shape?: HeroFlexShape | null): ReactNode {
  if (!shape?.enabled) {
    return null;
  }

  const radius = shape.radius ?? (shape.type === "rounded" ? 48 : 4);
  const paddingValue = shape.padding ?? 0;
  const inset = Math.abs(paddingValue);
  const insetStyle = paddingValue >= 0
    ? {
        top: `-${inset}px`,
        right: `-${inset}px`,
        bottom: `-${inset}px`,
        left: `-${inset}px`,
      }
    : {
        top: `${inset}px`,
        right: `${inset}px`,
        bottom: `${inset}px`,
        left: `${inset}px`,
      };
  const shadowClass = shape.shadow ? SHADOW_CLASS_MAP[shape.shadow] : "";

  const baseStyle: CSSProperties = {
    borderRadius: radius,
  };

  const fill = shape.fill ?? "color";
  const token = sanitizeString(shape.token);
  const color = sanitizeString(shape.color);

  let backgroundNode: ReactNode = null;

  if (fill === "color") {
    const resolvedColor = token
      ? `var(--color-${token})`
      : color ?? "var(--color-card)";

    backgroundNode = (
      <div
        className={cn("h-full w-full", shadowClass)}
        style={{
          ...baseStyle,
          background: resolvedColor,
        }}
      />
    );
  }

  if (fill === "image" && shape.image?.asset?._id) {
    const image = shape.image;
    const dimensions = image.asset?.metadata?.dimensions;
    const width = dimensions?.width ? Math.min(dimensions.width, 2000) : 1600;
    const builder = urlFor(image).width(width).quality(80);
    const imageUrl = builder.fit("crop").url();

    backgroundNode = (
      <div className={cn("relative h-full w-full overflow-hidden", shadowClass)}>
        <Image
          src={imageUrl}
          alt={sanitizeString(image.alt) ?? "Decorative hero shape"}
          fill
          className="object-cover"
          sizes="100vw"
          placeholder={image.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image.asset?.metadata?.lqip ?? undefined}
          style={baseStyle}
        />
      </div>
    );
  }

  if (fill === "lottie") {
    const src = sanitizeString(shape.lottie?.file?.asset?.url);
    if (src) {
      backgroundNode = (
        <HeroFlexLottie
          src={src}
          loop={shape.lottie?.loop}
          autoplay={shape.lottie?.autoplay}
          speed={shape.lottie?.speed}
          ariaLabel={sanitizeString(shape.lottie?.ariaLabel)}
          className={cn("relative h-full w-full overflow-hidden", shadowClass)}
          style={baseStyle}
          objectFit="cover"
        />
      );
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute" style={insetStyle}>
        {backgroundNode}
      </div>
    </div>
  );
}

type VariantRendererArgs = {
  variant: NonNullable<HeroFlexBlock["variant"]>;
  mediaPosition: NonNullable<HeroFlexBlock["mediaPosition"]>;
  mobileStack: NonNullable<HeroFlexBlock["mobileStack"]>;
  contentGapClass: string;
  textAlignClass: string;
  textContent: ReactNode;
  mediaNode: ReactNode | null;
  mediaWrapperClassName?: string;
  mediaWrapperStyle?: CSSProperties;
  mediaAlignContainerClass: string;
  mediaAlignSelfClass: string;
  mediaStyle?: CSSProperties;
  shape?: HeroFlexShape | null;
};

function renderVariantLayout({
  variant,
  mediaPosition,
  mobileStack,
  contentGapClass,
  textAlignClass,
  textContent,
  mediaNode,
  mediaWrapperClassName,
  mediaWrapperStyle,
  mediaAlignContainerClass,
  mediaAlignSelfClass,
  mediaStyle,
  shape,
}: VariantRendererArgs): ReactNode {
  if (variant === "fullBleed") {
    return (
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-24",
          "sm:py-32 lg:py-48"
        )}
      >
        <div className="relative">
          {renderShapeLayer(shape)}
          <div
            className={cn(
              "relative z-10 flex flex-col gap-6 md:gap-8",
              textAlignClass
            )}
          >
            {textContent}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "split") {
    const mediaOrderDesktop = mediaPosition === "left" ? "lg:order-1" : "lg:order-2";
    const textOrderDesktop = mediaPosition === "left" ? "lg:order-2" : "lg:order-1";
    const mediaOrderMobile = mobileStack === "mediaFirst" ? "order-1" : "order-2";
    const textOrderMobile = mobileStack === "mediaFirst" ? "order-2" : "order-1";

    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col lg:grid lg:grid-cols-2 lg:items-center",
          contentGapClass
        )}
      >
        <div
          className={cn(
            "relative",
            textOrderMobile,
            textOrderDesktop
          )}
        >
          {renderShapeLayer(shape)}
          <div
            className={cn(
              "relative z-10 flex flex-col gap-6 md:gap-8",
              textAlignClass,
              "lg:self-center"
            )}
          >
            {textContent}
          </div>
        </div>
        {mediaNode ? (
          <div
            className={cn(
              "relative flex items-center",
              mediaAlignContainerClass,
              mediaOrderMobile,
              mediaOrderDesktop
            )}
          >
            <div
              className={cn(
                "relative z-10",
                mediaAlignSelfClass,
                mediaWrapperClassName
              )}
              style={{ ...mediaWrapperStyle, ...mediaStyle }}
            >
              {mediaNode}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // card variant
  const isMediaLeft = mediaPosition === "left";
  const baseStackDirection = isMediaLeft ? "lg:flex-row-reverse" : "lg:flex-row";
  const cardMediaOrderMobile = mobileStack === "mediaFirst" ? "order-1" : "order-2";
  const cardTextOrderMobile = mobileStack === "mediaFirst" ? "order-2" : "order-1";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch">
      <div
        className={cn(
          "relative isolate flex w-full flex-col gap-10 rounded-[3rem] bg-white/10 p-8 shadow-xl backdrop-blur-xl",
          baseStackDirection,
          "sm:p-10 md:p-14",
          contentGapClass
        )}
      >
        {renderShapeLayer(shape)}
        <div
          className={cn(
            "relative z-10 flex flex-col gap-6 md:gap-8",
            textAlignClass,
            cardTextOrderMobile
          )}
        >
          {textContent}
        </div>
        {mediaNode ? (
          <div
            className={cn(
              "relative z-10 flex items-center",
              mediaAlignContainerClass,
              cardMediaOrderMobile
            )}
          >
            <div
              className={cn(
                "w-full",
                mediaAlignSelfClass,
                mediaWrapperClassName
              )}
              style={{ ...mediaWrapperStyle, ...mediaStyle }}
            >
              {mediaNode}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function HeroFlex(block: HeroFlexProps) {
  const variant = (block.variant ?? "split") as NonNullable<HeroFlexBlock["variant"]>;
  const contentGapClass = resolveContentGapClass(block.contentSpacing ?? "cozy");
  const paddingClass = resolvePaddingClass(
    block.paddingStrategy,
    block.paddingStrategyDesktop
  );
  const titleBodyGapClass = resolveTitleSpacingClass(block.titleBodySpacing ?? "normal");
  const mobileOverrides = block.mobileOverrides ?? null;
  const mobileAlignKey = (mobileOverrides?.textAlign ?? block.textAlign ?? "left") as TextAlignOption;
  const desktopAlignKey = (block.textAlign ?? "left") as TextAlignOption;
  const textAlignClass = cn(
    TEXT_ALIGN_MOBILE_CLASS_MAP[mobileAlignKey] ?? TEXT_ALIGN_MOBILE_CLASS_MAP.left,
    TEXT_ALIGN_DESKTOP_CLASS_MAP[desktopAlignKey] ?? TEXT_ALIGN_DESKTOP_CLASS_MAP.left
  );
  const invertText = Boolean(block.invertText);
  const mobileStack = (block.mobileStack ?? "textFirst") as NonNullable<
    HeroFlexBlock["mobileStack"]
  >;
  const mediaPosition = (block.mediaPosition ?? "right") as NonNullable<
    HeroFlexBlock["mediaPosition"]
  >;
  const mediaAlignKey = (block.media?.align ?? "center") as MediaAlignOption;
  const mediaAlignContainerClass =
    MEDIA_CONTAINER_ALIGN_MAP[mediaAlignKey] ?? "justify-center";
  const mediaAlignSelfClass =
    MEDIA_SELF_ALIGN_MAP[mediaAlignKey] ?? "self-center";
  const { minHeight } = resolveSectionDimensions(
    block.minHeight,
    block.minHeightCustom
  );

  const backgroundConfig = resolveBackgroundStyles(block.background);
  const backgroundImage = renderBackgroundImage(block.background);

  const titleClasses = resolveTitleClasses(block.titleStyles);

  const bodyValue = (Array.isArray(block.body) ? block.body : []) as PortableTextBlock[];
  const bodyHasContent = bodyValue.length > 0;
  const mobileBodyValue = (
    Array.isArray(mobileOverrides?.body) ? mobileOverrides?.body : []
  ) as PortableTextBlock[];
  const mobileBodyHasContent = mobileBodyValue.length > 0;
  const ctas = Array.isArray(block.ctas) ? block.ctas : [];

  const textToneClass = invertText ? "text-white" : "text-foreground";

  const sectionLayoutClass =
    variant === "card"
      ? "flex flex-col items-center justify-center"
      : "flex flex-col justify-center";

  const eyebrow = sanitizeString(block.eyebrow);
  const title = sanitizeString(block.title);
  const mobileTitle = sanitizeString(mobileOverrides?.title);

  const eyebrowNode = eyebrow ? (
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
      {eyebrow}
    </p>
  ) : null;

  const titleNodeDesktop = title ? (
    <h1
      className={cn(
        "leading-tight",
        titleClasses.className,
        mobileTitle ? "hidden lg:block" : undefined
      )}
    >
      {title}
    </h1>
  ) : null;

  const titleNodeMobile = mobileTitle ? (
    <h1 className={cn("leading-tight", titleClasses.className, "lg:hidden")}>
      {mobileTitle}
    </h1>
  ) : null;

  const bodyNodeDesktop = bodyHasContent ? (
    <div
      className={cn(
        "max-w-3xl text-base sm:text-lg",
        mobileBodyHasContent ? "hidden lg:block" : undefined
      )}
    >
      <PortableTextRenderer value={bodyValue} />
    </div>
  ) : null;

  const bodyNodeMobile = mobileBodyHasContent ? (
    <div className="max-w-2xl text-base sm:text-lg lg:hidden">
      <PortableTextRenderer value={mobileBodyValue} />
    </div>
  ) : null;

  const hasTitleContent = Boolean(titleNodeDesktop || titleNodeMobile);
  const hasBodyContent = Boolean(bodyNodeDesktop || bodyNodeMobile);

  const titleBodyGroup = hasTitleContent || hasBodyContent ? (
    <div className={cn("flex flex-col", titleBodyGapClass)}>
      {titleNodeMobile}
      {titleNodeDesktop}
      {bodyNodeMobile}
      {bodyNodeDesktop}
    </div>
  ) : null;

  const ctasNode = ctas.length > 0 ? (
    <div className="flex flex-wrap gap-4 pt-2">
      {ctas.map((cta) => {
        const label = sanitizeString(cta.label) ?? "Learn more";
        const href = sanitizeString(cta.href) ?? "#";
        const ariaLabel = sanitizeString(cta.ariaLabel);
        const style = cta.style ?? "primary";
        const buttonVariant = CTA_VARIANT_MAP[style] ?? "default";

        return (
          <Button
            key={cta._key}
            asChild
            variant={buttonVariant}
            className={invertText && buttonVariant === "ghost" ? "text-white" : undefined}
          >
            <a
              href={href}
              aria-label={ariaLabel}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {label}
            </a>
          </Button>
        );
      })}
    </div>
  ) : null;

  const textContent = (
    <>
      {eyebrowNode}
      {titleBodyGroup}
      {ctasNode}
    </>
  );

  const mediaStyle = resolveMediaStyle(block.media);
  const mediaResult = renderMediaContent(block.media, variant);
  const inlineMediaNode = variant === "fullBleed" ? null : mediaResult?.node ?? null;
  const inlineMediaWrapperClass =
    variant === "fullBleed" ? undefined : mediaResult?.wrapperClassName;
  const inlineMediaWrapperStyle =
    variant === "fullBleed" ? undefined : mediaResult?.wrapperStyle;
  const inlineMediaStyle = variant === "fullBleed" ? undefined : mediaStyle;

  const variantLayout = renderVariantLayout({
    variant,
    mediaPosition,
    mobileStack,
    contentGapClass,
    textAlignClass: cn(textAlignClass, textToneClass),
    textContent,
    mediaNode: inlineMediaNode,
    mediaWrapperClassName: inlineMediaWrapperClass,
    mediaWrapperStyle: inlineMediaWrapperStyle,
    mediaAlignContainerClass,
    mediaAlignSelfClass,
    mediaStyle: inlineMediaStyle,
    shape: block.shape,
  });

  const sectionStyle: CSSProperties = {
    ...backgroundConfig.style,
  };

  if (typeof minHeight === "string") {
    sectionStyle.minHeight = minHeight;
  }

  return (
    <section
      className={cn(
        "hero-flex relative isolate overflow-visible md:overflow-hidden",
        sectionLayoutClass,
        paddingClass,
        backgroundConfig.className
      )}
      style={sectionStyle}
    >
      {backgroundImage}
      {variant === "fullBleed" ? mediaResult?.node ?? null : null}

      <div className="relative z-10 w-full">{variantLayout}</div>
    </section>
  );
}
