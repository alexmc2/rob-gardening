// sanity/queries/gallery/cloudinary-gallery.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "@/sanity/queries/shared/fade-in";

// @sanity-typegen-ignore
export const cloudinaryGalleryQuery = groq`
  _type == "cloudinary-gallery" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    intro,
    folderPrefix,
    dateOrder,
    images[]{
      _key,
      cloudinaryPublicId,
      alt,
      caption,
      overrideUrl,
      widthOverride,
      heightOverride,
      createdAtOverride,
    },
    ${fadeInQuery},
  }
`;
