// sanity/queries/all-posts.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "./shared/fade-in";

// @sanity-typegen-ignore
export const allPostsQuery = groq`
  _type == "all-posts" => {
    _type,
    _key,
    padding,
    colorVariant,
    ${fadeInQuery},
  }
`;
