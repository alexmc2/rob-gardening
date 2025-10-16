// sanity/queries/split/split-cards-list.ts
import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const splitCardsListQuery = groq`
  _type == "split-cards-list" => {
    _type,
    _key,
    list[]{
      _key,
      image{
        ${imageQuery}
      },
      imageSize,
      imageShape,
      sizeBasis,
      tagLine,
      title,
      body[]{
        ${bodyQuery}
      },
    },
  }
`;
