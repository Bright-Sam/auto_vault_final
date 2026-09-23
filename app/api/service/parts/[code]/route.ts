import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { code } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.stock !== 'number') return jsonError('stock is required');

  const part = await prisma.part.update({ where: { code }, data: { stock: body.stock } }).catch(() => null);
  if (!part) return jsonError('Part not found', 404);
  return NextResponse.json(part);
}
