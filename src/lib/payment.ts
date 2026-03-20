import { env } from "@/lib/env";

type PaymentSessionInput = {
  amount: number;
  currency: string;
  order_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  cus_name?: string;
  cus_email?: string;
  cus_phone?: string;
  cus_add1?: string;
  cus_city?: string;
  cus_country?: string;
};

type SSLCommerzClient = {
  initiate: (data: PaymentSessionInput) => Promise<unknown>;
  validation: (data: { val_id: string; store_passwd: string }) => Promise<unknown>;
};

const getSSLCommerzClient = async (): Promise<SSLCommerzClient | null> => {
  if (!env.SSL_STORE_ID || !env.SSL_STORE_PASSWORD) {
    return null;
  }

  const sslCommerzModule = await import("sslcommerz");
  const SSLCommerz = (sslCommerzModule.default ?? sslCommerzModule) as unknown as new (options: {
    store_id: string;
    store_passwd: string;
    is_sandbox: boolean;
  }) => SSLCommerzClient;

  return new SSLCommerz({
    store_id: env.SSL_STORE_ID,
    store_passwd: env.SSL_STORE_PASSWORD,
    is_sandbox: env.NODE_ENV !== "production",
  }) as SSLCommerzClient;
};

export const createPaymentSession = async (
  data: PaymentSessionInput
): Promise<unknown> => {
  const client = await getSSLCommerzClient();
  if (!client) {
    throw new Error("SSLCommerz is not configured");
  }

  return client.initiate(data);
};

export const verifyPayment = async (trx_id: string): Promise<unknown> => {
  const client = await getSSLCommerzClient();
  if (!client || !env.SSL_STORE_PASSWORD) {
    throw new Error("SSLCommerz is not configured");
  }

  return client.validation({
    val_id: trx_id,
    store_passwd: env.SSL_STORE_PASSWORD,
  });
};
