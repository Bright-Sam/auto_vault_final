'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

function PaystackCallbackContent() {
  const searchParams = useSearchParams();

  const reference =
    searchParams.get('reference') ||
    searchParams.get('trxref');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'failed'
  >('loading');

  const [message, setMessage] = useState(
    'Verifying your payment...'
  );

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference was provided.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          '/api/payments/paystack/verify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reference,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message ||
              'Payment verification failed.'
          );
        }

        setStatus('success');
        setMessage(
          'Your payment has been verified successfully.'
        );
      } catch (error) {
        setStatus('failed');
        setMessage(
          error instanceof Error
            ? error.message
            : 'We could not verify your payment.'
        );
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === 'loading') {
    return (
      <main className="empty">
        <h1>Verifying payment…</h1>
        <p>{message}</p>
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="empty">
        <XCircle size={64} />

        <h1>Payment verification failed</h1>

        <p>{message}</p>

        <Link
          href="/account"
          className="btn primary"
        >
          Back to account
        </Link>
      </main>
    );
  }

  return (
    <main className="confirmation">
      <CheckCircle2 size={68} />

      <p className="eyebrow dark">
        PAYMENT CONFIRMED
      </p>

      <h1>Payment received.</h1>

      <p>{message}</p>

      <div className="orderConfirmation">
        <b>Payment reference</b>
        <span>{reference}</span>
      </div>

      <div className="actions">
        <Link
          href="/account"
          className="btn primary"
        >
          My account
        </Link>
      </div>
    </main>
  );
}

export default function PaystackCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="empty">
          <h1>Verifying payment…</h1>
          <p>Loading payment details...</p>
        </main>
      }
    >
      <PaystackCallbackContent />
    </Suspense>
  );
}