'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Search, ShieldCheck, Truck} from 'lucide-react';

export default function TrackHome(){
 const [orderNo,setOrderNo]=useState('');
 return <main className="trackLanding"><header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><Link href="/account" className="accountLink">My Account</Link></header><section className="trackHero"><div className="trackIntro"><p className="eyebrow dark">AUTO VAULT DELIVERY PORTAL</p><h1>Track your vehicle.</h1><p>Enter your Auto Vault order number to see the latest status of your vehicle, payment and delivery journey.</p><div className="trackForm"><input value={orderNo} onChange={e=>setOrderNo(e.target.value.toUpperCase())} placeholder="e.g. AV-2026-00125"/><Link className="btn primary" href={orderNo?`/track/${encodeURIComponent(orderNo)}`:'#'}><Search size={18}/> Track order</Link></div><small>Example: AV-2026-00125</small></div><div className="trackFeature"><Truck size={54}/><h2>From order to delivery</h2><p>Follow every major milestone from payment confirmation to vehicle handover.</p><div><ShieldCheck/> Secure customer tracking</div></div></section></main>
}
