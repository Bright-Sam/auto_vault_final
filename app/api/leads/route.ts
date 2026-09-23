import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, genRef, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { leadStage, leadSource } from '@/lib/mappings';

/*function serialize(l: any) {
  return {
    id: l.leadNo,
    name: l.name,
    phone: l.phone,
    vehicle: l.vehicleInterest,
    source: leadSource.toLabel(l.source),
    agent: l.agent?.name || 'Unassigned',
    stage: leadStage.toLabel(l.stage),
    value: l.value,
    lastContact: l.lastContact ? l.lastContact.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—',
    nextFollowUp: l.nextFollowUp ? l.nextFollowUp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—',
    notes: l.notes || '',
  };
}

export async function GET() {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const leads = await prisma.lead.findMany({ include: { agent: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(leads.map(serialize));
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.phone || !body?.vehicle) return jsonError('name, phone and vehicle are required');

  const lead = await prisma.lead.create({
    data: {
      leadNo: genRef('LD'),
      name: body.name, phone: body.phone, vehicleInterest: body.vehicle,
      source: leadSource.fromLabel(body.source || 'Website'), agentId: body.agentId || user.id,
      value: body.value || 0, notes: body.notes || null,
    },
    include: { agent: true },
  });
  return NextResponse.json(serialize(lead), { status: 201 });
}*/

function formatStage(stage: string) {
  return stage
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}

function formatSource(source: string) {
  return source
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        agent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedLeads = leads.map((lead) => ({
      id: lead.leadNo,
      name: lead.name,
      phone: lead.phone,
      vehicle: lead.vehicleInterest,
      source: formatSource(lead.source),
      agent: lead.agent?.name || 'Unassigned',
      stage: formatStage(lead.stage),
      value: lead.value,
      lastContact: lead.lastContact
        ? lead.lastContact.toLocaleDateString('en-GB')
        : '—',
      nextFollowUp: lead.nextFollowUp
        ? lead.nextFollowUp.toLocaleDateString('en-GB')
        : '—',
      notes: lead.notes || '',
    }));

    return NextResponse.json(formattedLeads);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        leadNo: body.leadNo,
        name: body.name,
        phone: body.phone,
        vehicleInterest: body.vehicleInterest,
        source: body.source,
        agentId: body.agentId || null,
        value: body.value || 0,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
