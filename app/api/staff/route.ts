import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { requireStaff, STAFF_ROLES, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

export async function GET() {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const staff = await prisma.user.findMany({
    where: { role: { in: STAFF_ROLES } },
    select: { id: true, name: true, role: true, email: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(staff);
}

// Admin: invite a new staff member. No email delivery is wired up yet, so the temporary
// password is returned once in the response for the admin to relay directly.
export async function POST(req: NextRequest) {
  let admin;
  try {
    admin = await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  if (admin.role !== 'ADMIN') return jsonError('Only an admin can invite staff', 403);

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.role) return jsonError('name, email and role are required');
  if (!STAFF_ROLES.includes(body.role)) return jsonError('Invalid role');

  const tempPassword = Math.random().toString(36).slice(2, 10);
  const passwordHash = await hashPassword(tempPassword);
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash, role: body.role },
  }).catch(() => null);
  if (!user) return jsonError('A user with this email already exists', 409);

  return NextResponse.json({ id: user.id, name: user.name, role: user.role, tempPassword }, { status: 201 });
}
