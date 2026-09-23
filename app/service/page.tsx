'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Phone, ShieldAlert, ShieldCheck, Wrench } from 'lucide-react';

const serviceTypes = ['Routine Maintenance', 'Oil & Filter Change', 'Brake Service', 'Diagnostic Check', 'Tyres & Alignment', 'Bodywork & Paint', 'Warranty Repair', 'Other'];
const timeSlots = ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

export default function ServicePage() {
  const [cars, setCars] = useState<any[]>([]);
  useEffect(() => { fetch('/api/vehicles').then(r => r.json()).then(setCars).catch(() => {}); }, []);
  const [tab, setTab] = useState<'book' | 'warranty'>('book');

  // ---- Booking state ----
  const [booking, setBooking] = useState({
    vehicleId: 'custom', vehicleText: '', serviceType: serviceTypes[0], date: '', time: timeSlots[0],
    name: '', phone: '', email: '', notes: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingNo, setBookingNo] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const updateBooking = (k: string, v: string) => setBooking({ ...booking, [k]: v });

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingSubmitting) return;
    setBookingSubmitting(true);
    const vehicleLabel = booking.vehicleId === 'custom' ? booking.vehicleText : (() => { const c = cars.find(c => c.id === booking.vehicleId); return c ? `${c.brand} ${c.model}` : booking.vehicleText; })();
    try {
      const res = await fetch('/api/service/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: booking.name, email: booking.email, phone: booking.phone, vehicle: vehicleLabel, serviceType: booking.serviceType, date: booking.date, time: booking.time, notes: booking.notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit booking');
      setBookingNo(data.jobNo);
      setBookingSubmitted(true);
    } catch (err: unknown) { alert((err instanceof Error ? err.message : 'Something went wrong. Please try again.')); }
    finally { setBookingSubmitting(false); }
  };

  // ---- Warranty claim state ----
  const [claim, setClaim] = useState({
    vehicleId: 'custom', vehicleText: '', orderNo: '', issue: '',
    name: '', phone: '', email: ''
  });
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimNo, setClaimNo] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const updateClaim = (k: string, v: string) => setClaim({ ...claim, [k]: v });

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (claimSubmitting) return;
    setClaimSubmitting(true);
    const vehicleLabel = claim.vehicleId === 'custom' ? claim.vehicleText : (() => { const c = cars.find(c => c.id === claim.vehicleId); return c ? `${c.brand} ${c.model}` : claim.vehicleText; })();
    try {
      const res = await fetch('/api/service/claims', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: claim.name, email: claim.email, phone: claim.phone, vehicle: vehicleLabel, orderNo: claim.orderNo, issue: claim.issue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit claim');
      setClaimNo(data.claimNo);
      setClaimSubmitted(true);
    } catch (err: unknown) { alert((err instanceof Error ? err.message : 'Something went wrong. Please try again.')); }
    finally { setClaimSubmitting(false); }
  };

  return <main className="orderPage">
    <header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><nav className="navlinks static"><Link href="/#vehicles">Vehicles</Link><Link href="/brands">Brands</Link><Link href="/financing">Finance</Link><Link href="/service">Service</Link></nav><a className="navcta" href="tel:0245202242"><Phone size={16} /> 024 520 2242</a></header>
    <div className="orderWrap">
      <Link href="/" className="backOrder"><ArrowLeft size={16} /> Back to home</Link>
      <div className="orderHeader"><div><p className="eyebrow dark">SERVICE &amp; WARRANTY</p><h1>Keep it running right.</h1><p>Book a service appointment or file a warranty claim, and our workshop team will confirm the details with you.</p></div><div className="secure"><ShieldCheck /> Genuine parts &amp; trained technicians</div></div>

      <div className="financeTabs serviceTabs">
        <button className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}><CalendarCheck size={16} /> Book a service</button>
        <button className={tab === 'warranty' ? 'active' : ''} onClick={() => setTab('warranty')}><ShieldAlert size={16} /> Warranty claim</button>
      </div>

      {tab === 'book' && (bookingSubmitted ? <section className="confirmation">
        <CheckCircle2 size={68} /><p className="eyebrow dark">BOOKING REQUESTED</p><h1>We've got your booking.</h1><p>Our service desk will confirm your appointment time by phone or email.</p>
        <div className="orderConfirmation"><span>BOOKING REFERENCE</span><strong>{bookingNo}</strong><hr /><b>{booking.serviceType}</b><span>{booking.date || 'Date to be confirmed'} · {booking.time}</span></div>
        <div className="approvalSteps"><span className="stepDone">Requested</span><span>Confirmed</span><span>In Progress</span><span>Completed</span></div>
        <div className="actions"><Link href="/service" className="btn outline">File a warranty claim</Link><Link href="/" className="btn primary">Back to home</Link></div>
      </section> : <div className="orderGrid">
        <form className="orderForm" onSubmit={submitBooking}>
          <section className="orderCard"><h2>1. Vehicle &amp; service</h2><div className="formGrid">
            <label>Vehicle<select value={booking.vehicleId} onChange={e => updateBooking('vehicleId', e.target.value)}><option value="custom">Other / not purchased here</option>{cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model}</option>)}</select></label>
            {booking.vehicleId === 'custom' && <label>Vehicle &amp; registration<input required value={booking.vehicleText} onChange={e => updateBooking('vehicleText', e.target.value)} placeholder="e.g. Toyota Corolla, GX 0000-26" /></label>}
            <label>Service type<select value={booking.serviceType} onChange={e => updateBooking('serviceType', e.target.value)}>{serviceTypes.map(s => <option key={s}>{s}</option>)}</select></label>
            <label>Preferred date<input required type="date" value={booking.date} onChange={e => updateBooking('date', e.target.value)} /></label>
            <label>Preferred time<select value={booking.time} onChange={e => updateBooking('time', e.target.value)}>{timeSlots.map(t => <option key={t}>{t}</option>)}</select></label>
          </div></section>
          <section className="orderCard"><h2>2. Your details</h2><div className="formGrid">
            <label>Full name<input required value={booking.name} onChange={e => updateBooking('name', e.target.value)} placeholder="e.g. Kwame Mensah" /></label>
            <label>Phone number<input required value={booking.phone} onChange={e => updateBooking('phone', e.target.value)} placeholder="024 XXX XXXX" /></label>
            <label>Email address<input type="email" value={booking.email} onChange={e => updateBooking('email', e.target.value)} placeholder="you@example.com" /></label>
            <label>Notes (optional)<input value={booking.notes} onChange={e => updateBooking('notes', e.target.value)} placeholder="Describe any noise, warning light, etc." /></label>
          </div></section>
          <button className="btn primary full" type="submit">Request booking <ArrowRight size={17} /></button>
          <p className="demoNote">Prototype mode: bookings are stored locally. Workshop scheduling and SMS/email confirmations are connected in the backend phase.</p>
        </form>
        <div className="orderSummary">
          <h2>Booking summary</h2>
          <div className="resultRow"><span>Service</span><b>{booking.serviceType}</b></div>
          <div className="resultRow"><span>Date</span><b>{booking.date || '—'}</b></div>
          <div className="resultRow"><span>Time</span><b>{booking.time}</b></div>
          <div className="resultRow"><span>Vehicle</span><b>{booking.vehicleId === 'custom' ? (booking.vehicleText || '—') : (() => { const c = cars.find(c => c.id === booking.vehicleId); return c ? `${c.brand} ${c.model}` : '—'; })()}</b></div>
        </div>
      </div>)}

      {tab === 'warranty' && (claimSubmitted ? <section className="confirmation">
        <CheckCircle2 size={68} /><p className="eyebrow dark">CLAIM SUBMITTED</p><h1>Your claim is with us.</h1><p>A service advisor will review your claim and get back to you.</p>
        <div className="orderConfirmation"><span>CLAIM REFERENCE</span><strong>{claimNo}</strong><hr /><b>{claim.vehicleId === 'custom' ? claim.vehicleText : (() => { const c = cars.find(c => c.id === claim.vehicleId); return c ? `${c.brand} ${c.model}` : ''; })()}</b><span>{claim.issue.slice(0, 60)}{claim.issue.length > 60 ? '…' : ''}</span></div>
        <div className="approvalSteps"><span className="stepDone">Submitted</span><span>Under Review</span><span>Approved</span><span>Resolved</span></div>
        <div className="actions"><Link href="/service" className="btn outline">Book a service</Link><Link href="/" className="btn primary">Back to home</Link></div>
      </section> : <div className="orderGrid">
        <form className="orderForm" onSubmit={submitClaim}>
          <section className="orderCard"><h2>1. Vehicle &amp; purchase</h2><div className="formGrid">
            <label>Vehicle<select value={claim.vehicleId} onChange={e => updateClaim('vehicleId', e.target.value)}><option value="custom">Other / not purchased here</option>{cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model}</option>)}</select></label>
            {claim.vehicleId === 'custom' && <label>Vehicle &amp; registration<input required value={claim.vehicleText} onChange={e => updateClaim('vehicleText', e.target.value)} placeholder="e.g. Jetour X70 Plus, GX 0000-26" /></label>}
            <label>Order / purchase number (if known)<input value={claim.orderNo} onChange={e => updateClaim('orderNo', e.target.value)} placeholder="e.g. AV-2026-583214" /></label>
          </div></section>
          <section className="orderCard"><h2>2. Describe the issue</h2><div className="formGrid">
            <label style={{ gridColumn: '1 / -1' }}>What's wrong?<textarea required rows={4} value={claim.issue} onChange={e => updateClaim('issue', e.target.value)} placeholder="Describe the fault, when it started and any warning lights or noises." /></label>
          </div></section>
          <section className="orderCard"><h2>3. Your details</h2><div className="formGrid">
            <label>Full name<input required value={claim.name} onChange={e => updateClaim('name', e.target.value)} placeholder="e.g. Kwame Mensah" /></label>
            <label>Phone number<input required value={claim.phone} onChange={e => updateClaim('phone', e.target.value)} placeholder="024 XXX XXXX" /></label>
            <label>Email address<input type="email" value={claim.email} onChange={e => updateClaim('email', e.target.value)} placeholder="you@example.com" /></label>
          </div></section>
          <button className="btn primary full" type="submit"><ShieldAlert size={17} /> Submit warranty claim</button>
          <p className="demoNote">Prototype mode: claims are stored locally. Inspection scheduling and manufacturer warranty verification are connected in the backend phase.</p>
        </form>
        <div className="orderSummary">
          <h2>Claim summary</h2>
          <div className="resultRow"><span>Vehicle</span><b>{claim.vehicleId === 'custom' ? (claim.vehicleText || '—') : (() => { const c = cars.find(c => c.id === claim.vehicleId); return c ? `${c.brand} ${c.model}` : '—'; })()}</b></div>
          <div className="resultRow"><span>Order number</span><b>{claim.orderNo || '—'}</b></div>
          <div className="resultRow"><span>Warranty</span><b><Wrench size={13} /> Covered on eligible vehicles</b></div>
        </div>
      </div>)}
    </div>
  </main>;
}
