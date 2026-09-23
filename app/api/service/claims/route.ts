import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { getCurrentUser, genRef, jsonError, jsonErrorFrom, STAFF_ROLES } from '@/lib/api-helpers';
import { claimStatus } from '@/lib/mappings';

function serialize(c: any) {
  return {
    claimNo: c.claimNo, customer: c.user.name, vehicle: c.vehicle, issue: c.issue,
    orderNo: c.orderNo || '—', status: claimStatus.toLabel(c.status),
    date: c.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError('Sign in required', 401);
    const claims = await prisma.warrantyClaim.findMany({
      where: STAFF_ROLES.includes(user.role) ? {} : { userId: user.id },
      include: { user: true }, orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(claims.map(serialize));
  } catch (e: unknown) {
    return jsonErrorFrom(e, 500);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.phone || !body?.vehicle || !body?.issue) return jsonError('Vehicle, issue and contact details are required');

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

  const claim = await prisma.warrantyClaim.create({
    data: { claimNo: genRef('AV-WC'), userId: user.id, vehicle: body.vehicle, issue: body.issue, orderNo: body.orderNo || null },
    include: { user: true },
  });
  return NextResponse.json(serialize(claim), { status: 201 });
}
