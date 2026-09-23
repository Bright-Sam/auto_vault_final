import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { jobStatus } from '@/lib/mappings';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ jobNo: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { jobNo } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return jsonError('Request body required');

  const data: any = {};
  if (body.status) data.status = jobStatus.fromLabel(body.status);
  if (typeof body.paid === 'boolean') data.paid = body.paid;

  const booking = await prisma.serviceBooking.update({ where: { bookingNo: jobNo }, data }).catch(() => null);
  if (!booking) return jsonError('Job card not found', 404);

  return NextResponse.json({ jobNo: booking.bookingNo, status: jobStatus.toLabel(booking.status), paid: booking.paid });
}
