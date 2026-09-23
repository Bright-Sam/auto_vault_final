'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { money } from '../../data';

export default function OrderPage({params}:{params:Promise<{id:string}>}){
 const {id}=use(params);
 const [car,setCar]=useState<any>(undefined);
 useEffect(()=>{fetch(`/api/vehicles/${id}`).then(r=>r.ok?r.json():null).then(setCar).catch(()=>setCar(null))},[id]);
 const [submitting,setSubmitting]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const [orderNo,setOrderNo]=useState('');
 const [purchase,setPurchase]=useState<'deposit'|'full'>('deposit');
 const [form,setForm]=useState({name:'',phone:'',email:'',idNumber:'',delivery:'Pickup',address:'',notes:''});
 const deposit=Math.round((car?.price||0)*0.2);
 const amount=purchase==='full'?(car?.price||0):deposit;
 const update=(k:string,v:string)=>setForm({...form,[k]:v});
 const submit=async(e:React.FormEvent)=>{
   e.preventDefault();
   if(!car||submitting)return;
   setSubmitting(true);
   try{
     const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
       vehicleId:car.id,purchaseOption:purchase,
       customer:{name:form.name,phone:form.phone,email:form.email,idNumber:form.idNumber},
       delivery:form.delivery,address:form.address,notes:form.notes,
     })});
     const data=await res.json();
     if(!res.ok)throw new Error(data.error||'Could not submit order');
     setOrderNo(data.orderNo);setSubmitted(true);
   }catch(err:any){alert(err.message||'Something went wrong. Please try again.');}
   finally{setSubmitting(false);}
 };
 if(car===undefined)return <main className="empty"><h1>Loading vehicle…</h1></main>;
 if(!car)return <main className="empty"><h1>Vehicle not found</h1><Link href="/vehicles" className="btn primary">Back to vehicles</Link></main>;
 if(submitted)return <main className="orderPage"><header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link></header><section className="confirmation"><CheckCircle2 size={68}/><p className="eyebrow dark">ORDER RECEIVED</p><h1>You're on your way.</h1><p>Your Auto Vault order has been submitted successfully.</p><div className="orderConfirmation"><span>ORDER NUMBER</span><strong>{orderNo}</strong><hr/><b>{car.brand} {car.model}</b><span>{purchase==='deposit'?'20% deposit selected':'Full payment selected'} · {money(amount)}</span></div><div className="actions"><Link href={`/pay/${orderNo}`} className="btn primary">Continue to payment <ArrowRight size={17}/></Link><Link href={`/track/${orderNo}`} className="btn outline">Track order</Link><Link href="/account" className="btn outline">Go to my account</Link></div></section></main>;
 return <main className="orderPage">
  <header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><nav className="navlinks static"><Link href="/#vehicles">Vehicles</Link><Link href="/brands">Brands</Link><Link href="/#finance">Finance</Link></nav></header>
  <div className="orderWrap"><Link href={`/vehicles/${car.id}`} className="backOrder"><ArrowLeft size={16}/> Back to vehicle</Link>
   <div className="orderHeader"><div><p className="eyebrow dark">SECURE YOUR VEHICLE</p><h1>Place your order.</h1><p>Complete the details below. A sales representative will contact you to confirm specification, final pricing and payment instructions.</p></div><div className="secure"><ShieldCheck/> Secure order process</div></div>
   <div className="orderGrid">
    <form className="orderForm" onSubmit={submit}>
     <section className="orderCard"><h2>1. Your details</h2><div className="formGrid">
      <label>Full name<input required value={form.name} onChange={e=>update('name',e.target.value)} placeholder="e.g. Kwame Mensah"/></label>
      <label>Phone number<input required value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="024 XXX XXXX"/></label>
      <label>Email address<input type="email" required value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></label>
      <label>Ghana Card / ID number<input value={form.idNumber} onChange={e=>update('idNumber',e.target.value)} placeholder="Optional at this stage"/></label>
     </div></section>
     <section className="orderCard"><h2>2. Purchase option</h2><div className="choiceGrid">
      <button type="button" className={purchase==='deposit'?'choice active':'choice'} onClick={()=>setPurchase('deposit')}><b>Reserve with deposit</b><span>20% indicative deposit</span><strong>{money(deposit)}</strong></button>
      <button type="button" className={purchase==='full'?'choice active':'choice'} onClick={()=>setPurchase('full')}><b>Full payment</b><span>Pay the vehicle in full</span><strong>{money(car.price)}</strong></button>
     </div><p className="formNote">The amount shown is indicative. Final taxes, registration, insurance and delivery charges will be confirmed by Auto Vault before payment.</p></section>
     <section className="orderCard"><h2>3. Delivery</h2><div className="formGrid"><label>Collection method<select value={form.delivery} onChange={e=>update('delivery',e.target.value)}><option>Pickup</option><option>Accra delivery</option><option>Delivery to another region</option></select></label><label className="wide">Delivery address<textarea value={form.address} onChange={e=>update('address',e.target.value)} placeholder="Required if delivery is selected"/></label></div></section>
     <section className="orderCard"><h2>4. Additional notes</h2><textarea value={form.notes} onChange={e=>update('notes',e.target.value)} placeholder="Preferred colour, finance request, trade-in, questions..." /></section>
     <button className="btn primary submitOrder" type="submit" disabled={submitting}>{submitting?'Submitting…':'Submit order request'} <ArrowRight size={18}/></button>
    </form>
    <aside className="orderSummary"><div className="summaryImage"><img src={car.img} alt={`${car.brand} ${car.model}`}/></div><div className="summaryBody"><span>{car.brand} · {car.year}</span><h2>{car.model}</h2><strong>{money(car.price)}</strong><div className="summaryLine"><span>Selected option</span><b>{purchase==='deposit'?'Deposit':'Full payment'}</b></div><div className="summaryLine"><span>Amount to initiate</span><b>{money(amount)}</b></div><div className="summaryLine"><span>Availability</span><b>{car.status}</b></div><hr/><p>✓ {car.warranty}</p><p>✓ Spintex, Accra</p></div></aside>
   </div>
  </div>
 </main>
}
