import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { completePaystackPayment } from '@/lib/complete-paystack-payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.reference) {
      return NextResponse.json(
        { success: false, message: 'Reference is required' },
        { status: 400 }
      );
    }

    const reference = String(body.reference);

    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }

    const result = await verifyPaystackTransaction(reference);

    const transaction = result.data;

    // Verify the transaction belongs to this AutoVault payment.
    if (transaction.reference !== payment.reference) {
      return NextResponse.json(
        { success: false, message: 'Payment reference mismatch' },
        { status: 400 }
      );
    }

    // Paystack returns amount in pesewas.
    const expectedAmount = payment.amount * 100;

    if (transaction.amount !== expectedAmount) {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: 'FAILED',
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Payment amount does not match the order',
        },
        { status: 400 }
      );
    }

    if (transaction.currency !== 'GHS') {
      return NextResponse.json(
        {
          success: false,
          message: 'Unexpected payment currency',
        },
        { status: 400 }
      );
    }

    if (transaction.status !== 'success') {
      return NextResponse.json({
        success: false,
        status: transaction.status,
        message: 'Payment has not been completed',
      });
    }

    const completed = await completePaystackPayment(reference);

    return NextResponse.json({
      success: true,
      status: 'VERIFIED',
      orderNo: completed.orderNo,
      amount: completed.amount,
      alreadyProcessed: completed.alreadyProcessed,
    });
  } catch (error) {
    console.error('Paystack verification error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Payment verification failed',
      },
      { status: 500 }
    );
  }
}