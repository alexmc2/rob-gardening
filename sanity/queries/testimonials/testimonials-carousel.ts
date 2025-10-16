// sanity/queries/testimonials/testimonials-carousel.ts
import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const testimonialsCarouselQuery = groq`
  _type == "testimonials-carousel" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionId,
    eyebrow,
    heading,
    intro,
    testimonials[]->{
      _id,
      name,
      title,
      rating,
      image{
        ${imageQuery}
      },
      body[]{
        ${bodyQuery}
      },
    },
    cta {
      ${linkQuery}
    },
    ${fadeInQuery},
  }
`;
