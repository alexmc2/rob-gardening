// types/product.ts
import type { PortableTextBlock } from "@portabletext/types";

export type ProductOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  title: string;
  sku: string;
  priceOverride?: number | null;
  stock?: number | null;
  options?: ProductOption[];
};

export type ProductImage = {
  url: string;
  alt?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  price: number;
  compareAtPrice?: number | null;
  image?: ProductImage | null;
};

export type ProductDetail = ProductListItem & {
  images: ProductImage[];
  stock?: number | null;
  body?: PortableTextBlock[];
  variants?: ProductVariant[];
  meta?: {
    title?: string | null;
    description?: string | null;
    noindex?: boolean | null;
  };
};
