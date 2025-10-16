import ProductCard from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface ProductGridProps {
  products: ProductListItem[];
  columns?: number;
  showComparePrice?: boolean;
  showQuickView?: boolean;
  className?: string;
  layout?: "card" | "stacked";
}

const columnClasses: Record<number, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export default function ProductGrid({
  products,
  columns = 3,
  showComparePrice = true,
  showQuickView = false,
  className,
  layout = "card",
}: ProductGridProps) {
  if (!products.length) {
    return null;
  }

  const resolvedColumns = columnClasses[columns] ?? columnClasses[3];

  return (
    <div
      className={cn(
        "grid gap-8 sm:gap-10 xl:gap-12",
        resolvedColumns,
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          slug={product.slug}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          imageUrl={product.image?.url}
          imageAlt={product.image?.alt}
          blurDataURL={product.image?.blurDataURL}
          excerpt={product.excerpt}
          showComparePrice={showComparePrice}
          showQuickView={showQuickView}
          layout={layout}
        />
      ))}
    </div>
  );
}
