// app/api/checkout/paypal/capture/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { createPayPalClient, paypal } from "@/lib/paypal";

export const runtime = "nodejs";

const captureSchema = z.object({
  orderId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const { orderId } = captureSchema.parse(await request.json());

    const client = createPayPalClient();
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    const response = await client.execute(captureRequest);

    if (response.result?.status !== "COMPLETED") {
      throw new Error("PayPal order was not completed");
    }

    return NextResponse.json({ status: response.result.status });
  } catch (error) {
    console.error("PayPal capture failed", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid capture payload", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Unable to capture PayPal payment",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
