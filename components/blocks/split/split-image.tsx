// components/blocks/split/split-image.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitImage = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-image" }
>;

const imageSizes = {
  sm: {
    wrapper: "max-w-[14rem]",
    assetWidth: 320,
  },
  md: {
    wrapper: "max-w-[18rem]",
    assetWidth: 420,
  },
  lg: {
    wrapper: "max-w-[22rem]",
    assetWidth: 520,
  },
  xl: {
    wrapper: "max-w-[28rem]",
    assetWidth: 640,
  },
} as const;

const aspectClasses = {
  auto: "",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

export default function SplitImage({
  image,
  imageLight,
  imageDark,
  imageSize,
  imageShape,
  aspectRatio,
}: SplitImage) {
  const baseImage = image && image.asset?._id ? image : null;
  const themedLight = imageLight && imageLight.asset?._id ? imageLight : null;
  const themedDark = imageDark && imageDark.asset?._id ? imageDark : null;

  const displayImage = themedDark || baseImage || themedLight;

  if (!displayImage) return null;

  const shapeVariant = imageShape ?? "rounded";
  const sizeVariant = imageSize ?? "md";
  const ratioVariant = aspectRatio ?? "auto";

  const sizeConfig = imageSizes[sizeVariant] ?? imageSizes.md;
  const aspectClass =
    shapeVariant === "circle"
      ? aspectClasses.square
      : aspectClasses[ratioVariant] ?? "";

  const shapeClass = (
    {
      rounded: "rounded-3xl",
      square: "rounded-lg",
      circle: "rounded-full",
    } as const
  )[shapeVariant];

  const getAlt = (img?: typeof image) => img?.alt || baseImage?.alt || "";
  const getBlurData = (img?: typeof image) => img?.asset?.metadata?.lqip;
  const isSvg = displayImage.asset?.mimeType === "image/svg+xml";

  const buildImageUrl = () => {
    const builder = urlFor(displayImage);

    if (isSvg) {
      return builder.url();
    }

    const width = sizeConfig.assetWidth;

    if (shapeVariant === "circle" || ratioVariant === "square") {
      return builder.width(width).height(width).url();
    }

    if (ratioVariant === "portrait") {
      const height = Math.round(width * (4 / 3));
      return builder.width(width).height(height).url();
    }

    if (ratioVariant === "landscape") {
      const height = Math.round(width * (3 / 4));
      return builder.width(width).height(height).url();
    }

    return builder.width(width).url();
  };

  const imageUrl = buildImageUrl();
  const blurData = getBlurData(displayImage);

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          sizeConfig.wrapper,
          aspectClass,
          shapeClass,
          isSvg ? "bg-transparent" : "bg-foreground/5"
        )}
      >
        <Image
          src={imageUrl}
          alt={getAlt(displayImage)}
          fill
          className={cn(
            "object-cover",
            isSvg ? "object-contain p-4" : undefined
          )}
          placeholder={blurData && !isSvg ? "blur" : "empty"}
          blurDataURL={blurData && !isSvg ? blurData : undefined}
          sizes="(min-width:1280px) 24rem, (min-width:1024px) 22rem, (min-width:768px) 18rem, (min-width:640px) 16rem, 14rem"
          priority
        />
      </div>
    </div>
  );
}
