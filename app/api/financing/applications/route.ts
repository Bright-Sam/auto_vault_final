import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { getCurrentUser, genRef, jsonError, jsonErrorFrom, STAFF_ROLES } from '@/lib/api-helpers';
import { financeStatus } from '@/lib/mappings';

/*function serialize(a: any) {
  return {
    appNo: a.appNo, customer: a.user.name, vehicle: a.vehicle, price: a.price,
    downPayment: a.downPayment, loanAmount: a.loanAmount, term: a.term, rate: a.rate,
    monthlyPayment: a.monthlyPayment, status: financeStatus.toLabel(a.status),
    date: a.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError('Sign in required', 401);
    const apps = await prisma.financeApplication.findMany({
      where: STAFF_ROLES.includes(user.role) ? {} : { userId: user.id },
      include: { user: true }, orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(apps.map(serialize));
  } catch (e: unknown) {
    return jsonErrorFrom(e, 500);
  }
}

// Public: submit a financing application. Same find-or-create-and-login pattern as /api/orders.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.phone) return jsonError('Applicant name, email and phone are required');

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

  const app = await prisma.financeApplication.create({
    data: {
      appNo: genRef('AV-FIN'), userId: user.id, vehicle: body.vehicle || 'Vehicle not yet selected',
      price: body.price || 0, downPayment: body.downPayment || 0, loanAmount: body.loanAmount || 0,
      term: body.term || 36, rate: body.rate || 28, monthlyPayment: body.monthlyPayment || 0,
      employment: body.employment || null, employer: body.employer || null, occupation: body.occupation || null,
      income: body.income ? Number(body.income) : null, address: body.address || null,
    },
    include: { user: true },
  });
  return NextResponse.json(serialize(app), { status: 201 });
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
    const applications =
      await prisma.financeApplication.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    const formatted = applications.map((app) => ({
      appNo: app.appNo,
      customer: app.user.name,
      vehicle: app.vehicle,
      price: app.price,
      downPayment: app.downPayment,
      loanAmount: app.loanAmount,
      term: app.term,
      rate: app.rate,
      monthlyPayment: app.monthlyPayment,
      status: formatStatus(app.status),
      date: app.createdAt.toLocaleDateString('en-GB'),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
