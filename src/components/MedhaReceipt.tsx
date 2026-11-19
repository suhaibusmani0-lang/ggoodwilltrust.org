'use client';

import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  X,
  CheckCircle2,
  Building2,
  HeartHandshake,
  Award,
  ShieldCheck,
  Copy,
  Check,
  FileCheck2,
} from 'lucide-react';

export interface MedhaReceiptData {
  registrationNo: string;
  receiptNo: string;
  studentName: string;
  guardianName: string;
  category: string;
  schoolName: string;
  schoolCode?: string;
  referralCode?: string;
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!receipt) return null;

  const handleCopyReg = () => {
    navigator.clipboard.writeText(receipt.registrationNo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = receiptRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2.5, // 2.5x high resolution for crisp print/viewing
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 900,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Medha-Pariksha-Receipt-${receipt.registrationNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image download, falling back to print:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text =
      `*Dr. A.P.J. Abdul Kalam Medha Pariksha - Official Candidate Receipt*%0A%0A` +
      `*Registration No:* ${receipt.registrationNo}%0A` +
      `*Receipt No:* ${receipt.receiptNo}%0A` +
      `*Student Name:* ${receipt.studentName}%0A` +
      `*Father/Guardian:* ${receipt.guardianName}%0A` +
      `*Category:* ${receipt.category}%0A` +
      `*School:* ${receipt.schoolName} ${receipt.schoolCode ? `(Code: ${receipt.schoolCode})` : ''}%0A` +
      (receipt.referralCode ? `*Referred By:* ${receipt.referralCode}%0A` : '') +
      `*Fee Paid:* ₹${receipt.amount} (COMPLETED & VERIFIED)%0A` +
      `*Authorized Person:* Miss Safia%0A` +
      `*Transaction ID:* ${receipt.paymentId}%0A%0A` +
      `*Verify Receipt & Download:* https://www.ggoodwilltrust.org/medha-pariksha`;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Outer Shell */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide">
                Verified Candidate Examination Receipt
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                REG: {receipt.registrationNo} &bull; 256-Bit SSL Secured
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="bg-gradient-to-r from-amber-500 to-[#d4af37] hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
              title="Download High-Resolution Image Receipt"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Preparing...' : 'Download Receipt'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Share Receipt on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors ml-1 cursor-pointer"
              aria-label="Close Receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Board Receipt Document */}
        <div
          ref={receiptRef}
          className="relative p-6 sm:p-10 text-slate-900 bg-[#fffdf9] font-sans selection:bg-amber-100 print:p-8"
        >
          {/* Subtle Security Border Frame */}
          <div className="absolute inset-3 pointer-events-none border-2 border-double border-[#d4af37]/40 rounded-2xl print:inset-0 print:border print:border-slate-300" />

          {/* Watermark Crest Emblem (Centered in Background) */}
          <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.045] overflow-hidden">
            <img
              src="/logo-icon.png"
              alt="Watermark"
              className="w-72 sm:w-84 h-auto object-contain grayscale"
            />
          </div>

          {/* Receipt Header */}
          <div className="relative border-b-2 border-slate-900 pb-5 mb-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              
              {/* Trust Official Logo & Credentials */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <img
                  src="/logo-icon.png"
                  alt="G Goodwill Trust Official Logo"
                  className="h-14 sm:h-16 w-auto object-contain shrink-0 drop-shadow-xs"
                />
                <div className="space-y-0.5">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-950 uppercase leading-none">
                    G Goodwill Trust
                  </h1>
                  <p className="text-[10.5px] font-bold text-[#b45309] uppercase tracking-wider mt-0.5">
                    Academic Examination Cell &bull; Registered Public Charitable Trust
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Section 80G Tax Exempted &bull; Govt. Registration Recognized
                  </p>
                  <p className="text-[9.5px] text-slate-500 font-light">
                    Central Secretariat: G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India
                  </p>
                </div>
              </div>

              {/* Verified Digital Seal Badge */}
              <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-1.5">
                <div className="border-2 border-emerald-600 rounded-2xl px-4 py-2 bg-emerald-50/90 text-emerald-900 text-center shadow-xs">
                  <span className="block text-[9px] uppercase font-bold tracking-widest text-emerald-700">
                    Candidate Status
                  </span>
                  <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> PAID ₹100
                  </span>
                  <span className="block text-[8.5px] text-emerald-600 font-mono font-semibold">
                    VERIFIED &amp; ENROLLED
                  </span>
                </div>
              </div>

            </div>

            {/* Exam Program Banner */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/60 to-amber-50 border border-amber-200/80 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold text-[#b45309] uppercase tracking-widest mb-0.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>National Merit Talent Search &bull; Academic Session 2026-2027</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">
                Dr. A.P.J. Abdul Kalam Medha Pariksha
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5 font-medium">
                Combined Grand Championship Mega Prize Pool: <strong className="text-amber-700 font-bold">1st ₹21,000</strong> &bull; <strong className="text-amber-700 font-bold">2nd ₹11,000</strong> &bull; <strong className="text-amber-700 font-bold">3rd ₹5,100</strong> + Trophies &amp; Merit Certificates
              </p>
            </div>
          </div>

          {/* Candidate Registration Docket Grid */}
          <div className="relative mb-5">
            <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-slate-300">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Candidate Identification &amp; Enrolment Docket</span>
              </span>
              <button
                onClick={handleCopyReg}
                className="print:hidden text-[10px] text-slate-600 hover:text-slate-950 font-mono font-semibold flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                title="Copy Registration Number"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy Reg No</span>
                  </>
                )}
              </button>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-3">
              <div>
                <span className="block text-[9.5px] uppercase font-bold text-slate-400">Registration No</span>
                <span className="font-mono font-black text-slate-950 text-sm tracking-wide text-[#b45309]">
                  {receipt.registrationNo}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] uppercase font-bold text-slate-400">Board Receipt No</span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                  {receipt.receiptNo}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] uppercase font-bold text-slate-400">Transaction ID (UTR)</span>
                <span className="font-mono text-slate-700 text-[11px] break-all block truncate" title={receipt.paymentId}>
                  {receipt.paymentId}
                </span>
              </div>
              <div>
                <span className="block text-[9.5px] uppercase font-bold text-slate-400">Enrolment Date</span>
                <span className="font-medium text-slate-800 text-xs">
                  {receipt.date}
                </span>
              </div>
            </div>

            {/* Candidate Details 2-Column Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs bg-white p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Student Full Name:</span>
                <span className="font-bold text-slate-950 uppercase">{receipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Father / Guardian:</span>
                <span className="font-semibold text-slate-900 uppercase">{receipt.guardianName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Exam Category:</span>
                <span className="font-bold text-[#b45309] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  {receipt.category}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">School / Institution:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[220px] truncate" title={receipt.schoolName}>
                  {receipt.schoolName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">School Code:</span>
                <span className="font-mono font-bold text-slate-800">
                  {receipt.schoolCode || 'NOT SPECIFIED (N/A)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Referred By / Referral:</span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                  {receipt.referralCode || 'Direct Online Application'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Examination City &amp; State:</span>
                <span className="font-medium text-slate-800">{receipt.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Registered Phone:</span>
                <span className="font-mono font-bold text-slate-900">+91 {receipt.phone}</span>
              </div>
              {receipt.email && (
                <div className="flex justify-between py-1 border-b border-slate-100 sm:col-span-2">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-mono text-slate-700">{receipt.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fee Schedule & Accounting Particulars Table */}
          <div className="relative mb-5 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">S.No</th>
                  <th className="py-2.5 px-4">Fee Particulars &amp; Service Head</th>
                  <th className="py-2.5 px-4 text-center">Mode</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                <tr>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">01</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-950">Dr. A.P.J. Abdul Kalam Medha Pariksha Enrolment Fee</p>
                    <p className="text-[11px] text-slate-500">
                      OMR Sheet Evaluation, Digital Merit Rank Card Generation, &amp; Certificate of Participation
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Razorpay Online
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-950">₹{receipt.amount}.00</td>
                </tr>
                <tr className="bg-amber-50/60 font-bold border-t border-amber-200/60">
                  <td colSpan={3} className="py-2.5 px-4 text-right uppercase text-[11px] text-slate-800">
                    Total Amount Received (Non-Refundable):
                  </td>
                  <td className="py-2.5 px-4 text-right text-base text-[#b45309] font-serif font-black">
                    ₹{receipt.amount}.00
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-1">
              <span className="italic">
                <strong>Amount in Words:</strong> Indian Rupees One Hundred Only
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Payment Channel: Razorpay 256-Bit SSL Secured
              </span>
            </div>
          </div>

          {/* Supporting NGOs & Sponsors Accreditation */}
          <div className="relative p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-5 space-y-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Partner NGOs &amp; Supporting Foundations:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10.5px] text-slate-700">
                {partnerNgos.map((ngo, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                  >
                    {idx + 1}. {ngo}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Official Corporate &amp; Hospitality Sponsors:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10.5px] text-slate-800 font-semibold">
                {sponsors.map((sponsor, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-2.5 py-0.5 rounded-md border border-amber-200 text-[#b45309]"
                  >
                    &bull; {sponsor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Important Candidate Guidelines */}
          <div className="relative border-t border-slate-200 pt-3.5 text-[10px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 uppercase tracking-wide">
              Official Examination Guidelines &amp; Instructions:
            </p>
            <p>&bull; <strong>Admit Card &amp; Center:</strong> The examination date, reporting time, and allotted center will be published on <strong className="text-slate-900">ggoodwilltrust.org</strong> and notified via SMS/WhatsApp.</p>
            <p>&bull; <strong>Combined Championship:</strong> The 3 Mega Cash Prizes (₹21,000, ₹11,000, ₹5,100) are the Combined Grand Winners across Sub-Junior, Junior, and Senior categories.</p>
            <p>&bull; <strong>Verification:</strong> Keep this official receipt downloaded or printed. Registration No is required for Admit Card download and hall entry.</p>
            <p>&bull; <strong>Trust Secretariat Support:</strong> For assistance, contact Examination Helpdesk at <strong>+91 79828 04385</strong> or email <strong>globalgoodwill4@gmail.com</strong>.</p>
          </div>

          {/* Signatures & Seal Authorization Footer */}
          <div className="relative mt-6 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            
            {/* Left: Authentic Round Seal Stamp */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="relative shrink-0">
                <img
                  src="/seal-ggoodwill.png"
                  alt="Official Seal of G Goodwill Trust"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain transform -rotate-2"
                />
              </div>
              <div className="space-y-0.5">
                <p className="font-serif font-black text-slate-950 text-sm leading-tight uppercase">
                  G Goodwill Trust
                </p>
                <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wide">
                  Official Seal of Examination Cell
                </p>
                <p className="text-[9.5px] text-slate-600 font-medium">
                  Shaheen Bagh, Okhla, New Delhi - 110025
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  Govt. Registered &bull; Section 80G Tax Exempted
                </p>
              </div>
            </div>

            {/* Right: Authentic Signature of Miss Safia */}
            <div className="text-center sm:text-right shrink-0">
              <div className="flex flex-col items-center sm:items-end">
                {/* Real Signature Graphic */}
                <div className="h-16 flex items-end justify-center sm:justify-end pb-0.5">
                  <img
                    src="/signature-safia.png"
                    alt="Signature of Miss Safia"
                    className="h-14 sm:h-16 w-auto object-contain transform -rotate-1"
                  />
                </div>
                <div className="border-b-2 border-slate-800 w-44 pb-0.5 mb-1 font-serif text-slate-950 font-bold text-sm">
                  Miss Safia
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                  Authorized Person / Signatory
                </p>
                <p className="text-[9px] text-slate-600 font-semibold">
                  G Goodwill Trust &bull; Academic Examination Cell
                </p>
              </div>
            </div>

          </div>

          {/* Verification Barcode / Link at Bottom */}
          <div className="mt-4 pt-2.5 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-400 font-mono gap-1">
            <span>SECURE VERIFICATION HASH: {receipt.paymentId.slice(-12).toUpperCase()}</span>
            <span>PORTAL: WWW.GGOODWILLTRUST.ORG/MEDHA-PARIKSHA</span>
          </div>

        </div>

      </div>

    </div>
  );
}
