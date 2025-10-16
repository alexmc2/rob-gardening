"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ProductGrid from "@/components/store/ProductGrid";
import Price from "@/components/store/Price";
import { useCart } from "@/components/store/CartProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutGrid, Rows, ShoppingCart } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";
import type {
  ShopCollection,
  ShopEmptyStateContent,
  ShopGridOptions,
  ShopOverviewContent,
  ShopSortValue,
  ShopToolbarConfig,
} from "@/types/shop";

const DEFAULT_OVERVIEW_LABEL = "Shop overview";
const DEFAULT_SUMMARY_TEMPLATE = "Showing {{showing}} of {{total}} products";
const DEFAULT_SORT_LABEL = "Sort by";
const DEFAULT_GRID_LABEL = "Grid";
const DEFAULT_LIST_LABEL = "List";
const DEFAULT_EMPTY_HEADING = "No products yet";
const DEFAULT_EMPTY_BODY =
  "Add products in Sanity to populate your shop. Once products are published, they will appear here automatically.";

const ALL_COLLECTION = "__all__";

const SORT_LABELS: Record<ShopSortValue, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "title-asc": "Alphabetical",
};

const DEFAULT_SORT_OPTIONS: Array<{ value: ShopSortValue; label: string }> = [
  { value: "featured", label: SORT_LABELS.featured },
  { value: "price-asc", label: SORT_LABELS["price-asc"] },
  { value: "price-desc", label: SORT_LABELS["price-desc"] },
  { value: "title-asc", label: SORT_LABELS["title-asc"] },
];

type SortComparatorKey = Exclude<ShopSortValue, "featured">;

const sortComparators: Record<SortComparatorKey, (a: ProductListItem, b: ProductListItem) => number> = {
  "price-asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
  "price-desc": (a, b) => (b.price ?? 0) - (a.price ?? 0),
  "title-asc": (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
};

const normaliseSortOptions = (toolbar?: ShopToolbarConfig | null) => {
  const configured = toolbar?.sortOptions ?? [];
  const seen = new Set<ShopSortValue>();
  const options: Array<{ value: ShopSortValue; label: string }> = [];

  configured?.forEach((option) => {
    const value = option?.value;

    if (!value || seen.has(value)) {
      return;
    }

    if (!(value in SORT_LABELS)) {
      return;
    }

    options.push({
      value,
      label: option.label?.trim() || SORT_LABELS[value],
    });
    seen.add(value);
  });

  if (!options.length) {
    return DEFAULT_SORT_OPTIONS;
  }

  if (!options.some((option) => option.value === "featured")) {
    options.unshift(DEFAULT_SORT_OPTIONS[0]);
  }

  return options;
};

const formatSummary = (template: string, showing: number, total: number) =>
  template
    .replace(/\{\{\s*showing\s*\}\}/gi, showing.toString())
    .replace(/\{\{\s*total\s*\}\}/gi, total.toString());

type ViewMode = "grid" | "list";

interface ShopProductsProps {
  products: ProductListItem[];
  overview?: ShopOverviewContent | null;
  toolbar?: ShopToolbarConfig | null;
  emptyState?: ShopEmptyStateContent | null;
  collections?: ShopCollection[] | null;
  gridOptions?: ShopGridOptions | null;
}

const filterCollections = (
  collections: ShopCollection[] | null | undefined,
  products: ProductListItem[]
): ShopCollection[] => {
  if (!collections?.length) {
    return [];
  }

  const productIds = new Set(products.map((product) => product.id));

  const result: ShopCollection[] = [];

  collections.forEach((collection) => {
    const ids = collection.productIds.filter((id) => productIds.has(id));

    if (ids.length) {
      result.push({ ...collection, productIds: ids });
    }
  });

  return result;
};

export default function ShopProducts({
  products,
  overview,
  toolbar,
  emptyState,
  collections,
  gridOptions,
}: ShopProductsProps) {
  const filteredCollections = useMemo(
    () => filterCollections(collections, products),
    [collections, products]
  );

  const [activeCollection, setActiveCollection] = useState<string>(ALL_COLLECTION);
  const [view, setView] = useState<ViewMode>("grid");
  const sortOptions = useMemo(() => normaliseSortOptions(toolbar), [toolbar]);
  const defaultSort = sortOptions[0]?.value ?? "featured";
  const [sort, setSort] = useState<ShopSortValue>(defaultSort);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!sortOptions.some((option) => option.value === sort)) {
      setSort(sortOptions[0]?.value ?? "featured");
    }
  }, [sort, sortOptions]);

  useEffect(() => {
    if (
      activeCollection !== ALL_COLLECTION &&
      !filteredCollections.some((collection) => collection.id === activeCollection)
    ) {
      setActiveCollection(ALL_COLLECTION);
    }
  }, [activeCollection, filteredCollections]);

  const filteredProducts = useMemo(() => {
    if (activeCollection === ALL_COLLECTION) {
      return products;
    }

    const selectedCollection = filteredCollections.find(
      (collection) => collection.id === activeCollection
    );

    if (!selectedCollection) {
      return products;
    }

    const ids = new Set(selectedCollection.productIds);

    return products.filter((product) => ids.has(product.id));
  }, [activeCollection, filteredCollections, products]);

  const sortedProducts = useMemo(() => {
    if (sort === "featured") {
      return filteredProducts;
    }

    const comparator = sortComparators[sort as SortComparatorKey];

    if (!comparator) {
      return filteredProducts;
    }

    return [...filteredProducts].sort(comparator);
  }, [filteredProducts, sort]);

  const totalCount = products.length;
  const showingCount = filteredProducts.length;

  const overviewLabel = overview?.label?.trim() || DEFAULT_OVERVIEW_LABEL;
  const summaryTemplate = overview?.summaryTemplate?.trim() || DEFAULT_SUMMARY_TEMPLATE;
  const summaryText = formatSummary(summaryTemplate, showingCount, totalCount);

  const sortLabel = toolbar?.sortLabel?.trim() || DEFAULT_SORT_LABEL;
  const currentSort = sortOptions.find((option) => option.value === sort) ?? {
    value: sort,
    label: SORT_LABELS[sort],
  };

  const gridLabel = toolbar?.views?.gridLabel?.trim() || DEFAULT_GRID_LABEL;
  const listLabel = toolbar?.views?.listLabel?.trim() || DEFAULT_LIST_LABEL;

  const emptyHeading = emptyState?.heading?.trim() || DEFAULT_EMPTY_HEADING;
  const emptyBody = emptyState?.body?.trim() || DEFAULT_EMPTY_BODY;
  const filteredEmptyBody =
    activeCollection === ALL_COLLECTION
      ? emptyBody
      : "There aren\u2019t any products in this collection yet. Try another filter.";

  const columns = gridOptions?.columns ?? 3;
  const showComparePrice = gridOptions?.showComparePrice ?? true;
  const showQuickView = gridOptions?.showQuickView ?? false;
  const layout = gridOptions?.layout === "stacked" ? "stacked" : "card";

  const handleAddToCart = (product: ProductListItem) => {
    const image = product.image
      ? {
          url: product.image.url,
          alt: product.image.alt ?? product.title,
          blurDataURL: product.image.blurDataURL ?? undefined,
        }
      : null;

    addItem(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        image,
      },
      1
    );
    openCart();
  };

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-muted/30 p-16 text-center">
        <h2 className="text-2xl font-semibold text-foreground">{emptyHeading}</h2>
        <p className="max-w-xl text-sm text-muted-foreground">{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {overviewLabel}
            </h2>
            <p className="text-sm text-muted-foreground">{summaryText}</p>
          </div>

          {filteredCollections.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={activeCollection === ALL_COLLECTION ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveCollection(ALL_COLLECTION)}
              >
                All
              </Button>
              {filteredCollections.map((collection) => (
                <Button
                  key={collection.id}
                  type="button"
                  size="sm"
                  variant={activeCollection === collection.id ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveCollection(collection.id)}
                >
                  {collection.title}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {collection.productIds.length}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>{sortLabel}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex items-center gap-2 rounded-full border-border/60 bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                >
                  <span>{currentSort.label}</span>
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {sortLabel}
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value as ShopSortValue)}
                  >
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                view === "grid"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="size-4" />
              {gridLabel}
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                view === "list"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={view === "list"}
            >
              <Rows className="size-4" />
              {listLabel}
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-muted/30 p-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground">{emptyHeading}</h2>
          <p className="max-w-xl text-sm text-muted-foreground">{filteredEmptyBody}</p>
        </div>
      ) : view === "grid" ? (
        <ProductGrid
          products={sortedProducts}
          columns={columns ?? 3}
          showComparePrice={showComparePrice ?? true}
          showQuickView={showQuickView ?? false}
          layout={layout}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {sortedProducts.map((product) => {
            const image = product.image;

            return (
              <article
                key={product.id}
                className="group flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md lg:flex-row lg:items-start"
              >
                <div className="relative w-full overflow-hidden rounded-2xl bg-muted shadow-sm lg:w-2/5">
                  <Link
                    href={`/shop/${product.slug}`}
                    aria-label={`View ${product.title}`}
                    className="absolute inset-0 z-10"
                  />
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? product.title}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover"
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      placeholder={image.blurDataURL ? "blur" : undefined}
                      blurDataURL={image.blurDataURL ?? undefined}
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center text-sm text-muted-foreground">
                      Image coming soon
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold leading-tight text-foreground transition hover:text-primary">
                      <Link href={`/shop/${product.slug}`}>{product.title}</Link>
                    </h3>
                    {product.excerpt && (
                      <p className="text-sm text-muted-foreground md:text-base">
                        {product.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3">
                    <Price amount={product.price} className="text-2xl" />
                    {product.compareAtPrice && product.compareAtPrice > product.price ? (
                      <Price
                        amount={product.compareAtPrice}
                        className="text-sm font-medium text-muted-foreground line-through"
                      />
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3">
                    <Button type="button" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="mr-2 size-4" />
                      Add to cart
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/shop/${product.slug}`}>View details</Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
