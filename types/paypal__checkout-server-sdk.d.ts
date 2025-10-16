// Minimal typings for @paypal/checkout-server-sdk used by the app
// Define only the surface our code relies upon to keep maintenance light.
declare module "@paypal/checkout-server-sdk" {
  export namespace core {
    class PayPalEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class SandboxEnvironment extends PayPalEnvironment {}
    class LiveEnvironment extends PayPalEnvironment {}

    interface PayPalRequest {
      prefer(value: string): void;
      requestBody(body: unknown): void;
    }

    class PayPalHttpClient {
      constructor(environment: PayPalEnvironment);
      execute<TResponse = any>(
        request: PayPalRequest
      ): Promise<{ result?: TResponse } & Record<string, unknown>>;
    }
  }

  export namespace orders {
    class OrdersCreateRequest implements core.PayPalRequest {
      prefer(value: string): void;
      requestBody(body: unknown): void;
    }

    class OrdersCaptureRequest implements core.PayPalRequest {
      constructor(orderId: string);
      prefer(value: string): void;
      requestBody(body: unknown): void;
    }
  }

  interface PayPalSdk {
    core: {
      PayPalHttpClient: typeof core.PayPalHttpClient;
      SandboxEnvironment: typeof core.SandboxEnvironment;
      LiveEnvironment: typeof core.LiveEnvironment;
    };
    orders: {
      OrdersCreateRequest: typeof orders.OrdersCreateRequest;
      OrdersCaptureRequest: typeof orders.OrdersCaptureRequest;
    };
  }

  const paypal: PayPalSdk;
  export default paypal;
}
