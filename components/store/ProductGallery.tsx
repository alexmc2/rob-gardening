"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0] ?? null;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card p-4">
        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-background">
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.alt ?? "Product image"}
              fill
              sizes="(min-width: 1280px) 35vw, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover"
              placeholder={activeImage.blurDataURL ? "blur" : undefined}
              blurDataURL={activeImage.blurDataURL ?? undefined}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
              Image coming soon
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                type="button"
                key={`${image.url}-${index}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 border-transparent bg-background p-1 transition hover:border-primary/40",
                  isActive && "border-primary"
                )}
                aria-label={image.alt ? `View ${image.alt}` : `View image ${index + 1}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={image.url}
                    alt={image.alt ?? "Product thumbnail"}
                    fill
                    sizes="120px"
                    className="h-full w-full object-cover"
                    placeholder={image.blurDataURL ? "blur" : undefined}
                    blurDataURL={image.blurDataURL ?? undefined}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
