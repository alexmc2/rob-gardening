// sanity/queries/timeline.ts
import { groq } from "next-sanity";
import { bodyQuery } from "./shared/body";
import { imageQuery } from "./shared/image";
import { fadeInQuery } from "./shared/fade-in";

// @sanity-typegen-ignore
export const timelineQuery = groq`
  _type == "timeline-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    timelines[]{
      title,
      tagLine,
      body[]{
        ${bodyQuery}
      },
    },
    ${fadeInQuery},
  }
`;
