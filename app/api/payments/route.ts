import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { genRef, jsonError } from '@/lib/api-helpers';
import { paymentMethod } from '@/lib/mappings';

// Public: pays the full outstanding amount on an order in one shot, matching the original
// prototype checkout (deposit or full payment, whichever was chosen when the order was placed).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.orderNo || !body?.method) return jsonError('orderNo and method are required');

  const order = await prisma.order.findUnique({ where: { orderNo: body.orderNo } });
  if (!order) return jsonError('Order not found', 404);

  const amount = order.amountDue - order.amountPaid;
  if (amount <= 0) return jsonError('This order has already been paid');

  const reference = genRef('AVPAY');
  const method = paymentMethod.fromLabel(body.method);

  await prisma.payment.create({ data: { reference, orderId: order.id, amount, method, status: 'VERIFIED' } });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { amountPaid: { increment: amount }, status: order.status === 'PAYMENT_PENDING' ? 'VEHICLE_ALLOCATED' : order.status },
  });

  await prisma.invoice.upsert({
    where: { orderId: order.id },
    update: { paidAmount: updated.amountPaid, balance: Math.max(0, updated.vehiclePrice - updated.amountPaid) },
    create: {
      invoiceNo: `INV-${order.orderNo.replace('AV-', '')}`, orderId: order.id,
      totalAmount: updated.vehiclePrice, paidAmount: updated.amountPaid, balance: Math.max(0, updated.vehiclePrice - updated.amountPaid),
    },
  });

  return NextResponse.json({ reference, amount, orderNo: order.orderNo });
}
