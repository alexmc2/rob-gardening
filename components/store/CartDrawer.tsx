"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/CartProvider";
import Price, { formatPrice } from "@/components/store/Price";
import { Minus, Plus, Trash2 } from "@/lib/icons";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const {
    isOpen,
    items,
    subtotal,
    itemCount,
    removeItem,
    updateQuantity,
    clear,
    closeCart,
    openCart,
  } = useCart();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openCart();
    } else {
      closeCart();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg p-0">
        <SheetHeader className="border-b border-border/60 bg-background p-6">
          <div>
            <SheetTitle className="text-xl font-semibold">Shopping Cart</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {itemCount === 1 ? "1 item" : `${itemCount} items`}
            </p>
          </div>
        </SheetHeader>

        <div className="flex h-full flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Your cart is empty.
                </p>
                <p className="text-sm text-muted-foreground">
                  Browse our products and add your favourites to the cart.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li
                    key={item.lineId}
                    className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
                      {item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.alt ?? item.title}
                          fill
                          className="h-full w-full object-cover"
                          sizes="120px"
                          placeholder={item.image.blurDataURL ? "blur" : undefined}
                          blurDataURL={item.image.blurDataURL ?? undefined}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={closeCart}
                            className="text-base font-semibold text-foreground transition hover:text-primary"
                          >
                            {item.title}
                          </Link>
                          {item.variantOptions && item.variantOptions.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.variantOptions
                                .map((option) => `${option.name}: ${option.value}`)
                                .join(" · ")}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.lineId)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="min-w-[2ch] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <Price amount={item.price * item.quantity} className="text-base font-semibold" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SheetFooter className="border-t border-border/60 bg-background p-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal) ?? "£0.00"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className={cn(
                    "w-full justify-center rounded-full px-6 py-3 text-base font-semibold",
                    items.length === 0 && "pointer-events-none opacity-60"
                  )}
                >
                  <Link href="/checkout" aria-disabled={items.length === 0}>
                    Proceed to checkout
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clear}
                  disabled={items.length === 0}
                  className="justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear cart
                </Button>
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
