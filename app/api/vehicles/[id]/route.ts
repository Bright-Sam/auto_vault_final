import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { vehicleStatus } from '@/lib/mappings';

function serialize(v: any) {
  return { ...v, status: vehicleStatus.toLabel(v.status) };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return jsonError('Vehicle not found', 404);
  return NextResponse.json(serialize(vehicle));
}

// Admin: update price/status/etc for a vehicle.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError('Request body required');

  const data: any = {};
  if (body.status) data.status = vehicleStatus.fromLabel(body.status);
  if (typeof body.price === 'number') data.price = body.price;

  const vehicle = await prisma.vehicle.update({ where: { id }, data }).catch(() => null);
  if (!vehicle) return jsonError('Vehicle not found', 404);
  return NextResponse.json(serialize(vehicle));
}
