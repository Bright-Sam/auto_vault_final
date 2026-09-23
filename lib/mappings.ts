// Every Prisma enum has a matching human-readable label, since the existing UI (built in
// Modules 1-10) already displays and edits statuses as plain English strings. These maps let
// API routes accept/return the same strings the frontend already uses, instead of forcing a
// UI rewrite around SCREAMING_SNAKE_CASE enum values.

function buildMaps<T extends string>(pairs: [T, string][]) {
  const toLabel = new Map<T, string>(pairs);
  const fromLabel = new Map<string, T>(pairs.map(([k, v]) => [v, k]));
  return {
    toLabel: (v: T) => toLabel.get(v) ?? v,
    fromLabel: (v: string) => fromLabel.get(v) ?? (v as T),
  };
}

export const vehicleStatus = buildMaps<'IN_STOCK' | 'IN_TRANSIT' | 'RESERVED' | 'SOLD'>([
  ['IN_STOCK', 'In Stock'], ['IN_TRANSIT', 'In Transit'], ['RESERVED', 'Reserved'], ['SOLD', 'Sold'],
]);

// Unified order-status list — used for both the admin order/shipment select and the public
// tracking timeline, so a status set in the admin dashboard maps to exactly one tracking stage.
export const orderStatus = buildMaps<
  'PAYMENT_PENDING' | 'VEHICLE_ALLOCATED' | 'EXPORT_PROCESSING' | 'SHIPPED' | 'ARRIVED_IN_GHANA' | 'CUSTOMS_CLEARING' | 'READY_FOR_COLLECTION' | 'DELIVERED'
>([
  ['PAYMENT_PENDING', 'Payment Pending'],
  ['VEHICLE_ALLOCATED', 'Vehicle Allocated'],
  ['EXPORT_PROCESSING', 'Export Processing'],
  ['SHIPPED', 'Shipped'],
  ['ARRIVED_IN_GHANA', 'Arrived in Ghana'],
  ['CUSTOMS_CLEARING', 'Customs & Clearing'],
  ['READY_FOR_COLLECTION', 'Ready for Collection'],
  ['DELIVERED', 'Delivered'],
]);
export const orderStatusOrder = ['PAYMENT_PENDING', 'VEHICLE_ALLOCATED', 'EXPORT_PROCESSING', 'SHIPPED', 'ARRIVED_IN_GHANA', 'CUSTOMS_CLEARING', 'READY_FOR_COLLECTION', 'DELIVERED'] as const;

export const purchaseOption = buildMaps<'DEPOSIT' | 'FULL_PAYMENT'>([
  ['DEPOSIT', 'Deposit'], ['FULL_PAYMENT', 'Full payment'],
]);

export const paymentMethod = buildMaps<'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CARD'>([
  ['MOBILE_MONEY', 'Mobile Money'], ['BANK_TRANSFER', 'Bank Transfer'], ['CARD', 'Card'],
]);

export const leadStage = buildMaps<'NEW_LEAD' | 'CONTACTED' | 'INTERESTED' | 'TEST_DRIVE' | 'NEGOTIATION' | 'DEPOSIT_PAID' | 'SOLD' | 'LOST'>([
  ['NEW_LEAD', 'New Lead'], ['CONTACTED', 'Contacted'], ['INTERESTED', 'Interested'], ['TEST_DRIVE', 'Test Drive'],
  ['NEGOTIATION', 'Negotiation'], ['DEPOSIT_PAID', 'Deposit Paid'], ['SOLD', 'Sold'], ['LOST', 'Lost'],
]);

export const leadSource = buildMaps<'WEBSITE' | 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP' | 'REFERRAL' | 'WALK_IN'>([
  ['WEBSITE', 'Website'], ['INSTAGRAM', 'Instagram'], ['FACEBOOK', 'Facebook'],
  ['WHATSAPP', 'WhatsApp'], ['REFERRAL', 'Referral'], ['WALK_IN', 'Walk-in'],
]);

export const financeStatus = buildMaps<'SUBMITTED' | 'DOCUMENT_REVIEW' | 'CREDIT_CHECK' | 'APPROVED' | 'DECLINED' | 'DISBURSED'>([
  ['SUBMITTED', 'Submitted'], ['DOCUMENT_REVIEW', 'Document Review'], ['CREDIT_CHECK', 'Credit Check'],
  ['APPROVED', 'Approved'], ['DECLINED', 'Declined'], ['DISBURSED', 'Disbursed'],
]);

export const tradeStatus = buildMaps<'PENDING_VALUATION' | 'OFFER_SENT' | 'ACCEPTED' | 'DECLINED'>([
  ['PENDING_VALUATION', 'Pending Valuation'], ['OFFER_SENT', 'Offer Sent'], ['ACCEPTED', 'Accepted'], ['DECLINED', 'Declined'],
]);

export const jobStatus = buildMaps<'BOOKED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'AWAITING_PARTS' | 'QUALITY_CHECK' | 'COMPLETED'>([
  ['BOOKED', 'Booked'], ['CHECKED_IN', 'Checked In'], ['IN_PROGRESS', 'In Progress'],
  ['AWAITING_PARTS', 'Awaiting Parts'], ['QUALITY_CHECK', 'Quality Check'], ['COMPLETED', 'Completed'],
]);

export const claimStatus = buildMaps<'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESOLVED'>([
  ['SUBMITTED', 'Submitted'], ['UNDER_REVIEW', 'Under Review'], ['APPROVED', 'Approved'],
  ['REJECTED', 'Rejected'], ['RESOLVED', 'Resolved'],
]);
