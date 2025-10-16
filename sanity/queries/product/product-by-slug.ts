// sanity/queries/product/product-by-slug.ts
import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

export const PRODUCT_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    price,
    compareAtPrice,
    stock,
    images[]{
      ${imageQuery}
    },
    body[]{
      ${bodyQuery}
    },
    variants[]{
      title,
      sku,
      priceOverride,
      stock,
      options[]{
        name,
        value
      }
    },
    meta_title,
    meta_description,
    noindex
  }
`;

export const PRODUCTS_SLUGS_QUERY = groq`
  *[_type == "product" && defined(slug.current)]{ slug }
`;
