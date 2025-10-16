// sanity/queries/section-header.ts
import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";
import { bodyQuery } from "./shared/body";
import { fadeInQuery } from "./shared/fade-in";

// @sanity-typegen-ignore
export const sectionHeaderQuery = groq`
  _type == "section-header" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionWidth,
    stackAlign,
    tagLine,
    title,
    description[]{
      ${bodyQuery}
    },
    link{
      ${linkQuery}
    },
    ${fadeInQuery},
  }
`;
