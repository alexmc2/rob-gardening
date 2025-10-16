// sanity/queries/rich-text-block.ts
import { groq } from "next-sanity";

import { bodyQuery } from "./shared/body";
import { fadeInQuery } from "./shared/fade-in";

// @sanity-typegen-ignore
export const richTextBlockQuery = groq`
  _type == "rich-text-block" => {
    _type,
    _key,
    padding,
    colorVariant,
    colorVariantDark,
    contentWidth,
    textAlign,
    fontFamily,
    fontSize,
    spacing,
    textColorVariant,
    body[]{
      ${bodyQuery}
    },
    ${fadeInQuery},
  }
`;
