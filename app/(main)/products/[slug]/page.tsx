// app/(main)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProductDetail from "@/components/store/ProductDetail";
import {
  fetchSanityProductBySlug,
  fetchSanityProductsStaticParams,
} from "@/sanity/lib/fetch";
import type { BreadcrumbLink } from "@/types";

const fallbackSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const defaultDescription =
  "Explore our curated selection of products made with care.";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const products = await fetchSanityProductsStaticParams();

  return products
    .map((product) => product.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await fetchSanityProductBySlug({ slug: params.slug });

  if (!product) {
    notFound();
  }

  const title = product.meta?.title ?? product.title ?? "Product";
  const description =
    product.meta?.description ?? product.excerpt ?? defaultDescription;
  const imageUrl = product.images[0]?.url ?? `${fallbackSiteUrl}/images/og-image.jpg`;
  const canonical = `/products/${params.slug}`;
  const robots = product.meta?.noindex ? "noindex" : "index, follow";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical,
    },
    robots,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await fetchSanityProductBySlug({ slug: params.slug });

  if (!product) {
    notFound();
  }

  const breadcrumbs: BreadcrumbLink[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.title, href: "#" },
  ];

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <Breadcrumbs links={breadcrumbs} />
          <ProductDetail product={product} />
        </div>
      </div>
    </section>
  );
}
