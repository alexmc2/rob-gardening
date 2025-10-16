// components/blocks/gallery/cloudinary-gallery.tsx
import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import type { PAGE_QUERYResult } from "@/sanity.types";

import CloudinaryCarouselClient, {
  type CloudinaryCarouselImage,
} from "./cloudinary-carousel-client";

const DEVELOPMENT_PORT = process.env.PORT || process.env.NEXT_PUBLIC_PORT || "3000";

type CloudinaryApiImage = {
  url: string;
  public_id: string;
  alt: string;
  width: number;
  height: number;
  created_at: string;
};

const parseTimestamp = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
};

const buildFallbackAlt = (publicId: string) => {
  const filename = publicId.split("/").pop() ?? publicId;
  const cleaned = filename.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : publicId;
};

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type CloudinaryGalleryBlock = Extract<Block, { _type: "cloudinary-gallery" }>;

type CloudinaryGalleryImageOverride = NonNullable<
  CloudinaryGalleryBlock["images"]
>[number];

async function fetchGalleryImages(folderPrefix: string | null) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const baseUrl = siteUrl
    ? siteUrl.replace(/\/$/, "")
    : process.env.NODE_ENV === "development"
    ? `http://localhost:${DEVELOPMENT_PORT}`
    : vercelUrl
    ? `https://${vercelUrl}`
    : "http://localhost:3000";

  const url = folderPrefix
    ? `${baseUrl}/api/images?prefix=${encodeURIComponent(folderPrefix)}`
    : `${baseUrl}/api/images`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Cloudinary images:", response.statusText);
      return [] as CloudinaryApiImage[];
    }

    const data = (await response.json()) as CloudinaryApiImage[];
    return data;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [] as CloudinaryApiImage[];
  }
}

const sanitizeString = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const cleaned = stegaClean(value);
  if (typeof cleaned !== "string") {
    return null;
  }

  return cleaned.trim().length > 0 ? cleaned.trim() : null;
};

const buildOverridesMap = (
  overrides: CloudinaryGalleryImageOverride[]
): Map<string, CloudinaryGalleryImageOverride> => {
  return overrides.reduce((acc, override) => {
    if (!override?.cloudinaryPublicId) {
      return acc;
    }

    const publicId = sanitizeString(override.cloudinaryPublicId);
    if (!publicId) {
      return acc;
    }

    acc.set(publicId, override);
    return acc;
  }, new Map<string, CloudinaryGalleryImageOverride>());
};

const applyOverrides = (
  apiImage: CloudinaryApiImage,
  override: CloudinaryGalleryImageOverride | undefined,
  fallbackIndex: number
): CloudinaryCarouselImage => {
  const overrideAlt = sanitizeString(override?.alt);
  const overrideCaption = sanitizeString(override?.caption);
  const overrideUrl = sanitizeString(override?.overrideUrl);
  const createdAtOverride = sanitizeString(override?.createdAtOverride);

  return {
    id: override?._key ?? `${apiImage.public_id}-${fallbackIndex}`,
    url: overrideUrl ?? apiImage.url,
    alt: overrideAlt ?? apiImage.alt ?? buildFallbackAlt(apiImage.public_id),
    caption: overrideCaption ?? undefined,
    width: override?.widthOverride ?? apiImage.width,
    height: override?.heightOverride ?? apiImage.height,
    createdAt: createdAtOverride ?? apiImage.created_at ?? null,
  };
};

export default async function CloudinaryGallery(block: CloudinaryGalleryBlock) {
  const color = stegaClean(block.colorVariant);
  const cleanHeading = block.heading ? stegaClean(block.heading) : null;
  const cleanIntro = block.intro ? stegaClean(block.intro) : null;
  const order = stegaClean(block.dateOrder) === "asc" ? "asc" : "desc";
  const folderPrefix = (() => {
    const raw = sanitizeString(block.folderPrefix);

    if (!raw) {
      return null;
    }

    const trimmed = raw.replace(/^\/+/, "").replace(/\/+$/, "");

    return trimmed.length > 0 ? trimmed : null;
  })();

  const apiImages = await fetchGalleryImages(folderPrefix);
  const apiImagesById = new Map(apiImages.map((image) => [image.public_id, image]));

  const blockImages = Array.isArray(block.images) ? block.images : [];
  const overrideMap = buildOverridesMap(blockImages as CloudinaryGalleryImageOverride[]);

  const baseApiImages = folderPrefix
    ? apiImages
    : blockImages
        .map((image) => {
          if (!image?.cloudinaryPublicId) {
            return null;
          }

          const publicId = sanitizeString(image.cloudinaryPublicId);

          if (!publicId) {
            return null;
          }

          const apiImage = apiImagesById.get(publicId);

          if (!apiImage) {
            console.warn(`Cloudinary image not found for public ID: ${publicId}`);
            return null;
          }

          return apiImage;
        })
        .filter((image): image is CloudinaryApiImage => Boolean(image));

  const galleryImages = baseApiImages.map((apiImage, index) => {
    const override = overrideMap.get(apiImage.public_id);
    return applyOverrides(apiImage, override, index);
  });

  const sortedImages = [...galleryImages].sort((a, b) => {
    const aTime = parseTimestamp(a.createdAt);
    const bTime = parseTimestamp(b.createdAt);

    if (aTime !== null && bTime !== null) {
      return order === "asc" ? aTime - bTime : bTime - aTime;
    }

    if (aTime !== null) {
      return order === "asc" ? -1 : 1;
    }

    if (bTime !== null) {
      return order === "asc" ? 1 : -1;
    }

    return a.id.localeCompare(b.id);
  });

  if (sortedImages.length === 0) {
    if (folderPrefix) {
      console.warn(
        `Cloudinary gallery folder "${folderPrefix}" did not return any images.`
      );
    }

    return null;
  }

  return (
    <SectionContainer
      color={color}
      padding={block.padding}
      enableFadeIn={block.enableFadeIn}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        {(cleanHeading || cleanIntro) && (
          <div className="max-w-3xl text-center">
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
        <div className="w-full max-w-5xl">
          <CloudinaryCarouselClient images={sortedImages} />
        </div>
      </div>
    </SectionContainer>
  );
}
