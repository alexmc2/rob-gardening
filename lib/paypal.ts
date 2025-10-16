import paypal from "@paypal/checkout-server-sdk";

type PayPalSdk = typeof paypal;

export type PayPalClient = InstanceType<
  PayPalSdk["core"]["PayPalHttpClient"]
>;

export function createPayPalClient(): PayPalClient {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const environmentName = process.env.PAYPAL_ENVIRONMENT?.toLowerCase();
  const environment =
    environmentName === "live"
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}

export { paypal };
