'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Battery,
  Check,
  Gauge,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
import { brands, money } from './data';

const filterBrands = ['All', ...brands];

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [activeBrand, setActiveBrand] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<'order' | 'testdrive' | null>(null);
  const [selectedCar, setSelectedCar] = useState('');

  useEffect(() => { fetch('/api/vehicles').then(r => r.json()).then(setCars).catch(() => {}); }, []);

  const filtered = useMemo(() => cars.filter(c => (activeBrand === 'All' || c.brand === activeBrand) && `${c.brand} ${c.model}`.toLowerCase().includes(query.toLowerCase())), [cars, activeBrand, query]);

  return (
    <main>
      <header className="nav">
        <a href="#top" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></a>
        <nav className={mobileOpen ? 'navlinks open' : 'navlinks'}>
          <a href="#vehicles" onClick={() => setMobileOpen(false)}>Vehicles</a>
          <a href="#brands" onClick={() => setMobileOpen(false)}>Brands</a>
          <a href="#why" onClick={() => setMobileOpen(false)}>Why Auto Vault</a>
          <a href="#finance" onClick={() => setMobileOpen(false)}>Finance</a>
          <Link href="/service" onClick={() => setMobileOpen(false)}>Service</Link>
          <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        </nav>
        <button className="menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
        <div className="navRight"><Link className="accountLink" href="/account">My Account</Link><a className="navcta" href="tel:0245202242"><Phone size={16}/> 024 520 2242</a></div>
      </header>

      <section className="hero" id="top">
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">PREMIUM CHINESE CARS · BUILT FOR AFRICA</p>
          <h1>More features.<br/><em>More value.</em><br/>More for you.</h1>
          <p className="heroText">Discover premium Chinese vehicles from Jetour, Changan, Chery, Geely and GAC — with reliable support in Accra.</p>
          <div className="actions"><a className="btn primary" href="#vehicles">Explore vehicles <ArrowRight size={18}/></a><button className="btn ghost" onClick={() => setModal('testdrive')}>Book a test drive</button></div>
          <div className="heroTrust"><span><Check/> Quality checked</span><span><Check/> Warranty available</span><span><Check/> After-sales support</span></div>
        </div>
      </section>

      <section className="brands" id="brands"><div><span>TOP CHINESE BRANDS</span><strong>World-class quality.</strong></div><div className="brandList">{brands.map(b => <button key={b} onClick={() => {setActiveBrand(b); document.getElementById('vehicles')?.scrollIntoView({behavior:'smooth'});}}>{b}</button>)}</div></section>

      <section className="section" id="vehicles">
        <div className="sectionHead"><div><p className="eyebrow dark">OUR COLLECTION</p><h2>Find your next drive.</h2></div><div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search model or brand"/></div></div>
        <div className="filters">{filterBrands.map(b => <button className={activeBrand === b ? 'active' : ''} key={b} onClick={() => setActiveBrand(b)}>{b}</button>)}</div>
<div className="grid">
  {filtered.map((car) => (
    <article className="carCard" key={car.id}>
      
      <div className="carImage">
        <img
          src={car.img}
          alt={`${car.brand} ${car.model}`}
        />

        <div className="vehicleBadges">
          <span className="newBadge">NEW</span>

          <span className="powerBadge">
            <Zap size={13} />
            {car.fuel}
          </span>
        </div>
      </div>

      <div className="carBody">

        <div className="muted">
          {car.brand} · {car.year} · {car.type}
        </div>

        <h3>{car.model}</h3>

        {/* EV Quick Specifications */}
        <div className="quickSpecs">

          <div>
            <Gauge size={16} />
            <span>{car.range || 'Range N/A'}</span>
          </div>

          <div>
            <Battery size={16} />
            <span>{car.battery || 'Battery N/A'}</span>
          </div>

          <div>
            <Zap size={16} />
            <span>{car.charging || 'Charging N/A'}</span>
          </div>

        </div>

        <strong className="carPrice">
          {money(car.price)}
        </strong>

        <div className="cardActions">

          <Link href={`/vehicles/${car.id}`}>
            View details
            <ArrowRight size={15} />
          </Link>

          <button
            onClick={() => {
              setSelectedCar(`${car.brand} ${car.model}`);
              setModal('order');
            }}
          >
            Order now
          </button>

          <a
            href={`https://wa.me/233245202242?text=Hello%20Auto%20Vault,%20I'm%20interested%20in%20the%20${encodeURIComponent(
              car.brand + ' ' + car.model
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

        </div>

      </div>
    </article>
  ))}
</div>
      </section>

      <section className="why" id="why"><div><p className="eyebrow">THE AUTO VAULT DIFFERENCE</p><h2>Premium cars.<br/>Serious value.</h2><p>We combine advanced technology, competitive pricing and dependable after-sales support to make buying a vehicle in Ghana simpler.</p><a className="textLink" href="#contact">Talk to our team <ArrowRight size={17}/></a></div><div className="benefits"><div><ShieldCheck/><h3>Quality checked</h3><p>Vehicles selected and prepared for the roads ahead.</p></div><div><Sparkles/><h3>Advanced technology</h3><p>Modern features without the premium-brand price tag.</p></div><div><Check/><h3>After-sales support</h3><p>Warranty and support to keep you moving.</p></div></div></section>

      <section className="finance" id="finance"><div><p className="eyebrow dark">DRIVE SOONER</p><h2>Flexible ways to own your car.</h2><p>Calculate a monthly payment, apply for financing or get an instant trade-in estimate on your current vehicle.</p></div><div className="financeCtas"><Link href="/financing" className="btn primary">Calculate financing <ArrowRight size={18}/></Link><button className="btn outline" onClick={() => setModal('order')}>Start an enquiry</button></div></section>

      <footer id="contact"><div><a className="logo" href="#top"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></a><p>Premium Chinese cars. Built for Africa.</p></div><div><h4>Visit us</h4><p>Spintex — Accra, Ghana</p><p><a href="tel:0245202242">024 520 2242</a></p></div><div><h4>Explore</h4><a href="#vehicles">Vehicles</a><a href="#brands">Brands</a><a href="#finance">Finance</a><Link href="/service">Service</Link></div></footer>
      <div className="copyright">© 2026 Auto Vault. All rights reserved.</div>

      {modal && <div className="modalBackdrop" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setModal(null)}><X/></button><p className="eyebrow dark">AUTO VAULT</p><h2>{modal === 'order' ? 'Start your vehicle enquiry' : 'Book a test drive'}</h2><p>Leave your details and our sales team will contact you on WhatsApp or phone.</p><input placeholder="Full name"/><input placeholder="Phone number"/><input value={selectedCar} onChange={e=>setSelectedCar(e.target.value)} placeholder="Vehicle / model"/><button className="btn primary" onClick={() => setModal(null)}>Submit enquiry <ArrowRight size={18}/></button></div></div>}
    </main>
  );
}
