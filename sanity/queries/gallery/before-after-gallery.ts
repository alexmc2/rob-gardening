// sanity/queries/gallery/before-after-gallery.ts
import { groq } from "next-sanity";
import { imageQuery } from "@/sanity/queries/shared/image";
import { fadeInQuery } from "@/sanity/queries/shared/fade-in";

// @sanity-typegen-ignore
export const beforeAfterGalleryQuery = groq`
  _type == "before-after-gallery" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    intro,
    sliderSize,
    items[]{
      _key,
      title,
      description,
      beforeLabel,
      afterLabel,
      beforeImage{
        ${imageQuery},
        alt,
      },
      afterImage{
        ${imageQuery},
        alt,
      },
    },
    ${fadeInQuery},
  }
`;
