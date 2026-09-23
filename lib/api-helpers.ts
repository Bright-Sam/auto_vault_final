import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getSession } from './auth';

export const STAFF_ROLES: Role[] = [Role.ADMIN, Role.SALES_AGENT, Role.ACCOUNTANT, Role.INVENTORY_MANAGER, Role.WORKSHOP_MANAGER];

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

export function getErrorStatus(error: unknown, fallback = 400) {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === 'number' && Number.isInteger(status)) return status;
  }
  return fallback;
}

export function jsonErrorFrom(error: unknown, fallbackStatus = 400) {
  return jsonError(getErrorMessage(error), getErrorStatus(error, fallbackStatus));
}

// Returns the logged-in user record (or null). Route handlers decide whether
// that's good enough or whether a specific role is required.
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new ApiAuthError('Sign in required', 401);
  return user;
}

export async function requireStaff() {
  const user = await requireUser();
  if (!STAFF_ROLES.includes(user.role)) throw new ApiAuthError('Staff access required', 403);
  return user;
}

export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function genRef(prefix: string) {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${rand}`;
}
