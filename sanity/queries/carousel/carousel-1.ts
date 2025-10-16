// sanity/queries/carousel/carousel-1.ts
import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const carousel1Query = groq`
  _type == "carousel-1" => {
    _type,
    _key,
    padding,
    colorVariant,
    size,
    orientation,
    indicators,
    images[]{
      ${imageQuery}
    },
    ${fadeInQuery},
  }
`;
