import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { leadStage } from '@/lib/mappings';

/*export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.stage) return jsonError('stage is required');

  const lead = await prisma.lead.update({
    where: { leadNo: id },
    data: { stage: leadStage.fromLabel(body.stage), lastContact: new Date() },
  }).catch(() => null);
  if (!lead) return jsonError('Lead not found', 404);

  return NextResponse.json({ id: lead.leadNo, stage: leadStage.toLabel(lead.stage) });
}*/

const stageMap: Record<string, any> = {
  'New Lead': 'NEW_LEAD',
  'Contacted': 'CONTACTED',
  'Interested': 'INTERESTED',
  'Test Drive': 'TEST_DRIVE',
  'Negotiation': 'NEGOTIATION',
  'Deposit Paid': 'DEPOSIT_PAID',
  'Sold': 'SOLD',
  'Lost': 'LOST',
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: any = {};

    if (body.stage) {
      data.stage = stageMap[body.stage];
    }

    const lead = await prisma.lead.update({
      where: {
        leadNo: id,
      },
      data,
    });

    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}