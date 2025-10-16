// sanity/queries/gallery/image-gallery.ts
import { groq } from "next-sanity";
import { imageQuery } from "@/sanity/queries/shared/image";
import { fadeInQuery } from "@/sanity/queries/shared/fade-in";

// @sanity-typegen-ignore
export const imageGalleryQuery = groq`
  _type == "image-gallery" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    intro,
    desktopColumns,
    dateOrder,
    images[]{
      ${imageQuery},
      alt,
      caption,
    },
    ${fadeInQuery},
  }
`;
