import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError } from '@/lib/api-helpers';
import { orderStatus } from '@/lib/mappings';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const order = await prisma.order.findUnique({ where: { orderNo }, include: { vehicle: true, shipment: true } });
  if (!order) return jsonError('Order not found', 404);

  return NextResponse.json({
    orderNo: order.orderNo,
    vehicle: `${order.vehicle.brand} ${order.vehicle.model}`,
    price: order.vehiclePrice,
    paid: order.amountPaid,
    status: orderStatus.toLabel(order.status),
    customer: { name: order.customerName },
    tracking: {
      origin: order.shipment?.origin || 'Origin pending',
      destination: order.shipment?.destination || 'Tema, Ghana',
      vessel: order.shipment?.vessel || 'To be assigned',
      container: order.shipment?.container || 'Not assigned',
      eta: order.shipment?.eta ? order.shipment.eta.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'To be confirmed',
    },
  });
}
