'use client';

import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  Sparkles,
  Award,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  HeartHandshake
} from 'lucide-react';
import Image from 'next/image';

export interface MedhaReceiptData {
  registrationNo: string;
  receiptNo: string;
  studentName: string;
  guardianName: string;
  category: string;
  schoolName: string;
  city: string;
  phone: string;
  email?: string;
  amount: number;
  paymentId: string;
  date: string;
}

interface MedhaReceiptProps {
  receipt: MedhaReceiptData | null;
  onClose: () => void;
}

export default function MedhaReceipt({ receipt, onClose }: MedhaReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*Dr. A.P.J. Abdul Kalam Medha Pariksha - Registration Receipt*%0A%0A` +
      `*Registration No:* ${receipt.registrationNo}%0A` +
      `*Receipt No:* ${receipt.receiptNo}%0A` +
      `*Student Name:* ${receipt.studentName}%0A` +
      `*Category:* ${receipt.category}%0A` +
      `*School:* ${receipt.schoolName}%0A` +
      `*Fee Paid:* ₹${receipt.amount} (COMPLETED)%0A` +
      `*Transaction ID:* ${receipt.paymentId}%0A%0A` +
      `*Official Website:* https://ggoodwilltrust.org/medha-pariksha`;
    window.open(`https://api.whatsapp.com/send?phone=91${receipt.phone}&text=${text}`, '_blank');
  };

  const partnerNgos = [
    'Spread Smiles Foundation',
    'No Crying Foundation',
    'Musawat Welfare Trust',
    'Nayab Training & Educational Trust',
    'Buniyadi Sahara Trust',
  ];

  const sponsors = ['Zarnetic', 'Arshi Cafe'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-wide">Candidate Registration Receipt</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#d4af37] hover:bg-[#c59b27] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 sm:p-10 text-slate-900 bg-white">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 uppercase">
                    G Goodwill Trust
                  </h1>
                </div>
                <p className="text-[11px] font-semibold text-[#b45309] uppercase tracking-wider">
                  Registered Indian Non-Profit Trust &bull; Section 80G Tax Exempted
                </p>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">
                  Secretariat: G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India
                </p>
              </div>

              {/* Verified Stamp Badge */}
              <div className="border-2 border-emerald-600 rounded-2xl px-4 py-2 bg-emerald-50 text-emerald-800 text-center shrink-0">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-600">Payment Status</span>
                <span className="text-base font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> PAID ₹100
                </span>
                <span className="block text-[9px] text-emerald-600 font-mono mt-0.5">VERIFIED REGISTRATION</span>
              </div>
            </div>

            {/* Exam Program Banner */}
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <span className="text-[10px] font-extrabold text-[#b45309] uppercase tracking-widest block mb-0.5">
                Official Merit Examination &bull; 2026-2027
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">
                Dr. A.P.J. Abdul Kalam Medha Pariksha
              </h2>
              <p className="text-xs text-slate-600 font-serif italic">
                (डॉ. ए.पी.जे. अब्दुल कलाम मेधा परीक्षा)
              </p>
            </div>
          </div>

          {/* Meta Bar: Reg No, Receipt No, Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Registration No</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{receipt.registrationNo}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Receipt No</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{receipt.receiptNo}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Transaction ID</span>
              <span className="font-mono text-slate-700 text-xs break-all">{receipt.paymentId}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Date &amp; Time</span>
              <span className="font-medium text-slate-800 text-xs">{receipt.date}</span>
            </div>
          </div>

          {/* Candidate & Application Details */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-200">
              Candidate Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900 uppercase">{receipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Guardian Name:</span>
                <span className="font-semibold text-slate-800 uppercase">{receipt.guardianName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Exam Category:</span>
                <span className="font-bold text-[#b45309]">{receipt.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">School / College:</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{receipt.schoolName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">City &amp; State:</span>
                <span className="font-medium text-slate-800">{receipt.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Contact Phone:</span>
                <span className="font-mono font-medium text-slate-800">{receipt.phone}</span>
              </div>
              {receipt.email && (
                <div className="flex justify-between py-1 border-b border-slate-100 sm:col-span-2">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-mono text-slate-700">{receipt.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fee Table */}
          <div className="mb-6 border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Fee Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">Examination &amp; Registration Fee</p>
                    <p className="text-[11px] text-slate-500">Dr. A.P.J. Abdul Kalam Medha Pariksha &bull; OMR &amp; Evaluation</p>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">1</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">₹{receipt.amount}.00</td>
                </tr>
                <tr className="bg-amber-50/50 font-bold">
                  <td colSpan={2} className="py-2.5 px-4 text-right uppercase text-[11px] text-slate-800">
                    Total Amount Received:
                  </td>
                  <td className="py-2.5 px-4 text-right text-base text-[#b45309] font-serif">
                    ₹{receipt.amount}.00
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 italic">
              Amount in words: One Hundred Rupees Only
            </div>
          </div>

          {/* Partner NGOs & Sponsors Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Partner NGOs &amp; Supporting Foundations:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700">
                {partnerNgos.map((ngo, idx) => (
                  <span key={idx} className="bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-medium">
                    {idx + 1}. {ngo}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Official Sponsors:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-800 font-semibold">
                {sponsors.map((sponsor, idx) => (
                  <span key={idx} className="bg-white px-3 py-0.5 rounded-lg border border-amber-200 text-[#b45309]">
                    &bull; {sponsor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions & Candidate Guidelines */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 uppercase">Important Candidate Guidelines:</p>
            <p>&bull; This is an authentic computer-generated receipt confirming your enrollment in Dr. A.P.J. Abdul Kalam Medha Pariksha.</p>
            <p>&bull; Exam Date, Timing, and Admit Card release will be announced on the trust website (<strong className="text-slate-800">ggoodwilltrust.org</strong>) and sent to your registered contact number.</p>
            <p>&bull; For queries or verification support, contact the Trust helpline: <strong>+91 79828 04385</strong> or email: <strong>globalgoodwill4@gmail.com</strong>.</p>
          </div>

          {/* Signatory Footer */}
          <div className="mt-8 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">G Goodwill Trust</p>
              <p className="text-[10px] text-slate-400">Shaheen Bagh, Okhla, New Delhi - 110025</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="inline-block border-b border-slate-400 px-6 pb-1 mb-1 font-serif italic text-slate-700">
                Authorized Signatory
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Academic Examination Board</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
