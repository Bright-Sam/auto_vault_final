import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { jsonError } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.password) return jsonError('Name, email and password are required');
  if (body.password.length < 6) return jsonError('Password must be at least 6 characters');

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return jsonError('An account with this email already exists', 409);

  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, phone: body.phone || null, passwordHash, role: 'CUSTOMER' },
  });

  const token = signSession({ userId: user.id, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
}
