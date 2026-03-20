// src/lib/payment.ts
import SSLCommerz from 'sslcommerz'

const ss lc = new SSLCommerz({
  store_id: process.env.SSL_STORE_ID!,
  store_passwd: process.env.SSL_STORE_PASSWORD!,
  is_sandbox: process.env.NODE_ENV === 'development',
})

export async function createPaymentSession(data: {
  amount: number
  currency: string
  order_id: string
  success_url: string
  fail_url: string
  cancel_url: string
}) {
  const response = await ss lc?.initiate(data)
  return response
}

export async function verifyPayment(trx_id: string) {
  const response = await ss lc?.validation({ val_id: trx_id, store_passwd: process.env.SSL_STORE_PASSWORD! })
  return response
}

