'use client';
import {useEffect,useState,use} from 'react';
import Link from 'next/link';
import {ArrowLeft,Download,Printer,Receipt} from 'lucide-react';
import {money} from '../../data';
export default function InvoicePage({params}:{params:Promise<{orderNo:string}>}){
 const {orderNo}=use(params); const [invoice,setInvoice]=useState<any>(undefined);
 useEffect(()=>{fetch(`/api/invoices/${orderNo}`).then(r=>r.ok?r.json():null).then(setInvoice).catch(()=>setInvoice(null))},[orderNo]);
 if(invoice===undefined)return <main className="empty"><h1>Loading invoice…</h1></main>;
 if(!invoice)return <main className="empty"><h1>Invoice not found</h1><Link href="/account" className="btn primary">Back to account</Link></main>;
 const print=()=>window.print();
 return <main className="invoicePage"><div className="invoiceToolbar"><Link href="/account" className="backOrder"><ArrowLeft size={16}/> Back</Link><div><button onClick={print}><Printer size={17}/> Print</button><button onClick={print}><Download size={17}/> Save PDF</button></div></div><article className="invoice"><header className="invoiceHead"><div className="logo"><span className="shield">AV</span><span>AUTO <b>VAULT</b><small>DRIVE THE FUTURE</small></span></div><div className="invoiceTitle"><span>INVOICE</span><strong>{invoice.invoiceNo}</strong><small>{new Date(invoice.createdAt).toLocaleDateString()}</small></div></header><div className="invoiceMeta"><div><span>BILL TO</span><strong>{invoice.customer?.name||'Customer'}</strong><p>{invoice.customer?.email||''}<br/>{invoice.customer?.phone||''}</p></div><div><span>ORDER</span><strong>{invoice.orderNo}</strong><p>{invoice.vehicle}<br/>Payment: {invoice.paymentStatus}</p></div></div><table><thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead><tbody><tr><td>{invoice.vehicle}<small>Vehicle purchase</small></td><td>1</td><td>{money(invoice.price)}</td></tr></tbody><tfoot><tr><td colSpan={2}>Vehicle total</td><td>{money(invoice.price)}</td></tr><tr><td colSpan={2}>Paid</td><td>{money(invoice.paid)}</td></tr><tr className="grand"><td colSpan={2}>Balance</td><td>{money(invoice.balance)}</td></tr></tfoot></table><div className="invoiceNote"><Receipt/><p><b>Payment terms</b><br/>This invoice is generated from the Auto Vault order record. Registration, insurance, taxes and delivery charges may be invoiced separately after final confirmation.</p></div><footer>Auto Vault · Spintex, Accra · Drive the Future</footer></article></main>
}
