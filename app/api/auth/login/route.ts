import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signSession, setSessionCookie } from '@/lib/auth';
import { jsonError } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) return jsonError('Email and password are required');

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return jsonError('Invalid email or password', 401);

  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) return jsonError('Invalid email or password', 401);

  const token = signSession({ userId: user.id, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
}
