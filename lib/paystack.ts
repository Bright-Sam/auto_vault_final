const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;

  if (!key) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }

  return key;
}

export async function paystackRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Paystack request failed');
  }

  return data;
}

export async function initializePaystackTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  orderNo: string;
  customerName: string;
  method?: string;
}) {
  const channels =
    params.method === 'MOBILE_MONEY'
      ? ['mobile_money']
      : params.method === 'BANK_TRANSFER'
        ? ['bank_transfer']
        : params.method === 'CARD'
          ? ['card']
          : ['card', 'mobile_money', 'bank_transfer'];

  return paystackRequest<{
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,

      // AutoVault stores GHS as whole cedis.
      // Paystack expects the amount in pesewas.
      amount: Math.round(params.amount * 100),

      currency: 'GHS',
      reference: params.reference,
      channels,

      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paystack/callback`,

      metadata: JSON.stringify({
        orderNo: params.orderNo,
        customerName: params.customerName,
      }),
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<{
    status: boolean;
    message: string;
    data: {
      id: number;
      status: string;
      reference: string;
      amount: number;
      currency: string;
      channel: string;
      customer: {
        email: string;
      };
    };
  }>(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
  });
}