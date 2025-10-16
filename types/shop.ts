// types/shop.ts
export type ShopSortValue = "featured" | "price-asc" | "price-desc" | "title-asc";

export interface ShopSortOption {
  _key?: string;
  label?: string | null;
  value?: ShopSortValue | null;
}

export interface ShopToolbarViews {
  gridLabel?: string | null;
  listLabel?: string | null;
}

export interface ShopToolbarConfig {
  sortLabel?: string | null;
  sortOptions?: ShopSortOption[] | null;
  views?: ShopToolbarViews | null;
}

export interface ShopHeroSettings {
  enabled?: boolean | null;
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
}

export interface ShopOverviewContent {
  label?: string | null;
  summaryTemplate?: string | null;
}

export interface ShopEmptyStateContent {
  heading?: string | null;
  body?: string | null;
}

export interface ShopCollection {
  id: string;
  title: string;
  slug?: string | null;
  productIds: string[];
}

export interface ShopGridOptions {
  columns?: number | null;
  showComparePrice?: boolean | null;
  showQuickView?: boolean | null;
  layout?: "card" | "stacked" | null;
}
