-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN', 'SALES_AGENT', 'ACCOUNTANT', 'INVENTORY_MANAGER', 'WORKSHOP_MANAGER');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('IN_STOCK', 'IN_TRANSIT', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PAYMENT_PENDING', 'VEHICLE_ALLOCATED', 'EXPORT_PROCESSING', 'SHIPPED', 'ARRIVED_IN_GHANA', 'CUSTOMS_CLEARING', 'READY_FOR_COLLECTION', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PurchaseOption" AS ENUM ('DEPOSIT', 'FULL_PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MOBILE_MONEY', 'BANK_TRANSFER', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'INTERESTED', 'TEST_DRIVE', 'NEGOTIATION', 'DEPOSIT_PAID', 'SOLD', 'LOST');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'WHATSAPP', 'REFERRAL', 'WALK_IN');

-- CreateEnum
CREATE TYPE "FinanceStatus" AS ENUM ('SUBMITTED', 'DOCUMENT_REVIEW', 'CREDIT_CHECK', 'APPROVED', 'DECLINED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING_VALUATION', 'OFFER_SENT', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('BOOKED', 'CHECKED_IN', 'IN_PROGRESS', 'AWAITING_PARTS', 'QUALITY_CHECK', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "ghanaCardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "drive" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "mileage" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'IN_STOCK',
    "warranty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedVehicle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "purchaseOption" "PurchaseOption" NOT NULL,
    "vehiclePrice" INTEGER NOT NULL,
    "amountDue" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'PAYMENT_PENDING',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "ghanaCardId" TEXT,
    "deliveryPreference" TEXT NOT NULL,
    "deliveryAddress" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'VERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "vessel" TEXT,
    "container" TEXT,
    "origin" TEXT NOT NULL DEFAULT 'China',
    "destination" TEXT NOT NULL DEFAULT 'Tema, Ghana',
    "eta" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'SHIPPED',

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "leadNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicleInterest" TEXT NOT NULL,
    "source" "LeadSource" NOT NULL,
    "agentId" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'NEW_LEAD',
    "value" INTEGER NOT NULL,
    "lastContact" TIMESTAMP(3),
    "nextFollowUp" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceApplication" (
    "id" TEXT NOT NULL,
    "appNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "downPayment" INTEGER NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "monthlyPayment" INTEGER NOT NULL,
    "employment" TEXT,
    "employer" TEXT,
    "occupation" TEXT,
    "income" INTEGER,
    "address" TEXT,
    "status" "FinanceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeIn" (
    "id" TEXT NOT NULL,
    "tradeNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" INTEGER NOT NULL,
    "mileage" INTEGER,
    "condition" TEXT,
    "regNumber" TEXT,
    "estimatedLow" INTEGER NOT NULL,
    "estimatedValue" INTEGER NOT NULL,
    "estimatedHigh" INTEGER NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'PENDING_VALUATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "bookingNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "preferredDate" TEXT,
    "preferredTime" TEXT,
    "notes" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'BOOKED',
    "laborHours" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "laborRate" INTEGER NOT NULL DEFAULT 180,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPart" (
    "id" TEXT NOT NULL,
    "serviceBookingId" TEXT NOT NULL,
    "partCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "JobPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarrantyClaim" (
    "id" TEXT NOT NULL,
    "claimNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "orderNo" TEXT,
    "status" "ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarrantyClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "orderNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavedVehicle_userId_vehicleId_key" ON "SavedVehicle"("userId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNo_key" ON "Order"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_leadNo_key" ON "Lead"("leadNo");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceApplication_appNo_key" ON "FinanceApplication"("appNo");

-- CreateIndex
CREATE UNIQUE INDEX "TradeIn_tradeNo_key" ON "TradeIn"("tradeNo");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceBooking_bookingNo_key" ON "ServiceBooking"("bookingNo");

-- CreateIndex
CREATE UNIQUE INDEX "WarrantyClaim_claimNo_key" ON "WarrantyClaim"("claimNo");

-- AddForeignKey
ALTER TABLE "SavedVehicle" ADD CONSTRAINT "SavedVehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedVehicle" ADD CONSTRAINT "SavedVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceApplication" ADD CONSTRAINT "FinanceApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeIn" ADD CONSTRAINT "TradeIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_serviceBookingId_fkey" FOREIGN KEY ("serviceBookingId") REFERENCES "ServiceBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarrantyClaim" ADD CONSTRAINT "WarrantyClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
