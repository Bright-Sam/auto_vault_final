import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Calculator,
  Check,
  Gauge,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { money } from '../../data';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const row = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!row) {
    notFound();
  }

  const car = {
    ...row,
    status:
      row.status === 'IN_STOCK'
        ? 'In Stock'
        : row.status === 'IN_TRANSIT'
        ? 'In Transit'
        : row.status === 'RESERVED'
        ? 'Reserved'
        : 'Sold',
  };

  return (
    <main className="detailPage">

      {/* Navigation */}
      <header className="nav">
        <Link href="/" className="logo">
          <span className="shield">AV</span>

          <span>
            AUTO <b>VAULT</b>
            <small>DRIVE THE FUTURE</small>
          </span>
        </Link>

        <nav className="navlinks static">
          <Link href="/#vehicles">Vehicles</Link>
          <Link href="/#brands">Brands</Link>
          <Link href="/#finance">Finance</Link>
          <Link href="/#contact">Contact</Link>
        </nav>

        <a className="navcta" href="tel:0245202242">
          <Phone size={16} />
          024 520 2242
        </a>
      </header>

      {/* Back Button */}
      <div className="crumb">
        <Link href="/">
          <ArrowLeft size={16} />
          Back to vehicles
        </Link>
      </div>

      {/* Vehicle Hero */}
      <section className="detailHero">

        <div className="detailImage">
          <img
            src={car.img}
            alt={`${car.brand} ${car.model}`}
          />

          <span
            className={
              car.status === 'In Stock'
                ? 'stock'
                : 'transit'
            }
          >
            {car.status}
          </span>
        </div>

        <div className="detailInfo">

          <p className="eyebrow dark">
            {car.brand} · {car.year} · {car.type}
          </p>

          <h1>{car.model}</h1>

          <p className="detailDescription">
            {car.description}
          </p>
/* EV Performance Highlights */
            <div className="evHighlights">

  <div className="evHighlight">
    <BatteryCharging size={22} />
    <div>
      <small>BATTERY</small>
      <strong>{car.battery || 'N/A'}</strong>
    </div>
  </div>

  <div className="evHighlight">
    <Gauge size={22} />
    <div>
      <small>DRIVING RANGE</small>
      <strong>{car.range || 'N/A'}</strong>
    </div>
  </div>

  <div className="evHighlight">
    <Zap size={22} />
    <div>
      <small>CHARGING</small>
      <strong>{car.charging || 'N/A'}</strong>
    </div>
  </div>

</div>

          <div className="price">
            {money(car.price)}
          </div>

          <p className="mutedLine">
            Price shown is a starting price. Confirm final
            specification, registration and delivery costs with
            Auto Vault.
          </p>

          <div className="detailButtons">

            <Link
              className="btn primary"
              href={`/order/${car.id}`}
            >
              Order now
              <ArrowRight size={18} />
            </Link>

            <Link
              className="btn outline"
              href={`/financing?vehicle=${car.id}`}
            >
              <Calculator size={16} />
              Estimate financing
            </Link>

            <a
              className="btn outline"
              href="tel:0245202242"
            >
              Call sales
            </a>

          </div>

          <div className="detailTrust">

            <span>
              <ShieldCheck />
              {car.warranty}
            </span>

            <span>
              <MapPin />
              Spintex, Accra
            </span>

          </div>

        </div>

      </section>

      {/* Specifications */}
      <section className="specSection">

        <div>
          <p className="eyebrow dark">
            SPECIFICATIONS
          </p>

          <h2>
            Everything you need to know.
          </h2>
        </div>

        <div className="specGrid">

          {[
            ['Powertrain', car.fuel],
            ['Range', car.range],
            ['Battery', car.battery],
            ['Charging', car.charging],
            ['Transmission', car.transmission],
            ['Drive', car.drive],
            ['Seats', String(car.seats)],
            ['Mileage', car.mileage],
            ['Colour', car.colour],
            ['Warranty', car.warranty],
          ].map(([label, value]) => (

            <div
              className="spec"
              key={label}
            >
              <small>{label}</small>

              <strong>
                {value || 'N/A'}
              </strong>
            </div>

          ))}

        </div>

      </section>

      {/* Features */}
      <section className="featureSection">

        <div>
          <p className="eyebrow">
            FEATURES
          </p>

          <h2>
            Built around you.
          </h2>
        </div>

        <div className="featureList">

          {car.features.map((feature) => (

            <div key={feature}>
              <Check />
              <span>{feature}</span>
            </div>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="ctaStrip">

        <div>

          <p className="eyebrow">
            READY TO DRIVE?
          </p>

          <h2>
            Talk to Auto Vault today.
          </h2>

          <p>
            Book a viewing, request a quotation or start your
            purchase enquiry.
          </p>

        </div>

        <a
          className="btn primary"
          href="https://wa.me/233245202242"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp sales
          <ArrowRight size={18} />
        </a>

      </section>

    </main>
  );
}