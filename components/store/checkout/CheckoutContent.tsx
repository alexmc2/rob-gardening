"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/store/CartProvider";
import Price, { formatPrice } from "@/components/store/Price";
import { cn } from "@/lib/utils";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

const shippingOptions = [
  {
    id: "standard",
    label: "Standard delivery",
    description: "Royal Mail 3-5 working days",
    amount: 500,
  },
  {
    id: "express",
    label: "Express delivery",
    description: "Next working day (order by 12pm)",
    amount: 1500,
  },
  {
    id: "collect",
    label: "Click & collect",
    description: "Free collection from our studio",
    amount: 0,
  },
] as const;

const checkoutSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters" })
    .max(32)
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  company: z.string().max(120).optional().or(z.literal("")),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: z.string().max(120).optional().or(z.literal("")),
  city: z.string().min(1, { message: "Town or city is required" }),
  region: z.string().max(120).optional().or(z.literal("")),
  postalCode: z.string().min(3, { message: "Postcode is required" }),
  country: z
    .string()
    .min(2, { message: "Use a 2 letter ISO country code" })
    .max(2, { message: "Use a 2 letter ISO country code" })
    .transform((value) => value.toUpperCase()),
  notes: z.string().max(500).optional().or(z.literal("")),
  shippingMethod: z.enum([
    shippingOptions[0].id,
    shippingOptions[1].id,
    shippingOptions[2].id,
  ]),
  paymentProvider: z.enum(["stripe", "paypal"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutPayload = {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  shippingOption: (typeof shippingOptions)[number];
  notes?: string;
};

const formatCurrency = (value: number) => formatPrice(value) ?? "£0.00";

function ShippingRadio({
  option,
  field,
  checked,
  disabled,
}: {
  option: (typeof shippingOptions)[number];
  field: ControllerRenderProps<CheckoutFormValues, "shippingMethod">;
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition",
        checked
          ? "border-primary bg-primary/5"
          : "border-border/70 hover:border-border",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            className="sr-only"
            value={option.id}
            checked={checked}
            onChange={() => field.onChange(option.id)}
            disabled={disabled}
          />
          <span className="text-sm font-semibold text-foreground">
            {option.label}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {option.amount === 0
            ? "Free"
            : formatCurrency(option.amount)}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {option.description}
      </span>
    </label>
  );
}

export default function CheckoutContent() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentProvider: stripePromise ? "stripe" : "paypal",
      shippingMethod: shippingOptions[0].id,
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      region: "",
      postalCode: "",
      country: "GB",
      notes: "",
    },
    mode: "onBlur",
  });

  const watchedShippingMethod = form.watch("shippingMethod");
  const watchedPaymentProvider = form.watch("paymentProvider");

  const shippingOption = useMemo(() => {
    return (
      shippingOptions.find((option) => option.id === watchedShippingMethod) ??
      shippingOptions[0]
    );
  }, [watchedShippingMethod]);

  const lineItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
    [items]
  );

  const itemTotal = subtotal;

  const orderTotal = itemTotal + shippingOption.amount;

  const buildPayload = (values: CheckoutFormValues): CheckoutPayload => ({
    items: lineItems,
    customer: {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone ? values.phone : undefined,
    },
    shippingAddress: {
      firstName: values.firstName,
      lastName: values.lastName,
      company: values.company || undefined,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || undefined,
      city: values.city,
      region: values.region || undefined,
      postalCode: values.postalCode,
      country: values.country,
    },
    shippingOption,
    notes: values.notes || undefined,
  });

  const handleStripeCheckout = async (values: CheckoutFormValues) => {
    if (!stripePromise) {
      toast.error("Stripe is not configured. Please use PayPal instead.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload(values);
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message ?? "Unable to start Stripe checkout");
      }

      const data = (await response.json()) as { sessionId?: string };
      if (!data.sessionId) {
        throw new Error("Stripe session could not be created");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialise");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Stripe checkout failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalCreateOrder = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Please review your details before continuing");
      throw new Error("invalid_form");
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      throw new Error("cart_empty");
    }

    setIsSubmitting(true);

    try {
      const values = form.getValues();
      const payload = buildPayload(values);

      const response = await fetch("/api/checkout/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message ?? "Unable to create PayPal order");
      }

      const data = (await response.json()) as { orderId?: string };

      if (!data.orderId) {
        throw new Error("PayPal order could not be created");
      }

      setPaypalOrderId(data.orderId);
      return data.orderId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "PayPal order failed";
      toast.error(message);
      setIsSubmitting(false);
      throw error;
    }
  };

  const handlePayPalApprove = async (orderId: string) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message ?? "Unable to capture PayPal payment");
      }

      clear();
      router.push(`/checkout/success?provider=paypal&orderId=${orderId}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "PayPal capture could not be completed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasCartItems = items.length > 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Checkout
        </h1>
        <p className="text-base text-muted-foreground">
          Secure your order with Stripe or PayPal. Shipping and billing details
          are required before we can process your payment.
        </p>
      </div>

      {!hasCartItems ? (
        <Card className="rounded-2xl border border-border/60 bg-card p-10 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground">
              Add a few products before heading to checkout.
            </p>
            <Button asChild className="rounded-full px-6 py-3 text-base font-semibold">
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleStripeCheckout)}
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]"
          >
            <section className="space-y-6">
              <Card className="rounded-2xl border border-border/60">
                <CardHeader className="gap-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Contact details
                  </CardTitle>
                  <CardDescription>
                    We&apos;ll use this information to send your order updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/60">
                <CardHeader className="gap-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Shipping address
                  </CardTitle>
                  <CardDescription>
                    Orders ship from our UK studio. Enter a delivery address that can accept parcels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input autoComplete="given-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input autoComplete="family-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input autoComplete="organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address line 1</FormLabel>
                        <FormControl>
                          <Input autoComplete="address-line1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address line 2 (optional)</FormLabel>
                        <FormControl>
                          <Input autoComplete="address-line2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town / city</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-level2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County / region</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-level1" placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input autoComplete="postal-code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country (ISO)</FormLabel>
                          <FormControl>
                            <Input autoComplete="country" placeholder="GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/60">
                <CardHeader className="gap-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Order notes
                  </CardTitle>
                  <CardDescription>
                    Leave delivery instructions or anything else we should know.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Leave a note for our packing team"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </section>

            <aside className="space-y-6">
              <Card className="rounded-2xl border border-border/60">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Your order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.lineId}
                        className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/60 p-3"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                          {item.image?.url ? (
                            <Image
                              src={item.image.url}
                              alt={item.image.alt ?? item.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {item.title}
                              </p>
                              {item.variantOptions && item.variantOptions.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {item.variantOptions
                                    .map((option) => `${option.name}: ${option.value}`)
                                    .join(" · ")}
                                </p>
                              )}
                            </div>
                            <Price amount={item.price * item.quantity} className="text-sm font-semibold" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Qty {item.quantity}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatCurrency(itemTotal)}</span>
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <div className="space-y-3">
                          <span className="text-sm font-semibold text-foreground">
                            Shipping
                          </span>
                          <div className="space-y-3">
                            {shippingOptions.map((option) => (
                              <ShippingRadio
                                key={option.id}
                                option={option}
                                field={field}
                                checked={field.value === option.id}
                                disabled={isSubmitting}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    />
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-base font-semibold text-foreground">
                      <span>Total</span>
                      <span>{formatCurrency(orderTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tax is included where applicable. Shipping costs are shown above.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-border/60">
                <CardHeader className="gap-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Payment method
                  </CardTitle>
                  <CardDescription>
                    Choose a provider to complete your purchase securely.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentProvider"
                    render={({ field }) => (
                      <div className="flex flex-col gap-3">
                        <label
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition",
                            field.value === "stripe"
                              ? "border-primary bg-primary/5"
                              : "border-border/70 hover:border-border",
                            !stripePromise && "pointer-events-none opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              value="stripe"
                              className="sr-only"
                              onChange={() => field.onChange("stripe")}
                              checked={field.value === "stripe"}
                              disabled={!stripePromise}
                            />
                            <span className="text-sm font-semibold text-foreground">
                              Stripe
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Pay with card, Apple Pay or Google Pay.
                          </span>
                        </label>

                        <label
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition",
                            field.value === "paypal"
                              ? "border-primary bg-primary/5"
                              : "border-border/70 hover:border-border",
                            !paypalClientId && "pointer-events-none opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              value="paypal"
                              className="sr-only"
                              onChange={() => field.onChange("paypal")}
                              checked={field.value === "paypal"}
                              disabled={!paypalClientId}
                            />
                            <span className="text-sm font-semibold text-foreground">
                              PayPal
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Checkout with your PayPal account in a few taps.
                          </span>
                        </label>
                      </div>
                    )}
                  />

                  {watchedPaymentProvider === "stripe" ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full justify-center rounded-full px-6 py-3 text-base font-semibold"
                    >
                      {isSubmitting ? "Redirecting to Stripe..." : "Pay with Stripe"}
                    </Button>
                  ) : null}

                  {watchedPaymentProvider === "paypal" && paypalClientId ? (
                    <div className="flex flex-col gap-3">
                      <PayPalScriptProvider
                        options={{
                          clientId: paypalClientId,
                          currency: "GBP",
                          intent: "capture",
                          components: "buttons",
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          disabled={isSubmitting}
                          createOrder={async () => handlePayPalCreateOrder()}
                          onApprove={async (data: { orderID?: string }) => {
                            if (!data.orderID) {
                              toast.error("PayPal order ID missing");
                              return;
                            }

                            await handlePayPalApprove(data.orderID);
                          }}
                          onError={(error: unknown) => {
                            const message =
                              error instanceof Error
                                ? error.message
                                : "PayPal checkout encountered an issue";
                            toast.error(message);
                            setIsSubmitting(false);
                          }}
                        />
                      </PayPalScriptProvider>
                      {paypalOrderId ? (
                        <p className="text-xs text-muted-foreground">
                          Order reference: {paypalOrderId}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {!stripePromise && watchedPaymentProvider === "stripe" ? (
                    <p className="text-xs text-destructive">
                      Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable Stripe.
                    </p>
                  ) : null}

                  {!paypalClientId && watchedPaymentProvider === "paypal" ? (
                    <p className="text-xs text-destructive">
                      Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable PayPal checkout.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </aside>
          </form>
        </Form>
      )}
    </div>
  );
}
