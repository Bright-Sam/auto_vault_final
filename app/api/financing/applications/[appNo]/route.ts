import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { financeStatus } from '@/lib/mappings';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ appNo: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { appNo } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.status) return jsonError('status is required');

  const app = await prisma.financeApplication.update({
    where: { appNo }, data: { status: financeStatus.fromLabel(body.status) },
  }).catch(() => null);
  if (!app) return jsonError('Application not found', 404);

  return NextResponse.json({ appNo: app.appNo, status: financeStatus.toLabel(app.status) });
}
