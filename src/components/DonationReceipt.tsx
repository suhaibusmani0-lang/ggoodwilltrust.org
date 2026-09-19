'use client';

import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export interface ReceiptData {
  receiptNo: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
  amount: number | string;
  purpose: string;
  paymentId?: string;
  date: string;
}

// Convert number to Indian words
function numberToWords(num: number): string {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : ' ');
  }

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const hundreds = Math.floor(num / 100);
  const remaining = Math.floor(num % 100);

  let str = '';
  if (crores > 0) str += inWords(crores) + 'Crore ';
  if (lakhs > 0) str += inWords(lakhs) + 'Lakh ';
  if (thousands > 0) str += inWords(thousands) + 'Thousand ';
  if (hundreds > 0) str += inWords(hundreds) + 'Hundred ';
  if (remaining > 0) str += (str !== '' ? 'and ' : '') + inWords(remaining);

  return str.trim() + ' Rupees Only';
}

export default function DonationReceiptModal({
  data,
  onClose,
}: {
  data: ReceiptData;
  onClose?: () => void;
}) {
  const numericAmount = typeof data.amount === 'number' ? data.amount : parseFloat(String(data.amount).replace(/[^0-9.]/g, '')) || 0;
  const amountWords = numberToWords(numericAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Action Header (Hidden on Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-200">Official 80G Tax Exemption Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#c59b27] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="printable-receipt p-6 sm:p-10 bg-white text-slate-900 relative">
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="font-serif text-8xl font-black tracking-widest text-slate-900 rotate-[-25deg]">
              G GOODWILL TRUST
            </span>
          </div>

          {/* Decorative Gold & Slate Border Frame */}
          <div className="border-2 border-[#d4af37] p-6 sm:p-8 rounded-2xl relative bg-gradient-to-b from-amber-50/20 via-white to-slate-50/30">
            
            {/* Top Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#b45309]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#b45309]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#b45309]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#b45309]" />

            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <Image
                    src="/logo-icon.png"
                    alt="G Goodwill Trust Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight leading-none mb-1">
                    G GOODWILL TRUST
                  </h1>
                  <p className="text-[11px] font-semibold text-[#b45309] uppercase tracking-wider">
                    Registered Non-Profit Public Charitable Trust
                  </p>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5">
                    Reg. Under Indian Trusts Act, 1882 &bull; Reg. No: 2024/10/IV/1387
                  </p>
                  <p className="text-[10px] text-slate-500 font-light">
                    G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India
                  </p>
                </div>
              </div>

              {/* 80G Tax Exemption Seal */}
              <div className="text-center sm:text-right shrink-0 bg-emerald-50 border border-emerald-300 rounded-xl p-3">
                <div className="flex items-center justify-center sm:justify-end gap-1 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Section 80G Exemption
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-900">
                  Unique Reg: <span className="text-[#b45309]">AAETG8344FF20241</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  Trust PAN: <span className="font-bold">AAETG8344F</span>
                </div>
                <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                  50% Tax Exemption Under IT Act 1961
                </div>
              </div>
            </div>

            {/* Receipt Title Banner */}
            <div className="my-5 py-2 px-4 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row justify-between items-center text-xs gap-2">
              <span className="font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                DONATION APPRECIATION RECEIPT
              </span>
              <div className="flex items-center gap-4 font-mono text-[11px] text-slate-300">
                <span>Receipt No: <strong className="text-white">{data.receiptNo}</strong></span>
                <span>Date: <strong className="text-white">{data.date}</strong></span>
              </div>
            </div>

            {/* Main Donor & Payment Grid */}
            <div className="space-y-4 text-xs">
              
              {/* Donor particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Received With Deep Gratitude From
                  </span>
                  <div className="font-serif text-lg font-normal text-slate-900">
                    {data.donorName}
                  </div>
                  {data.donorEmail && (
                    <div className="text-slate-600 text-[11px] mt-0.5">{data.donorEmail}</div>
                  )}
                  {data.donorPhone && (
                    <div className="text-slate-600 text-[11px]">{data.donorPhone}</div>
                  )}
                </div>

                <div className="sm:text-right flex flex-col justify-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Donor PAN (For IT Exemption)
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-300 inline-block">
                      {data.donorPan || 'Not Provided / Form 60'}
                    </span>
                  </div>
                  {data.paymentId && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Ref ID: {data.paymentId}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-gradient-to-r from-amber-50/60 via-amber-100/30 to-amber-50/60 rounded-xl border border-amber-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider block mb-1">
                    Amount Received In Figures &amp; Words
                  </span>
                  <div className="font-serif italic text-sm text-slate-800 font-medium">
                    &ldquo;{amountWords}&rdquo;
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Purpose / Mandate: <strong className="text-slate-800 font-semibold">{data.purpose}</strong>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Net Amount</span>
                  <span className="font-serif text-3xl font-normal text-slate-900 font-bold">
                    ₹ {numericAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed font-light">
                <p className="mb-1">
                  <strong>Statutory Declaration:</strong> Donations made to G Goodwill Trust are eligible for tax deduction under Section 80G(5)(vi) of the Income Tax Act, 1961 vide Order No. AAETG8344FF20241.
                </p>
                <p>
                  No goods, commercial services, or personal benefits have been provided to the donor in exchange for this contribution. 100% of these funds are dedicated to relief and welfare interventions.
                </p>
              </div>

            </div>

            {/* Receipt Footer & Signatures */}
            <div className="pt-6 mt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
              {/* Trust Seal Stamp */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#b45309] flex flex-col items-center justify-center text-center p-1 bg-amber-50/50">
                  <span className="text-[8px] font-bold text-[#b45309] uppercase leading-tight">G GOODWILL TRUST</span>
                  <span className="text-[6px] text-slate-500">NEW DELHI</span>
                  <span className="text-[7px] font-mono text-[#b45309] font-bold mt-0.5">VERIFIED</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digitally Validated
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Official Central Registry
                  </div>
                </div>
              </div>

              {/* Authorized Signatory */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic text-base text-slate-800 mb-1 font-semibold">
                  Safia / Suhaib Usmani
                </div>
                <div className="w-36 h-0.5 bg-slate-300 ml-auto mb-1" />
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Authorized Trustee / Treasurer
                </div>
                <div className="text-[9px] text-slate-400">
                  For G Goodwill Trust, New Delhi
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Note */}
          <div className="text-center text-[10px] text-slate-400 mt-4 no-print">
            This receipt can be authenticated anytime on our public portal at{' '}
            <span className="text-[#b45309] font-semibold">ggoodwilltrust.org/donate</span> using receipt #{data.receiptNo}
          </div>

        </div>

      </div>
    </div>
  );
}

