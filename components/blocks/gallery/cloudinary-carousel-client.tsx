// components/blocks/gallery/cloudinary-carousel-client.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi,
} from '@/components/ui/carousel';

export type CloudinaryCarouselImage = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  createdAt: string | null;
  caption?: string;
};

type CloudinaryCarouselClientProps = {
  images: CloudinaryCarouselImage[];
};

export default function CloudinaryCarouselClient({
  images,
}: CloudinaryCarouselClientProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  const handleNavigation = React.useCallback(
    (direction: 'prev' | 'next') => {
      if (!api) return;

      if (direction === 'prev') {
        api.scrollPrev();
      } else {
        api.scrollNext();
      }
    },
    [api]
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: 'center',
          loop: images.length > 1,
          skipSnaps: false,
          dragFree: false,
          duration: 40,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <figure className="relative flex h-[50vh] min-h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl p-2">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-contain"
                />
                {image.caption && (
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious
              className="left-2"
              onClick={() => handleNavigation('prev')}
            />
            <CarouselNext
              className="right-2"
              onClick={() => handleNavigation('next')}
            />
            {/* <CarouselDots className="-bottom-10" size="sm" /> */}
          </>
        )}
      </Carousel>
    </div>
  );
}
