// Seeds the database with the demo data used by the AutoVault prototypes.
//
// Run with:
//   npx prisma db seed
//
// IMPORTANT:
// This seed does NOT delete existing vehicles, orders, customers, or other
// production records. Existing vehicles with matching IDs are updated,
// while new vehicles are inserted.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'AutoVault123!';

const cars = [
  // =========================
  // BYD
  // =========================

  {
    id: 'byd-atto-3',
    brand: 'BYD',
    model: 'Atto 3',
    year: 2026,
    price: 380000,
    type: 'SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '420 km',
    battery: '82.5 kWh Blade Battery',
    charging: '80 kW DC Fast Charging',
    description:
      'A modern electric SUV combining practicality, advanced safety technology and BYD Blade Battery innovation.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd_atto_3.jpg',
    features: [
      'Panoramic sunroof',
      '360° camera',
      'Adaptive cruise control',
      'Rotating touchscreen',
      'Vehicle-to-load',
    ],
  },

  {
    id: 'bydseal',
    brand: 'BYD',
    model: 'Seal',
    year: 2026,
    price: 520000,
    type: 'Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '230 kW Electric Motor',
    drive: 'RWD',
    seats: 5,
    mileage: 'New',
    colour: 'Blue',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '570 km',
    battery: '82.56 kWh Blade Battery',
    charging: '150 kW DC Fast Charging',
    description:
      'A premium electric sports sedan with impressive range, performance and futuristic styling.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/bydseal.jpg',
    features: [
      '15.6-inch rotating screen',
      'Panoramic roof',
      'Premium audio',
      'ADAS',
      'Vehicle-to-load',
    ],
  },

  {
    id: 'byd-dolphin',
    brand: 'BYD',
    model: 'Dolphin',
    year: 2026,
    price: 280000,
    type: 'Hatchback',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '427 km',
    battery: '60.48 kWh Blade Battery',
    charging: '88 kW DC Fast Charging',
    description:
      'A stylish and efficient compact electric vehicle ideal for modern city driving.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd-dolphin.jpg',
    features: [
      'Digital cockpit',
      '360° camera',
      'Wireless charging',
      'Smart connectivity',
      'LED lighting',
    ],
  },

  {
    id: 'byd-song-plus-dm-i',
    brand: 'BYD',
    model: 'Song Plus DM-i',
    year: 2026,
    price: 450000,
    type: 'SUV',
    fuel: 'Plug-in Hybrid',
    transmission: 'E-CVT',
    engine: '1.5L Hybrid',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '110 km electric / 1100 km combined',
    battery: '18.3 kWh Blade Battery',
    charging: '18 kW DC Charging',
    description:
      'A sophisticated plug-in hybrid SUV offering excellent fuel efficiency and long-distance capability.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd-song-plus-dm-i.jpg',
    features: [
      'Plug-in hybrid system',
      'Panoramic roof',
      '360° camera',
      'ADAS',
      'Large touchscreen',
    ],
  },

  // =========================
  // ZEEKR
  // =========================

  {
    id: 'zeekr-001',
    brand: 'Zeekr',
    model: '001',
    year: 2026,
    price: 720000,
    type: 'Shooting Brake',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '400 kW Dual Motor',
    drive: 'AWD',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'IN_TRANSIT',
    warranty: '6 years / 150,000 km',
    range: '620 km',
    battery: '100 kWh Lithium-ion',
    charging: '200 kW DC Fast Charging',
    description:
      'A high-performance luxury EV combining exceptional range, power and premium technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/zeekr-001.jpg',
    features: [
      'Air suspension',
      'Premium sound',
      'Panoramic roof',
      'Advanced ADAS',
      'Digital cockpit',
    ],
  },

  {
    id: 'zeekr-x',
    brand: 'Zeekr',
    model: 'X',
    year: 2026,
    price: 580000,
    type: 'SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '315 kW Dual Motor',
    drive: 'AWD',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '440 km',
    battery: '69 kWh Lithium-ion',
    charging: '150 kW DC Fast Charging',
    description:
      'A premium compact electric SUV with bold Scandinavian-inspired design and strong performance.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/zeekr-x.jpg',
    features: [
      'Face recognition',
      '360° camera',
      'Premium interior',
      'ADAS',
      'Wireless charging',
    ],
  },

  // =========================
  // XPENG
  // =========================

  {
    id: 'xpeng-g6',
    brand: 'XPeng',
    model: 'G6',
    year: 2026,
    price: 510000,
    type: 'SUV Coupe',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '218 kW Electric Motor',
    drive: 'RWD',
    seats: 5,
    mileage: 'New',
    colour: 'Silver',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '570 km',
    battery: '87.5 kWh',
    charging: '280 kW DC Fast Charging',
    description:
      'A technology-focused electric coupe SUV with ultra-fast charging capability.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/xpeng-g6.jpg',
    features: [
      'XPILOT ADAS',
      'Panoramic roof',
      'Large touchscreen',
      'Fast charging',
      'Smart parking',
    ],
  },

  {
    id: 'xpeng-p7',
    brand: 'XPeng',
    model: 'P7',
    year: 2026,
    price: 550000,
    type: 'Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '348 kW Dual Motor',
    drive: 'AWD',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'IN_TRANSIT',
    warranty: '6 years / 150,000 km',
    range: '586 km',
    battery: '82.7 kWh',
    charging: '175 kW DC Fast Charging',
    description:
      'A sleek performance electric sedan with intelligent driving technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/xpeng-p7.jpg',
    features: [
      'Autonomous driving assist',
      'Premium sound',
      'Panoramic roof',
      'Digital cockpit',
      'Smart parking',
    ],
  },

  // =========================
  // GAC AION
  // =========================

  {
    id: 'gac-aion-y-plus',
    brand: 'GAC Aion',
    model: 'Y Plus',
    year: 2026,
    price: 350000,
    type: 'SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'IN_STOCK',
    warranty: '5 years / 150,000 km',
    range: '490 km',
    battery: '63.2 kWh',
    charging: '120 kW DC Fast Charging',
    description:
      'A spacious and practical electric SUV designed for families and everyday mobility.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/gac-aion-y-plus.jpg',
    features: [
      'Large cabin',
      'Panoramic roof',
      'Digital dashboard',
      'Smart connectivity',
      'ADAS',
    ],
  },

  {
    id: 'gac-aion-s-plus',
    brand: 'GAC Aion',
    model: 'S Plus',
    year: 2026,
    price: 390000,
    type: 'Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '165 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Blue',
    status: 'IN_STOCK',
    warranty: '5 years / 150,000 km',
    range: '510 km',
    battery: '69.9 kWh',
    charging: '140 kW DC Fast Charging',
    description:
      'A refined electric sedan offering strong range and comfortable daily driving.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/gac-aion-s-plus.jpg',
    features: [
      'Digital cockpit',
      'ADAS',
      'Wireless charging',
      'Premium interior',
      'Smart connectivity',
    ],
  },

  // =========================
  // GEELY
  // =========================

  {
    id: 'geely-geometry-c',
    brand: 'Geely',
    model: 'Geometry C',
    year: 2026,
    price: 370000,
    type: 'SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Red',
    status: 'IN_STOCK',
    warranty: '5 years / 150,000 km',
    range: '485 km',
    battery: '70 kWh',
    charging: '100 kW DC Fast Charging',
    description:
      'A modern compact electric SUV offering practicality and advanced connectivity.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/geely-geometry-c.jpg',
    features: [
      'ADAS',
      'Digital dashboard',
      '360° camera',
      'Panoramic roof',
      'Smart infotainment',
    ],
  },

  {
    id: 'geely-galaxy-l7',
    brand: 'Geely',
    model: 'Galaxy L7',
    year: 2026,
    price: 470000,
    type: 'SUV',
    fuel: 'Plug-in Hybrid',
    transmission: '3-speed DHT',
    engine: '1.5L Turbo Hybrid',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '115 km electric / 1300 km combined',
    battery: '18.7 kWh',
    charging: '60 kW Fast Charging',
    description:
      'An advanced plug-in hybrid SUV with impressive combined range and intelligent technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/geely-galaxy-l7.jpg',
    features: [
      'Triple screen cockpit',
      'Hybrid technology',
      'Panoramic roof',
      'ADAS',
      'Premium audio',
    ],
  },

  // =========================
  // JETOUR
  // =========================

  {
    id: 't2',
    brand: 'Jetour',
    model: 'T1iDM',
    year: 2026,
    price: 430000,
    type: 'SUV',
    fuel: 'Plug-in Hybrid',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'IN_STOCK',
    warranty: '7 years / 150,000 km',
    range: '1,200 km',
    battery: '18.4 kWh',
    charging: '50 kW DC Fast Charging',
    description:
      'Design that Combines Urban and Off-road Styles. The design won the prestigious German Red Dot Award.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/t2.jpg',
    features: [
      'AR head-up display',
      'ADAS',
      'Panoramic roof',
      'Smart cockpit',
      '360° camera',
    ],
  },

  {
    id: 'jetour_dashing',
    brand: 'Jetour',
    model: 'Dashing',
    year: 2026,
    price: 440000,
    type: 'Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '190 kW Electric Motor',
    drive: 'RWD',
    seats: 5,
    mileage: 'New',
    colour: 'Silver',
    status: 'IN_STOCK',
    warranty: '6 years / 150,000 km',
    range: '515 km',
    battery: '79.97 kWh',
    charging: '120 kW DC Fast Charging',
    description:
      'A sleek electric sedan combining aerodynamic design and modern technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/jetour_dashing.jpg',
    features: [
      'Frameless doors',
      'AR HUD',
      'Panoramic roof',
      'Smart cockpit',
      'ADAS',
    ],
  },

  {
    id: 't1iDM',
    brand: 'Jetour',
    model: 'T1iDM',
    year: 2026,
    price: 430000,
    type: 'SUV',
    fuel: 'Plug-in Hybrid',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'IN_STOCK',
    warranty: '7 years / 150,000 km',
    range: '1,200 km',
    battery: '18.4 kWh',
    charging: '50 kW DC Fast Charging',
    description:
      'Design that Combines Urban and Off-road Styles. The design won the prestigious German Red Dot Award.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/t1iDM.jpg',
    features: [
      'Dual screens',
      'ADAS',
      '360° camera',
      'Panoramic roof',
    ],
  },

  // =========================
  // VOYAH
  // =========================

  {
    id: 'voyah-free',
    brand: 'Voyah',
    model: 'Free',
    year: 2026,
    price: 750000,
    type: 'Luxury SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '360 kW Dual Motor',
    drive: 'AWD',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'IN_TRANSIT',
    warranty: '6 years / 150,000 km',
    range: '500 km',
    battery: '106 kWh',
    charging: '150 kW DC Fast Charging',
    description:
      'A luxury electric SUV delivering powerful performance and premium comfort.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/voyah-free.jpg',
    features: [
      'Air suspension',
      'Premium leather',
      'Night vision',
      'ADAS',
      'Panoramic roof',
    ],
  },

  // =========================
  // BYD HAN
  // =========================

  {
    id: 'bydhanEV',
    brand: 'BYD',
    model: 'Han EV',
    year: 2026,
    price: 680000,
    type: 'Luxury Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '380 kW Dual Motor',
    drive: 'AWD',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'RESERVED',
    warranty: '6 years / 150,000 km',
    range: '605 km',
    battery: '85.4 kWh Blade Battery',
    charging: '120 kW DC Fast Charging',
    description:
      "BYD's flagship luxury electric sedan combining performance, comfort and advanced technology.",
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/bydhanEV.jpg',
    features: [
      'Premium Nappa leather',
      'Dynaudio sound',
      'ADAS',
      'Panoramic roof',
      'Executive rear seating',
    ],
  },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ============================================================
  // VEHICLE INVENTORY
  // ============================================================
  //
  // IMPORTANT:
  // We intentionally DO NOT delete old vehicles here.
  //
  // If a vehicle ID already exists:
  //   -> update its information and image URL.
  //
  // If the vehicle ID does not exist:
  //   -> create the vehicle.
  //
  // This protects existing orders and customer records.
  // ============================================================

  console.log('Updating vehicle inventory...');

  for (const car of cars) {
    await prisma.vehicle.upsert({
      where: {
        id: car.id,
      },

      update: {
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        type: car.type,
        fuel: car.fuel,
        transmission: car.transmission,
        engine: car.engine,
        drive: car.drive,
        seats: car.seats,
        mileage: car.mileage,
        colour: car.colour,
        status: car.status,
        warranty: car.warranty,
        range: car.range,
        battery: car.battery,
        charging: car.charging,
        description: car.description,
        img: car.img,
        features: [...car.features],
      },

      create: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        type: car.type,
        fuel: car.fuel,
        transmission: car.transmission,
        engine: car.engine,
        drive: car.drive,
        seats: car.seats,
        mileage: car.mileage,
        colour: car.colour,
        status: car.status,
        warranty: car.warranty,
        range: car.range,
        battery: car.battery,
        charging: car.charging,
        description: car.description,
        img: car.img,
        features: [...car.features],
      },
    });

    console.log(`Updated: ${car.brand} ${car.model}`);
  }

  console.log(
    `Vehicle inventory sync complete. Processed ${cars.length} vehicles.`,
  );

  // ============================================================
  // STAFF & CUSTOMER USERS
  // ============================================================

  console.log('Seeding staff & customer users...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@autovault.gh' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@autovault.gh',
      phone: '024 000 0000',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const staffSeed = [
    {
      name: 'Patience Bedi-Kwao',
      email: 'patience@autovault.gh',
      role: 'ADMIN' as const,
    },
    {
      name: 'Michael Mensah',
      email: 'michael@autovault.gh',
      role: 'SALES_AGENT' as const,
    },
    {
      name: 'Sandra Osei',
      email: 'sandra@autovault.gh',
      role: 'SALES_AGENT' as const,
    },
    {
      name: 'Linda Owusu',
      email: 'linda.owusu@autovault.gh',
      role: 'ACCOUNTANT' as const,
    },
    {
      name: 'Kojo Arthur',
      email: 'kojo.arthur@autovault.gh',
      role: 'INVENTORY_MANAGER' as const,
    },
    {
      name: 'David Kusi',
      email: 'david.kusi@autovault.gh',
      role: 'WORKSHOP_MANAGER' as const,
    },
  ];

  const staff: Record<string, any> = {};

  for (const s of staffSeed) {
    staff[s.name] = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        ...s,
        passwordHash,
      },
    });
  }

  const customerSeed = [
    {
      name: 'Kwame Mensah',
      email: 'kwame@example.com',
      phone: '024 111 2222',
    },
    {
      name: 'Ama Boateng',
      email: 'ama@example.com',
      phone: '020 111 2222',
    },
    {
      name: 'Daniel Owusu',
      email: 'daniel@example.com',
      phone: '055 111 2222',
    },
    {
      name: 'Linda Addo',
      email: 'linda@example.com',
      phone: '027 111 2222',
    },
    {
      name: 'Kojo Asante',
      email: 'kojo@example.com',
      phone: '050 111 2222',
    },
    {
      name: 'Nana Yaa',
      email: 'nanayaa@example.com',
      phone: '024 333 4444',
    },
  ];

  const customers: Record<string, any> = {};

  for (const c of customerSeed) {
    customers[c.name] = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        ...c,
        passwordHash,
        role: 'CUSTOMER',
      },
    });
  }

  // ============================================================
  // ORDERS, PAYMENTS, INVOICES & SHIPMENTS
  // ============================================================

  console.log('Seeding orders, payments, invoices & shipments...');

  const orderSeed = [
    {
      orderNo: 'AV-2026-583214',
      customer: 'Kwame Mensah',
      vehicleId: 'geely-galaxy-l7',
      amount: 580000,
      paid: 116000,
      status: 'PAYMENT_PENDING' as const,
    },
    {
      orderNo: 'AV-2026-582991',
      customer: 'Ama Boateng',
      vehicleId: 'byd-atto-3',
      amount: 380000,
      paid: 380000,
      status: 'VEHICLE_ALLOCATED' as const,
    },
    {
      orderNo: 'AV-2026-582731',
      customer: 'Daniel Owusu',
      vehicleId: 'xpeng-g6',
      amount: 510000,
      paid: 102000,
      status: 'SHIPPED' as const,
    },
    {
      orderNo: 'AV-2026-581940',
      customer: 'Linda Addo',
      vehicleId: 'gac-aion-y-plus',
      amount: 350000,
      paid: 350000,
      status: 'READY_FOR_COLLECTION' as const,
    },
    {
      orderNo: 'AV-2026-580412',
      customer: 'Kojo Asante',
      vehicleId: 'geely-geometry-c',
      amount: 370000,
      paid: 370000,
      status: 'DELIVERED' as const,
    },
  ];

  for (const o of orderSeed) {
    const cust = customers[o.customer];

    const order = await prisma.order.upsert({
      where: { orderNo: o.orderNo },
      update: {},
      create: {
        orderNo: o.orderNo,
        userId: cust.id,
        vehicleId: o.vehicleId,
        purchaseOption:
          o.paid >= o.amount ? 'FULL_PAYMENT' : 'DEPOSIT',
        vehiclePrice: o.amount,
        amountDue: o.amount,
        depositAmount: Math.round(o.amount * 0.2),
        amountPaid: o.paid,
        status: o.status,
        customerName: cust.name,
        customerPhone: cust.phone!,
        customerEmail: cust.email,
        deliveryPreference: 'Pickup',
      },
    });

    if (o.paid > 0) {
      await prisma.payment.upsert({
        where: {
          reference: `AVPAY-SEED-${o.orderNo}`,
        },
        update: {},
        create: {
          reference: `AVPAY-SEED-${o.orderNo}`,
          orderId: order.id,
          amount: o.paid,
          method: 'MOBILE_MONEY',
          status: 'VERIFIED',
        },
      });

      await prisma.invoice.upsert({
        where: {
          orderId: order.id,
        },
        update: {},
        create: {
          invoiceNo: `INV-${o.orderNo.replace('AV-', '')}`,
          orderId: order.id,
          totalAmount: o.amount,
          paidAmount: o.paid,
          balance: o.amount - o.paid,
        },
      });
    }

    if (
      [
        'SHIPPED',
        'ARRIVED_IN_GHANA',
        'CUSTOMS_CLEARING',
        'READY_FOR_COLLECTION',
        'DELIVERED',
      ].includes(o.status)
    ) {
      await prisma.shipment.upsert({
        where: {
          orderId: order.id,
        },
        update: {},
        create: {
          orderId: order.id,
          vessel: 'MV Auto Pioneer',
          container: `AVCU${Math.floor(
            100000 + Math.random() * 900000,
          )}`,
          status: o.status,
        },
      });
    }
  }

  // ============================================================
  // CRM LEADS
  // ============================================================

  console.log('Seeding CRM leads...');

  const leadSeed = [
    {
      leadNo: 'LD-00124',
      name: 'Kwame Mensah',
      phone: '024 111 2222',
      vehicleInterest: 'BYD Seal',
      source: 'WEBSITE' as const,
      agent: 'Michael Mensah',
      stage: 'NEGOTIATION' as const,
      value: 520000,
      notes: 'Requested finance options and charging information.',
    },
    {
      leadNo: 'LD-00123',
      name: 'Ama Boateng',
      phone: '020 111 2222',
      vehicleInterest: 'BYD Atto 3',
      source: 'INSTAGRAM' as const,
      agent: 'Patience Bedi-Kwao',
      stage: 'DEPOSIT_PAID' as const,
      value: 385000,
      notes: 'Deposit received; vehicle allocation in progress.',
    },
    {
      leadNo: 'LD-00122',
      name: 'Daniel Owusu',
      phone: '055 111 2222',
      vehicleInterest: 'Geely EX5',
      source: 'REFERRAL' as const,
      agent: 'Michael Mensah',
      stage: 'TEST_DRIVE' as const,
      value: 395000,
      notes: 'Interested in battery range and home charging.',
    },
    {
      leadNo: 'LD-00121',
      name: 'Linda Addo',
      phone: '027 111 2222',
      vehicleInterest: 'Chery Omoda E5',
      source: 'FACEBOOK' as const,
      agent: 'Sandra Osei',
      stage: 'INTERESTED' as const,
      value: 420000,
      notes: 'Asked about warranty and charging time.',
    },
    {
      leadNo: 'LD-00120',
      name: 'Kojo Asante',
      phone: '050 111 2222',
      vehicleInterest: 'XPeng G6',
      source: 'WALK_IN' as const,
      agent: 'Sandra Osei',
      stage: 'SOLD' as const,
      value: 510000,
      notes: 'Delivered. EV charging orientation scheduled.',
    },
    {
      leadNo: 'LD-00119',
      name: 'Nana Yaa',
      phone: '024 333 4444',
      vehicleInterest: 'Zeekr X',
      source: 'WHATSAPP' as const,
      agent: 'Michael Mensah',
      stage: 'NEW_LEAD' as const,
      value: 495000,
      notes: 'New enquiry about luxury compact EV options.',
    },
  ];

  for (const l of leadSeed) {
    await prisma.lead.upsert({
      where: {
        leadNo: l.leadNo,
      },
      update: {},
      create: {
        leadNo: l.leadNo,
        name: l.name,
        phone: l.phone,
        vehicleInterest: l.vehicleInterest,
        source: l.source,
        agentId: staff[l.agent].id,
        stage: l.stage,
        value: l.value,
        notes: l.notes,
      },
    });
  }

  // ============================================================
  // FINANCING APPLICATIONS & TRADE-INS
  // ============================================================

  console.log('Seeding financing applications & trade-ins...');

  const financeSeed = [
    {
      appNo: 'AV-FIN-2026-410221',
      customer: 'Kwame Mensah',
      vehicle: 'T1iDM',
      price: 520000,
      downPayment: 104000,
      loanAmount: 416000,
      term: 48,
      rate: 28,
      monthlyPayment: 14380,
      status: 'CREDIT_CHECK' as const,
    },
    {
      appNo: 'AV-FIN-2026-409887',
      customer: 'Ama Boateng',
      vehicle: 'Jetour X70 Plus',
      price: 420000,
      downPayment: 84000,
      loanAmount: 336000,
      term: 36,
      rate: 28,
      monthlyPayment: 13640,
      status: 'DOCUMENT_REVIEW' as const,
    },
    {
      appNo: 'AV-FIN-2026-409502',
      customer: 'Daniel Owusu',
      vehicle: 'Geely Coolray',
      price: 360000,
      downPayment: 72000,
      loanAmount: 288000,
      term: 60,
      rate: 27,
      monthlyPayment: 8720,
      status: 'APPROVED' as const,
    },
    {
      appNo: 'AV-FIN-2026-408810',
      customer: 'Linda Addo',
      vehicle: 'GAC GS3 Emzoom',
      price: 410000,
      downPayment: 41000,
      loanAmount: 369000,
      term: 24,
      rate: 29,
      monthlyPayment: 19230,
      status: 'DECLINED' as const,
    },
    {
      appNo: 'AV-FIN-2026-408100',
      customer: 'Kojo Asante',
      vehicle: 'Changan CS55 Plus',
      price: 385000,
      downPayment: 77000,
      loanAmount: 308000,
      term: 36,
      rate: 28,
      monthlyPayment: 12500,
      status: 'DISBURSED' as const,
    },
  ];

  for (const f of financeSeed) {
    await prisma.financeApplication.upsert({
      where: {
        appNo: f.appNo,
      },
      update: {},
      create: {
        appNo: f.appNo,
        userId: customers[f.customer].id,
        vehicle: f.vehicle,
        price: f.price,
        downPayment: f.downPayment,
        loanAmount: f.loanAmount,
        term: f.term,
        rate: f.rate,
        monthlyPayment: f.monthlyPayment,
        status: f.status,
      },
    });
  }

  const tradeSeed = [
    {
      tradeNo: 'AV-TI-2026-330144',
      customer: 'Nana Yaa',
      brand: 'Toyota',
      model: 'RAV4',
      year: 2016,
      value: 198000,
      status: 'PENDING_VALUATION' as const,
    },
    {
      tradeNo: 'AV-TI-2026-329981',
      customer: 'Kwame Mensah',
      brand: 'Honda',
      model: 'CR-V',
      year: 2015,
      value: 171000,
      status: 'OFFER_SENT' as const,
    },
    {
      tradeNo: 'AV-TI-2026-329502',
      customer: 'Ama Boateng',
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2017,
      value: 205000,
      status: 'ACCEPTED' as const,
    },
  ];

  for (const t of tradeSeed) {
    await prisma.tradeIn.upsert({
      where: {
        tradeNo: t.tradeNo,
      },
      update: {},
      create: {
        tradeNo: t.tradeNo,
        userId: customers[t.customer].id,
        vehicleBrand: t.brand,
        vehicleModel: t.model,
        vehicleYear: t.year,
        estimatedLow: Math.round(t.value * 0.9),
        estimatedValue: t.value,
        estimatedHigh: Math.round(t.value * 1.05),
        status: t.status,
      },
    });
  }

  // ============================================================
  // SERVICE JOB CARDS, WARRANTY CLAIMS & PARTS
  // ============================================================

  console.log('Seeding service job cards, warranty claims & parts...');

  const jobSeed = [
    {
      bookingNo: 'AV-SVC-2026-710221',
      customer: 'Kwame Mensah',
      vehicle: 'gac-aion-s-plus',
      serviceType: 'Routine Maintenance',
      status: 'IN_PROGRESS' as const,
      laborHours: 3,
      parts: [
        {
          code: 'PT-0002',
          name: 'Oil filter',
          qty: 1,
          price: 120,
        },
        {
          code: 'PT-0001',
          name: 'Engine oil 5L',
          qty: 1,
          price: 480,
        },
      ],
    },
    {
      bookingNo: 'AV-SVC-2026-709887',
      customer: 'Ama Boateng',
      vehicle: 'Jetour X70 Plus',
      serviceType: 'Brake Service',
      status: 'AWAITING_PARTS' as const,
      laborHours: 2,
      parts: [
        {
          code: 'PT-0003',
          name: 'Brake pads (set)',
          qty: 1,
          price: 650,
        },
      ],
    },
    {
      bookingNo: 'AV-SVC-2026-709502',
      customer: 'Daniel Owusu',
      vehicle: 'Geely Coolray',
      serviceType: 'Diagnostic Check',
      status: 'QUALITY_CHECK' as const,
      laborHours: 1,
      parts: [],
    },
    {
      bookingNo: 'AV-SVC-2026-708810',
      customer: 'Linda Addo',
      vehicle: 'GAC GS3 Emzoom',
      serviceType: 'Tyres & Alignment',
      status: 'COMPLETED' as const,
      laborHours: 2,
      paid: true,
      parts: [
        {
          code: 'PT-0005',
          name: 'Tyre — 215/60R17',
          qty: 4,
          price: 520,
        },
      ],
    },
    {
      bookingNo: 'AV-SVC-2026-708100',
      customer: 'Kojo Asante',
      vehicle: 'Changan CS55 Plus',
      serviceType: 'Oil & Filter Change',
      status: 'COMPLETED' as const,
      laborHours: 1,
      paid: false,
      parts: [
        {
          code: 'PT-0002',
          name: 'Oil filter',
          qty: 1,
          price: 120,
        },
        {
          code: 'PT-0001',
          name: 'Engine oil 5L',
          qty: 1,
          price: 480,
        },
      ],
    },
  ];

  for (const j of jobSeed) {
    const booking = await prisma.serviceBooking.upsert({
      where: {
        bookingNo: j.bookingNo,
      },
      update: {},
      create: {
        bookingNo: j.bookingNo,
        userId: customers[j.customer].id,
        vehicle: j.vehicle,
        serviceType: j.serviceType,
        status: j.status,
        laborHours: j.laborHours,
        paid: !!j.paid,
      },
    });

    for (const p of j.parts) {
      await prisma.jobPart.upsert({
        where: {
          id: `${booking.id}-${p.code}`,
        },
        update: {},
        create: {
          id: `${booking.id}-${p.code}`,
          serviceBookingId: booking.id,
          partCode: p.code,
          name: p.name,
          qty: p.qty,
          price: p.price,
        },
      });
    }
  }

  // ============================================================
  // WARRANTY CLAIMS
  // ============================================================

  const claimSeed = [
    {
      claimNo: 'AV-WC-2026-550144',
      customer: 'Nana Yaa',
      vehicle: 'Jetour Dashing',
      issue: 'Dashboard warning light for ABS intermittently on.',
      orderNo: 'AV-2026-579312',
      status: 'UNDER_REVIEW' as const,
    },
    {
      claimNo: 'AV-WC-2026-549981',
      customer: 'Kwame Mensah',
      vehicle: 'Jetour Dashing',
      issue: 'Air conditioning not cooling on the passenger side.',
      orderNo: 'AV-2026-577201',
      status: 'APPROVED' as const,
    },
    {
      claimNo: 'AV-WC-2026-549502',
      customer: 'Ama Boateng',
      vehicle: 'GAC GS3 Emzoom',
      issue: 'Rattling noise from rear suspension over bumps.',
      orderNo: 'AV-2026-574009',
      status: 'RESOLVED' as const,
    },
  ];

  for (const c of claimSeed) {
    await prisma.warrantyClaim.upsert({
      where: {
        claimNo: c.claimNo,
      },
      update: {},
      create: {
        claimNo: c.claimNo,
        userId: customers[c.customer].id,
        vehicle: c.vehicle,
        issue: c.issue,
        orderNo: c.orderNo,
        status: c.status,
      },
    });
  }

  // ============================================================
  // PARTS INVENTORY
  // ============================================================

  const partSeed = [
    {
      code: 'PT-0001',
      name: 'Engine oil 5L',
      stock: 24,
      price: 480,
    },
    {
      code: 'PT-0002',
      name: 'Oil filter',
      stock: 31,
      price: 120,
    },
    {
      code: 'PT-0003',
      name: 'Brake pads (set)',
      stock: 8,
      price: 650,
    },
    {
      code: 'PT-0004',
      name: 'Air filter',
      stock: 3,
      price: 150,
    },
    {
      code: 'PT-0005',
      name: 'Tyre — 215/60R17',
      stock: 12,
      price: 520,
    },
    {
      code: 'PT-0006',
      name: 'Cabin filter',
      stock: 2,
      price: 110,
    },
  ];

  for (const p of partSeed) {
    await prisma.part.upsert({
      where: {
        code: p.code,
      },
      update: {},
      create: p,
    });
  }

  console.log('========================================');
  console.log('AutoVault seed completed successfully.');
  console.log(`Processed ${cars.length} vehicles.`);
  console.log(`All demo accounts use password: ${DEMO_PASSWORD}`);
  console.log('Admin login: admin@autovault.gh');
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });