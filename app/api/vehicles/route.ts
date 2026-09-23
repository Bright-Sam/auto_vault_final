/*import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { vehicleStatus } from '@/lib/mappings';

function serialize(v: any) {
  return { ...v, status: vehicleStatus.toLabel(v.status) };
}

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(vehicles.map(serialize));
}

// Admin: create a new vehicle listing.
export async function POST(req: NextRequest) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.brand || !body?.model || !body?.price) {
    return jsonError('id, brand, model and price are required');
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        id: body.id, brand: body.brand, model: body.model, year: body.year || new Date().getFullYear(),
        price: body.price, type: body.type || 'SUV', fuel: body.fuel || 'Petrol', transmission: body.transmission || '',
        engine: body.engine || '', drive: body.drive || 'FWD', seats: body.seats || 5, mileage: body.mileage || 'New',
        colour: body.colour || '', status: vehicleStatus.fromLabel(body.status || 'In Stock'), warranty: body.warranty || '',
        description: body.description || '', img: body.img || '', features: body.features || [],
      },
    });
    return NextResponse.json(serialize(vehicle), { status: 201 });
  } catch (error) {
    console.error("CREATE VEHICLE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';
import { vehicleStatus } from '@/lib/mappings';

function serialize(v: any) {
  return { ...v, status: vehicleStatus.toLabel(v.status) };
}

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(vehicles.map(serialize));
}

// Admin: create a new vehicle listing.
export async function POST(req: NextRequest) {
  try {
    await requireStaff();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 403);
  }

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.brand || !body?.model || !body?.price) {
    return jsonError('id, brand, model and price are required');
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        id: body.id, brand: body.brand, model: body.model, year: body.year || new Date().getFullYear(),
        price: body.price, type: body.type || 'SUV', fuel: body.fuel || 'Petrol', transmission: body.transmission || '',
        engine: body.engine || '', drive: body.drive || 'FWD', seats: body.seats || 5,
        battery: body.battery || '', range: body.range || '', charging: body.charging || '',
        mileage: body.mileage || 'New', colour: body.colour || '',
        status: vehicleStatus.fromLabel(body.status || 'In Stock'), warranty: body.warranty || '',
        description: body.description || '', img: body.img || '', features: body.features || [],
      },
    });
    return NextResponse.json(serialize(vehicle), { status: 201 });
  } catch (error) {
    console.error("CREATE VEHICLE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}