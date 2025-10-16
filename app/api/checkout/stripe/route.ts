// app/api/checkout/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export const runtime = "nodejs";

const fallbackSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const currency = (process.env.STRIPE_CURRENCY ?? "GBP").toLowerCase();

const cartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0),
});

const checkoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    region: z.string().optional(),
    postalCode: z.string(),
    country: z.string().min(2).max(2),
  }),
  shippingOption: z.object({
    id: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().int().min(0),
  }),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { message: "Stripe is not configured. Add STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  let parsedBody;

  try {
    const body = await request.json();
    parsedBody = checkoutRequestSchema.parse(body);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid checkout payload",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const shippingCountryRaw = parsedBody.shippingAddress.country.trim();

    if (!/^[A-Za-z]{2}$/.test(shippingCountryRaw)) {
      return NextResponse.json(
        {
          message: "Invalid shipping country code",
        },
        { status: 400 }
      );
    }

    const shippingCountryCode = shippingCountryRaw.toUpperCase() as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = parsedBody.items.map(
      (item) => ({
        quantity: item.quantity,
        price_data: {
          currency,
          product_data: {
            name: item.title,
          },
          unit_amount: item.price,
        },
      })
    );

    const metadata: Record<string, string> = {
      order_notes: parsedBody.notes ?? "",
      shipping_method: parsedBody.shippingOption.id,
      shipping_city: parsedBody.shippingAddress.city,
      shipping_country: shippingCountryCode,
    };

    const deliveryEstimate = (() => {
      switch (parsedBody.shippingOption.id) {
        case "express":
          return {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 2 },
          } as const;
        case "collect":
          return undefined;
        default:
          return {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          } as const;
      }
    })();

    const successUrlTemplate =
      process.env.STRIPE_SUCCESS_URL ??
      `${fallbackSiteUrl}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = process.env.STRIPE_CANCEL_URL ?? `${fallbackSiteUrl}/checkout`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsedBody.customer.email,
      line_items: lineItems,
      allow_promotion_codes: true,
      metadata,
      shipping_address_collection: {
        allowed_countries: [shippingCountryCode],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name:
              parsedBody.shippingOption.label ?? parsedBody.shippingOption.id,
            fixed_amount: {
              amount: parsedBody.shippingOption.amount,
              currency,
            },
            delivery_estimate: deliveryEstimate,
          },
        },
      ],
      success_url: successUrlTemplate,
      cancel_url: cancelUrl,
      phone_number_collection: { enabled: Boolean(parsedBody.customer.phone) },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      {
        message: "Unable to create Stripe checkout session",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
