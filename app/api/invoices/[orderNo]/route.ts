import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError } from '@/lib/api-helpers';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const order = await prisma.order.findUnique({ where: { orderNo }, include: { vehicle: true, invoice: true } });
  if (!order) return jsonError('Order not found', 404);

  const paid = order.invoice?.paidAmount ?? order.amountPaid;
  const balance = order.invoice?.balance ?? Math.max(0, order.vehiclePrice - order.amountPaid);

  return NextResponse.json({
    invoiceNo: order.invoice?.invoiceNo || `INV-${order.orderNo.replace('AV-', '')}`,
    orderNo: order.orderNo,
    createdAt: order.createdAt,
    vehicle: `${order.vehicle.brand} ${order.vehicle.model}`,
    price: order.vehiclePrice,
    paid,
    balance,
    paymentStatus: paid >= order.vehiclePrice ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Pending',
    customer: { name: order.customerName, email: order.customerEmail, phone: order.customerPhone },
  });
}
