// app/(main)/checkout/page.tsx
import type { Metadata } from "next";

import Breadcrumbs from "@/components/ui/breadcrumbs";
import { CheckoutContent } from "@/components/store/checkout";
import type { BreadcrumbLink } from "@/types";

export const metadata: Metadata = {
  title: "Secure checkout",
  description:
    "Complete your order securely with Stripe or PayPal and track your delivery from dispatch.",
};

const breadcrumbLinks: BreadcrumbLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Checkout", href: "/checkout" },
];

export default function CheckoutPage() {
  return (
    <section>
      <div className="container py-16 xl:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <Breadcrumbs links={breadcrumbLinks} />
          <CheckoutContent />
        </div>
      </div>
    </section>
  );
}
