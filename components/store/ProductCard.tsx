'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';

import Price from '@/components/store/Price';
import { useCart } from '@/components/store/CartProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart, ShoppingCart } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  blurDataURL?: string | null;
  excerpt?: string | null;
  className?: string;
  background?: 'card' | 'muted' | 'secondary' | 'accent';
  showComparePrice?: boolean;
  showQuickView?: boolean;
  titleSize?: CSSProperties['fontSize'];
  titleWeight?: CSSProperties['fontWeight'];
  titleFont?: CSSProperties['fontFamily'];
  layout?: 'card' | 'stacked';
}

type CardBackground = NonNullable<ProductCardProps['background']>;

export default function ProductCard({
  id,
  title,
  slug,
  price,
  compareAtPrice,
  imageUrl,
  imageAlt,
  blurDataURL,
  excerpt,
  className,
  background = 'card',
  showComparePrice = true,
  showQuickView = false,
  titleSize,
  titleWeight,
  titleFont,
  layout = 'card',
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const hasCompare = Boolean(
    showComparePrice && compareAtPrice && compareAtPrice > price
  );
  const discountPercentage =
    hasCompare && compareAtPrice
      ? Math.max(
          1,
          Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        )
      : null;

  const image = imageUrl
    ? {
        url: imageUrl,
        alt: imageAlt ?? title,
        blurDataURL: blurDataURL ?? undefined,
      }
    : null;

  const handleAddToCart = () => {
    addItem(
      {
        id,
        slug,
        title,
        price,
        compareAtPrice: compareAtPrice ?? null,
        image,
      },
      1
    );
    openCart();
  };

  const toggleWishlist = () => {
    setWishlisted((value) => !value);
  };

  const backgroundVariants: Record<CardBackground, string> = {
    card: '',
    muted: '!bg-muted !text-foreground',
    secondary: '!bg-secondary !text-secondary-foreground',
    accent: '!bg-accent !text-accent-foreground',
  };

  const titleStyles: CSSProperties | undefined =
    titleSize || titleWeight || titleFont
      ? {
          ...(titleSize ? { fontSize: titleSize } : {}),
          ...(titleWeight ? { fontWeight: titleWeight } : {}),
          ...(titleFont ? { fontFamily: titleFont } : {}),
        }
      : undefined;

  const actionBar = (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-center gap-2 rounded-md bg-background/95 p-2 opacity-0 translate-y-6 ring-1 ring-border/40 shadow-sm transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100">
      {showQuickView && (
        <Button
          asChild
          variant="outline"
          size="icon"
          className="pointer-events-auto shrink-0"
          aria-label={`Quick view ${title}`}
        >
          <Link href={`/shop/${slug}`}>
            <Eye className="size-5" />
          </Link>
        </Button>
      )}

      <Button
        type="button"
        onClick={handleAddToCart}
        className="pointer-events-auto flex-1"
      >
        <ShoppingCart className="size-4" />
        Add to cart
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggleWishlist}
        aria-pressed={wishlisted}
        aria-label={
          wishlisted
            ? `Remove ${title} from wishlist`
            : `Save ${title} for later`
        }
        className={cn(
          'pointer-events-auto',
          wishlisted && 'border-primary bg-primary/10 text-primary'
        )}
      >
        <Heart
          className="size-5"
          strokeWidth={wishlisted ? 2.2 : 1.8}
          fill={wishlisted ? 'currentColor' : 'none'}
        />
      </Button>
    </div>
  );

  const renderMedia = (
    wrapperClass: string,
    imageSizes: string
  ) => (
    <div className={wrapperClass}>
      <Link
        href={`/shop/${slug}`}
        aria-label={`View ${title}`}
        className="absolute inset-0 z-10"
      />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? title}
          fill
          sizes={imageSizes}
          className="object-cover"
          placeholder={blurDataURL ? 'blur' : undefined}
          blurDataURL={blurDataURL ?? undefined}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          Image coming soon
        </div>
      )}

      {discountPercentage && (
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
          -{discountPercentage}%
        </span>
      )}

      {actionBar}
    </div>
  );

  if (layout === 'stacked') {
    return (
      <div className={cn('group relative flex w-full flex-col', className)}>
        {renderMedia(
          cn(
            'relative w-full aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm transition-shadow hover:shadow-md',
            backgroundVariants[background]
          ),
          '(min-width:1280px) 22vw, (min-width:768px) 33vw, 100vw'
        )}

        <div className="mt-3 flex flex-col gap-2 px-1">
          <h3
            className="text-lg font-semibold leading-tight text-foreground transition hover:text-primary"
            style={titleStyles}
          >
            <Link href={`/shop/${slug}`}>{title}</Link>
          </h3>
          {excerpt && (
            <p
              className="text-sm text-muted-foreground"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <Price amount={price} className="text-base font-semibold" />
            {hasCompare && (
              <Price
                amount={compareAtPrice}
                className="text-sm text-muted-foreground line-through"
              />
            )}
            {!showQuickView && (
              <Button asChild variant="ghost" className="ml-auto gap-1">
                <Link href={`/shop/${slug}`}>
                  View details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border border-border/60',
        backgroundVariants[background],
        className
      )}
    >
      {renderMedia(
        'relative flex min-h-[280px] w-full items-center justify-center overflow-hidden border-b border-border/60 bg-muted',
        '(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 90vw'
      )}

      <CardContent className="flex flex-1 flex-col gap-4 p-6 pt-5">
        <div className="flex flex-col gap-2">
          <h3
            className="text-xl font-semibold leading-tight text-foreground transition hover:text-primary"
            style={titleStyles}
          >
            <Link href={`/shop/${slug}`}>{title}</Link>
          </h3>
          {excerpt && (
            <p
              className="text-sm text-muted-foreground"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-baseline gap-3">
          <Price amount={price} className="text-2xl" />
          {hasCompare && (
            <Price
              amount={compareAtPrice}
              className="text-sm font-medium text-muted-foreground line-through"
            />
          )}
          {!showQuickView && (
            <Button asChild variant="default" className="ml-auto gap-1">
              <Link href={`/shop/${slug}`}>
                View details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
