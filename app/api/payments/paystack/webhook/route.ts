import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { completePaystackPayment } from '@/lib/complete-paystack-payment';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is not configured');

      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const rawBody = await req.text();

    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { message: 'Missing Paystack signature' },
        { status: 401 }
      );
    }

    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    const validSignature =
      hash.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      );

    if (!validSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event !== 'charge.success') {
      return NextResponse.json({ received: true });
    }

    const reference = event.data?.reference;

    if (!reference) {
      return NextResponse.json({ received: true });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
    });

    if (!payment) {
      console.error(
        `Paystack webhook received for unknown reference: ${reference}`
      );

      return NextResponse.json({ received: true });
    }

    // Verify directly with Paystack before giving the order value.
    const verification = await verifyPaystackTransaction(reference);

    if (
      verification.data.status !== 'success' ||
      verification.data.amount !== payment.amount * 100 ||
      verification.data.currency !== 'GHS'
    ) {
      console.error(
        `Paystack verification failed for reference ${reference}`
      );

      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    await completePaystackPayment(reference);

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error('Paystack webhook error:', error);

    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}