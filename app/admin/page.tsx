'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Bell, CalendarCheck, CarFront, CheckCircle2, ChevronDown, CircleDollarSign, ClipboardList, FileText, Landmark, LayoutDashboard, Menu, Package, Plus, RefreshCcw, Search, Settings, Ship, ShieldAlert, ShoppingCart, Users, Wrench, X, MoreHorizontal } from 'lucide-react';
import { money, brands } from '../data';

type Section = 'overview'|'inventory'|'orders'|'customers'|'crm'|'financing'|'service'|'payments'|'invoices'|'shipments'|'sales'|'staff'|'reports';

type AdminOrder = { orderNo:string; customer:string; vehicle:string; amount:number; paid:number; status:string; date:string };

const nav: {id:Section; label:string; icon:any}[] = [
  {id:'overview',label:'Overview',icon:LayoutDashboard},{id:'inventory',label:'Inventory',icon:CarFront},{id:'orders',label:'Orders',icon:ShoppingCart},{id:'customers',label:'Customers',icon:Users},{id:'crm',label:'CRM',icon:ClipboardList},{id:'financing',label:'Financing',icon:Landmark},{id:'service',label:'Service & Warranty',icon:CalendarCheck},{id:'payments',label:'Payments',icon:CircleDollarSign},{id:'invoices',label:'Invoices',icon:FileText},{id:'shipments',label:'Shipments',icon:Ship},{id:'sales',label:'Sales',icon:BarChart3},{id:'staff',label:'Staff',icon:Wrench},{id:'reports',label:'Reports',icon:ClipboardList}
];

export default function AdminPage(){
  const [section,setSection]=useState<Section>('overview');
  const [mobile,setMobile]=useState(false);
  const [cars,setCars]=useState<any[]>([]);
  const [orders,setOrders]=useState<AdminOrder[]>([]);
  const [query,setQuery]=useState('');
  const [toast,setToast]=useState('');

  useEffect(()=>{
    fetch('/api/vehicles').then(r=>r.json()).then(setCars).catch(()=>{});
    fetch('/api/orders').then(r=>r.ok?r.json():[]).then(setOrders).catch(()=>{});
  },[]);

  const filteredCars=useMemo(()=>cars.filter(c=>`${c.brand} ${c.model}`.toLowerCase().includes(query.toLowerCase())),[cars,query]);
  const totalSales=orders.reduce((s,o)=>s+o.paid,0);
  const outstanding=orders.reduce((s,o)=>s+o.amount-o.paid,0);
  const activeOrders=orders.filter(o=>!['Delivered'].includes(o.status)).length;
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2200)};
  const updateOrder=(orderNo:string,status:string)=>{
    setOrders(prev=>prev.map(o=>o.orderNo===orderNo?{...o,status}:o));
    fetch(`/api/orders/${orderNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}).catch(()=>{});
    showToast(`Order ${orderNo} updated`);
  };

  return <div className="adminShell">
    <aside className={mobile?'adminSide open':'adminSide'}>
      <div className="adminBrand"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DEALERSHIP ADMIN</small></span><button className="sideClose" onClick={()=>setMobile(false)}><X/></button></div>
      <div className="adminMenu">{nav.map(n=>{const I=n.icon;return <button key={n.id} className={section===n.id?'selected':''} onClick={()=>{setSection(n.id);setMobile(false)}}><I size={18}/>{n.label}{n.id==='orders'&&<span className="navBadge">{activeOrders}</span>}</button>})}</div>
      <div className="sideBottom"><button onClick={()=>showToast('Settings module coming soon')}><Settings size={18}/>Settings</button><div className="adminUser"><span>PB</span><div><b>Admin User</b><small>Super Admin</small></div><MoreHorizontal size={18}/></div></div>
    </aside>
    <main className="adminMain">
      <header className="adminTop"><button className="mobileAdminMenu" onClick={()=>setMobile(true)}><Menu/></button><div><p className="eyebrow dark">AUTO VAULT · ADMIN</p><h1>{nav.find(n=>n.id===section)?.label}</h1></div><div className="topTools"><button onClick={()=>showToast('You have 3 new notifications')} className="iconButton"><Bell size={19}/><i/></button><button className="adminProfile"><span>PB</span><b>Admin</b><ChevronDown size={16}/></button></div></header>
      {section==='overview'&&<Overview orders={orders} totalSales={totalSales} outstanding={outstanding} activeOrders={activeOrders} onSection={setSection} updateOrder={updateOrder}/>} 
      {section==='inventory'&&<Inventory query={query} setQuery={setQuery} filteredCars={filteredCars} showToast={showToast}/>} 
      {section==='orders'&&<Orders orders={orders} updateOrder={updateOrder}/>} 
      {section==='customers'&&<Customers orders={orders}/>} 
      {section==='crm'&&<CRM orders={orders} showToast={showToast}/>} 
      {section==='financing'&&<Financing showToast={showToast}/>} 
      {section==='service'&&<ServiceWarranty showToast={showToast}/>} 
      {section==='payments'&&<Payments orders={orders}/>} 
      {section==='invoices'&&<Invoices orders={orders}/>} 
      {section==='shipments'&&<Shipments orders={orders} updateOrder={updateOrder}/>} 
      {section==='sales'&&<Sales orders={orders}/>} 
      {section==='staff'&&<Staff showToast={showToast}/>} 
      {section==='reports'&&<Reports orders={orders} cars={cars}/>} 
      {toast&&<div className="adminToast"><CheckCircle2 size={17}/>{toast}</div>}
    </main>
  </div>
}

function Stat({label,value,sub,icon:Icon}:{label:string,value:string,sub:string,icon:any}){return <div className="statCard"><div className="statTop"><span>{label}</span><Icon size={19}/></div><strong>{value}</strong><small>{sub}</small></div>}

function Overview({orders,totalSales,outstanding,activeOrders,onSection,updateOrder}:{orders:AdminOrder[];totalSales:number;outstanding:number;activeOrders:number;onSection:(s:Section)=>void;updateOrder:(n:string,s:string)=>void}){
 return <section className="adminContent"><div className="statGrid"><Stat label="Vehicles in stock" value="24" sub="+4 this month" icon={CarFront}/><Stat label="Active orders" value={String(activeOrders)} sub="3 need attention" icon={ShoppingCart}/><Stat label="Sales collected" value={money(totalSales)} sub="August to date" icon={CircleDollarSign}/><Stat label="Outstanding" value={money(outstanding)} sub="Across active orders" icon={FileText}/></div>
 <div className="dashboardGrid"><div className="adminCard"><div className="cardHead"><div><h2>Sales performance</h2><p>Collected revenue · last 7 months</p></div><button onClick={()=>onSection('reports')}>View reports →</button></div><div className="chart"><div className="chartYAxis"><span>500k</span><span>400k</span><span>300k</span><span>200k</span><span>100k</span><span>0</span></div><div className="bars">{[['Feb',210],['Mar',290],['Apr',330],['May',370],['Jun',310],['Jul',450],['Aug',390]].map(([m,v])=><div className="barCol" key={m as string}><div className="bar" style={{height:`${Number(v)/5}px`}}/><span>{m}</span></div>)}</div></div></div>
 <div className="adminCard"><div className="cardHead"><div><h2>Inventory snapshot</h2><p>Current vehicle pipeline</p></div><button onClick={()=>onSection('inventory')}>Manage →</button></div><div className="inventoryStats"><div><b>24</b><span>In stock</span></div><div><b>12</b><span>In transit</span></div><div><b>6</b><span>Reserved</span></div><div><b>51</b><span>Sold</span></div></div><div className="miniProgress"><span style={{width:'58%'}}/><span style={{width:'24%'}}/><span style={{width:'14%'}}/></div><div className="legend"><span><i/>In stock</span><span><i/>In transit</span><span><i/>Reserved</span></div></div></div>
 <div className="adminCard"><div className="cardHead"><div><h2>Recent orders</h2><p>Latest dealership activity</p></div><button onClick={()=>onSection('orders')}>View all →</button></div><OrderTable orders={orders.slice(0,5)} updateOrder={updateOrder}/></div></section>
}


type Lead = {id:string; name:string; phone:string; vehicle:string; source:string; agent:string; stage:string; value:number; lastContact:string; nextFollowUp:string; notes:string};

const leadStages = ['New Lead','Contacted','Interested','Test Drive','Negotiation','Deposit Paid','Sold','Lost'];

function CRM({orders,showToast}:{orders:AdminOrder[];showToast:(m:string)=>void}) {
  const [leads,setLeads] = useState<Lead[]>([]);
  useEffect(()=>{ fetch('/api/leads').then(r=>r.ok?r.json():[]).then(setLeads).catch(()=>{}); },[]);
  const [stage,setStage] = useState('All');
  const [query,setQuery] = useState('');
  const [selected,setSelected] = useState<Lead|null>(null);

  const visible = leads.filter(l =>
    (stage==='All' || l.stage===stage) &&
    `${l.name} ${l.phone} ${l.vehicle} ${l.agent}`.toLowerCase().includes(query.toLowerCase())
  );
  const pipelineValue = leads.filter(l=>!['Lost','Sold'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
  const won = leads.filter(l=>l.stage==='Sold').length;
  const active = leads.filter(l=>!['Lost','Sold'].includes(l.stage)).length;

  const moveLead = (id:string, next:string) => {
    setLeads(prev=>prev.map(l=>l.id===id?{...l,stage:next}:l));
    fetch(`/api/leads/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stage:next})}).catch(()=>{});
    showToast(`Lead moved to ${next}`);
  };

  return <section className="adminContent">
    <div className="contentToolbar">
      <div><h2>CRM & Sales Pipeline</h2><p>Manage leads, conversations, follow-ups and conversion from enquiry to sale.</p></div>
      <button className="adminPrimary" onClick={()=>showToast('New lead form is ready for the backend')}><Plus size={17}/> Add lead</button>
    </div>

    <div className="statGrid crmStats">
      <Stat label="Active leads" value={String(active)} sub="Across the pipeline" icon={Users}/>
      <Stat label="Pipeline value" value={money(pipelineValue)} sub="Open opportunities" icon={CircleDollarSign}/>
      <Stat label="Won this period" value={String(won)} sub="Converted customers" icon={CheckCircle2}/>
      <Stat label="Follow-ups" value="7" sub="Due in the next 7 days" icon={Bell}/>
    </div>

    <div className="pipelineStrip">
      {leadStages.slice(0,7).map(s=><button key={s} className={stage===s?'active':''} onClick={()=>setStage(stage===s?'All':s)}>{s}<b>{leads.filter(l=>l.stage===s).length}</b></button>)}
    </div>

    <div className="crmToolbar">
      <div className="adminSearch"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search leads, customers, vehicles or agents..."/></div>
      <select value={stage} onChange={e=>setStage(e.target.value)}><option>All</option>{leadStages.map(s=><option key={s}>{s}</option>)}</select>
      <button onClick={()=>showToast('Lead export prepared')}>Export</button>
    </div>

    <div className="crmLayout">
      <div className="adminCard">
        <div className="cardHead"><div><h2>Lead pipeline</h2><p>Drag-and-drop can be connected to the backend later.</p></div><span className="crmCount">{visible.length} records</span></div>
        <div className="crmTableWrap">
          <table><thead><tr><th>Lead / Customer</th><th>Vehicle</th><th>Source</th><th>Agent</th><th>Stage</th><th>Value</th><th>Next follow-up</th><th></th></tr></thead>
          <tbody>{visible.map(l=><tr key={l.id}>
            <td><b>{l.name}</b><small>{l.id} · {l.phone}</small></td>
            <td>{l.vehicle}</td><td>{l.source}</td><td>{l.agent}</td>
            <td><select className="stageSelect" value={l.stage} onChange={e=>moveLead(l.id,e.target.value)}>{leadStages.map(s=><option key={s}>{s}</option>)}</select></td>
            <td>{money(l.value)}</td><td>{l.nextFollowUp}</td>
            <td><button className="rowAction" onClick={()=>setSelected(l)}>View</button></td>
          </tr>)}</tbody></table>
        </div>
      </div>

      <div className="adminCard followCard">
        <div className="cardHead"><div><h2>Today's follow-ups</h2><p>Keep every opportunity moving.</p></div></div>
        {leads.filter(l=>l.nextFollowUp==='11 Aug' || l.nextFollowUp==='12 Aug').map(l=>
          <div className="followItem" key={l.id}>
            <div className="avatar">{l.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
            <div><b>{l.name}</b><small>{l.vehicle} · {l.nextFollowUp}</small></div>
            <button onClick={()=>{setSelected(l);showToast(`Opening ${l.name}`)}}>Open</button>
          </div>
        )}
        <div className="crmTip"><b>Sales tip</b><span>Follow up within 24 hours after a test drive or pricing enquiry.</span></div>
      </div>
    </div>

    {selected && <div className="crmModalBackdrop" onClick={()=>setSelected(null)}>
      <div className="crmModal" onClick={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)}><X size={17}/></button>
        <p className="eyebrow dark">LEAD {selected.id}</p>
        <h2>{selected.name}</h2>
        <p className="crmModalVehicle">{selected.vehicle} · {money(selected.value)}</p>
        <div className="leadInfoGrid"><span><small>Phone</small><b>{selected.phone}</b></span><span><small>Source</small><b>{selected.source}</b></span><span><small>Agent</small><b>{selected.agent}</b></span><span><small>Last contact</small><b>{selected.lastContact}</b></span></div>
        <div className="noteBox"><small>CRM Notes</small><p>{selected.notes}</p></div>
        <div className="modalActions">
          <button className="outlineBtn" onClick={()=>showToast('Follow-up marked as completed')}>✓ Complete follow-up</button>
          <button className="adminPrimary" onClick={()=>showToast('Customer profile prepared')}>Open customer</button>
        </div>
      </div>
    </div>}
  </section>
}

type FinanceApp = { appNo:string; customer:string; vehicle:string; price:number; downPayment:number; loanAmount:number; term:number; rate:number; monthlyPayment:number; status:string; date:string };
type TradeIn = { tradeNo:string; customer:string; vehicle:string; estimatedValue:number; status:string; date:string };

const financeStages = ['Submitted','Document Review','Credit Check','Approved','Declined','Disbursed'];
const tradeStages = ['Pending Valuation','Offer Sent','Accepted','Declined'];

function Financing({showToast}:{showToast:(m:string)=>void}) {
  const [apps,setApps] = useState<FinanceApp[]>([]);
  const [trades,setTrades] = useState<TradeIn[]>([]);
  const [view,setView] = useState<'applications'|'tradeins'>('applications');

  useEffect(() => {
    fetch('/api/financing/applications').then(r=>r.ok?r.json():[]).then(setApps).catch(()=>{});
    fetch('/api/financing/tradeins').then(r=>r.ok?r.json():[]).then(setTrades).catch(()=>{});
  }, []);

  const totalApps = apps.length;
  const approvedValue = apps.filter(a=>['Approved','Disbursed'].includes(a.status)).reduce((s,a)=>s+a.loanAmount,0);
  const pendingReview = apps.filter(a=>['Submitted','Document Review','Credit Check'].includes(a.status)).length;

  const moveApp = (appNo:string, status:string) => {
    setApps(prev=>prev.map(a=>a.appNo===appNo?{...a,status}:a));
    fetch(`/api/financing/applications/${appNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}).catch(()=>{});
    showToast(`Application ${appNo} moved to ${status}`);
  };
  const moveTrade = (tradeNo:string, status:string) => {
    setTrades(prev=>prev.map(t=>t.tradeNo===tradeNo?{...t,status}:t));
    fetch(`/api/financing/tradeins/${tradeNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}).catch(()=>{});
    showToast(`Trade-in ${tradeNo} moved to ${status}`);
  };

  return <section className="adminContent">
    <div className="contentToolbar">
      <div><h2>Financing &amp; Trade-In</h2><p>Review financing applications through approval and manage trade-in valuations.</p></div>
    </div>

    <div className="statGrid">
      <Stat label="Applications" value={String(totalApps)} sub="All time" icon={FileText}/>
      <Stat label="Approved loan value" value={money(approvedValue)} sub="Approved + disbursed" icon={CircleDollarSign}/>
      <Stat label="Pending review" value={String(pendingReview)} sub="Needs action" icon={Bell}/>
      <Stat label="Trade-in requests" value={String(trades.length)} sub="Awaiting inspection or offer" icon={RefreshCcw}/>
    </div>

    <div className="pipelineStrip">
      <button className={view==='applications'?'active':''} onClick={()=>setView('applications')}>Financing applications<b>{apps.length}</b></button>
      <button className={view==='tradeins'?'active':''} onClick={()=>setView('tradeins')}>Trade-in requests<b>{trades.length}</b></button>
    </div>

    {view==='applications' && <div className="adminCard">
      <div className="cardHead"><div><h2>Approval workflow</h2><p>Move each application through document review, credit check and approval.</p></div></div>
      <div className="crmTableWrap"><table><thead><tr><th>Application</th><th>Customer</th><th>Vehicle</th><th>Loan amount</th><th>Monthly</th><th>Stage</th></tr></thead>
        <tbody>{apps.map(a=><tr key={a.appNo}>
          <td><b>{a.appNo}</b><small>{a.date}</small></td>
          <td>{a.customer}</td><td>{a.vehicle}</td>
          <td>{money(a.loanAmount)}</td><td>{money(a.monthlyPayment)}</td>
          <td><select className="stageSelect" value={a.status} onChange={e=>moveApp(a.appNo,e.target.value)}>{financeStages.map(s=><option key={s}>{s}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>
    </div>}

    {view==='tradeins' && <div className="adminCard">
      <div className="cardHead"><div><h2>Trade-in requests</h2><p>Confirm valuations and move requests to an offer.</p></div></div>
      <div className="crmTableWrap"><table><thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Estimated value</th><th>Stage</th></tr></thead>
        <tbody>{trades.map(t=><tr key={t.tradeNo}>
          <td><b>{t.tradeNo}</b><small>{t.date}</small></td>
          <td>{t.customer}</td><td>{t.vehicle}</td>
          <td>{money(t.estimatedValue)}</td>
          <td><select className="stageSelect" value={t.status} onChange={e=>moveTrade(t.tradeNo,e.target.value)}>{tradeStages.map(s=><option key={s}>{s}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>
    </div>}
  </section>
}

type JobCard = { jobNo:string; customer:string; vehicle:string; serviceType:string; status:string; date:string; laborHours:number; laborRate:number; parts:{name:string;qty:number;price:number}[]; paid?:boolean };
type WarrantyClaim = { claimNo:string; customer:string; vehicle:string; issue:string; orderNo:string; status:string; date:string };
type Part = { code:string; name:string; stock:number; price:number };

const jobStages = ['Booked','Checked In','In Progress','Awaiting Parts','Quality Check','Completed'];
const claimStages = ['Submitted','Under Review','Approved','Rejected','Resolved'];

function ServiceWarranty({showToast}:{showToast:(m:string)=>void}) {
  const [jobs,setJobs] = useState<JobCard[]>([]);
  const [claims,setClaims] = useState<WarrantyClaim[]>([]);
  const [parts,setParts] = useState<Part[]>([]);
  const [view,setView] = useState<'jobcards'|'parts'|'warranty'|'invoices'>('jobcards');

  useEffect(() => {
    fetch('/api/service/bookings').then(r=>r.ok?r.json():[]).then(setJobs).catch(()=>{});
    fetch('/api/service/claims').then(r=>r.ok?r.json():[]).then(setClaims).catch(()=>{});
    fetch('/api/service/parts').then(r=>r.ok?r.json():[]).then(setParts).catch(()=>{});
  }, []);

  const jobTotal = (j:JobCard) => j.laborHours*j.laborRate + j.parts.reduce((s,p)=>s+p.qty*p.price,0);
  const activeJobs = jobs.filter(j=>j.status!=='Completed').length;
  const completedJobs = jobs.filter(j=>j.status==='Completed');
  const openClaims = claims.filter(c=>!['Resolved','Rejected'].includes(c.status)).length;
  const lowStock = parts.filter(p=>p.stock<5).length;

  const moveJob = (jobNo:string, status:string) => {
    setJobs(prev=>prev.map(j=>j.jobNo===jobNo?{...j,status}:j));
    fetch(`/api/service/bookings/${jobNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}).catch(()=>{});
    showToast(`Job card ${jobNo} moved to ${status}`);
  };
  const moveClaim = (claimNo:string, status:string) => {
    setClaims(prev=>prev.map(c=>c.claimNo===claimNo?{...c,status}:c));
    fetch(`/api/service/claims/${claimNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}).catch(()=>{});
    showToast(`Claim ${claimNo} moved to ${status}`);
  };
  const updateStock = (code:string, stock:number) => {
    setParts(prev=>prev.map(p=>p.code===code?{...p,stock}:p));
    fetch(`/api/service/parts/${code}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stock})}).catch(()=>{});
  };
  const markPaid = (jobNo:string) => {
    setJobs(prev=>prev.map(j=>j.jobNo===jobNo?{...j,paid:true}:j));
    fetch(`/api/service/bookings/${jobNo}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({paid:true})}).catch(()=>{});
    showToast(`Invoice for ${jobNo} marked as paid`);
  };

  return <section className="adminContent">
    <div className="contentToolbar">
      <div><h2>Service &amp; Warranty</h2><p>Manage job cards, parts stock, warranty claims and service invoices.</p></div>
    </div>

    <div className="statGrid">
      <Stat label="Active job cards" value={String(activeJobs)} sub="In the workshop" icon={Wrench}/>
      <Stat label="Completed this period" value={String(completedJobs.length)} sub="Ready to invoice" icon={CheckCircle2}/>
      <Stat label="Open warranty claims" value={String(openClaims)} sub="Needs review" icon={ShieldAlert}/>
      <Stat label="Low stock parts" value={String(lowStock)} sub="Below 5 units" icon={Package}/>
    </div>

    <div className="pipelineStrip">
      <button className={view==='jobcards'?'active':''} onClick={()=>setView('jobcards')}>Job cards<b>{jobs.length}</b></button>
      <button className={view==='parts'?'active':''} onClick={()=>setView('parts')}>Parts<b>{parts.length}</b></button>
      <button className={view==='warranty'?'active':''} onClick={()=>setView('warranty')}>Warranty claims<b>{claims.length}</b></button>
      <button className={view==='invoices'?'active':''} onClick={()=>setView('invoices')}>Service invoices<b>{completedJobs.length}</b></button>
    </div>

    {view==='jobcards' && <div className="adminCard">
      <div className="cardHead"><div><h2>Job cards</h2><p>Move each job through the workshop, from booking to completion.</p></div></div>
      <div className="crmTableWrap"><table><thead><tr><th>Job card</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Parts</th><th>Total</th><th>Stage</th></tr></thead>
        <tbody>{jobs.map(j=><tr key={j.jobNo}>
          <td><b>{j.jobNo}</b><small>{j.date}</small></td>
          <td>{j.customer}</td><td>{j.vehicle}</td><td>{j.serviceType}</td>
          <td>{j.parts.length ? j.parts.map(p=>`${p.name} ×${p.qty}`).join(', ') : '—'}</td>
          <td>{money(jobTotal(j))}</td>
          <td><select className="stageSelect" value={j.status} onChange={e=>moveJob(j.jobNo,e.target.value)}>{jobStages.map(s=><option key={s}>{s}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>
    </div>}

    {view==='parts' && <div className="adminCard">
      <div className="cardHead"><div><h2>Parts inventory</h2><p>Track stock on hand for common service parts.</p></div></div>
      <div className="adminContent" style={{padding:'0 22px 22px'}}><div className="partsGrid">{parts.map(p=><div className="partCard" key={p.code}>
        <div className="partTop"><div><small>{p.code}</small><h3>{p.name}</h3></div>{p.stock<5 && <span className="lowStock">Low stock</span>}</div>
        <span>Unit price: {money(p.price)}</span>
        <div className="partStock"><span>Stock on hand</span><input type="number" min={0} value={p.stock} onChange={e=>updateStock(p.code,Number(e.target.value))}/></div>
      </div>)}</div></div>
    </div>}

    {view==='warranty' && <div className="adminCard">
      <div className="cardHead"><div><h2>Warranty claims</h2><p>Review and progress claims submitted by customers.</p></div></div>
      <div className="crmTableWrap"><table><thead><tr><th>Claim</th><th>Customer</th><th>Vehicle</th><th>Issue</th><th>Order</th><th>Stage</th></tr></thead>
        <tbody>{claims.map(c=><tr key={c.claimNo}>
          <td><b>{c.claimNo}</b><small>{c.date}</small></td>
          <td>{c.customer}</td><td>{c.vehicle}</td>
          <td>{c.issue.slice(0,50)}{c.issue.length>50?'…':''}</td>
          <td>{c.orderNo}</td>
          <td><select className="stageSelect" value={c.status} onChange={e=>moveClaim(c.claimNo,e.target.value)}>{claimStages.map(s=><option key={s}>{s}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>
    </div>}

    {view==='invoices' && <div className="adminCard">
      <div className="cardHead"><div><h2>Service invoices</h2><p>Invoices generated from completed job cards (labor + parts).</p></div><button onClick={()=>window.print()}><FileText size={15}/> Print</button></div>
      <div className="tableWrap"><table><thead><tr><th>Invoice</th><th>Job card</th><th>Customer</th><th>Vehicle</th><th>Labor</th><th>Parts</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>{completedJobs.map(j=><tr key={j.jobNo}>
          <td><b>SVC-INV-{j.jobNo.slice(-6)}</b><small>{j.date}</small></td>
          <td>{j.jobNo}</td><td>{j.customer}</td><td>{j.vehicle}</td>
          <td>{money(j.laborHours*j.laborRate)}</td>
          <td>{money(j.parts.reduce((s,p)=>s+p.qty*p.price,0))}</td>
          <td>{money(jobTotal(j))}</td>
          <td><Status status={j.paid?'Paid':'Outstanding'}/></td>
          <td>{!j.paid && <button className="rowAction" onClick={()=>markPaid(j.jobNo)}>Mark paid</button>}</td>
        </tr>)}</tbody>
      </table></div>
      {!completedJobs.length && <div className="empty"><FileText/><h3>No invoices yet</h3><p>Invoices appear here once a job card is marked Completed.</p></div>}
    </div>}
  </section>
}

function OrderTable({orders,updateOrder}:{orders:AdminOrder[];updateOrder:(n:string,s:string)=>void}){return <div className="tableWrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Vehicle</th><th>Value</th><th>Paid</th><th>Status</th><th></th></tr></thead><tbody>{orders.map(o=><tr key={o.orderNo}><td><b>{o.orderNo}</b><small>{o.date}</small></td><td>{o.customer}</td><td>{o.vehicle}</td><td>{money(o.amount)}</td><td>{money(o.paid)}</td><td><Status status={o.status}/></td><td><select className="statusSelect" value={o.status} onChange={e=>updateOrder(o.orderNo,e.target.value)}><option>Payment Pending</option><option>Vehicle Allocated</option><option>Export Processing</option><option>Shipped</option><option>Arrived in Ghana</option><option>Customs & Clearing</option><option>Ready for Collection</option><option>Delivered</option></select></td></tr>)}</tbody></table></div>}
function Status({status}:{status:string}){const good=['Delivered','Ready for Collection','Shipped','Vehicle Allocated'].includes(status);return <span className={`status ${good?'good':status.includes('Pending')?'warn':'neutral'}`}>{status}</span>}

function Inventory({query,setQuery,filteredCars,showToast}:{query:string;setQuery:(v:string)=>void;filteredCars:any[];showToast:(m:string)=>void}){return <section className="adminContent"><div className="contentToolbar"><div><h2>Vehicle inventory</h2><p>Manage availability, pricing and vehicle records.</p></div><button className="adminPrimary" onClick={()=>showToast('New vehicle form is ready for the backend') }><Plus size={17}/> Add vehicle</button></div><div className="inventoryFilters"><div className="adminSearch"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search vehicle..."/></div><button>All brands <ChevronDown size={15}/></button><button>All statuses <ChevronDown size={15}/></button></div><div className="vehicleAdminGrid">{filteredCars.map(c=><div className="vehicleAdminCard" key={c.id}><img src={c.img} alt=""/><div className="vehicleAdminBody"><div className="vehicleTitle"><div><small>{c.brand} · {c.year}</small><h3>{c.model}</h3></div><Status status={c.status}/></div><div className="vehicleMeta"><span>Stock ID<br/><b>AV-{c.id.slice(0,5).toUpperCase()}</b></span><span>Price<br/><b>{money(c.price)}</b></span></div><div className="vehicleActions"><button onClick={()=>showToast(`${c.brand} ${c.model} selected`)}>Edit</button><button onClick={()=>showToast('Vehicle status editor opened')}>Update status</button></div></div></div>)}</div></section>}

function Orders({orders,updateOrder}:{orders:AdminOrder[];updateOrder:(n:string,s:string)=>void}){return <section className="adminContent"><div className="contentToolbar"><div><h2>Orders</h2><p>Review, approve and move customer orders through the sales process.</p></div><button className="adminPrimary" onClick={()=>alert('Create order is connected in the backend phase')}><Plus size={17}/> Create order</button></div><div className="orderKPIs"><span><b>{orders.length}</b> Total orders</span><span><b>{orders.filter(o=>o.status==='Delivered').length}</b> Delivered</span><span><b>{orders.filter(o=>o.status.includes('Pending')).length}</b> Pending payment</span></div><div className="adminCard"><OrderTable orders={orders} updateOrder={updateOrder}/></div></section>}

function Customers({orders}:{orders:AdminOrder[]}){const names=[...new Set(orders.map(o=>o.customer))];return <section className="adminContent"><div className="contentToolbar"><div><h2>Customers</h2><p>Customer records connected to vehicle orders.</p></div><button className="adminPrimary"><Plus size={17}/> Add customer</button></div><div className="adminCard"><div className="tableWrap"><table><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total value</th><th>Last activity</th></tr></thead><tbody>{names.map((n,i)=>{const os=orders.filter(o=>o.customer===n);return <tr key={n}><td><b>{n}</b><small>Customer ID AV-CUST-{String(i+1).padStart(4,'0')}</small></td><td>024 XXX XXXX</td><td>{os.length}</td><td>{money(os.reduce((s,o)=>s+o.amount,0))}</td><td>{os[0]?.date}</td></tr>})}</tbody></table></div></div></section>}

function Payments({orders}:{orders:AdminOrder[]}){return <section className="adminContent"><div className="statGrid"><Stat label="Collected" value={money(orders.reduce((s,o)=>s+o.paid,0))} sub="All recorded payments" icon={CircleDollarSign}/><Stat label="Outstanding" value={money(orders.reduce((s,o)=>s+o.amount-o.paid,0))} sub="Needs collection" icon={FileText}/><Stat label="Transactions" value="18" sub="This month" icon={ClipboardList}/><Stat label="Pending verification" value="3" sub="Needs review" icon={Bell}/></div><div className="adminCard"><div className="cardHead"><div><h2>Recent payments</h2><p>Payment ledger by order</p></div></div><div className="tableWrap"><table><thead><tr><th>Reference</th><th>Order</th><th>Customer</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead><tbody>{orders.map((o,i)=><tr key={o.orderNo}><td><b>PAY-{String(i+1).padStart(5,'0')}</b></td><td>{o.orderNo}</td><td>{o.customer}</td><td>{i%3===0?'Mobile Money':i%3===1?'Bank Transfer':'Card'}</td><td>{money(o.paid)}</td><td><Status status={o.paid>0?'Verified':'Payment Pending'}/></td></tr>)}</tbody></table></div></div></section>}

function Invoices({orders}:{orders:AdminOrder[]}){return <section className="adminContent"><div className="contentToolbar"><div><h2>Invoices</h2><p>Invoices generated from customer orders.</p></div><button className="adminPrimary"><Plus size={17}/> Create invoice</button></div><div className="adminCard"><div className="tableWrap"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Order</th><th>Total</th><th>Balance</th><th>Status</th></tr></thead><tbody>{orders.map((o,i)=><tr key={o.orderNo}><td><b>INV-2026-{String(i+124).padStart(4,'0')}</b><small>{o.date}</small></td><td>{o.customer}</td><td>{o.orderNo}</td><td>{money(o.amount)}</td><td>{money(o.amount-o.paid)}</td><td><Status status={o.amount===o.paid?'Paid':'Outstanding'}/></td></tr>)}</tbody></table></div></div></section>}

function Shipments({orders,updateOrder}:{orders:AdminOrder[];updateOrder:(n:string,s:string)=>void}){const shipped=orders.filter(o=>['Shipped','Arrived in Ghana','Customs & Clearing','Ready for Collection'].includes(o.status));return <section className="adminContent"><div className="contentToolbar"><div><h2>Shipments</h2><p>Track imported vehicles from export to delivery.</p></div><button className="adminPrimary"><Plus size={17}/> New shipment</button></div><div className="shipmentGrid">{shipped.map((o,i)=><div className="shipmentCard" key={o.orderNo}><div className="shipTop"><span className="shipIcon"><Ship size={19}/></span><div><b>{o.orderNo}</b><small>{o.vehicle}</small></div><Status status={o.status}/></div><div className="shipRoute"><div><small>ORIGIN</small><b>China</b></div><div className="routeLine"><span>────── ✈ ──────</span><small>ETA 18 Aug 2026</small></div><div><small>DESTINATION</small><b>Accra, Ghana</b></div></div><div className="shipMeta"><span>Vessel<br/><b>MV Auto Pioneer</b></span><span>Container<br/><b>AVCU{i+1}02688</b></span><span>Clearing<br/><b>{o.status==='Arrived in Ghana'?'In progress':'Pending'}</b></span></div><select className="shipmentSelect" value={o.status} onChange={e=>updateOrder(o.orderNo,e.target.value)}><option>Shipped</option><option>Arrived in Ghana</option><option>Customs & Clearing</option><option>Ready for Collection</option><option>Delivered</option></select></div>)}</div></section>}

function Sales({orders}:{orders:AdminOrder[]}){return <section className="adminContent"><div className="statGrid"><Stat label="August revenue" value={money(orders.reduce((s,o)=>s+o.paid,0))} sub="Collected to date" icon={CircleDollarSign}/><Stat label="Units sold" value="8" sub="+2 vs July" icon={CarFront}/><Stat label="Average order" value={money(orders.reduce((s,o)=>s+o.amount,0)/orders.length)} sub="Across current orders" icon={ShoppingCart}/><Stat label="Conversion" value="18.4%" sub="Lead to sale" icon={BarChart3}/></div><div className="adminCard"><div className="cardHead"><div><h2>Sales by brand</h2><p>Current year performance</p></div></div><div className="salesRows">{['Jetour','Changan','Chery','Geely','GAC'].map((b,i)=><div key={b}><span>{b}</span><div><i style={{width:`${88-i*13}%`}}/></div><b>{[28,22,19,17,14][i]}%</b></div>)}</div></div></section>}

function Staff({showToast}:{showToast:(m:string)=>void}){
  const [staff,setStaff]=useState<any[]>([]);
  useEffect(()=>{ fetch('/api/staff').then(r=>r.ok?r.json():[]).then(setStaff).catch(()=>{}); },[]);
  const roleLabel:any={ADMIN:'Admin',SALES_MANAGER:'Sales Manager',SALES_AGENT:'Sales Agent',ACCOUNTANT:'Accountant',INVENTORY_MANAGER:'Inventory Manager',WORKSHOP_MANAGER:'Workshop Manager'};
  const invite=async()=>{
    const name=window.prompt('Staff member full name?'); if(!name)return;
    const email=window.prompt('Email address?'); if(!email)return;
    const role=window.prompt('Role — one of ADMIN, SALES_MANAGER, SALES_AGENT, ACCOUNTANT, INVENTORY_MANAGER, WORKSHOP_MANAGER','SALES_AGENT'); if(!role)return;
    const res=await fetch('/api/staff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,role})});
    const data=await res.json();
    if(!res.ok){alert(data.error||'Could not invite staff member');return;}
    setStaff(prev=>[...prev,data]);
    showToast(`Invited ${name} — temporary password: ${data.tempPassword}`);
  };
  return <section className="adminContent"><div className="contentToolbar"><div><h2>Staff &amp; permissions</h2><p>Control access to dealership functions by role.</p></div><button className="adminPrimary" onClick={invite}><Plus size={17}/> Invite staff</button></div><div className="adminCard"><div className="tableWrap"><table><thead><tr><th>Staff member</th><th>Role</th><th>Email</th><th>Permissions</th></tr></thead><tbody>{staff.map(s=><tr key={s.id}><td><b>{s.name}</b></td><td>{roleLabel[s.role]||s.role}</td><td>{s.email}</td><td>Inventory · Orders · Customers</td></tr>)}</tbody></table></div></div></section>
}

type ReportView = 'overview'|'sales'|'inventory'|'agents'|'finance'|'service';

function Reports({orders,cars}:{orders:AdminOrder[];cars:any[]}) {
  const [view,setView] = useState<ReportView>('overview');
  const [financeApps,setFinanceApps] = useState<FinanceApp[]>([]);
  const [tradeIns,setTradeIns] = useState<TradeIn[]>([]);
  const [jobs,setJobs] = useState<JobCard[]>([]);
  const [claims,setClaims] = useState<WarrantyClaim[]>([]);
  const [parts,setParts] = useState<Part[]>([]);
  const [leads,setLeads] = useState<Lead[]>([]);

  // Every report tab is driven by the same live data the rest of the admin dashboard uses.
  useEffect(() => {
    fetch('/api/financing/applications').then(r=>r.ok?r.json():[]).then(setFinanceApps).catch(()=>{});
    fetch('/api/financing/tradeins').then(r=>r.ok?r.json():[]).then(setTradeIns).catch(()=>{});
    fetch('/api/service/bookings').then(r=>r.ok?r.json():[]).then(setJobs).catch(()=>{});
    fetch('/api/service/claims').then(r=>r.ok?r.json():[]).then(setClaims).catch(()=>{});
    fetch('/api/service/parts').then(r=>r.ok?r.json():[]).then(setParts).catch(()=>{});
    fetch('/api/leads').then(r=>r.ok?r.json():[]).then(setLeads).catch(()=>{});
  }, []);

  // ---- Derived metrics ----
  const totalRevenue = orders.reduce((s,o)=>s+o.paid,0);
  const outstanding = orders.reduce((s,o)=>s+o.amount-o.paid,0);
  const orderBook = orders.reduce((s,o)=>s+o.amount,0);
  const avgOrderValue = orders.length ? orderBook/orders.length : 0;
  const inventoryValue = cars.reduce((s:number,c:any)=>s+c.price,0);
  const inStock = cars.filter((c:any)=>c.status==='In Stock').length;
  const inTransit = cars.filter((c:any)=>c.status==='In Transit').length;
  const reserved = cars.filter((c:any)=>c.status==='Reserved').length;

  const brandRevenue = brands.map(b=>({brand:b, revenue: orders.filter(o=>o.vehicle.startsWith(b)).reduce((s,o)=>s+o.paid,0), units: orders.filter(o=>o.vehicle.startsWith(b)).length}));
  const maxBrandRevenue = Math.max(1, ...brandRevenue.map(b=>b.revenue));
  const brandInventoryCount = brands.map(b=>({brand:b, count: cars.filter((c:any)=>c.brand===b).length, value: cars.filter((c:any)=>c.brand===b).reduce((s:number,c:any)=>s+c.price,0)}));

  const agents = [...new Set(leads.map(l=>l.agent))];
  const agentStats = agents.map(a=>{
    const ls = leads.filter(l=>l.agent===a);
    const won = ls.filter(l=>l.stage==='Sold').length;
    const lost = ls.filter(l=>l.stage==='Lost').length;
    const pipelineValue = ls.filter(l=>!['Lost','Sold'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
    const wonValue = ls.filter(l=>l.stage==='Sold').reduce((s,l)=>s+l.value,0);
    return {agent:a, total:ls.length, won, lost, pipelineValue, wonValue, conversion: ls.length ? Math.round((won/ls.length)*100) : 0};
  }).sort((a,b)=>b.wonValue-a.wonValue);
  const activeLeads = leads.filter(l=>!['Lost','Sold'].includes(l.stage)).length;
  const totalPipelineValue = leads.filter(l=>!['Lost','Sold'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
  const overallConversion = leads.length ? Math.round((leads.filter(l=>l.stage==='Sold').length/leads.length)*100) : 0;

  const approvedLoanValue = financeApps.filter(a=>['Approved','Disbursed'].includes(a.status)).reduce((s,a)=>s+a.loanAmount,0);
  const disbursedValue = financeApps.filter(a=>a.status==='Disbursed').reduce((s,a)=>s+a.loanAmount,0);
  const financeByStage = financeStages.map(s=>({stage:s, count: financeApps.filter(a=>a.status===s).length}));
  const acceptedTradeInValue = tradeIns.filter(t=>t.status==='Accepted').reduce((s,t)=>s+t.estimatedValue,0);

  const jobTotal = (j:JobCard) => j.laborHours*j.laborRate + j.parts.reduce((s,p)=>s+p.qty*p.price,0);
  const completedJobs = jobs.filter(j=>j.status==='Completed');
  const serviceRevenue = completedJobs.reduce((s,j)=>s+jobTotal(j),0);
  const outstandingServiceInvoices = completedJobs.filter(j=>!j.paid).reduce((s,j)=>s+jobTotal(j),0);
  const jobsByStage = jobStages.map(s=>({stage:s, count: jobs.filter(j=>j.status===s).length}));
  const openClaims = claims.filter(c=>!['Resolved','Rejected'].includes(c.status)).length;
  const lowStockParts = parts.filter(p=>p.stock<5).length;

  return <section className="adminContent">
    <div className="contentToolbar">
      <div><h2>Reports &amp; Business Intelligence</h2><p>Management summaries across sales, inventory, agents, finance and service.</p></div>
      <button className="adminPrimary" onClick={()=>window.print()}><FileText size={17}/> Print report</button>
    </div>

    <div className="pipelineStrip">
      <button className={view==='overview'?'active':''} onClick={()=>setView('overview')}>Management dashboard</button>
      <button className={view==='sales'?'active':''} onClick={()=>setView('sales')}>Sales &amp; revenue</button>
      <button className={view==='inventory'?'active':''} onClick={()=>setView('inventory')}>Inventory</button>
      <button className={view==='agents'?'active':''} onClick={()=>setView('agents')}>Agent performance</button>
      <button className={view==='finance'?'active':''} onClick={()=>setView('finance')}>Finance</button>
      <button className={view==='service'?'active':''} onClick={()=>setView('service')}>Service</button>
    </div>

    {view==='overview' && <>
      <div className="statGrid">
        <Stat label="Revenue collected" value={money(totalRevenue)} sub="All recorded payments" icon={CircleDollarSign}/>
        <Stat label="Outstanding" value={money(outstanding)} sub="Across active orders" icon={FileText}/>
        <Stat label="Order book" value={money(orderBook)} sub={`${orders.length} orders`} icon={ShoppingCart}/>
        <Stat label="Inventory value" value={money(inventoryValue)} sub={`${cars.length} listed vehicles`} icon={CarFront}/>
      </div>
      <div className="statGrid">
        <Stat label="Approved loan value" value={money(approvedLoanValue)} sub="Financing approved + disbursed" icon={Landmark}/>
        <Stat label="Service revenue" value={money(serviceRevenue)} sub="From completed job cards" icon={Wrench}/>
        <Stat label="Pipeline value" value={money(totalPipelineValue)} sub={`${activeLeads} active leads`} icon={ClipboardList}/>
        <Stat label="Open warranty claims" value={String(openClaims)} sub="Needs review" icon={ShieldAlert}/>
      </div>
      <div className="reportGrid">
        <div className="adminCard reportCard" style={{cursor:'pointer'}} onClick={()=>setView('sales')}><span>Sales &amp; revenue</span><strong>{money(totalRevenue)}</strong><small>{orders.length} orders · avg {money(avgOrderValue)}</small></div>
        <div className="adminCard reportCard" style={{cursor:'pointer'}} onClick={()=>setView('inventory')}><span>Inventory</span><strong>{inStock+inTransit+reserved}</strong><small>{inStock} in stock · {inTransit} in transit · {reserved} reserved</small></div>
        <div className="adminCard reportCard" style={{cursor:'pointer'}} onClick={()=>setView('agents')}><span>Agent performance</span><strong>{overallConversion}%</strong><small>Lead-to-sale conversion, {agents.length} agents</small></div>
        <div className="adminCard reportCard" style={{cursor:'pointer'}} onClick={()=>setView('finance')}><span>Finance &amp; trade-in</span><strong>{money(approvedLoanValue)}</strong><small>{financeApps.length} applications · {tradeIns.length} trade-ins</small></div>
      </div>
    </>}

    {view==='sales' && <>
      <div className="statGrid">
        <Stat label="Revenue collected" value={money(totalRevenue)} sub="All recorded payments" icon={CircleDollarSign}/>
        <Stat label="Order book" value={money(orderBook)} sub="Active + completed orders" icon={ShoppingCart}/>
        <Stat label="Average order value" value={money(avgOrderValue)} sub={`${orders.length} orders`} icon={BarChart3}/>
        <Stat label="Outstanding" value={money(outstanding)} sub="Potential receivables" icon={FileText}/>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Revenue by brand</h2><p>Collected payments, current order book</p></div></div>
        <div className="salesRows">{brandRevenue.map(b=><div key={b.brand}><span>{b.brand}</span><div><i style={{width:`${Math.round((b.revenue/maxBrandRevenue)*100)}%`}}/></div><b>{money(b.revenue)}</b></div>)}</div>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Order funnel</h2><p>Orders by current status</p></div></div>
        <div className="tableWrap"><table><thead><tr><th>Status</th><th>Orders</th><th>Value</th></tr></thead><tbody>
          {[...new Set(orders.map(o=>o.status))].map(s=>{const os=orders.filter(o=>o.status===s); return <tr key={s}><td><b>{s}</b></td><td>{os.length}</td><td>{money(os.reduce((a,o)=>a+o.amount,0))}</td></tr>})}
        </tbody></table></div>
      </div>
    </>}

    {view==='inventory' && <>
      <div className="statGrid">
        <Stat label="Inventory value" value={money(inventoryValue)} sub={`${cars.length} listed vehicles`} icon={CarFront}/>
        <Stat label="In stock" value={String(inStock)} sub="Ready to sell" icon={CheckCircle2}/>
        <Stat label="In transit" value={String(inTransit)} sub="Importing" icon={Ship}/>
        <Stat label="Reserved" value={String(reserved)} sub="Held for a customer" icon={Users}/>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Inventory by brand</h2><p>Stock count and listed value</p></div></div>
        <div className="tableWrap"><table><thead><tr><th>Brand</th><th>Vehicles</th><th>Listed value</th></tr></thead><tbody>
          {brandInventoryCount.map(b=><tr key={b.brand}><td><b>{b.brand}</b></td><td>{b.count}</td><td>{money(b.value)}</td></tr>)}
        </tbody></table></div>
      </div>
    </>}

    {view==='agents' && <>
      <div className="statGrid">
        <Stat label="Active leads" value={String(activeLeads)} sub="Across the pipeline" icon={Users}/>
        <Stat label="Pipeline value" value={money(totalPipelineValue)} sub="Open opportunities" icon={CircleDollarSign}/>
        <Stat label="Conversion rate" value={`${overallConversion}%`} sub="Lead to sale, all agents" icon={CheckCircle2}/>
        <Stat label="Sales agents" value={String(agents.length)} sub="With assigned leads" icon={ClipboardList}/>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Performance by agent</h2><p>Leads, conversion and sales value</p></div></div>
        <div className="tableWrap"><table><thead><tr><th>Agent</th><th>Leads</th><th>Won</th><th>Lost</th><th>Conversion</th><th>Pipeline value</th><th>Sales value</th></tr></thead><tbody>
          {agentStats.map(a=><tr key={a.agent}><td><b>{a.agent}</b></td><td>{a.total}</td><td>{a.won}</td><td>{a.lost}</td><td>{a.conversion}%</td><td>{money(a.pipelineValue)}</td><td>{money(a.wonValue)}</td></tr>)}
        </tbody></table></div>
      </div>
    </>}

    {view==='finance' && <>
      <div className="statGrid">
        <Stat label="Applications" value={String(financeApps.length)} sub="All time" icon={FileText}/>
        <Stat label="Approved loan value" value={money(approvedLoanValue)} sub="Approved + disbursed" icon={CircleDollarSign}/>
        <Stat label="Disbursed" value={money(disbursedValue)} sub="Fully paid out" icon={Landmark}/>
        <Stat label="Accepted trade-in value" value={money(acceptedTradeInValue)} sub={`${tradeIns.length} trade-in requests`} icon={RefreshCcw}/>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Applications by stage</h2><p>Financing approval pipeline</p></div></div>
        <div className="tableWrap"><table><thead><tr><th>Stage</th><th>Applications</th></tr></thead><tbody>
          {financeByStage.map(f=><tr key={f.stage}><td><b>{f.stage}</b></td><td>{f.count}</td></tr>)}
        </tbody></table></div>
      </div>
    </>}

    {view==='service' && <>
      <div className="statGrid">
        <Stat label="Service revenue" value={money(serviceRevenue)} sub="From completed job cards" icon={CircleDollarSign}/>
        <Stat label="Outstanding invoices" value={money(outstandingServiceInvoices)} sub="Completed, not yet paid" icon={FileText}/>
        <Stat label="Open warranty claims" value={String(openClaims)} sub="Needs review" icon={ShieldAlert}/>
        <Stat label="Low stock parts" value={String(lowStockParts)} sub="Below 5 units" icon={Package}/>
      </div>
      <div className="adminCard">
        <div className="cardHead"><div><h2>Job cards by stage</h2><p>Workshop pipeline</p></div></div>
        <div className="tableWrap"><table><thead><tr><th>Stage</th><th>Job cards</th></tr></thead><tbody>
          {jobsByStage.map(j=><tr key={j.stage}><td><b>{j.stage}</b></td><td>{j.count}</td></tr>)}
        </tbody></table></div>
      </div>
    </>}
  </section>
}
