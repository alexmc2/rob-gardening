// app/(main)/checkout/success/page.tsx
import type { Metadata } from "next";

import Breadcrumbs from "@/components/ui/breadcrumbs";
import { CheckoutSuccess } from "@/components/store/checkout";
import type { BreadcrumbLink } from "@/types";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for shopping with us. We will confirm dispatch shortly.",
};

const breadcrumbLinks: BreadcrumbLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Checkout", href: "/checkout" },
  { label: "Success", href: "/checkout/success" },
];

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const providerParam = params.provider;
  const orderIdParam = params.orderId;
  const sessionIdParam = params.session_id;

  const provider = Array.isArray(providerParam)
    ? providerParam[0]
    : providerParam ?? undefined;
  const orderId = Array.isArray(orderIdParam)
    ? orderIdParam[0]
    : orderIdParam ?? undefined;
  const sessionId = Array.isArray(sessionIdParam)
    ? sessionIdParam[0]
    : sessionIdParam ?? undefined;

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Breadcrumbs links={breadcrumbLinks} />
          <CheckoutSuccess provider={provider} orderId={orderId} sessionId={sessionId} />
        </div>
      </div>
    </section>
  );
}
