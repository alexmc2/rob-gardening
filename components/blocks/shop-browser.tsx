// components/blocks/shop-browser.tsx
import { stegaClean } from "next-sanity";

import ShopProducts from "@/components/store/ShopProducts";
import SectionContainer from "@/components/ui/section-container";
import { fetchSanityCollections, fetchSanityProducts } from "@/sanity/lib/fetch";
import type { PAGE_QUERYResult } from "@/sanity.types";
import type {
  ShopCollection,
  ShopEmptyStateContent,
  ShopGridOptions,
  ShopHeroSettings,
  ShopOverviewContent,
  ShopToolbarConfig,
} from "@/types/shop";

const cleanString = (value?: string | null) =>
  typeof value === "string" ? stegaClean(value) : value ?? null;

type ShopBrowserBlockProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "shop-browser" }
> & {
  enableFadeIn?: boolean | null;
};

const toId = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    if ("_ref" in value && typeof (value as { _ref?: unknown })._ref === "string") {
      return (value as { _ref: string })._ref;
    }

    if ("_id" in value && typeof (value as { _id?: unknown })._id === "string") {
      return (value as { _id: string })._id;
    }
  }

  return undefined;
};

const cleanOverview = (overview?: ShopOverviewContent | null): ShopOverviewContent | undefined => {
  if (!overview) {
    return undefined;
  }

  return {
    label: cleanString(overview.label),
    summaryTemplate: cleanString(overview.summaryTemplate),
  };
};

const cleanToolbar = (toolbar?: ShopToolbarConfig | null): ShopToolbarConfig | undefined => {
  if (!toolbar) {
    return undefined;
  }

  return {
    sortLabel: cleanString(toolbar.sortLabel),
    sortOptions:
      toolbar.sortOptions?.map((option) => ({
        _key: option?._key,
        label: cleanString(option?.label),
        value: option?.value ? (stegaClean(option.value) as typeof option.value) : option?.value ?? null,
      })) ?? undefined,
    views: toolbar.views
      ? {
          gridLabel: cleanString(toolbar.views.gridLabel),
          listLabel: cleanString(toolbar.views.listLabel),
        }
      : undefined,
  };
};

const cleanEmptyState = (
  emptyState?: ShopEmptyStateContent | null
): ShopEmptyStateContent | undefined => {
  if (!emptyState) {
    return undefined;
  }

  return {
    heading: cleanString(emptyState.heading),
    body: cleanString(emptyState.body),
  };
};

const cleanHero = (hero?: ShopHeroSettings | null): ShopHeroSettings | undefined => {
  if (!hero) {
    return undefined;
  }

  return {
    enabled: Boolean(hero.enabled),
    eyebrow: cleanString(hero.eyebrow),
    heading: cleanString(hero.heading),
    subheading: cleanString(hero.subheading),
  };
};

const cleanGridOptions = (
  grid?: ShopGridOptions | null
): ShopGridOptions | undefined => {
  if (!grid) {
    return undefined;
  }

  const layout = grid.layout ? stegaClean(grid.layout) : grid.layout;

  return {
    columns: typeof grid.columns === "number" ? grid.columns : null,
    showComparePrice:
      typeof grid.showComparePrice === "boolean" ? grid.showComparePrice : null,
    showQuickView:
      typeof grid.showQuickView === "boolean" ? grid.showQuickView : null,
    layout:
      layout === "card" || layout === "stacked"
        ? (layout as "card" | "stacked")
        : null,
  };
};

const sanitizeCollections = (
  collections: ShopCollection[],
  productIds: string[],
  keepEmpty: boolean
): ShopCollection[] => {
  if (!collections.length) {
    return [];
  }

  const validProductIds = new Set(productIds);

  const result: ShopCollection[] = [];

  collections.forEach((collection) => {
    const ids = collection.productIds.filter((id) => validProductIds.has(id));

    if (!ids.length && !keepEmpty) {
      return;
    }

    result.push({ ...collection, productIds: ids });
  });

  return result;
};

export default async function ShopBrowserBlock({
  hero,
  overview,
  toolbar,
  emptyState,
  selection,
  categoryFilters,
  padding,
  colorVariant,
  grid,
  enableFadeIn,
}: ShopBrowserBlockProps) {
  const selectionModeRaw = selection?.mode ? stegaClean(selection.mode) : "all";
  const selectionMode =
    selectionModeRaw === "manual" || selectionModeRaw === "collection"
      ? selectionModeRaw
      : "all";

  const productIds = (selection?.products ?? [])
    .map((product) => toId(product))
    .filter((id): id is string => Boolean(id));

  const selectedCollectionId = toId(selection?.collection);

  const products = await fetchSanityProducts({
    ids: selectionMode === "manual" ? productIds : undefined,
    collectionId:
      selectionMode === "collection" && selectedCollectionId
        ? selectedCollectionId
        : undefined,
  });

  const explicitCollectionIds = (categoryFilters ?? [])
    .map((value) => toId(value))
    .filter((id): id is string => Boolean(id));

  const collectionFetchIds = explicitCollectionIds.length
    ? explicitCollectionIds
    : selectionMode === "collection" && selectedCollectionId
      ? [selectedCollectionId]
      : undefined;

  const collectionsRaw = await fetchSanityCollections({ ids: collectionFetchIds });
  const collections = sanitizeCollections(
    collectionsRaw,
    products.map((product) => product.id),
    explicitCollectionIds.length > 0
  );

  const cleanedHero = cleanHero(hero);
  const cleanedOverview = cleanOverview(overview);
  const cleanedToolbar = cleanToolbar(toolbar);
  const cleanedEmptyState = cleanEmptyState(emptyState);
  const cleanedGrid = cleanGridOptions(grid);

  const showHero = Boolean(cleanedHero?.enabled);
  const heroEyebrow = showHero ? cleanedHero?.eyebrow : null;
  const heroHeading = showHero ? cleanedHero?.heading ?? "Shop" : null;
  const heroSubheading = showHero ? cleanedHero?.subheading : null;

  const color = colorVariant ? (stegaClean(colorVariant) as typeof colorVariant) : undefined;

  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div className="flex flex-col gap-12">
        {showHero && (
          <div className="mx-auto flex max-w-4xl flex-col gap-4 text-center">
            {heroEyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {heroEyebrow}
              </p>
            )}
            {heroHeading && (
              <h2 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                {heroHeading}
              </h2>
            )}
            {heroSubheading && (
              <p className="text-base text-muted-foreground sm:text-lg">{heroSubheading}</p>
            )}
          </div>
        )}

        <ShopProducts
          products={products}
          overview={cleanedOverview}
          toolbar={cleanedToolbar}
          emptyState={cleanedEmptyState}
          collections={collections}
          gridOptions={cleanedGrid}
        />
      </div>
    </SectionContainer>
  );
}
