"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/components/store/CartProvider";

interface CheckoutSuccessProps {
  provider?: string;
  orderId?: string;
  sessionId?: string;
}

const providerCopy: Record<string, { title: string; message: string }> = {
  paypal: {
    title: "Thanks for your PayPal order",
    message: "We've captured your payment and emailed the receipt to you.",
  },
  stripe: {
    title: "Thanks for your order",
    message: "Your payment is processing. A confirmation email will arrive shortly.",
  },
};

export default function CheckoutSuccess({
  provider,
  orderId,
  sessionId,
}: CheckoutSuccessProps) {
  const { clear } = useCart();
  const [hasCleared, setHasCleared] = useState(false);

  const key = provider?.toLowerCase() ?? "stripe";
  const copy = providerCopy[key] ?? providerCopy.stripe;

  const reference = useMemo(() => orderId ?? sessionId ?? null, [orderId, sessionId]);

  useEffect(() => {
    if (!hasCleared && (orderId || sessionId)) {
      clear();
      setHasCleared(true);
    }
  }, [clear, hasCleared, orderId, sessionId]);

  return (
    <Card className="rounded-3xl border border-border/60 bg-card">
      <CardHeader className="gap-2 text-center">
        <CardTitle className="text-3xl font-semibold text-foreground">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pb-12 text-center">
        <p className="max-w-xl text-base text-muted-foreground">{copy.message}</p>
        <p className="text-sm text-muted-foreground">
          {reference ? `Order reference: ${reference}` : "We'll be in touch with your order details."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6 py-3 text-base font-semibold">
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="rounded-full px-6 py-3 text-base font-semibold text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              Back to home
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
