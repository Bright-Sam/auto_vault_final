import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonErrorFrom } from '@/lib/api-helpers';

// Documents aren't a separately-authored record in this prototype — they're derived from the
// customer's own orders/payments, so an invoice and a receipt appear automatically once a
// payment has been made, without needing a document-upload/generation step yet.
export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e: unknown) {
    return jsonErrorFrom(e, 401);
  }
  const orders = await prisma.order.findMany({ where: { userId: user.id, amountPaid: { gt: 0 } }, include: { invoice: true } });
  const docs = orders.flatMap((o: (typeof orders)[number]) => ([
    { label: 'Purchase invoice', ref: o.invoice?.invoiceNo || `INV-${o.orderNo.replace('AV-', '')}`, orderNo: o.orderNo },
    { label: 'Payment receipt', ref: `RCPT-${o.orderNo.replace('AV-', '')}`, orderNo: o.orderNo },
  ]));
  return NextResponse.json(docs);
}
