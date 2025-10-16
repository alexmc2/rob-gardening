// sanity/queries/shop.ts
import { groq } from "next-sanity";

export const SHOP_PRESENCE_QUERY = groq`
  {
    "hasShop": count(*[_type == "page" && count(blocks[_type == "shop-browser"]) > 0]) > 0
  }
`;
