'use client';
import {useEffect,useState,use} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,CheckCircle2,ShieldCheck,Smartphone,Building2,CreditCard} from 'lucide-react';
import {money} from '../../data';

export default function PayPage({params}:{params:Promise<{orderNo:string}>}){
 const {orderNo}=use(params); const [order,setOrder]=useState<any>(undefined); const [method,setMethod]=useState('Mobile Money'); const [phone,setPhone]=useState(''); const [paid,setPaid]=useState(false); const [reference,setReference]=useState(''); const [submitting,setSubmitting]=useState(false);
 useEffect(()=>{fetch(`/api/orders/${orderNo}`).then(r=>r.ok?r.json():null).then(setOrder).catch(()=>setOrder(null))},[orderNo]);
 const pay=async()=>{
   if(!order||submitting)return;
   setSubmitting(true);
   try{
     const res=await fetch('/api/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderNo,method})});
     const data=await res.json();
     if(!res.ok)throw new Error(data.error||'Payment failed');
     setReference(data.reference);setPaid(true);
   }catch(err:any){alert(err.message||'Something went wrong. Please try again.');}
   finally{setSubmitting(false);}
 };
 if(order===undefined)return <main className="empty"><h1>Loading order…</h1></main>;
 if(!order)return <main className="empty"><h1>Order not found</h1><Link href="/account" className="btn primary">Back to account</Link></main>;
 const amountDue=order.amountDue-order.paid;
 if(paid)return <main className="confirmation"><CheckCircle2 size={68}/><p className="eyebrow dark">PAYMENT CONFIRMED</p><h1>Payment received.</h1><p>Your payment for order <b>{orderNo}</b> has been recorded.</p><div className="orderConfirmation"><span>AMOUNT PAID</span><strong>{money(amountDue)}</strong><hr/><b>Reference</b><span>{reference}</span></div><div className="actions"><Link href={`/invoice/${orderNo}`} className="btn primary">View invoice <ArrowRight size={17}/></Link><Link href={`/track/${orderNo}`} className="btn outline">Track vehicle</Link><Link href="/account" className="btn outline">My account</Link></div></main>;
 return <main className="paymentPage"><header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link></header><div className="payWrap"><Link href="/account" className="backOrder"><ArrowLeft size={16}/> Back to account</Link><div className="payHeader"><div><p className="eyebrow dark">PAYMENT</p><h1>Complete your payment.</h1><p>Order {orderNo} · {order.vehicle}</p></div><div className="secure"><ShieldCheck/> Secure checkout</div></div><div className="payGrid"><section className="payCard"><h2>Choose payment method</h2><div className="methodGrid"><button className={method==='Mobile Money'?'method active':'method'} onClick={()=>setMethod('Mobile Money')}><Smartphone/><b>Mobile Money</b><span>MTN, Telecel, AirtelTigo</span></button><button className={method==='Bank Transfer'?'method active':'method'} onClick={()=>setMethod('Bank Transfer')}><Building2/><b>Bank transfer</b><span>Payment confirmation required</span></button><button className={method==='Card'?'method active':'method'} onClick={()=>setMethod('Card')}><CreditCard/><b>Card</b><span>Visa / Mastercard</span></button></div>{method==='Mobile Money'&&<label>Mobile Money number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="024 XXX XXXX"/></label>}<div className="demoBanner">Prototype checkout: no real money is moved. A live Ghana payment gateway will be connected in the production integration.</div><button className="btn primary full" onClick={pay} disabled={submitting}>{submitting?'Processing…':`Pay ${money(amountDue)}`} <ArrowRight size={18}/></button></section><aside className="orderSummary"><div className="summaryBody"><span>ORDER SUMMARY</span><h2>{order.vehicle}</h2><div className="summaryLine"><span>Vehicle price</span><b>{money(order.price)}</b></div><div className="summaryLine"><span>Selected payment</span><b>{order.purchaseOption}</b></div><div className="summaryLine"><span>Amount due now</span><b>{money(amountDue)}</b></div><hr/><p>Order #{order.orderNo}</p><p>Final taxes, registration and delivery charges are confirmed separately.</p></div></aside></div></div></main>
}
