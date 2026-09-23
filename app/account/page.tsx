'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CarFront, FileText, Heart, LogOut, Menu, Receipt, Settings, ShieldCheck, UserRound, Wrench, X, Truck } from 'lucide-react';
import { money } from '../data';

const titles:any={overview:'Overview',orders:'My Orders',saved:'Saved Vehicles',service:'Service & Warranty',documents:'Documents',profile:'My Profile',settings:'Settings'};

export default function Account(){
 const [user,setUser]=useState<any>(undefined);
 const [mode,setMode]=useState<'login'|'register'>('login');
 const [form,setForm]=useState({name:'',email:'',phone:'',password:''});
 const [error,setError]=useState('');
 const [submitting,setSubmitting]=useState(false);

 useEffect(()=>{fetch('/api/auth/me').then(r=>r.json()).then(setUser).catch(()=>setUser(null));},[]);

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();setSubmitting(true);setError('');
  try{
   const res=await fetch(`/api/auth/${mode}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
   const data=await res.json();
   if(!res.ok)throw new Error(data.error||'Something went wrong');
   setUser(data);
  }catch(err:any){setError(err.message||'Something went wrong');}
  finally{setSubmitting(false);}
 };
 const logout=async()=>{await fetch('/api/auth/logout',{method:'POST'});setUser(null);};

 if(user===undefined)return <main className="empty"><h1>Loading…</h1></main>;
 if(!user)return <main className="accountShell"><header className="accountNav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><Link href="/" className="backLink">← Back to website</Link></header><section className="authWrap"><div className="authIntro"><p className="eyebrow">AUTO VAULT CUSTOMER PORTAL</p><h1>Your vehicle journey, all in one place.</h1><p>Manage your profile, orders, invoices, documents and service history from one customer portal.</p><div className="authPoints"><span><ShieldCheck/> Account-based order tracking</span><span><Receipt/> Invoices & payment records</span><span><CarFront/> Vehicle & service history</span></div></div><form className="authCard" onSubmit={submit}><div className="tabs"><button type="button" className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Sign in</button><button type="button" className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Create account</button></div><h2>{mode==='login'?'Welcome back':'Create your account'}</h2><p className="muted">{mode==='login'?'Sign in to access your Auto Vault account.':'Set up your customer profile.'}</p>{mode==='register'&&<label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}<label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>{mode==='register'&&<label>Phone number<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="024 000 0000"/></label>}<label>Password<input required minLength={6} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<p className="formError">{error}</p>}<button className="btn primary full" disabled={submitting}>{submitting?'Please wait…':(mode==='login'?'Sign in':'Create account')} <ArrowRight size={18}/></button><p className="demoNote">Demo accounts use password AutoVault123! — e.g. kwame@example.com, or admin@autovault.gh for staff.</p></form></section></main>;
 return <Dashboard user={user} logout={logout}/>;
}

function Dashboard({user,logout}:{user:any;logout:()=>void}){
 const [section,setSection]=useState('overview');const [open,setOpen]=useState(false);
 const [orders,setOrders]=useState<any[]>([]);
 const [saved,setSaved]=useState<any[]>([]);
 const [docs,setDocs]=useState<any[]>([]);
 useEffect(()=>{
  fetch('/api/orders').then(r=>r.json()).then(setOrders).catch(()=>{});
  fetch('/api/account/saved-vehicles').then(r=>r.json()).then(setSaved).catch(()=>{});
  fetch('/api/account/documents').then(r=>r.json()).then(setDocs).catch(()=>{});
 },[]);
 const removeSaved=async(id:string)=>{await fetch(`/api/account/saved-vehicles/${id}`,{method:'DELETE'});setSaved(saved.filter(c=>c.id!==id));};
 return <main className="dashboardShell"><header className="dashTop"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div className="userTop"><span className="avatar">{user.name[0]}</span><span>{user.name}</span><button onClick={logout}><LogOut size={16}/></button></div></header><div className="dashLayout"><aside className={open?'dashSide open':'dashSide'}><div className="sideUser"><span className="avatar large">{user.name[0]}</span><strong>{user.name}</strong><small>{user.email}</small></div>{[['overview','Overview',CarFront],['orders','My Orders',Receipt],['saved','Saved Vehicles',Heart],['service','Service & Warranty',Wrench],['documents','Documents',FileText],['profile','My Profile',UserRound],['settings','Settings',Settings]].map(([k,l,I]:any)=><button key={k} className={section===k?'sideActive':''} onClick={()=>{setSection(k);setOpen(false)}}><I size={18}/>{l}</button>)}<button className="sideLogout" onClick={logout}><LogOut size={18}/> Sign out</button></aside><section className="dashContent"><div className="dashHead"><div><p className="eyebrow dark">CUSTOMER PORTAL</p><h1>{section==='overview'?`Welcome, ${user.name.split(' ')[0]}.`:titles[section]}</h1></div><Link href="/#vehicles" className="btn primary">Browse vehicles <ArrowRight size={17}/></Link></div>{section==='overview'&&<Overview orders={orders} saved={saved.length} go={setSection}/>} {section==='orders'&&<Orders orders={orders}/>} {section==='saved'&&<Saved cars={saved} remove={removeSaved}/>} {section==='service'&&<ServiceHistory/>} {section==='documents'&&<Documents docs={docs}/>}{section==='profile'&&<Profile user={user}/>} {section==='settings'&&<SettingsPanel/>}</section></div></main>
}

function Overview({orders,saved,go}:any){
 const latest=orders[0];
 return <><div className="statGrid"><div><span>Active orders</span><strong>{orders.length}</strong><small>Currently in progress</small></div><div><span>Amount paid</span><strong>{money(orders.reduce((a:any,o:any)=>a+o.paid,0))}</strong><small>Across your orders</small></div><div><span>Saved vehicles</span><strong>{saved}</strong><small>Ready to compare</small></div><div><span>Documents</span><strong>{orders.filter((o:any)=>o.paid>0).length*2}</strong><small>Available in portal</small></div></div><div className="dashGrid"><section className="panel"><div className="panelHead"><div><p className="eyebrow dark">LATEST</p><h2>Your current order</h2></div><button onClick={()=>go('orders')}>View all</button></div>{latest?<div className="orderMini"><div className="vehicleThumb"><CarFront/></div><div className="orderInfo"><strong>{latest.vehicle}</strong><span>Order #{latest.orderNo}</span><small>{latest.status}</small></div><strong>{money(latest.amount)}</strong></div>:<div className="empty"><CarFront/><h3>No orders yet</h3><p>Browse vehicles to place your first order.</p></div>}</section><section className="panel"><div className="panelHead"><div><p className="eyebrow dark">SHORTCUTS</p><h2>Manage your account</h2></div></div><div className="shortcutGrid"><button onClick={()=>go('documents')}><FileText/>Documents</button><button onClick={()=>go('profile')}><UserRound/>Profile</button><button onClick={()=>go('saved')}><Heart/>Saved cars</button><button onClick={()=>go('orders')}><Truck/>Track vehicle</button><button onClick={()=>go('service')}><ShieldCheck/>Warranty</button></div></section></div></>
}
function Orders({orders}:any){return <section className="panel"><div className="panelHead"><div><p className="eyebrow dark">PURCHASE HISTORY</p><h2>My orders</h2></div></div>{orders.length?orders.map((o:any)=><div className="orderRow" key={o.orderNo}><div className="vehicleThumb"><CarFront/></div><div><strong>{o.vehicle}</strong><span>{o.orderNo}</span><small>{o.status}</small></div><div className="orderAmount"><strong>{money(o.amount)}</strong><span>Paid {money(o.paid)}</span><div className="orderActions"><Link href={`/track/${o.orderNo}`}>Track vehicle</Link><Link href={`/invoice/${o.orderNo}`}>Invoice</Link>{o.paid<o.amount&&<Link href={`/pay/${o.orderNo}`}>Pay balance</Link>}</div></div></div>):<div className="empty"><Receipt/><h3>No orders yet</h3><p>Browse vehicles to place your first order.</p></div>}</section>}
function Saved({cars,remove}:any){return <section className="panel"><div className="panelHead"><div><p className="eyebrow dark">YOUR SHORTLIST</p><h2>Saved vehicles</h2></div><Link href="/#vehicles">Browse more</Link></div>{cars.length?<div className="savedGrid">{cars.map((c:any)=><div className="savedCard" key={c.id}><img src={c.img} alt={c.model}/><div><span>{c.brand}</span><h3>{c.model}</h3><strong>{money(c.price)}</strong><button onClick={()=>remove(c.id)}>Remove</button></div></div>)}</div>:<div className="empty"><Heart/><h3>No saved vehicles yet</h3><p>Save vehicles while browsing.</p></div>}</section>}
function ServiceHistory(){
 const [bookings,setBookings]=useState<any[]>([]);
 const [claims,setClaims]=useState<any[]>([]);
 useEffect(()=>{
  fetch('/api/service/bookings').then(r=>r.json()).then(setBookings).catch(()=>{});
  fetch('/api/service/claims').then(r=>r.json()).then(setClaims).catch(()=>{});
 },[]);
 return <>
  <section className="panel">
   <div className="panelHead"><div><p className="eyebrow dark">WORKSHOP</p><h2>Service bookings</h2></div><Link href="/service">Book a service</Link></div>
   {bookings.length?<div className="docList">{bookings.map((b:any)=><div className="docRow" key={b.jobNo}><CalendarCheck/><div><strong>{b.serviceType}</strong><span>{b.jobNo} · {b.vehicle} · {b.status}</span></div></div>)}</div>:<div className="empty"><CalendarCheck/><h3>No service bookings yet</h3><p>Book a service appointment for your vehicle.</p></div>}
  </section>
  <section className="panel" style={{marginTop:20}}>
   <div className="panelHead"><div><p className="eyebrow dark">COVERAGE</p><h2>Warranty claims</h2></div><Link href="/service">File a claim</Link></div>
   {claims.length?<div className="docList">{claims.map((c:any)=><div className="docRow" key={c.claimNo}><ShieldCheck/><div><strong>{c.vehicle}</strong><span>{c.claimNo} · {c.status}</span></div></div>)}</div>:<div className="empty"><ShieldCheck/><h3>No warranty claims yet</h3><p>File a claim if something needs attention.</p></div>}
  </section>
 </>
}
function Documents({docs}:{docs:any[]}){return <section className="panel"><div className="panelHead"><div><p className="eyebrow dark">YOUR RECORDS</p><h2>Documents</h2></div></div>{docs.length?<div className="docList">{docs.map((d:any)=><div className="docRow" key={d.ref}><FileText/><div><strong>{d.label}</strong><span>{d.ref} · Order {d.orderNo}</span></div><Link href={`/invoice/${d.orderNo}`}>View</Link></div>)}</div>:<div className="empty"><FileText/><h3>No documents yet</h3><p>Documents appear once you've made a payment.</p></div>}</section>}
function Profile({user}:any){return <section className="panel profilePanel"><div className="profileAvatar">{user.name[0]}</div><div><p className="eyebrow dark">PERSONAL INFORMATION</p><h2>{user.name}</h2><p>{user.email}</p><p>{user.phone}</p><button className="btn primary">Edit profile</button></div></section>}
function SettingsPanel(){return <section className="panel settingsPanel"><div><p className="eyebrow dark">PREFERENCES</p><h2>Notifications</h2></div><label><input type="checkbox" defaultChecked/> Order status updates</label><label><input type="checkbox" defaultChecked/> Payment and invoice alerts</label><label><input type="checkbox" defaultChecked/> Service and warranty reminders</label><button className="btn primary">Save preferences</button></section>}
