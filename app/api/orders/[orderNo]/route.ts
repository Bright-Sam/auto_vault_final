import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { orderStatus, purchaseOption } from '@/lib/mappings';

/*function serialize(o: any) {
  return {
    orderNo: o.orderNo,
    vehicle: `${o.vehicle.brand} ${o.vehicle.model}`,
    vehicleId: o.vehicleId,
    price: o.vehiclePrice,
    amountDue: o.amountDue,
    depositAmount: o.depositAmount,
    paid: o.amountPaid,
    status: orderStatus.toLabel(o.status),
    purchaseOption: purchaseOption.toLabel(o.purchaseOption),
    customer: { name: o.customerName, phone: o.customerPhone, email: o.customerEmail },
    shipment: o.shipment ? {
      origin: o.shipment.origin, destination: o.shipment.destination,
      vessel: o.shipment.vessel || 'To be assigned', container: o.shipment.container || 'Not assigned',
      eta: o.shipment.eta ? o.shipment.eta.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'To be confirmed',
    } : null,
    createdAt: o.createdAt,
  };
}

// Public lookup by order number — mirrors the original prototype's "anyone with the order
// number can track it" behaviour (used by /pay, /invoice and /track without requiring login).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const order = await prisma.order.findUnique({ where: { orderNo }, include: { vehicle: true, shipment: true } });
  if (!order) return jsonError('Order not found', 404);
  return NextResponse.json(serialize(order));
}

// Staff: move an order through the fulfilment pipeline. Keeps the linked shipment record in sync.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderNo: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { orderNo } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.status) return jsonError('status is required');

  const status = orderStatus.fromLabel(body.status);
  const order = await prisma.order.update({ where: { orderNo }, data: { status } }).catch(() => null);
  if (!order) return jsonError('Order not found', 404);

  const shippingStatuses = ['SHIPPED', 'ARRIVED_IN_GHANA', 'CUSTOMS_CLEARING', 'READY_FOR_COLLECTION', 'DELIVERED'];
  if (shippingStatuses.includes(status)) {
    await prisma.shipment.upsert({
      where: { orderId: order.id },
      update: { status },
      create: { orderId: order.id, status, vessel: 'MV Auto Pioneer', container: `AVCU${Math.floor(100000 + Math.random() * 900000)}` },
    });
  }

  return NextResponse.json({ orderNo: order.orderNo, status: orderStatus.toLabel(order.status) });
}*/

const statusMap: Record<string, any> = {
  'Payment Pending': 'PAYMENT_PENDING',
  'Vehicle Allocated': 'VEHICLE_ALLOCATED',
  'Export Processing': 'EXPORT_PROCESSING',
  'Shipped': 'SHIPPED',
  'Arrived in Ghana': 'ARRIVED_IN_GHANA',
  'Customs & Clearing': 'CUSTOMS_CLEARING',
  'Ready for Collection': 'READY_FOR_COLLECTION',
  'Delivered': 'DELIVERED',
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;
    const body = await request.json();

    const status = statusMap[body.status];

    if (!status) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: {
        orderNo,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
