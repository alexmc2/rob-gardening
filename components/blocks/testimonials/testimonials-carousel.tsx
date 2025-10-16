// components/blocks/testimonials/testimonials-carousel.tsx
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';
import { StarRating } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button1';
import { FadeIn, type FadeInProps } from '@/components/ui/fade-in';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PAGE_QUERYResult } from '@/sanity.types';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { urlFor } from '@/sanity/lib/image';

const INDICATOR_MIN_ITEMS = 2;

type PageBlock = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
export type TestimonialsCarouselBlock = Extract<
  PageBlock,
  { _type: 'testimonials-carousel' }
>;
type TestimonialsCarouselLink = NonNullable<TestimonialsCarouselBlock['cta']>;
type TestimonialEntry = NonNullable<
  TestimonialsCarouselBlock['testimonials']
>[number];

function initialsFromName(name?: string | null): string {
  if (!name) return 'TT';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
    .padEnd(2, 'T')
    .slice(0, 2);
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialEntry }) {
  const name = testimonial.name ? stegaClean(testimonial.name) : 'Happy client';
  const title = testimonial.title ? stegaClean(testimonial.title) : null;
  const rating = testimonial.rating ?? 0;
  const body = testimonial.body ?? [];
  const image = testimonial.image ?? null;
  const avatarUrl = image ? urlFor(image).width(160).height(160).fit('crop').url() : null;

  return (
    <article className="flex h-full min-h-[320px] flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:min-h-[360px]">
      <header className="flex items-center gap-3 text-left">
        <Avatar className="size-12 bg-muted">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={`${name} profile picture`} />
          ) : null}
          <AvatarFallback>{initialsFromName(name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">{name}</p>
          {title ? (
            <p className="text-sm text-muted-foreground">{title}</p>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 text-left">
        {rating > 0 ? <StarRating rating={rating} /> : null}
        {body.length > 0 ? (
          <div className="line-clamp-6 text-base leading-relaxed text-muted-foreground md:line-clamp-8">
            <PortableTextRenderer value={body} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function TestimonialsCarousel(block: TestimonialsCarouselBlock) {
  const color = block.colorVariant ? stegaClean(block.colorVariant) : undefined;
  const padding = block.padding ?? undefined;
  const sectionId = block.sectionId ? stegaClean(block.sectionId) : undefined;
  const eyebrow = block.eyebrow ? stegaClean(block.eyebrow) : undefined;
  const heading = block.heading ? stegaClean(block.heading) : undefined;
  const intro = block.intro ? stegaClean(block.intro) : undefined;
  const testimonials = block.testimonials ?? [];
  const cta = block.cta ?? null;
  const ctaHref = cta?.href ? stegaClean(cta.href) : null;
  const ctaLabel = cta?.title ? stegaClean(cta.title) : 'Read more testimonials';
  const ctaTarget = cta?.target ? '_blank' : undefined;
  const buttonVariant = cta?.buttonVariant
    ? (stegaClean(cta.buttonVariant) as TestimonialsCarouselLink['buttonVariant'])
    : 'default';

  const hasCarousel = testimonials.length > 0;
  const disableFade = block.enableFadeIn === false;
  const FadeMaybe = (props: FadeInProps) => (
    <FadeIn {...props} disabled={disableFade} />
  );

  return (
    <SectionContainer
      color={color}
      padding={padding}
      id={sectionId}
      enableFadeIn={block.enableFadeIn}
      className="py-16 lg:py-24"
    >
      <FadeMaybe
        as="div"
        delay={120}
        className="mx-auto flex max-w-5xl flex-col gap-12 text-center"
      >
        <div className="space-y-6">
          {eyebrow ? (
            <FadeMaybe
              as="p"
              delay={160}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              {eyebrow}
            </FadeMaybe>
          ) : null}

          {heading ? (
            <FadeMaybe
              as="h2"
              delay={200}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {heading}
            </FadeMaybe>
          ) : null}

          {intro ? (
            <FadeMaybe
              delay={240}
              className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground"
            >
              {intro}
            </FadeMaybe>
          ) : null}
        </div>

        {hasCarousel ? (
          <FadeMaybe delay={320} className="relative">
            <Carousel
              className="mx-auto max-w-5xl"
              opts={{ loop: testimonials.length > 1 }}
            >
              <CarouselContent className="ml-0 gap-6 px-6 md:gap-8 md:px-8 lg:gap-10 lg:px-10">
                {testimonials.map((testimonial) => (
                  <CarouselItem
                    key={testimonial._id}
                    className="flex basis-full pl-0 md:basis-1/2 lg:basis-1/3"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {testimonials.length > 1 ? (
                <>
                  <CarouselPrevious className="hidden md:flex md:left-0 md:-translate-x-full" />
                  <CarouselNext className="hidden md:flex md:right-0 md:translate-x-full" />
                </>
              ) : null}
              {testimonials.length >= INDICATOR_MIN_ITEMS ? (
                <CarouselDots className="static mt-12 flex justify-center" />
              ) : null}
            </Carousel>
          </FadeMaybe>
        ) : (
          <FadeMaybe
            as="p"
            delay={320}
            className="mx-auto max-w-xl text-sm text-muted-foreground"
          >
            Testimonials are being gathered and will appear here soon.
          </FadeMaybe>
        )}

        {ctaHref ? (
          <FadeMaybe as="div" delay={400} className="flex justify-center">
            <Button asChild variant={buttonVariant ?? 'default'}>
              <Link
                href={ctaHref}
                target={ctaTarget}
                rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {ctaLabel}
              </Link>
            </Button>
          </FadeMaybe>
        ) : null}
      </FadeMaybe>
    </SectionContainer>
  );
}
