import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ vehicleId: string }> }) {
  let user;
  try {
    user = await requireUser();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 401);
  }
  const { vehicleId } = await params;
  await prisma.savedVehicle.deleteMany({ where: { userId: user.id, vehicleId } });
  return NextResponse.json({ ok: true });
}
