import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { getCurrentUser, genRef, jsonError, jsonErrorFrom, STAFF_ROLES } from '@/lib/api-helpers';
import { jobStatus } from '@/lib/mappings';

/*function serialize(b: any) {
  return {
    jobNo: b.bookingNo, customer: b.user.name, vehicle: b.vehicle, serviceType: b.serviceType,
    status: jobStatus.toLabel(b.status), laborHours: b.laborHours, laborRate: b.laborRate, paid: b.paid,
    parts: b.parts.map((p: any) => ({ name: p.name, qty: p.qty, price: p.price })),
    date: b.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError('Sign in required', 401);
    const bookings = await prisma.serviceBooking.findMany({
      where: STAFF_ROLES.includes(user.role) ? {} : { userId: user.id },
      include: { user: true, parts: true }, orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings.map(serialize));
  } catch (e: unknown) {
    return jsonErrorFrom(e, 500);
  }
}

// Public: book a service appointment. Becomes a job card the workshop moves through stages.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.phone || !body?.vehicle || !body?.serviceType) return jsonError('Vehicle, service type and contact details are required');

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

  const booking = await prisma.serviceBooking.create({
    data: {
      bookingNo: genRef('AV-SVC'), userId: user.id, vehicle: body.vehicle, serviceType: body.serviceType,
      preferredDate: body.date || null, preferredTime: body.time || null, notes: body.notes || null,
    },
    include: { user: true, parts: true },
  });
  return NextResponse.json(serialize(booking), { status: 201 });
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
    const bookings =
      await prisma.serviceBooking.findMany({
        include: {
          user: true,
          parts: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    const formatted = bookings.map((job) => ({
      jobNo: job.bookingNo,
      customer: job.user.name,
      vehicle: job.vehicle,
      serviceType: job.serviceType,
      status: formatStatus(job.status),
      date: job.createdAt.toLocaleDateString('en-GB'),
      laborHours: job.laborHours,
      laborRate: job.laborRate,
      parts: job.parts.map((part) => ({
        name: part.name,
        qty: part.qty,
        price: part.price,
      })),
      paid: job.paid,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
