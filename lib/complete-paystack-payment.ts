import { prisma } from '@/lib/prisma';

export async function completePaystackPayment(reference: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: {
        reference,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Prevent duplicate fulfillment if both webhook
    // and callback try to process the same transaction.
    if (payment.status === 'VERIFIED') {
      return {
        alreadyProcessed: true,
        orderNo: payment.order.orderNo,
        amount: payment.amount,
      };
    }

    if (payment.status === 'FAILED') {
      throw new Error('Payment has already failed');
    }

    const claimed = await tx.payment.updateMany({
      where: {
        id: payment.id,
        status: 'PENDING',
      },
      data: {
        status: 'VERIFIED',
      },
    });

    if (claimed.count !== 1) {
      return {
        alreadyProcessed: true,
        orderNo: payment.order.orderNo,
        amount: payment.amount,
      };
    }

    const updatedOrder = await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        amountPaid: {
          increment: payment.amount,
        },
        status:
          payment.order.status === 'PAYMENT_PENDING'
            ? 'VEHICLE_ALLOCATED'
            : payment.order.status,
      },
    });

    await tx.invoice.upsert({
      where: {
        orderId: payment.orderId,
      },
      update: {
        paidAmount: updatedOrder.amountPaid,
        balance: Math.max(
          0,
          updatedOrder.vehiclePrice - updatedOrder.amountPaid
        ),
      },
      create: {
        invoiceNo: `INV-${updatedOrder.orderNo.replace('AV-', '')}`,
        orderId: updatedOrder.id,
        totalAmount: updatedOrder.vehiclePrice,
        paidAmount: updatedOrder.amountPaid,
        balance: Math.max(
          0,
          updatedOrder.vehiclePrice - updatedOrder.amountPaid
        ),
      },
    });

    return {
      alreadyProcessed: false,
      orderNo: updatedOrder.orderNo,
      amount: payment.amount,
    };
  });
}