export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  type: string;
  fuel: 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
  transmission: string;
  engine: string;
  drive: string;

  range: string;
  battery: string;
  charging: string;

  seats: number;
  mileage: string;
  colour: string;
  status: 'In Stock' | 'In Transit' | 'Reserved';
  warranty: string;
  description: string;
  img: string;
  features: string[];
};

export const brands = [
  "BYD",
  "Zeekr",
  "XPeng",
  "GAC Aion",
  "Geely",
  "Jetour",
  "Chery",
  //"Neta",
  "Voyah",
];

export const money = (value: number) =>
  `GH₵ ${value.toLocaleString('en-GH')}`;

export const cars: Car[] = [

  // ================= BYD =================

  {
    id: 'byd-atto-3',
    brand: 'BYD',
    model: 'Atto 3',
    year: 2026,
    price: 420000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    range: '420 km',
    battery: '60.48 kWh Blade Battery',
    charging: '80 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'In Stock',
    warranty: '6 years / 150,000 km',
    description: 'A stylish and practical electric SUV featuring BYD Blade Battery technology and a premium technology-focused cabin.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/BYD_Atto_3.jpg',
    features: ['Panoramic sunroof', '360° camera', 'Adaptive cruise control', 'Rotating touchscreen', 'Vehicle-to-load charging']
  },

  {
    id: 'byd-seal',
    brand: 'BYD',
    model: 'Seal',
    year: 2026,
    price: 520000,
    type: 'Electric Sedan',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '230 kW Electric Motor',
    drive: 'RWD',
    range: '570 km',
    battery: '82.5 kWh Blade Battery',
    charging: '150 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Blue',
    status: 'In Stock',
    warranty: '6 years / 150,000 km',
    description: 'A sleek performance electric sedan combining long range, rapid charging and advanced driving technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/BYDSEAL.jpg',
    features: ['15.6-inch rotating display', 'Panoramic roof', 'Premium audio', 'Adaptive cruise control', 'Wireless charging']
  },

  {
    id: 'byd-dolphin',
    brand: 'BYD',
    model: 'Dolphin',
    year: 2026,
    price: 310000,
    type: 'Electric Hatchback',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    range: '427 km',
    battery: '60.48 kWh Blade Battery',
    charging: '88 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Pink',
    status: 'In Stock',
    warranty: '6 years / 150,000 km',
    description: 'A compact and efficient electric hatchback designed for modern city driving.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd-dolphin.jpg',
    features: ['Rotating touchscreen', '360° camera', 'Wireless charging', 'LED lights', 'Smart key']
  },

  {
    id: 'byd-seal-u-dmi',
    brand: 'BYD',
    model: 'Seal U DM-i',
    year: 2026,
    price: 490000,
    type: 'Plug-in Hybrid SUV',
    fuel: 'Plug-in Hybrid',
    transmission: 'E-CVT',
    engine: '1.5L Hybrid + Electric Motor',
    drive: 'FWD',
    range: '1,100 km Combined',
    battery: '18.3 kWh Blade Battery',
    charging: 'AC + DC Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'In Transit',
    warranty: '6 years / 150,000 km',
    description: 'A versatile plug-in hybrid SUV offering electric driving with long-distance flexibility.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd-song-plus-dm-i.jpg',
    features: ['Panoramic roof', '360° camera', 'Adaptive cruise control', 'Large touchscreen', 'Vehicle-to-load']
  },


  // ================= ZEEKR =================

  {
    id: 'zeekr-x',
    brand: 'Zeekr',
    model: 'X',
    year: 2026,
    price: 480000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '200 kW Electric Motor',
    drive: 'RWD',
    range: '440 km',
    battery: '66 kWh Lithium-ion Battery',
    charging: '150 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'In Stock',
    warranty: '5 years / 150,000 km',
    description: 'A premium compact electric SUV with futuristic styling and advanced safety technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/zeekr-001.jpg',
    features: ['Frameless doors', '360° camera', 'Premium audio', 'Panoramic roof', 'ADAS']
  },

  {
    id: 'zeekr-001',
    brand: 'Zeekr',
    model: '001',
    year: 2026,
    price: 680000,
    type: 'Electric Shooting Brake',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '400 kW Dual Motor',
    drive: 'AWD',
    range: '620 km',
    battery: '100 kWh Battery',
    charging: '200 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'In Transit',
    warranty: '5 years / 150,000 km',
    description: 'A high-performance luxury EV delivering exceptional range, power and futuristic technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/zeekr-x.jpg',
    features: ['Air suspension', 'Premium audio', 'Panoramic glass roof', 'ADAS', 'Fast charging']
  },


  // ================= XPENG =================

  {
    id: 'xpeng-g6',
    brand: 'XPeng',
    model: 'G6',
    year: 2026,
    price: 510000,
    type: 'Electric Coupe SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '210 kW Electric Motor',
    drive: 'RWD',
    range: '570 km',
    battery: '87.5 kWh Battery',
    charging: '280 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Silver',
    status: 'In Stock',
    warranty: '5 years / 150,000 km',
    description: 'A futuristic electric coupe SUV built on an advanced 800V charging architecture.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/xpeng-g6.jpg',
    features: ['800V architecture', 'XPILOT ADAS', 'Panoramic roof', 'Smart cockpit', 'Fast charging']
  },

  {
    id: 'xpeng-p7',
    brand: 'XPeng',
    model: 'p7',
    year: 2026,
    price: 720000,
    type: 'Luxury Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '405 kW Dual Motor',
    drive: 'AWD',
    range: '650 km',
    battery: '98 kWh Battery',
    charging: '300 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'Reserved',
    warranty: '5 years / 150,000 km',
    description: 'A flagship luxury electric SUV featuring ultra-fast charging and advanced intelligent driving.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/xpeng-p7.jpg',
    features: ['Air suspension', 'Massage seats', 'Premium audio', 'Advanced ADAS', 'Ultra-fast charging']
  },


  // ================= GAC AION =================

  {
    id: 'gac-aion-y-plus',
    brand: 'GAC Aion',
    model: 'Y Plus',
    year: 2026,
    price: 350000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '150 kW Electric Motor',
    drive: 'FWD',
    range: '490 km',
    battery: '63.2 kWh Battery',
    charging: 'Fast DC Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Green',
    status: 'In Stock',
    warranty: '5 years / 150,000 km',
    description: 'A spacious and efficient family-friendly electric SUV with impressive cabin space.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/gac-aion-y-plus.jpg',
    features: ['Panoramic roof', 'Large touchscreen', '360° camera', 'Smart connectivity', 'Fast charging']
  },

  {
    id: 'gac-aion-s-plus',
    brand: 'GAC Aion',
    model: 'S Plus',
    year: 2026,
    price: 470000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '180 kW Electric Motor',
    drive: 'FWD',
    range: '520 km',
    battery: '75 kWh Battery',
    charging: '180 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Blue',
    status: 'In Transit',
    warranty: '5 years / 150,000 km',
    description: 'A technology-focused electric SUV designed for comfortable long-distance travel.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/gac-aion-s-plus.jpg',
    features: ['ADAS', 'Panoramic roof', 'Digital cockpit', 'Wireless charging', 'Fast charging']
  },


  // ================= GEELY =================

  {
    id: 'geely-galaxy-l7',
    brand: 'Geely',
    model: 'Galaxy L7',
    year: 2026,
    price: 390000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '160 kW Electric Motor',
    drive: 'FWD',
    range: '430 km',
    battery: '60.2 kWh LFP Battery',
    charging: '100 kW DC Fast Charging',
    seats: 5,
    mileage: 'New',
    colour: 'White',
    status: 'In Stock',
    warranty: '6 years / 150,000 km',
    description: 'A practical and refined electric SUV with excellent efficiency and family-friendly comfort.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/geely-galaxy-l7.jpg',
    features: ['Panoramic roof', '360° camera', 'Adaptive cruise control', 'Digital cockpit', 'Fast charging']
  },

  {
    id: 'geely-geometry-c',
    brand: 'Geely',
    model: 'Geometry C',
    year: 2026,
    price: 370000,
    type: 'Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '160 kW Electric Motor',
    drive: 'FWD',
    range: '530 km',
    battery: '60.2 kWh Aegis Battery',
    charging: 'Fast DC Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Grey',
    status: 'In Stock',
    warranty: '6 years / 150,000 km',
    description: 'A smart and efficient electric SUV featuring Geely advanced battery safety technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/geely-geometry-c.jpg',
    features: ['Smart cockpit', 'ADAS', 'Panoramic roof', 'Wireless charging', '360° camera']
  },


  // ================= JETOUR =================

  {
    id: "JETOUR T1iDM",
    brand: "JETOUR",
    model: "T1iDM",
    year: 2026,
    price: 430000,
    type: "SUV",
    fuel: "Plug-in Hybrid",
    transmission: "Single-speed Automatic",
    engine: "150 kW Electric Motor",
    drive: "FWD",
    seats: 5,
    mileage: "New",
    colour: "Grey",
    status: "In Stock",
    warranty: "7 years / 150,000 km",
    range: "1,200 km",
    battery: "18.4 kWh",
    charging: "50 kW DC Fast Charging",
    description:
      "Design that Combines Urban and Off-road Styles. The design won the prestigious German Red Dot Award",
    img: "https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/T1iDM.jpg",
    features: ['AR-HUD', '360° camera', 'ADAS', 'Panoramic roof', 'Smart cockpit']
  },

  {
    id: "Jetour_Dashing",
    brand: "JETOUR",
    model: "Dashing",
    year: 2026,
    price: 440000,
    type: "Sedan",
    fuel: "Electric",
    transmission: "Single-speed Automatic",
    engine: "190 kW Electric Motor",
    drive: "RWD",
    seats: 5,
    mileage: "New",
    colour: "Silver",
    status: "In Stock",
    warranty: "6 years / 150,000 km",
    range: "515 km",
    battery: "79.97 kWh",
    charging: "120 kW DC Fast Charging",
    description:
      "A sleek electric sedan combining aerodynamic design and modern technology.",
    img: "https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/Jetour_Dashing.jpg",
    features: ['AR-HUD', 'Premium audio', 'ADAS', 'Smart cockpit', 'Fast charging']
  },


  // ================= VOYAH =================

  {
    id: 'voyah-free',
    brand: 'Voyah',
    model: 'Free',
    year: 2026,
    price: 750000,
    type: 'Luxury Electric SUV',
    fuel: 'Electric',
    transmission: 'Single-speed Automatic',
    engine: '360 kW Dual Motor',
    drive: 'AWD',
    range: '500 km',
    battery: '100 kWh Battery',
    charging: 'Fast DC Charging',
    seats: 5,
    mileage: 'New',
    colour: 'Black',
    status: 'Reserved',
    warranty: '5 years / 150,000 km',
    description: 'A premium luxury electric SUV combining powerful performance with advanced comfort technology.',
    img: 'https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/Voyah-FREE.jpg',
    features: ['Air suspension', 'Massage seats', 'Premium audio', 'Panoramic roof', 'Advanced ADAS']
  },

  {
    id: "byd-han-ev",
    brand: "BYD",
    model: "Han EV",
    year: 2026,
    price: 680000,
    type: "Luxury Sedan",
    fuel: "Electric",
    transmission: "Single-speed Automatic",
    engine: "380 kW Dual Motor",
    drive: "AWD",
    seats: 5,
    mileage: "New",
    colour: "Black",
    status: "Reserved",
    warranty: "6 years / 150,000 km",
    range: "605 km",
    battery: "85.4 kWh Blade Battery",
    charging: "120 kW DC Fast Charging",
    description:
      "BYD's flagship luxury electric sedan combining performance, comfort and advanced technology.",
    img: "https://wzszopkfpswtttmpqaeg.supabase.co/storage/v1/object/public/autovault/byd%20hanEV.jpg",
    features: ['Executive captain seats', 'Massage seats', 'Premium audio', 'Panoramic roof', 'Air suspension']
  }
];

/*export const money = (value: number) =>
  `GH₵ ${value.toLocaleString("en-GH")}`;*/

export const getCar = (id: string) =>
  cars.find((car) => car.id === id);