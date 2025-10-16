// components/blocks/all-posts.tsx
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import { fetchSanityPosts } from '@/sanity/lib/fetch';
import { PAGE_QUERYResult } from '@/sanity.types';
import PostGrid from '@/components/blog/PostGrid';

type AllPostsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'all-posts' }
>;

export default async function AllPosts({
  padding,
  colorVariant,
  enableFadeIn,
}: AllPostsProps) {
  const color = stegaClean(colorVariant);
  const posts = await fetchSanityPosts();

  return (
    <SectionContainer
      color={color}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <PostGrid posts={posts ?? []} />
    </SectionContainer>
  );
}
