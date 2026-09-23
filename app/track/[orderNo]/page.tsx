'use client';
import {useEffect,useMemo,useState,use} from 'react';
import Link from 'next/link';
import {ArrowLeft,CheckCircle2,Clock3,FileCheck2,MapPin,PackageCheck,Ship,Truck,Warehouse} from 'lucide-react';
import {money} from '../../data';

const stages=[
 {key:'Payment Pending',label:'Order placed',desc:'Your vehicle order has been received.',icon:FileCheck2},
 {key:'Vehicle Allocated',label:'Vehicle allocated',desc:'Auto Vault has assigned your vehicle.',icon:PackageCheck},
 {key:'Export Processing',label:'Export processing',desc:'Vehicle is being prepared for shipment.',icon:Warehouse},
 {key:'Shipped',label:'Shipped',desc:'Vehicle has left the origin country.',icon:Ship},
 {key:'Arrived in Ghana',label:'Arrived in Ghana',desc:'Vehicle has arrived at the Ghana port.',icon:MapPin},
 {key:'Customs & Clearing',label:'Customs & clearing',desc:'Import and clearing procedures are underway.',icon:FileCheck2},
 {key:'Ready for Collection',label:'Ready for collection',desc:'Vehicle is ready for handover or delivery.',icon:Warehouse},
 {key:'Delivered',label:'Delivered',desc:'Vehicle has been handed over successfully.',icon:Truck}
];
function stageIndex(status:string){const i=stages.findIndex(s=>s.key===status); return i>=0?i:0}
export default function TrackOrder({params}:{params:Promise<{orderNo:string}>}){
 const {orderNo}=use(params); const [order,setOrder]=useState<any>(undefined);
 useEffect(()=>{fetch(`/api/track/${orderNo}`).then(r=>r.ok?r.json():null).then(setOrder).catch(()=>setOrder(null));},[orderNo]);
 const idx=useMemo(()=>stageIndex(order?.status||'Payment Pending'),[order]);
 if(order===undefined)return <main className="trackPage"><div className="loading">Loading tracking…</div></main>;
 if(!order)return <main className="empty"><h1>Order not found</h1><Link href="/track" className="btn primary">Track another order</Link></main>;
 const tracking=order.tracking;
 return <main className="trackPage"><header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><Link href="/account" className="accountLink">My Account</Link></header><div className="trackWrap"><Link href="/track" className="backOrder"><ArrowLeft size={16}/> Track another order</Link><div className="trackHeader"><div><p className="eyebrow dark">ORDER TRACKING</p><h1>{order.vehicle}</h1><p>Order <b>{order.orderNo}</b> · {order.customer?.name||'Auto Vault customer'}</p></div><span className="trackStatus">{stages[idx].label}</span></div><section className="trackGrid"><div className="trackTimeline">{stages.map((s,i)=>{const I=s.icon;const done=i<=idx;const current=i===idx;return <div className={`timelineItem ${done?'done':''} ${current?'current':''}`} key={s.key}><div className="timelineIcon"><I size={18}/></div><div><strong>{s.label}</strong><p>{done?s.desc:i<idx?'Completed':s.desc}</p></div></div>})}</div><aside className="trackingSide"><section className="trackingCard"><p className="eyebrow dark">SHIPMENT</p><h2>Vehicle logistics</h2><div className="trackingRows"><div><span>Origin</span><b>{tracking.origin}</b></div><div><span>Destination</span><b>{tracking.destination}</b></div><div><span>Vessel</span><b>{tracking.vessel}</b></div><div><span>Container</span><b>{tracking.container}</b></div><div><span>Estimated arrival</span><b>{tracking.eta}</b></div></div></section><section className="trackingCard"><p className="eyebrow dark">PAYMENT</p><h2>Financial status</h2><div className="trackingRows"><div><span>Vehicle price</span><b>{money(order.price||0)}</b></div><div><span>Paid</span><b>{money(order.paid||0)}</b></div><div><span>Balance</span><b>{money(Math.max(0,(order.price||0)-(order.paid||0)))}</b></div></div><Link className="btn outline full" href={`/invoice/${order.orderNo}`}>View invoice</Link></section></aside></section><div className="trackNote"><Clock3 size={18}/><p><b>Tracking updates are provided by Auto Vault.</b> Shipping dates and arrival estimates can change because of vessel schedules, port operations and customs procedures.</p></div></div></main>
}
