import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { getCurrentUser, genRef, jsonError, STAFF_ROLES } from '@/lib/api-helpers';
import { orderStatus, purchaseOption } from '@/lib/mappings';

/*function serialize(o: any) {
  return {
    orderNo: o.orderNo,
    customer: o.customerName,
    vehicle: `${o.vehicle.brand} ${o.vehicle.model}`,
    vehicleId: o.vehicleId,
    amount: o.amountDue,
    paid: o.amountPaid,
    status: orderStatus.toLabel(o.status),
    purchaseOption: purchaseOption.toLabel(o.purchaseOption),
    date: o.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

// Public: places an order. If the browser has no session, we find-or-create a customer
// account from the details entered on the form and log them in — a frictionless "checkout
// creates your account" flow, matching the guest-checkout UX the prototype originally had.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.vehicleId || !body?.customer?.name || !body?.customer?.email || !body?.customer?.phone) {
    return jsonError('Vehicle and customer details are required');
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
  if (!vehicle) return jsonError('Vehicle not found', 404);

  let user = await getCurrentUser();
  if (!user) {
    user = await prisma.user.findUnique({ where: { email: body.customer.email } });
    if (!user) {
      const passwordHash = await hashPassword(Math.random().toString(36).slice(2) + Date.now());
      user = await prisma.user.create({
        data: { name: body.customer.name, email: body.customer.email, phone: body.customer.phone, passwordHash, role: 'CUSTOMER' },
      });
    }
    const token = signSession({ userId: user.id, role: user.role });
    await setSessionCookie(token);
  }

  const deposit = Math.round(vehicle.price * 0.2);
  const isFull = body.purchaseOption === 'full';
  const amountDue = isFull ? vehicle.price : deposit;

  const order = await prisma.order.create({
    data: {
      orderNo: genRef('AV'),
      userId: user.id,
      vehicleId: vehicle.id,
      purchaseOption: isFull ? 'FULL_PAYMENT' : 'DEPOSIT',
      vehiclePrice: vehicle.price,
      amountDue,
      depositAmount: deposit,
      customerName: body.customer.name,
      customerPhone: body.customer.phone,
      customerEmail: body.customer.email,
      ghanaCardId: body.customer.idNumber || null,
      deliveryPreference: body.delivery || 'Pickup',
      deliveryAddress: body.address || null,
      notes: body.notes || null,
    },
    include: { vehicle: true },
  });

  return NextResponse.json(serialize(order), { status: 201 });
}

// Staff see every order; customers see only their own.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError('Sign in required', 401);

  const orders = await prisma.order.findMany({
    where: STAFF_ROLES.includes(user.role) ? {} : { userId: user.id },
    include: { vehicle: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders.map(serialize));
}*/

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        vehicle: true,
        user: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedOrders = orders.map((order) => ({
      orderNo: order.orderNo,
      customer: order.customerName,
      vehicle: `${order.vehicle.brand} ${order.vehicle.model}`,
      amount: order.amountDue,
      paid: order.amountPaid,
      status: formatStatus(order.status),
      date: order.createdAt.toLocaleDateString('en-GB'),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}
