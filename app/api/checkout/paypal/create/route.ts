// app/api/checkout/paypal/create/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { createPayPalClient, paypal } from "@/lib/paypal";

export const runtime = "nodejs";

const currency = (process.env.PAYPAL_CURRENCY ?? "GBP").toUpperCase();

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
  try {
    const payload = checkoutRequestSchema.parse(await request.json());

    const itemsTotal = payload.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingTotal = payload.shippingOption.amount;
    const orderTotal = itemsTotal + shippingTotal;

    if (orderTotal <= 0) {
      return NextResponse.json(
        { message: "Order total must be greater than zero" },
        { status: 400 }
      );
    }

    const client = createPayPalClient();

    const createRequest = new paypal.orders.OrdersCreateRequest();
    createRequest.prefer("return=representation");
    createRequest.requestBody({
      intent: "CAPTURE",
      payer: {
        email_address: payload.customer.email,
        name: {
          given_name: payload.customer.firstName,
          surname: payload.customer.lastName,
        },
        address: {
          address_line_1: payload.shippingAddress.addressLine1,
          address_line_2: payload.shippingAddress.addressLine2,
          admin_area_2: payload.shippingAddress.city,
          admin_area_1: payload.shippingAddress.region,
          postal_code: payload.shippingAddress.postalCode,
          country_code: payload.shippingAddress.country.toUpperCase(),
        },
      },
      purchase_units: [
        {
          reference_id: payload.shippingOption.id,
          description: payload.notes,
          soft_descriptor: "Online Shop",
          amount: {
            currency_code: currency,
            value: (orderTotal / 100).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: (itemsTotal / 100).toFixed(2),
              },
              shipping: {
                currency_code: currency,
                value: (shippingTotal / 100).toFixed(2),
              },
            },
          },
          items: payload.items.map((item) => ({
            name: item.title.substring(0, 126),
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: currency,
              value: (item.price / 100).toFixed(2),
            },
          })),
          shipping: {
            name: {
              full_name: `${payload.shippingAddress.firstName} ${payload.shippingAddress.lastName}`,
            },
            address: {
              address_line_1: payload.shippingAddress.addressLine1,
              address_line_2: payload.shippingAddress.addressLine2,
              admin_area_2: payload.shippingAddress.city,
              admin_area_1: payload.shippingAddress.region,
              postal_code: payload.shippingAddress.postalCode,
              country_code: payload.shippingAddress.country.toUpperCase(),
            },
          },
        },
      ],
      application_context: {
        brand_name: process.env.PAYPAL_BRAND_NAME ?? "Online Shop",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
      },
    });

    const response = await client.execute(createRequest);

    const orderId = response.result?.id;

    if (!orderId) {
      throw new Error("PayPal did not return an order ID");
    }

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("PayPal order creation failed", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid checkout payload", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Unable to create PayPal order",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
