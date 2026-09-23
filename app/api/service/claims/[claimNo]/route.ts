import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { claimStatus } from '@/lib/mappings';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ claimNo: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { claimNo } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.status) return jsonError('status is required');

  const claim = await prisma.warrantyClaim.update({
    where: { claimNo }, data: { status: claimStatus.fromLabel(body.status) },
  }).catch(() => null);
  if (!claim) return jsonError('Claim not found', 404);

  return NextResponse.json({ claimNo: claim.claimNo, status: claimStatus.toLabel(claim.status) });
}
