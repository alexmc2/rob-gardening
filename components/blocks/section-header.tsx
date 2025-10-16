// components/blocks/section-header.tsx
import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { FadeIn } from '@/components/ui/fade-in';
import { PAGE_QUERYResult } from '@/sanity.types';
import type { PortableTextBlock } from '@portabletext/types';

type SectionHeaderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'section-header' }
>;

export default function SectionHeader({
  padding,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  description,
  enableFadeIn,
}: SectionHeaderProps) {
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);
  const disableFade = enableFadeIn === false;

  const descriptionBlocks = Array.isArray(description)
    ? (description as PortableTextBlock[])
    : description
      ? ([
          {
            _type: 'block',
            _key: 'section-header-description',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'section-header-description-span',
                text: description,
                marks: [],
              },
            ],
          },
        ] satisfies PortableTextBlock[])
      : undefined;

  const showDescription = Boolean(descriptionBlocks?.length);
  const showTagLine = Boolean(tagLine);

  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div
        className={cn(
          align === 'center' ? 'max-w-[48rem] text-center mx-auto' : undefined,
          isNarrow ? 'max-w-[48rem] mx-auto' : undefined,
          'flex flex-col gap-4',
          color === 'primary' ? 'text-background' : undefined
        )}
      >
        {showTagLine ? (
          <FadeIn
            as="h1"
            delay={100}
            className="mt-0 mb-0 leading-[0]"
            disabled={disableFade}
          >
            <span className="text-base font-semibold">{tagLine}</span>
          </FadeIn>
        ) : null}
        {title ? (
          <FadeIn
            as="h2"
            delay={200}
            className="mt-0 mb-0 text-3xl md:text-5xl"
            disabled={disableFade}
          >
            {title}
          </FadeIn>
        ) : null}
        {showDescription ? (
          <FadeIn
            as="div"
            delay={300}
            className="text-base [&_p]:mt-0 [&_p:not(:last-child)]:mb-4 [&_a]:font-medium"
            disabled={disableFade}
          >
            <PortableTextRenderer value={descriptionBlocks ?? []} spacing="none" />
          </FadeIn>
        ) : null}
      </div>
    </SectionContainer>
  );
}
