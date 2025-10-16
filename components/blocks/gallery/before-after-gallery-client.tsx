// components/blocks/gallery/before-after-gallery-client.tsx
'use client';

import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowLeftRight } from 'lucide-react';

export type BeforeAfterGalleryImage = {
  src: string;
  alt: string;
  blurDataUrl: string | null;
  width: number;
  height: number;
};

export type BeforeAfterGalleryItem = {
  id: string;
  title: string | null;
  description: string | null;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: BeforeAfterGalleryImage;
  afterImage: BeforeAfterGalleryImage;
};

type BeforeAfterGalleryClientProps = {
  items: BeforeAfterGalleryItem[];
  maxHeight?: number;
};

export default function BeforeAfterGalleryClient({
  items,
  maxHeight,
}: BeforeAfterGalleryClientProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-14">
      {items.map((item) => (
        <BeforeAfterCard key={item.id} item={item} maxHeight={maxHeight} />
      ))}
    </div>
  );
}

type BeforeAfterCardProps = {
  item: BeforeAfterGalleryItem;
  maxHeight?: number;
};

function BeforeAfterCard({ item, maxHeight }: BeforeAfterCardProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  const aspectRatio =
    item.afterImage.width > 0 && item.afterImage.height > 0
      ? `${item.afterImage.width} / ${item.afterImage.height}`
      : undefined;

  const sizingStyle = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(typeof maxHeight === 'number' ? { maxHeight: `${maxHeight}px` } : {}),
  } satisfies CSSProperties;

  const comparisonLabel = item.title
    ? `${item.title} comparison`
    : `${item.beforeLabel} versus ${item.afterLabel}`;

  const titleId = item.title ? `${sliderId}-title` : undefined;
  const descriptionId = item.description ? `${sliderId}-description` : undefined;
  const describedBy = [titleId, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-6">
      {(item.title || item.description) && (
        <div className="space-y-2 text-center sm:text-left">
          {item.title && (
            <h3
              id={titleId}
              className="text-2xl font-semibold tracking-tight"
            >
              {item.title}
            </h3>
          )}
          {item.description && (
            <p
              id={descriptionId}
              className="text-base text-muted-foreground sm:text-lg"
            >
              {item.description}
            </p>
          )}
        </div>
      )}

      <div className="relative" style={sizingStyle}>
        <div className="relative overflow-hidden rounded-3xl bg-muted/60 shadow-lg focus-within:ring-4 focus-within:ring-primary/35 focus-within:ring-offset-4 focus-within:ring-offset-background">
          <Image
            src={item.afterImage.src}
            alt={item.afterImage.alt}
            width={item.afterImage.width}
            height={item.afterImage.height}
            placeholder={item.afterImage.blurDataUrl ? 'blur' : undefined}
            blurDataURL={item.afterImage.blurDataUrl ?? undefined}
            className="h-full w-full object-cover"
            sizes="(min-width: 1280px) 900px, (min-width: 768px) 600px, 100vw"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={item.beforeImage.src}
              alt={item.beforeImage.alt}
              width={item.beforeImage.width}
              height={item.beforeImage.height}
              placeholder={item.beforeImage.blurDataUrl ? 'blur' : undefined}
              blurDataURL={item.beforeImage.blurDataUrl ?? undefined}
              className="h-full w-full object-cover"
              sizes="(min-width: 1280px) 900px, (min-width: 768px) 600px, 100vw"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 z-10 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${position}%` }}
            aria-hidden="true"
          >
            <span className="h-full w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
            <span className="relative mt-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white text-foreground shadow-lg">
              <ArrowLeftRight className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white shadow">
            {item.beforeLabel}
          </div>
          <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white shadow">
            {item.afterLabel}
          </div>

          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
            aria-label={`Adjust ${comparisonLabel}`}
            aria-describedby={describedBy}
          />
        </div>
      </div>
    </div>
  );
}
