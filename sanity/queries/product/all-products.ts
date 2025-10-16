// sanity/queries/product/all-products.ts
import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

export const productCardFields = `
  _id,
  title,
  slug,
  price,
  compareAtPrice,
  excerpt,
  images[]{
    ${imageQuery}
  }
`;

export const PRODUCTS_QUERY = groq`
  *[_type == "product" && defined(slug.current)] | order(orderRank asc) {
    ${productCardFields}
  }
`;

export const PRODUCTS_BY_IDS_QUERY = groq`
  *[_type == "product" && _id in $ids] | order(orderRank asc) {
    ${productCardFields}
  }
`;

export const COLLECTION_PRODUCTS_QUERY = groq`
  {
    "products": *[_type == "product" && references($collectionId)] | order(orderRank asc) {
      ${productCardFields}
    }
  }
`;

export const COLLECTIONS_QUERY = groq`
  *[_type == "collection"] | order(orderRank asc) {
    _id,
    title,
    slug,
    "productIds": *[_type == "product" && references(^._id)]._id
  }
`;

export const COLLECTIONS_BY_IDS_QUERY = groq`
  *[_type == "collection" && _id in $ids] | order(orderRank asc) {
    _id,
    title,
    slug,
    "productIds": *[_type == "product" && references(^._id)]._id
  }
`;
