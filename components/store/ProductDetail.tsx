'use client';

import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

import ProductGallery from '@/components/store/ProductGallery';
import VariantSelector from '@/components/store/VariantSelector';
import Price, { formatPrice } from '@/components/store/Price';
import { useCart } from '@/components/store/CartProvider';
import { Minus, Plus } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type {
  ProductDetail as ProductDetailType,
  ProductVariant,
} from '@/types/product';

interface ProductDetailProps {
  product: ProductDetailType;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, openCart } = useCart();
  const defaultVariant = useMemo(
    () => product.variants?.[0] ?? null,
    [product.variants]
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);

  const basePrice = product.price ?? 0;
  const variantPrice = selectedVariant?.priceOverride ?? null;
  const activePrice = variantPrice ?? basePrice;
  const hasCompare =
    product.compareAtPrice != null && product.compareAtPrice > activePrice;
  const discountPercentage =
    hasCompare && product.compareAtPrice
      ? Math.max(
          1,
          Math.round(
            ((product.compareAtPrice - activePrice) / product.compareAtPrice) *
              100
          )
        )
      : null;
  const savings =
    hasCompare && product.compareAtPrice
      ? product.compareAtPrice - activePrice
      : null;
  const availableStock = selectedVariant?.stock ?? product.stock ?? null;
  const isOutOfStock = availableStock !== null && availableStock <= 0;
  const slugLabel = product.slug ? product.slug.toUpperCase() : 'PRODUCT';

  const descriptionHasContent = Boolean(
    product.body && product.body.length > 0
  );

  useEffect(() => {
    setSelectedVariant(defaultVariant);
    setQuantity(1);
  }, [defaultVariant, product.id]);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addItem(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: activePrice,
        compareAtPrice: product.compareAtPrice ?? null,
        image: product.images[0] ?? null,
        variant: selectedVariant,
      },
      quantity
    );
    openCart();
  };

  const portableComponents = useMemo<PortableTextComponents>(
    () => ({
      block: {
        normal: ({ children }) => (
          <p className="text-base leading-relaxed text-muted-foreground">
            {children}
          </p>
        ),
        h2: ({ children }) => (
          <h3 className="text-xl font-semibold text-foreground">{children}</h3>
        ),
        h3: ({ children }) => (
          <h4 className="text-lg font-semibold text-foreground">{children}</h4>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="ml-6 list-disc space-y-2 text-base text-muted-foreground">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="ml-6 list-decimal space-y-2 text-base text-muted-foreground">
            {children}
          </ol>
        ),
      },
      marks: {
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="text-foreground">{children}</em>,
      },
    }),
    []
  );

  return (
    <section className="flex flex-col gap-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
        <ProductGallery images={product.images} />

        <div className="flex flex-col gap-6 rounded-[34px] border border-border/60 bg-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              {slugLabel}
            </span>
            {discountPercentage && (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-destructive">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {product.title}
            </h1>
            {product.excerpt && (
              <p className="text-base text-muted-foreground">
                {product.excerpt}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-[26px] border border-border/60 bg-background p-5">
            <div className="flex flex-wrap items-end gap-4">
              <Price amount={activePrice} className="text-3xl" />
              {hasCompare && (
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <Price
                    amount={product.compareAtPrice}
                    className="text-base font-medium text-muted-foreground/80 line-through"
                  />
                  {savings ? (
                    <span className="text-xs uppercase tracking-wide">
                      Save {formatPrice(savings)}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
            {availableStock !== null && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                    availableStock > 0
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-destructive/10 text-destructive'
                  )}
                >
                  {availableStock > 0
                    ? `${availableStock} in stock`
                    : 'Currently unavailable'}
                </span>
              </div>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-col gap-4 rounded-[26px] border border-border/60 bg-background p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Choose your style
              </h2>
              <VariantSelector
                variants={product.variants}
                onVariantChange={setSelectedVariant}
              />
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-[26px] border border-border/60 bg-background p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background px-4 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[2ch] text-center text-base font-semibold">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  'flex-1 min-w-[180px] justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold',
                  isOutOfStock && 'cursor-not-allowed opacity-60'
                )}
              >
                {isOutOfStock ? 'Out of stock' : 'Add to cart'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Secure checkout. Tax included — shipping calculated at checkout.
            </p>
          </div>

          {product.meta?.description && (
            <div className="rounded-[26px] border border-border/60 bg-background p-5 text-sm text-muted-foreground">
              {product.meta.description}
            </div>
          )}
        </div>
      </div>

      {descriptionHasContent && (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-[34px] border border-border/60 bg-background p-8">
          <h2 className="text-2xl font-semibold text-foreground">Details</h2>
          <PortableText
            value={product.body ?? []}
            components={portableComponents}
          />
        </div>
      )}
    </section>
  );
}
