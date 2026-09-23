import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { getCurrentUser, genRef, jsonError, jsonErrorFrom, STAFF_ROLES } from '@/lib/api-helpers';
import { tradeStatus } from '@/lib/mappings';

/*function serialize(t: any) {
  return {
    tradeNo: t.tradeNo, customer: t.user.name,
    vehicle: `${t.vehicleBrand} ${t.vehicleModel} · ${t.vehicleYear}`,
    estimatedValue: t.estimatedValue, status: tradeStatus.toLabel(t.status),
    date: t.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError('Sign in required', 401);
    const trades = await prisma.tradeIn.findMany({
      where: STAFF_ROLES.includes(user.role) ? {} : { userId: user.id },
      include: { user: true }, orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(trades.map(serialize));
  } catch (e: unknown) {
    return jsonErrorFrom(e, 500);
  }
}

// Public: submit a trade-in request with an already-computed instant estimate.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.phone || !body?.vehicle?.brand) return jsonError('Contact and vehicle details are required');

  let user = await getCurrentUser();
  if (!user) {
    user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      const passwordHash = await hashPassword(Math.random().toString(36).slice(2) + Date.now());
      user = await prisma.user.create({ data: { name: body.name, email: body.email, phone: body.phone, passwordHash, role: 'CUSTOMER' } });
    }
    const token = signSession({ userId: user.id, role: user.role });
    await setSessionCookie(token);
  }

  const trade = await prisma.tradeIn.create({
    data: {
      tradeNo: genRef('AV-TI'), userId: user.id,
      vehicleBrand: body.vehicle.brand, vehicleModel: body.vehicle.model || '', vehicleYear: body.vehicle.year || new Date().getFullYear(),
      mileage: body.vehicle.mileage || null, condition: body.vehicle.condition || null, regNumber: body.vehicle.regNumber || null,
      estimatedLow: body.estimate?.low || 0, estimatedValue: body.estimate?.mid || 0, estimatedHigh: body.estimate?.high || 0,
    },
    include: { user: true },
  });
  return NextResponse.json(serialize(trade), { status: 201 });
}*/

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

export async function GET() {
  try {
    const trades = await prisma.tradeIn.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = trades.map((trade) => ({
      tradeNo: trade.tradeNo,
      customer: trade.user.name,
      vehicle: `${trade.vehicleBrand} ${trade.vehicleModel} ${trade.vehicleYear}`,
      estimatedValue: trade.estimatedValue,
      status: formatStatus(trade.status),
      date: trade.createdAt.toLocaleDateString('en-GB'),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trade-ins' },
      { status: 500 }
    );
  }
}
