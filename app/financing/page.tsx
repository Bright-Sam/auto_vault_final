'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator, CarFront, CheckCircle2, FileText, Percent, Phone, RefreshCcw, ShieldCheck } from 'lucide-react';
import { money } from '../data';

const terms = [12, 24, 36, 48, 60];
const conditions = ['Excellent', 'Good', 'Fair', 'Needs Work'] as const;
const tradeBrands = ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Ford', 'Mercedes-Benz', 'BMW', 'Jetour', 'Changan', 'Chery', 'Geely', 'GAC', 'Other'];
const referenceValues: Record<string, number> = { Toyota: 380000, Honda: 340000, Hyundai: 330000, Kia: 320000, Nissan: 310000, Ford: 300000, 'Mercedes-Benz': 480000, BMW: 470000, Jetour: 430000, Changan: 385000, Chery: 470000, Geely: 360000, GAC: 410000, Other: 280000 };

function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  if (principal <= 0 || months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function FinancingPage() {
  const [cars, setCars] = useState<any[]>([]);
  useEffect(() => { fetch('/api/vehicles').then(r => r.json()).then(setCars).catch(() => {}); }, []);
  const [tab, setTab] = useState<'calculator' | 'apply' | 'tradein'>('calculator');

  // ---- Calculator state ----
  const [vehicleId, setVehicleId] = useState('custom');
  const [customPrice, setCustomPrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(28);
  const [term, setTerm] = useState(36);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('vehicle');
    if (v && cars.find(c => c.id === v)) {
      setVehicleId(v);
      const car = cars.find(c => c.id === v)!;
      setDownPayment(Math.round(car.price * 0.2));
    }
  }, [cars]);

  const price = vehicleId === 'custom' ? customPrice : (cars.find(c => c.id === vehicleId)?.price || 0);
  const loanAmount = Math.max(price - downPayment, 0);
  const monthly = useMemo(() => monthlyPayment(loanAmount, rate, term), [loanAmount, rate, term]);
  const totalRepayable = monthly * term;
  const totalInterest = Math.max(totalRepayable - loanAmount, 0);

  const goApply = () => {
    setApplyForm(f => ({ ...f, vehicleId, price, downPayment, term }));
    setTab('apply');
  };

  // ---- Application state ----
  const [applyForm, setApplyForm] = useState({
    vehicleId: 'custom', price: 0, downPayment: 0, term: 36,
    name: '', phone: '', email: '', idNumber: '', employment: 'Employed', employer: '', occupation: '', income: '', address: ''
  });
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appNo, setAppNo] = useState('');
  const updateApply = (k: string, v: any) => setApplyForm({ ...applyForm, [k]: v });

  const applyPrice = applyForm.vehicleId === 'custom' ? applyForm.price : (cars.find(c => c.id === applyForm.vehicleId)?.price || applyForm.price);
  const applyLoan = Math.max(applyPrice - applyForm.downPayment, 0);
  const applyMonthly = monthlyPayment(applyLoan, rate, applyForm.term);

  const [applySubmitting, setApplySubmitting] = useState(false);
  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (applySubmitting) return;
    setApplySubmitting(true);
    const vehicleLabel = applyForm.vehicleId === 'custom' ? 'Vehicle not yet selected' : (() => { const c = cars.find(c => c.id === applyForm.vehicleId); return c ? `${c.brand} ${c.model}` : 'Vehicle not yet selected'; })();
    try {
      const res = await fetch('/api/financing/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applyForm.name, email: applyForm.email, phone: applyForm.phone,
          vehicle: vehicleLabel, price: applyPrice, downPayment: applyForm.downPayment,
          loanAmount: applyLoan, term: applyForm.term, rate, monthlyPayment: Math.round(applyMonthly),
          employment: applyForm.employment, employer: applyForm.employer, occupation: applyForm.occupation, income: applyForm.income, address: applyForm.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit application');
      setAppNo(data.appNo);
      setAppSubmitted(true);
    } catch (err: unknown) { alert((err instanceof Error ? err.message : 'Something went wrong. Please try again.')); }
    finally { setApplySubmitting(false); }
  };

  // ---- Trade-in state ----
  const [tradeForm, setTradeForm] = useState({ brand: 'Toyota', model: '', year: 2018, mileage: 60000, condition: 'Good' as typeof conditions[number], regNumber: '' });
  const [estimate, setEstimate] = useState<{ low: number; mid: number; high: number } | null>(null);
  const updateTrade = (k: string, v: any) => { setTradeForm({ ...tradeForm, [k]: v }); setEstimate(null); };

  const computeEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const base = referenceValues[tradeForm.brand] ?? referenceValues.Other;
    const age = Math.max(new Date().getFullYear() - tradeForm.year, 0);
    const ageFactor = Math.max(1 - age * 0.09, 0.3);
    const mileageFactor = tradeForm.mileage < 20000 ? 1 : tradeForm.mileage < 60000 ? 0.95 : tradeForm.mileage < 120000 ? 0.88 : 0.78;
    const conditionFactor = { Excellent: 1, Good: 0.92, Fair: 0.8, 'Needs Work': 0.6 }[tradeForm.condition];
    const mid = Math.round((base * ageFactor * mileageFactor * conditionFactor) / 1000) * 1000;
    setEstimate({ low: Math.round(mid * 0.9 / 1000) * 1000, mid, high: Math.round(mid * 1.05 / 1000) * 1000 });
  };

  const [tradeContact, setTradeContact] = useState({ name: '', phone: '', email: '', notes: '' });
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const [tradeNo, setTradeNo] = useState('');
  const updateTradeContact = (k: string, v: string) => setTradeContact({ ...tradeContact, [k]: v });

  const [tradeSubmitting, setTradeSubmitting] = useState(false);
  const submitTradeIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimate || tradeSubmitting) return;
    setTradeSubmitting(true);
    try {
      const res = await fetch('/api/financing/tradeins', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tradeContact.name, email: tradeContact.email, phone: tradeContact.phone,
          vehicle: { ...tradeForm }, estimate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit trade-in request');
      setTradeNo(data.tradeNo);
      setTradeSubmitted(true);
    } catch (err: unknown) { alert((err instanceof Error ? err.message : 'Something went wrong. Please try again.')); }
    finally { setTradeSubmitting(false); }
  };

  return <main className="orderPage financingPage">
    <header className="nav"><Link href="/" className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></Link><nav className="navlinks static"><Link href="/#vehicles">Vehicles</Link><Link href="/brands">Brands</Link><Link href="/financing">Finance</Link></nav><a className="navcta" href="tel:0245202242"><Phone size={16} /> 024 520 2242</a></header>
    <div className="orderWrap">
      <Link href="/" className="backOrder"><ArrowLeft size={16} /> Back to home</Link>
      <div className="orderHeader"><div><p className="eyebrow dark">FINANCING &amp; TRADE-IN</p><h1>Own it sooner.</h1><p>Estimate a monthly payment, apply for financing, or find out what your current vehicle is worth as a trade-in.</p></div><div className="secure"><ShieldCheck /> Prototype — no credit check performed</div></div>

      <div className="financeTabs">
        <button className={tab === 'calculator' ? 'active' : ''} onClick={() => setTab('calculator')}><Calculator size={16} /> Calculator</button>
        <button className={tab === 'apply' ? 'active' : ''} onClick={() => setTab('apply')}><FileText size={16} /> Apply for financing</button>
        <button className={tab === 'tradein' ? 'active' : ''} onClick={() => setTab('tradein')}><RefreshCcw size={16} /> Trade-in valuation</button>
      </div>

      {tab === 'calculator' && <div className="orderGrid">
        <form className="orderForm" onSubmit={e => e.preventDefault()}>
          <section className="orderCard"><h2>1. Vehicle &amp; price</h2><div className="formGrid">
            <label>Vehicle<select value={vehicleId} onChange={e => { setVehicleId(e.target.value); const c = cars.find(c => c.id === e.target.value); if (c) setDownPayment(Math.round(c.price * 0.2)); }}><option value="custom">Other / not listed</option>{cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} — {money(c.price)}</option>)}</select></label>
            {vehicleId === 'custom' && <label>Vehicle price (GH₵)<input type="number" min={0} value={customPrice} onChange={e => setCustomPrice(Number(e.target.value))} /></label>}
            <label>Down payment (GH₵)<input type="number" min={0} max={price} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} /></label>
            <label>Interest rate (% per year)<input type="number" min={0} max={60} value={rate} onChange={e => setRate(Number(e.target.value))} /></label>
          </div></section>
          <section className="orderCard"><h2>2. Loan term</h2><div className="termGrid">{terms.map(t => <button type="button" key={t} className={term === t ? 'termActive' : ''} onClick={() => setTerm(t)}>{t} mo</button>)}</div></section>
        </form>
        <div className="orderSummary calcResult">
          <h2>Estimated repayment</h2>
          <div className="calcHero"><span>Monthly payment</span><strong>{money(Math.round(monthly))}</strong><small>for {term} months</small></div>
          <div className="resultRow"><span>Vehicle price</span><b>{money(price)}</b></div>
          <div className="resultRow"><span>Down payment</span><b>{money(downPayment)}</b></div>
          <div className="resultRow"><span>Loan amount</span><b>{money(loanAmount)}</b></div>
          <div className="resultRow"><span>Total interest</span><b>{money(Math.round(totalInterest))}</b></div>
          <div className="resultRow"><span>Total repayable</span><b>{money(Math.round(totalRepayable))}</b></div>
          <button className="btn primary full" onClick={goApply}>Apply with these numbers <ArrowRight size={17} /></button>
          <p className="demoNote">Estimate only. Actual rate and terms depend on lender approval, income verification and credit assessment.</p>
        </div>
      </div>}

      {tab === 'apply' && (appSubmitted ? <section className="confirmation">
        <CheckCircle2 size={68} /><p className="eyebrow dark">APPLICATION RECEIVED</p><h1>Your application is in.</h1><p>A finance officer will review your application and contact you.</p>
        <div className="orderConfirmation"><span>APPLICATION NUMBER</span><strong>{appNo}</strong><hr /><b>{money(Math.round(applyMonthly))} / month</b><span>{applyForm.term} months · {rate}% p.a.</span></div>
        <div className="approvalSteps"><span className="stepDone">Submitted</span><span>Document review</span><span>Credit check</span><span>Approval</span><span>Disbursed</span></div>
        <div className="actions"><Link href="/financing" className="btn outline">Get a trade-in estimate</Link><Link href="/" className="btn primary">Back to home</Link></div>
      </section> : <div className="orderGrid">
        <form className="orderForm" onSubmit={submitApplication}>
          <section className="orderCard"><h2>1. Vehicle &amp; loan</h2><div className="formGrid">
            <label>Vehicle<select value={applyForm.vehicleId} onChange={e => { const c = cars.find(c => c.id === e.target.value); updateApply('vehicleId', e.target.value); if (c) { updateApply('price', c.price); updateApply('downPayment', Math.round(c.price * 0.2)); } }}><option value="custom">Other / not listed</option>{cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model}</option>)}</select></label>
            {applyForm.vehicleId === 'custom' && <label>Vehicle price (GH₵)<input required type="number" min={0} value={applyForm.price} onChange={e => updateApply('price', Number(e.target.value))} /></label>}
            <label>Down payment (GH₵)<input required type="number" min={0} value={applyForm.downPayment} onChange={e => updateApply('downPayment', Number(e.target.value))} /></label>
            <label>Loan term<select value={applyForm.term} onChange={e => updateApply('term', Number(e.target.value))}>{terms.map(t => <option key={t} value={t}>{t} months</option>)}</select></label>
          </div><p className="mutedLine">Estimated monthly payment at {rate}% p.a.: <b>{money(Math.round(applyMonthly))}</b></p></section>

          <section className="orderCard"><h2>2. Your details</h2><div className="formGrid">
            <label>Full name<input required value={applyForm.name} onChange={e => updateApply('name', e.target.value)} placeholder="e.g. Kwame Mensah" /></label>
            <label>Phone number<input required value={applyForm.phone} onChange={e => updateApply('phone', e.target.value)} placeholder="024 XXX XXXX" /></label>
            <label>Email address<input required type="email" value={applyForm.email} onChange={e => updateApply('email', e.target.value)} placeholder="you@example.com" /></label>
            <label>Ghana Card / ID number<input required value={applyForm.idNumber} onChange={e => updateApply('idNumber', e.target.value)} /></label>
            <label>Residential address<input value={applyForm.address} onChange={e => updateApply('address', e.target.value)} /></label>
          </div></section>

          <section className="orderCard"><h2>3. Employment &amp; income</h2><div className="formGrid">
            <label>Employment type<select value={applyForm.employment} onChange={e => updateApply('employment', e.target.value)}><option>Employed</option><option>Self-employed</option><option>Business owner</option><option>Other</option></select></label>
            <label>Employer / business name<input value={applyForm.employer} onChange={e => updateApply('employer', e.target.value)} /></label>
            <label>Occupation<input value={applyForm.occupation} onChange={e => updateApply('occupation', e.target.value)} /></label>
            <label>Gross monthly income (GH₵)<input required type="number" min={0} value={applyForm.income} onChange={e => updateApply('income', e.target.value)} /></label>
          </div></section>
          <button className="btn primary full" type="submit">Submit application <ArrowRight size={17} /></button>
          <p className="demoNote">Prototype mode: applications are stored locally. Document upload, credit bureau checks and lender integration are connected in the backend phase.</p>
        </form>
        <div className="orderSummary">
          <h2>Application summary</h2>
          <div className="resultRow"><span>Vehicle</span><b>{applyForm.vehicleId === 'custom' ? 'Not yet selected' : (() => { const c = cars.find(c => c.id === applyForm.vehicleId); return c ? `${c.brand} ${c.model}` : '—'; })()}</b></div>
          <div className="resultRow"><span>Price</span><b>{money(applyPrice)}</b></div>
          <div className="resultRow"><span>Down payment</span><b>{money(applyForm.downPayment)}</b></div>
          <div className="resultRow"><span>Loan amount</span><b>{money(applyLoan)}</b></div>
          <div className="resultRow"><span>Term</span><b>{applyForm.term} months</b></div>
          <div className="resultRow"><span>Est. monthly payment</span><b>{money(Math.round(applyMonthly))}</b></div>
        </div>
      </div>)}

      {tab === 'tradein' && (tradeSubmitted ? <section className="confirmation">
        <CheckCircle2 size={68} /><p className="eyebrow dark">TRADE-IN REQUEST SENT</p><h1>We'll be in touch.</h1><p>Our team will confirm your trade-in offer after a physical inspection.</p>
        <div className="orderConfirmation"><span>TRADE-IN REFERENCE</span><strong>{tradeNo}</strong><hr /><b>{money(estimate?.mid || 0)} estimated</b><span>Range {money(estimate?.low || 0)} – {money(estimate?.high || 0)}</span></div>
        <div className="actions"><Link href="/financing" className="btn outline">Calculate financing</Link><Link href="/" className="btn primary">Back to home</Link></div>
      </section> : <div className="orderGrid">
        <div className="orderForm">
          <section className="orderCard">
            <h2>1. Your vehicle</h2>
            <form className="formGrid" onSubmit={computeEstimate}>
              <label>Brand<select value={tradeForm.brand} onChange={e => updateTrade('brand', e.target.value)}>{tradeBrands.map(b => <option key={b}>{b}</option>)}</select></label>
              <label>Model<input value={tradeForm.model} onChange={e => updateTrade('model', e.target.value)} placeholder="e.g. Corolla" /></label>
              <label>Year<input type="number" min={1990} max={new Date().getFullYear()} value={tradeForm.year} onChange={e => updateTrade('year', Number(e.target.value))} /></label>
              <label>Mileage (km)<input type="number" min={0} value={tradeForm.mileage} onChange={e => updateTrade('mileage', Number(e.target.value))} /></label>
              <label>Condition<select value={tradeForm.condition} onChange={e => updateTrade('condition', e.target.value)}>{conditions.map(c => <option key={c}>{c}</option>)}</select></label>
              <label>Registration number (optional)<input value={tradeForm.regNumber} onChange={e => updateTrade('regNumber', e.target.value)} placeholder="GX 0000-26" /></label>
              <button className="btn primary full" type="submit" style={{ gridColumn: '1 / -1' }}><Percent size={17} /> Get instant estimate</button>
            </form>
          </section>

          {estimate && <section className="orderCard">
            <h2>2. Request a firm offer</h2>
            <form className="formGrid" onSubmit={submitTradeIn}>
              <label>Full name<input required value={tradeContact.name} onChange={e => updateTradeContact('name', e.target.value)} /></label>
              <label>Phone number<input required value={tradeContact.phone} onChange={e => updateTradeContact('phone', e.target.value)} placeholder="024 XXX XXXX" /></label>
              <label>Email address<input required type="email" value={tradeContact.email} onChange={e => updateTradeContact('email', e.target.value)} /></label>
              <label>Notes (optional)<input value={tradeContact.notes} onChange={e => updateTradeContact('notes', e.target.value)} placeholder="Any accidents, extra features..." /></label>
              <button className="btn primary full" type="submit" style={{ gridColumn: '1 / -1' }}>Request trade-in offer <ArrowRight size={17} /></button>
            </form>
          </section>}
        </div>
        <div className="orderSummary">
          <h2>Estimated value</h2>
          {estimate ? <>
            <div className="calcHero"><span><CarFront size={14} /> {tradeForm.brand} {tradeForm.model || ''} · {tradeForm.year}</span><strong>{money(estimate.mid)}</strong><small>Estimated trade-in value</small></div>
            <div className="resultRow"><span>Low estimate</span><b>{money(estimate.low)}</b></div>
            <div className="resultRow"><span>High estimate</span><b>{money(estimate.high)}</b></div>
          </> : <div className="empty"><RefreshCcw /><h3>No estimate yet</h3><p>Fill in your vehicle details and get an instant estimate.</p></div>}
          <p className="demoNote">Prototype estimate based on age, mileage and condition only. Final offer is confirmed after physical inspection at Auto Vault, Spintex.</p>
        </div>
      </div>)}
    </div>
  </main>;
}
