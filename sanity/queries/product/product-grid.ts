// sanity/queries/product/product-grid.ts
import { groq } from "next-sanity";

import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const productGridQuery = groq`
  _type == "product-grid" => {
    _type,
    _key,
    heading,
    description,
    padding,
    colorVariant,
    selection {
      mode,
      products[]{
        _key,
        _ref,
        _type
      },
      collection-> {
        _id,
        title,
        slug
      }
    },
    displayOptions {
      columns,
      showComparePrice,
      showQuickView,
      cardLayout
    },
    ${fadeInQuery}
  }
`;
