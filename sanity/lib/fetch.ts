// sanity/lib/fetch.ts
import { sanityFetch } from '@/sanity/lib/live';
import { urlFor } from '@/sanity/lib/image';
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from '@/sanity/queries/page';
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
import { SHOP_PRESENCE_QUERY } from '@/sanity/queries/shop';
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
} from '@/sanity/queries/post';
import {
  PRODUCTS_QUERY,
  PRODUCTS_BY_IDS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  COLLECTIONS_QUERY,
  COLLECTIONS_BY_IDS_QUERY,
} from '@/sanity/queries/product/all-products';
import {
  PRODUCT_QUERY,
  PRODUCTS_SLUGS_QUERY,
} from '@/sanity/queries/product/product-by-slug';
import type {
  PAGE_QUERYResult,
  PAGES_SLUGS_QUERYResult,
  POST_QUERYResult,
  POSTS_QUERYResult,
  POSTS_SLUGS_QUERYResult,
  NAVIGATION_QUERYResult,
  SETTINGS_QUERYResult,
} from '@/sanity.types';
import type {
  ProductDetail,
  ProductImage,
  ProductListItem,
  ProductOption,
  ProductVariant,
} from '@/types/product';
import type { ShopCollection } from '@/types/shop';

type SanityImageWithAsset = {
  alt?: string;
  asset?: {
    _id: string;
    url?: string;
    mimeType?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
};

type ProductOptionRaw = {
  name?: string;
  value?: string;
};

type ProductVariantRaw = {
  title?: string;
  sku?: string;
  priceOverride?: number;
  stock?: number;
  options?: ProductOptionRaw[];
};

type ProductCardRaw = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  price?: number;
  compareAtPrice?: number;
  images?: SanityImageWithAsset[];
};

type ProductDetailRaw = ProductCardRaw & {
  stock?: number;
  body?: any;
  variants?: ProductVariantRaw[];
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
};

const buildImage = (
  image?: SanityImageWithAsset | null
): ProductImage | null => {
  if (!image?.asset?._id) {
    return null;
  }

  const builder = urlFor(image);
  const isSvg = image.asset.mimeType === 'image/svg+xml';
  const url = (
    isSvg ? builder : builder.width(800).height(800).fit('crop')
  ).url();

  return {
    url,
    alt: image.alt ?? undefined,
    blurDataURL: image.asset.metadata?.lqip ?? undefined,
    width: image.asset.metadata?.dimensions?.width,
    height: image.asset.metadata?.dimensions?.height,
  };
};

const mapOptions = (
  options?: ProductOptionRaw[]
): ProductOption[] | undefined => {
  if (!options?.length) {
    return undefined;
  }

  const cleaned = options
    .filter((option): option is Required<ProductOptionRaw> =>
      Boolean(option?.name && option?.value)
    )
    .map((option) => ({
      name: option.name as string,
      value: option.value as string,
    }));

  return cleaned.length ? cleaned : undefined;
};

const mapVariants = (
  variants?: ProductVariantRaw[]
): ProductVariant[] | undefined => {
  if (!variants?.length) {
    return undefined;
  }

  const mapped = variants
    .filter(
      (
        variant
      ): variant is ProductVariantRaw & { title: string; sku: string } =>
        Boolean(variant?.title && variant?.sku)
    )
    .map((variant) => ({
      title: variant.title as string,
      sku: variant.sku as string,
      priceOverride: variant.priceOverride ?? null,
      stock: variant.stock ?? null,
      options: mapOptions(variant.options),
    }));

  return mapped.length ? mapped : undefined;
};

const mapProductListItem = (
  product?: ProductCardRaw | null
): ProductListItem | null => {
  if (!product) {
    return null;
  }

  const slug = product.slug?.current;

  if (!slug) {
    return null;
  }

  const primaryImage = buildImage(product.images?.[0]);

  return {
    id: product._id,
    title: product.title ?? 'Untitled product',
    slug,
    excerpt: product.excerpt ?? null,
    price: product.price ?? 0,
    compareAtPrice: product.compareAtPrice ?? null,
    image: primaryImage,
  };
};

const mapProductDetail = (
  product?: ProductDetailRaw | null
): ProductDetail | null => {
  if (!product) {
    return null;
  }

  const listItem = mapProductListItem(product);

  if (!listItem) {
    return null;
  }

  const gallery = product.images
    ?.map(buildImage)
    .filter(Boolean) as ProductImage[];

  return {
    ...listItem,
    images: gallery.length ? gallery : listItem.image ? [listItem.image] : [],
    stock: product.stock ?? null,
    body: product.body ?? undefined,
    variants: mapVariants(product.variants),
    meta: {
      title: product.meta_title ?? null,
      description: product.meta_description ?? null,
      noindex: product.noindex ?? null,
    },
  };
};

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<PAGE_QUERYResult> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async (): Promise<PAGES_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      perspective: 'published',
      stega: false,
    });

    return data;
  };

export const fetchSanityPosts = async (): Promise<POSTS_QUERYResult> => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });

  return data;
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<POST_QUERYResult> => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPostsStaticParams =
  async (): Promise<POSTS_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: POSTS_SLUGS_QUERY,
      perspective: 'published',
      stega: false,
    });

    return data;
  };

const mapProductCollection = (data: ProductCardRaw[] | null | undefined) =>
  (data ?? [])
    .map((item) => mapProductListItem(item))
    .filter((item): item is ProductListItem => Boolean(item));

type CollectionSummaryRaw = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  products?: Array<{ _ref?: string | null } | null> | null;
  productIds?: Array<string | null> | null;
};

const mapCollectionSummary = (
  collection?: CollectionSummaryRaw | null
): ShopCollection | null => {
  if (!collection?._id) {
    return null;
  }

  const productRefs =
    collection.products
      ?.map((item) => (item?._ref ? item._ref : null))
      .filter((ref): ref is string => Boolean(ref)) ?? [];

  const productIdsRaw =
    collection.productIds
      ?.map((value) => (typeof value === 'string' ? value : null))
      .filter((value): value is string => Boolean(value)) ?? [];

  const uniqueIds = Array.from(new Set([...productRefs, ...productIdsRaw]));

  return {
    id: collection._id,
    title: collection.title ?? 'Untitled collection',
    slug: collection.slug?.current ?? null,
    productIds: uniqueIds,
  };
};

const reorderByIds = (products: ProductListItem[], ids: string[]) => {
  const index = new Map(products.map((product) => [product.id, product]));
  return ids
    .map((id) => index.get(id))
    .filter((item): item is ProductListItem => Boolean(item));
};

export const fetchSanityProducts = async ({
  ids,
  collectionId,
}: {
  ids?: string[];
  collectionId?: string;
} = {}): Promise<ProductListItem[]> => {
  if (collectionId) {
    const { data } = await sanityFetch({
      query: COLLECTION_PRODUCTS_QUERY,
      params: { collectionId },
    });

    const collectionData = data as {
      products?: ProductCardRaw[] | null;
    } | null;
    return mapProductCollection(collectionData?.products);
  }

  if (ids && ids.length) {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_IDS_QUERY,
      params: { ids },
    });

    const mapped = mapProductCollection(
      data as ProductCardRaw[] | null | undefined
    );
    return reorderByIds(mapped, ids);
  }

  const { data } = await sanityFetch({
    query: PRODUCTS_QUERY,
  });

  return mapProductCollection(data as ProductCardRaw[] | null | undefined);
};

export const fetchSanityCollections = async ({
  ids,
}: { ids?: string[] } = {}): Promise<ShopCollection[]> => {
  const query =
    ids && ids.length ? COLLECTIONS_BY_IDS_QUERY : COLLECTIONS_QUERY;
  const params = ids && ids.length ? { ids } : undefined;

  const { data } = await sanityFetch({
    query,
    params,
  });

  return (
    (data as CollectionSummaryRaw[] | null | undefined)
      ?.map(mapCollectionSummary)
      .filter((collection): collection is ShopCollection =>
        Boolean(collection)
      ) ?? []
  );
};

export const fetchSanityProductBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<ProductDetail | null> => {
  const { data } = await sanityFetch({
    query: PRODUCT_QUERY,
    params: { slug },
  });

  return mapProductDetail(data as ProductDetailRaw | null);
};

export const fetchSanityProductsStaticParams = async (): Promise<
  Array<{ slug?: { current?: string } | null }>
> => {
  const { data } = await sanityFetch({
    query: PRODUCTS_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  });

  return (data as Array<{ slug?: { current?: string } | null }> | null) ?? [];
};

export const fetchSanityNavigation =
  async (): Promise<NAVIGATION_QUERYResult> => {
    const { data } = await sanityFetch({
      query: NAVIGATION_QUERY,
    });

    return data;
  };

export const fetchSanitySettings = async (): Promise<SETTINGS_QUERYResult> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
  });

  return data;
};

export const fetchSanityShopPresence = async (): Promise<boolean> => {
  const { data } = await sanityFetch({
    query: SHOP_PRESENCE_QUERY,
    perspective: 'published',
    stega: false,
  });

  return Boolean((data as { hasShop?: boolean | null } | null)?.hasShop);
};
