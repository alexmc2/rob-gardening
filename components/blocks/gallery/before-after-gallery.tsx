// components/blocks/gallery/before-after-gallery.tsx
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult } from "@/sanity.types";
import BeforeAfterGalleryClient, {
  type BeforeAfterGalleryItem,
} from "./before-after-gallery-client";

const SLIDER_TARGET_WIDTH = 1600;
const SLIDER_SIZE_MAP = {
  compact: 380,
  comfortable: 520,
  spacious: 680,
  full: null,
} as const;

type SliderSizeKey = keyof typeof SLIDER_SIZE_MAP;

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type BeforeAfterGalleryBlock = Extract<Block, { _type: "before-after-gallery" }>;

type BlockItem = NonNullable<BeforeAfterGalleryBlock["items"]>[number];

export default function BeforeAfterGallery({
  padding,
  colorVariant,
  heading,
  intro,
  sliderSize,
  items,
  enableFadeIn,
}: BeforeAfterGalleryBlock) {
  const color = stegaClean(colorVariant);
  const cleanHeading = heading ? stegaClean(heading) : null;
  const cleanIntro = intro ? stegaClean(intro) : null;
  const sliderSizeKey = resolveSliderSize(sliderSize);
  const sliderMaxHeight = SLIDER_SIZE_MAP[sliderSizeKey];

  const parsedItems = (Array.isArray(items) ? items : [])
    .map((item, index) => mapBlockItemToGalleryItem(item, index))
    .filter((entry): entry is BeforeAfterGalleryItem => entry !== null);

  if (parsedItems.length === 0) {
    return null;
  }

  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div className="space-y-12">
        {(cleanHeading || cleanIntro) && (
          <div className="mx-auto max-w-2xl text-center">
            {cleanHeading && (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {cleanHeading}
              </h2>
            )}
            {cleanIntro && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {cleanIntro}
              </p>
            )}
          </div>
        )}
        <BeforeAfterGalleryClient
          items={parsedItems}
          maxHeight={sliderMaxHeight ?? undefined}
        />
      </div>
    </SectionContainer>
  );
}

function resolveSliderSize(size: BeforeAfterGalleryBlock["sliderSize"]): SliderSizeKey {
  if (size && typeof size === "string" && size in SLIDER_SIZE_MAP) {
    return size as SliderSizeKey;
  }

  return "comfortable";
}

function mapBlockItemToGalleryItem(
  item: BlockItem | null,
  fallbackIndex: number
): BeforeAfterGalleryItem | null {
  if (!item) {
    return null;
  }

  const beforeImage = item.beforeImage;
  const afterImage = item.afterImage;

  if (!beforeImage?.asset?._id || !afterImage?.asset?._id) {
    return null;
  }

  const beforeUrl = urlFor(beforeImage)
    .width(SLIDER_TARGET_WIDTH)
    .fit("max")
    .quality(85)
    .url();

  const afterUrl = urlFor(afterImage)
    .width(SLIDER_TARGET_WIDTH)
    .fit("max")
    .quality(85)
    .url();

  if (!beforeUrl || !afterUrl) {
    return null;
  }

  const beforeAlt = beforeImage.alt ? stegaClean(beforeImage.alt) : null;
  const afterAlt = afterImage.alt ? stegaClean(afterImage.alt) : null;

  const baseDimensions =
    afterImage.asset?.metadata?.dimensions ?? beforeImage.asset?.metadata?.dimensions;

  const width = Math.round(baseDimensions?.width ?? SLIDER_TARGET_WIDTH);
  const height = Math.round(
    baseDimensions?.height ?? Math.round(SLIDER_TARGET_WIDTH * 0.66)
  );

  const title = item.title ? stegaClean(item.title) : null;
  const description = item.description ? stegaClean(item.description) : null;

  const beforeLabel = item.beforeLabel
    ? stegaClean(item.beforeLabel)
    : "Before";
  const afterLabel = item.afterLabel ? stegaClean(item.afterLabel) : "After";

  return {
    id: item._key ?? `comparison-${fallbackIndex}`,
    title,
    description,
    beforeLabel,
    afterLabel,
    beforeImage: {
      src: beforeUrl,
      alt: beforeAlt ?? "Before image",
      blurDataUrl: beforeImage.asset?.metadata?.lqip ?? null,
      width,
      height,
    },
    afterImage: {
      src: afterUrl,
      alt: afterAlt ?? "After image",
      blurDataUrl: afterImage.asset?.metadata?.lqip ?? null,
      width,
      height,
    },
  };
}
