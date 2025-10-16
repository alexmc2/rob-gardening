'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import PostCard from '@/components/ui/post-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { POSTS_QUERYResult } from '@/sanity.types';

type Post = NonNullable<POSTS_QUERYResult[number]>;

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'category';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'category', label: 'Category A–Z' },
];

const getTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const getTitleValue = (value?: string | null) =>
  value?.toLocaleLowerCase('en-US') ?? '';

const getCategoryValue = (post: Post) =>
  post.categories
    ?.find((category): category is NonNullable<typeof category> =>
      Boolean(category?.title)
    )
    ?.title?.toLocaleLowerCase('en-US') ?? '';

const sortPosts = (posts: Post[], option: SortOption) => {
  const sorted = [...posts];

  switch (option) {
    case 'oldest':
      return sorted.sort(
        (a, b) => getTimestamp(a._createdAt) - getTimestamp(b._createdAt)
      );
    case 'title-asc':
      return sorted.sort((a, b) =>
        getTitleValue(a.title).localeCompare(getTitleValue(b.title))
      );
    case 'title-desc':
      return sorted.sort((a, b) =>
        getTitleValue(b.title).localeCompare(getTitleValue(a.title))
      );
    case 'category':
      return sorted.sort((a, b) => {
        const comparison = getCategoryValue(a).localeCompare(
          getCategoryValue(b)
        );

        if (comparison !== 0) {
          return comparison;
        }

        return getTimestamp(b._createdAt) - getTimestamp(a._createdAt);
      });
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => getTimestamp(b._createdAt) - getTimestamp(a._createdAt)
      );
  }
};

interface PostGridProps {
  posts: POSTS_QUERYResult;
}

export default function PostGrid({ posts }: PostGridProps) {
  const labelId = useId();
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const normalizedPosts = useMemo(
    () =>
      (posts ?? []).filter((post): post is Post =>
        Boolean(post?.slug?.current)
      ),
    [posts]
  );

  const sortedPosts = useMemo(
    () => sortPosts(normalizedPosts, sortOption),
    [normalizedPosts, sortOption]
  );

  if (normalizedPosts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 bg-background/50 p-10 text-center text-muted-foreground">
        No posts available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <span
          id={labelId}
          className="text-sm font-medium text-muted-foreground"
        >
          Sort by
        </span>
        <Select
          aria-labelledby={labelId}
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="sm:w-52" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug?.current}
            className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href={`/blog/${post.slug?.current}`}
          >
            <PostCard
              title={post.title ?? ''}
              excerpt={post.excerpt ?? ''}
              image={post.image ?? null}
              _createdAt={post._createdAt ?? ''}
              categories={post.categories ?? null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
