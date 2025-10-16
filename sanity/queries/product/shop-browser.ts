// sanity/queries/product/shop-browser.ts
import { groq } from "next-sanity";

import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const shopBrowserQuery = groq`
  _type == "shop-browser" => {
    _type,
    _key,
    hero {
      enabled,
      eyebrow,
      heading,
      subheading
    },
    overview {
      label,
      summaryTemplate
    },
    toolbar {
      sortLabel,
      sortOptions[]{
        _key,
        label,
        value
      },
      views {
        gridLabel,
        listLabel
      }
    },
    emptyState {
      heading,
      body
    },
    selection {
      mode,
      products[]{
        _key,
        _ref,
        _type
      },
      collection
    },
    categoryFilters[]{
      _key,
      _ref,
      _type
    },
    grid {
      columns,
      showComparePrice,
      showQuickView,
      cardLayout
    },
    padding,
    colorVariant,
    ${fadeInQuery}
  }
`;
