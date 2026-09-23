import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const vehicle = await prisma.vehicle.create({
      data: {
        id: body.id,
        brand: body.brand,
        model: body.model,
        year: body.year,
        price: body.price,
        type: body.type,
        fuel: body.fuel,
        transmission: body.transmission,
        engine: body.engine,
        drive: body.drive,
        seats: body.seats,
        battery: body.battery || '',
        range: body.range || '',
        charging: body.charging || '',
        mileage: body.mileage || '',
        colour: body.colour,
        warranty: body.warranty,
        description: body.description,
        img: body.img,
        features: body.features || [],
        status: body.status || 'IN_STOCK',
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}