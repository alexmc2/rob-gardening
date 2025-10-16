"use client";

import { cn } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number | null | undefined) {
  if (amount == null) {
    return null;
  }

  return formatter.format(amount / 100);
}

interface PriceProps {
  amount: number | null | undefined;
  className?: string;
}

export default function Price({ amount, className }: PriceProps) {
  const formatted = formatPrice(amount);

  if (!formatted) {
    return null;
  }

  return <span className={cn("font-semibold", className)}>{formatted}</span>;
}
