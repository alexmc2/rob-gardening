// app/(main)/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import PostHero from '@/components/blocks/post-hero';
import { BreadcrumbLink } from '@/types';
import PortableTextRenderer from '@/components/portable-text-renderer';
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from '@/sanity/lib/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();

  return posts.map((post) => ({
    slug: post.slug?.current,
  }));
}

type BlogPageParams = { slug: string };
type BlogPageParamsInput = Promise<BlogPageParams> | undefined;

const resolveParams = async (
  params: BlogPageParamsInput
): Promise<BlogPageParams> => {
  const resolved = await params;

  if (!resolved?.slug) {
    notFound();
  }

  return resolved;
};

export async function generateMetadata({
  params,
}: {
  params: BlogPageParamsInput;
}): Promise<Metadata> {
  const { slug } = await resolveParams(params);
  const post = await fetchSanityPostBySlug({ slug });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({ page: post, slug: `Blog/${slug}` });
}

export default async function PostPage({
  params,
}: {
  params: BlogPageParamsInput;
}) {
  const routeParams = await resolveParams(params);
  const post = await fetchSanityPostBySlug(routeParams);

  if (!post) {
    notFound();
  }

  const links: BreadcrumbLink[] = post
    ? [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Blog',
          href: '/blog',
        },
        {
          label: post.title as string,
          href: '#',
        },
      ]
    : [];

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs links={links} />
          <PostHero {...post} />
          {post.body && <PortableTextRenderer value={post.body} />}
        </article>
      </div>
    </section>
  );
}
