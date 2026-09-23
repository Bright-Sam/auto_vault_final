import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { tradeStatus } from '@/lib/mappings';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tradeNo: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { tradeNo } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.status) return jsonError('status is required');

  const trade = await prisma.tradeIn.update({
    where: { tradeNo }, data: { status: tradeStatus.fromLabel(body.status) },
  }).catch(() => null);
  if (!trade) return jsonError('Trade-in request not found', 404);

  return NextResponse.json({ tradeNo: trade.tradeNo, status: tradeStatus.toLabel(trade.status) });
}
