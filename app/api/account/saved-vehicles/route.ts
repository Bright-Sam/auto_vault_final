import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 401);
  }
  const saved = await prisma.savedVehicle.findMany({ where: { userId: user.id }, include: { vehicle: true } });
  return NextResponse.json(saved.map(s => s.vehicle));
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 401);
  }
  const body = await req.json().catch(() => null);
  if (!body?.vehicleId) return jsonError('vehicleId is required');

  await prisma.savedVehicle.upsert({
    where: { userId_vehicleId: { userId: user.id, vehicleId: body.vehicleId } },
    update: {}, create: { userId: user.id, vehicleId: body.vehicleId },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
