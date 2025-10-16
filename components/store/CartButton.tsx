"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/CartProvider";
import { ShoppingCart } from "@/lib/icons";
import { cn } from "@/lib/utils";

type CartButtonProps = React.ComponentProps<typeof Button>;

export default function CartButton({ className, ...props }: CartButtonProps) {
  const { itemCount, toggleCart } = useCart();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleCart}
      className={cn(
        "relative rounded-full border-border bg-background text-foreground shadow-none",
        className
      )}
      aria-label="Open cart"
      {...props}
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
