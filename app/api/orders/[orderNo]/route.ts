import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderStatus } from '@/lib/mappings';

function serialize(o: any) {
  return {
    orderNo: o.orderNo,
    vehicle: `${o.vehicle.brand} ${o.vehicle.model}`,
    vehicleId: o.vehicleId,
    price: o.vehiclePrice,
    amountDue: o.amountDue,
    depositAmount: o.depositAmount,
    paid: o.amountPaid,
    status: orderStatus.toLabel(o.status),
    purchaseOption: o.purchaseOption,
    customer: {
      name: o.customerName,
      phone: o.customerPhone,
      email: o.customerEmail,
    },
    shipment: o.shipment
      ? {
          origin: o.shipment.origin,
          destination: o.shipment.destination,
          vessel: o.shipment.vessel || 'To be assigned',
          container: o.shipment.container || 'Not assigned',
          eta: o.shipment.eta
            ? o.shipment.eta.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'To be confirmed',
        }
      : null,
    createdAt: o.createdAt,
  };
}

// Public order lookup by order number
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: {
        vehicle: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serialize(order));
  } catch (error) {
    console.error('Order lookup error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// Staff/order status update
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;
    const body = await request.json();

    if (!body?.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const status = orderStatus.fromLabel(body.status);

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
    console.error('Order status update error:', error);

    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}