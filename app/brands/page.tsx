import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { brands, money } from '../data';

export const dynamic = 'force-dynamic';

export default async function BrandsPage(){
  const rows = await prisma.vehicle.findMany({ orderBy: { createdAt: 'asc' } });
  const cars = rows.map(v => ({ ...v, status: v.status === 'IN_STOCK' ? 'In Stock' : v.status === 'IN_TRANSIT' ? 'In Transit' : v.status === 'RESERVED' ? 'Reserved' : 'Sold' }));
  return <main><header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><nav className="navlinks static"><Link href="/#vehicles">Vehicles</Link><Link href="/brands">Brands</Link><Link href="/#finance">Finance</Link><Link href="/#contact">Contact</Link></nav></header><section className="brandHero"><p className="eyebrow">OUR BRANDS</p><h1>Top Chinese brands.<br/><em>World-class quality.</em></h1><p>Explore the brands available through Auto Vault in Ghana.</p></section><section className="section">{brands.map(brand=>{const items=cars.filter(c=>c.brand===brand);return <div className="brandBlock" key={brand}><div className="brandBlockHead"><div><p className="eyebrow dark">AUTO VAULT</p><h2>{brand}</h2></div><span>{items.length} vehicle{items.length!==1?'s':''}</span></div><div className="grid">{items.map(car=><article className="carCard" key={car.id}><div className="carImage"><img src={car.img} alt={`${car.brand} ${car.model}`}/><span>{car.status}</span></div><div className="carBody"><div className="muted">{car.year} · {car.type}</div><h3>{car.model}</h3><strong>{money(car.price)}</strong><div className="cardActions"><Link href={`/vehicles/${car.id}`}>View vehicle <ArrowRight size={14}/></Link></div></div></article>)}</div></div>})}</section></main>;
}
