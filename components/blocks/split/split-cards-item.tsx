// components/blocks/split/split-cards-item.tsx
"use client";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult, ColorVariant } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-cards-list" }
>;
type SplitCardItem = NonNullable<NonNullable<SplitCardsList["list"]>[number]>;

interface SplitCardsItemProps extends SplitCardItem {
  color?: ColorVariant;
}

export default function SplitCardsItem({
  color,
  image,
  imageSize,
  imageShape,
  sizeBasis,
  tagLine,
  title,
  body,
}: SplitCardsItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 1,
  });

  const sizeVariant = imageSize ?? "md";
  const shapeVariant = imageShape ?? "rounded";
  const basisVariant = sizeBasis ?? "text";

  const sizeConfig = {
    sm: {
      wrapper: "w-24 h-24 md:w-28 md:h-28",
      minHeight: "12rem",
      assetSize: 320,
    },
    md: {
      wrapper: "w-32 h-32 md:w-36 md:h-36",
      minHeight: "16rem",
      assetSize: 420,
    },
    lg: {
      wrapper: "w-40 h-40 md:w-44 md:h-44",
      minHeight: "20rem",
      assetSize: 520,
    },
  }[sizeVariant];

  const shapeClass = (
    {
      rounded: "rounded-3xl",
      square: "rounded-xl",
      circle: "rounded-full",
    } as const
  )[shapeVariant];

  const imageAsset = image?.asset as
    | (typeof image & {
        asset?: {
          _id?: string;
          url?: string;
          mimeType?: string;
          metadata?: {
            lqip?: string;
            dimensions?: {
              width?: number;
              height?: number;
            };
          };
        };
      })["asset"]
    | undefined;

  const isSvg = imageAsset?.mimeType === "image/svg+xml";
  const blurData = imageAsset?.metadata?.lqip;

  const imageUrl = image?.asset
    ? isSvg
      ? urlFor(image).url()
      : urlFor(image)
          .width(sizeConfig.assetSize)
          .height(sizeConfig.assetSize)
          .url()
    : undefined;

  const hasImage = Boolean(imageUrl);
  const cardStyles: CSSProperties | undefined =
    basisVariant === "image" && hasImage
      ? {
          minHeight: sizeConfig.minHeight,
        }
      : undefined;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex flex-col items-start border border-primary rounded-3xl px-6 lg:px-8 py-6 lg:py-8 transition-colors duration-1000 ease-in-out",
        hasImage ? "gap-6" : undefined,
        isInView ? "bg-foreground/85" : "bg-background",
        color === "primary" ? "text-background" : undefined
      )}
      style={cardStyles}
    >
      {hasImage && imageUrl && (
        <div className="flex w-full">
          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-foreground/5",
              sizeConfig.wrapper,
              shapeClass,
              color === "primary" ? "bg-background/10" : undefined
            )}
          >
            <Image
              src={imageUrl}
              alt={image?.alt || ""}
              fill
              className={cn(
                "object-cover",
                isSvg ? "object-contain p-4" : undefined
              )}
              placeholder={blurData && !isSvg ? "blur" : "empty"}
              blurDataURL={blurData && !isSvg ? blurData : undefined}
              sizes="(min-width:1024px) 11rem, (min-width:768px) 9rem, 8rem"
            />
          </div>
        </div>
      )}
      {tagLine && (
        <div
          className={cn(
            "font-bold text-2xl lg:text-3xl transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
            color === "primary" ? "text-background" : undefined
          )}
        >
          {tagLine}
        </div>
      )}
      {title && (
        <div
          className={cn(
            "my-2 font-semibold text-xl transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground",
            color === "primary" ? "text-background" : undefined
          )}
        >
          {title}
        </div>
      )}
      {body && (
        <div
          className={cn(
            "transition-colors duration-1000 ease-in-out",
            isInView ? "text-background" : "text-foreground"
          )}
        >
          <PortableTextRenderer value={body} />
        </div>
      )}
    </motion.div>
  );
}
