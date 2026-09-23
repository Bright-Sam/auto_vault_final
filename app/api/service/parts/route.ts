import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

/*export async function GET() {
  try {
    await requireStaff();
  } catch (e: unknown) {

  const parts = await prisma.part.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json(parts);
}
*/
export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(parts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}