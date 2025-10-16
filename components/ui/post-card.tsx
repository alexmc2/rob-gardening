// components/ui/post-card.tsx
import { cn, formatDate } from '@/lib/utils';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { POSTS_QUERYResult } from '@/sanity.types';
import { Badge } from '@/components/ui/badge';

type PostCard = NonNullable<POSTS_QUERYResult[number]>;

interface PostCardProps extends Omit<PostCard, 'slug'> {
  className?: string;
}

export default function PostCard({
  className,
  title,
  excerpt,
  image,
  _createdAt,
  categories,
}: PostCardProps) {
  const formattedDate = _createdAt ? formatDate(_createdAt) : null;
  const categoryList = (categories ?? []).filter(
    (category): category is NonNullable<typeof category> => Boolean(category?.title)
  );

  return (
    <div
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary/10 hover:bg-background/70 hover:shadow-lg dark:border-border dark:bg-background/80 dark:text-foreground dark:hover:bg-background/60',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {image && image.asset?._id && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={urlFor(image).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw"
            />
          </div>
        )}
        {formattedDate && (
          <time
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            dateTime={_createdAt}
          >
            {formattedDate}
          </time>
        )}
        {categoryList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categoryList.map((category) => (
              <Badge key={category._id ?? category.title ?? ''} variant="secondary">
                {category.title}
              </Badge>
            ))}
          </div>
        )}
        {title && (
          <h3 className={cn('text-xl font-semibold leading-snug text-foreground dark:text-foreground')}>{title}</h3>
        )}
        {excerpt && (
          <p
            className="text-sm text-muted-foreground "
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
