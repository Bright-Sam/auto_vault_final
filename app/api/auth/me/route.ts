import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api-helpers';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json(null);
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
}
