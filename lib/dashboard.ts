import { prisma } from "@/lib/prisma";
import {
  OrderStatus,
  PaymentStatus,
  VehicleStatus,
} from "@prisma/client";

export async function getDashboardStats() {
  const [
    vehiclesInStock,
    activeOrders,
    salesCollected,
    ordersForOutstanding,
    inTransit,
    reserved,
    sold,
    recentOrders,
  ] = await Promise.all([
    prisma.vehicle.count({
      where: {
        status: VehicleStatus.IN_STOCK,
      },
    }),

    prisma.order.count({
      where: {
        status: {
          not: OrderStatus.DELIVERED,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.VERIFIED,
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.order.findMany({
      select: {
        amountDue: true,
        amountPaid: true,
      },
    }),

    prisma.vehicle.count({
      where: {
        status: VehicleStatus.IN_TRANSIT,
      },
    }),

    prisma.vehicle.count({
      where: {
        status: VehicleStatus.RESERVED,
      },
    }),

    prisma.vehicle.count({
      where: {
        status: VehicleStatus.SOLD,
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vehicle: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const outstanding = ordersForOutstanding.reduce(
    (total, order) => total + (order.amountDue - order.amountPaid),
    0
  );

  return {
    vehiclesInStock,
    activeOrders,
    salesCollected: salesCollected._sum.amount ?? 0,
    outstanding,

    inventory: {
      inStock: vehiclesInStock,
      inTransit,
      reserved,
      sold,
    },

    recentOrders,
  };
}