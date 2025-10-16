// components/blocks/product-grid.tsx
import { stegaClean } from "next-sanity";

import SectionContainer from "@/components/ui/section-container";
import ProductGrid from "@/components/store/ProductGrid";
import { fetchSanityProducts } from "@/sanity/lib/fetch";
import type { PAGE_QUERYResult } from "@/sanity.types";

type ProductGridBlockProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "product-grid" }
> & {
  enableFadeIn?: boolean | null;
};

export default async function ProductGridBlock({
  heading,
  description,
  padding,
  colorVariant,
  selection,
  displayOptions,
  enableFadeIn,
}: ProductGridBlockProps) {
  const mode = selection?.mode ? stegaClean(selection.mode) : "manual";
  const productIds = selection?.products
    ?.map((product) => product?._ref)
    .filter((ref): ref is string => Boolean(ref));
  const collectionEntry = selection?.collection;
  const collectionId =
    collectionEntry && typeof collectionEntry === "object" && "_id" in collectionEntry
      ? (collectionEntry._id as string | undefined)
      : undefined;

  if (mode === "manual" && (!productIds || productIds.length === 0)) {
    return (
      <SectionContainer
        color={colorVariant ? stegaClean(colorVariant) : undefined}
        padding={padding}
        enableFadeIn={enableFadeIn}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold text-foreground">No products selected</h2>
          <p className="text-sm text-muted-foreground">Choose products in Sanity or switch the block to use a collection.</p>
        </div>
      </SectionContainer>
    );
  }

  if (mode === "collection" && !collectionId) {
    return (
      <SectionContainer
        color={colorVariant ? stegaClean(colorVariant) : undefined}
        padding={padding}
        enableFadeIn={enableFadeIn}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold text-foreground">Select a collection</h2>
          <p className="text-sm text-muted-foreground">Pick a collection in Sanity to populate this grid or switch to manual mode.</p>
        </div>
      </SectionContainer>
    );
  }

  const products = await fetchSanityProducts({
    ids: mode === "manual" ? productIds : undefined,
    collectionId: mode === "collection" ? collectionId : undefined,
  });

  if (!products.length) {
    return (
      <SectionContainer
        color={colorVariant ? stegaClean(colorVariant) : undefined}
        padding={padding}
        enableFadeIn={enableFadeIn}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold text-foreground">No products found</h2>
          <p className="text-sm text-muted-foreground">Publish products in Sanity or adjust the block configuration to see items here.</p>
        </div>
      </SectionContainer>
    );
  }

  const cleanedHeading = heading ? stegaClean(heading) : null;
  const cleanedDescription = description ? stegaClean(description) : null;
  const color = colorVariant ? stegaClean(colorVariant) : undefined;
  const columns = displayOptions?.columns ?? 3;
  const showComparePrice = displayOptions?.showComparePrice ?? true;
  const showQuickView = displayOptions?.showQuickView ?? false;
  const cardLayoutOption = (displayOptions as { cardLayout?: string } | null)?.cardLayout;
  const layoutValue = cardLayoutOption ? stegaClean(cardLayoutOption) : undefined;
  const layout = layoutValue === "stacked" ? "stacked" : "card";

  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {(cleanedHeading || cleanedDescription) && (
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            {cleanedHeading && (
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {cleanedHeading}
              </h2>
            )}
            {cleanedDescription && (
              <p className="mt-3 text-base text-muted-foreground">
                {cleanedDescription}
              </p>
            )}
          </div>
        )}
        <ProductGrid
          products={products}
          columns={columns}
          showComparePrice={showComparePrice}
          showQuickView={showQuickView}
          layout={layout}
        />
      </div>
    </SectionContainer>
  );
}
