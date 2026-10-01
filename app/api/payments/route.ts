import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { genRef, jsonError } from '@/lib/api-helpers';
import { paymentMethod } from '@/lib/mappings';
import { initializePaystackTransaction } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.orderNo || !body?.method) {
      return jsonError('orderNo and method are required');
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNo: body.orderNo,
      },
    });

    if (!order) {
      return jsonError('Order not found', 404);
    }

    const amount = order.amountDue - order.amountPaid;

    if (amount <= 0) {
      return jsonError('This order has already been paid');
    }

    const method = paymentMethod.fromLabel(body.method);

    const reference = genRef('AVPAY');

    // Create the payment as PENDING.
    // It becomes VERIFIED only after Paystack confirms payment.
    await prisma.payment.create({
      data: {
        reference,
        orderId: order.id,
        amount,
        method,
        status: 'PENDING',
      },
    });

    try {
      const transaction = await initializePaystackTransaction({
        email: order.customerEmail,
        amount,
        reference,
        orderNo: order.orderNo,
        customerName: order.customerName,
        method,
      });

      return NextResponse.json({
        success: true,
        reference,
        amount,
        orderNo: order.orderNo,
        authorizationUrl: transaction.data.authorization_url,
        accessCode: transaction.data.access_code,
      });
    } catch (error) {
      console.error('Paystack initialization failed:', error);

      return jsonError(
        error instanceof Error
          ? error.message
          : 'Unable to initialize payment',
        500
      );
    }
  } catch (error) {
    console.error('Payment initialization error:', error);

    return jsonError('Unable to initialize payment', 500);
  }
}
