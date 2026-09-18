'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Lock,
  CreditCard,
  Phone,
  Mail,
  User,
  BadgeIndianRupee,
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<'donate' | 'verify'>('donate');
  
  // Verify State
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [receiptData, setReceiptData] = useState<{
    donorName: string;
    amount: string;
    purpose: string;
    date: string;
  } | null>(null);

  // Donate State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    amount: '',
    purpose: 'General Donation'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = ['1000', '2500', '5000', '10000', '25000'];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptNumber) return;
    
    setIsVerifying(true);
    setVerifyStatus('idle');

    try {
      const res = await fetch('/api/donations/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_no: receiptNumber.trim().toUpperCase() }),
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.data) {
        setVerifyStatus('success');
        setReceiptData({
          donorName: data.data.name,
          amount: '\u20B9 ' + Number(data.data.amount).toLocaleString('en-IN'),
          purpose: data.data.purpose || 'General Donation',
          date: new Date(data.data.createdAt).toLocaleString('en-IN'),
        });
      } else {
        setVerifyStatus('error');
      }
    } catch {
      setVerifyStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.name || !formData.email) return;

    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/create-order', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          amount: parseFloat(formData.amount),
          purpose: formData.purpose,
        })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Failed to create payment order.');
        return;
      }

      const { order, receipt_no } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'G Goodwill Trust',
        description: 'Donation for ' + formData.purpose,
        order_id: order.id,
        handler: function(response: Record<string, string>) { 
          alert('Payment successful! Receipt: ' + receipt_no + '\nPayment ID: ' + response.razorpay_payment_id); 
        },
        prefill: { 
          name: formData.name, 
          email: formData.email, 
          contact: formData.phone 
        },
        theme: { color: '#d4af37' }
      };

      const win = window as unknown as { Razorpay?: new (opts: unknown) => { open: () => void } };
      if (win.Razorpay) {
        const rzp = new win.Razorpay(options);
        rzp.open();
      } else {
        alert('Payment gateway is loading. Please try again in a moment.');
      }
    } catch {
      alert('An error occurred while processing payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-6">
            <Sparkles className="w-3 h-3" /> Direct Community Contribution
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#fafafa] mb-6 leading-tight">
            Empower With <span className="italic font-serif text-[#d4af37]">Purpose</span>
          </h1>
          <p className="text-lg text-[#a1a1aa] font-sans max-w-2xl mx-auto leading-relaxed">
            Every contribution directly funds underprivileged education, critical healthcare initiatives, and dignity programs across New Delhi.
          </p>
        </motion.div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#121214] rounded-full p-1.5 border border-[#27272a] inline-flex">
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === 'donate'
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Contribute Now
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === 'verify'
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Verify Receipt
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {/* Verify Receipt View */}
          {activeTab === 'verify' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-[#121214] rounded-3xl border border-[#27272a] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-full bg-[#18181b] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-5 text-[#d4af37]">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h2 className="font-serif text-3xl font-light text-[#fafafa] mb-3">Check Authenticity</h2>
                  <p className="text-sm text-[#a1a1aa] max-w-md mx-auto">
                    Enter your unique receipt number (e.g. GGT-2026-XXXX-XXXX) to instantly verify donation authenticity against our registry.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] w-5 h-5" />
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="GGT-2026-..."
                      className="w-full pl-12 pr-32 py-4 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none transition-all text-[#fafafa] placeholder-[#71717a] text-sm tracking-wider uppercase font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !receiptNumber}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d4af37] hover:bg-[#e5c07b] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-bold px-6 py-2.5 rounded-lg transition-all"
                    >
                      {isVerifying ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {verifyStatus === 'success' && receiptData && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#18181b] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Valid Official Receipt Verified</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                        <div className="p-3 bg-[#121214] rounded-xl border border-[#27272a]">
                          <p className="text-[#71717a] mb-1">Donor Name</p>
                          <p className="font-medium text-[#fafafa] text-sm">{receiptData.donorName}</p>
                        </div>
                        <div className="p-3 bg-[#121214] rounded-xl border border-[#27272a]">
                          <p className="text-[#71717a] mb-1">Contribution Amount</p>
                          <p className="font-serif font-light text-[#d4af37] text-base">{receiptData.amount}</p>
                        </div>
                        <div className="p-3 bg-[#121214] rounded-xl border border-[#27272a]">
                          <p className="text-[#71717a] mb-1">Category / Purpose</p>
                          <p className="font-medium text-[#fafafa]">{receiptData.purpose}</p>
                        </div>
                        <div className="p-3 bg-[#121214] rounded-xl border border-[#27272a]">
                          <p className="text-[#71717a] mb-1">Date & Time</p>
                          <p className="font-medium text-[#a1a1aa]">{receiptData.date}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {verifyStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 text-center"
                    >
                      <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-red-300 mb-1">Receipt Not Found</h3>
                      <p className="text-xs text-red-400/80">
                        No record matches this receipt ID. Please recheck your reference or contact our trust office.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Donate Form View */}
          {activeTab === 'donate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              {/* Left Column: Trust Info & 80G */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-[#fafafa] mb-4">
                    Direct Impact, <span className="italic text-[#d4af37]">Complete</span> Clarity
                  </h2>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    100% of your contributions go straight to field operations. Every rupee is cataloged under audited financial frameworks and fully eligible for Section 80G tax benefits.
                  </p>
                </div>

                {/* 80G Registration Block */}
                <div className="bg-[#121214] border border-[#d4af37]/30 rounded-3xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" /> 80G Registered
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">Tax Exemption</span>
                  </div>

                  <div className="space-y-3 mb-5 text-xs">
                    <div className="flex justify-between items-center border-b border-[#27272a] pb-2">
                      <span className="text-[#a1a1aa]">Registration No:</span>
                      <span className="font-mono text-[#fafafa]">2024/10/IV/1387</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#27272a] pb-2">
                      <span className="text-[#a1a1aa]">80G Unique No:</span>
                      <span className="font-mono text-[#d4af37]">AAETG8344FF20241</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a1a1aa]">PAN Number:</span>
                      <span className="font-mono text-[#fafafa]">AAETG8344F</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    Donations are 50% tax exempt under Section 80G of the Indian Income Tax Act. A formal digitally signed PDF receipt will be delivered instantly upon payment confirmation.
                  </p>
                </div>

                {/* Direct Bank Transfer */}
                <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-6">
                  <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-2 mb-4 tracking-wider uppercase text-xs">
                    <Building2 className="w-4 h-4 text-[#d4af37]" />
                    Direct Bank Transfer (NEFT / RTGS)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-[#27272a] pb-2">
                      <span className="text-[#71717a]">Account Name</span>
                      <span className="font-medium text-[#fafafa]">G Goodwill Trust</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#27272a] pb-2">
                      <span className="text-[#71717a]">Bank Name</span>
                      <span className="font-medium text-[#fafafa]">J&amp;K Bank</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#27272a] pb-2">
                      <span className="text-[#71717a]">Account Number</span>
                      <span className="font-mono text-[#d4af37] font-medium">0743010100002326</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#71717a]">IFSC Code</span>
                      <span className="font-mono text-[#fafafa]">JAKA0ZAAKIR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donation Form */}
              <div className="lg:col-span-7">
                <div className="bg-[#121214] rounded-3xl border border-[#27272a] p-8 md:p-10 shadow-2xl relative">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#27272a]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#d4af37]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-light text-[#fafafa]">Donor Details</h2>
                        <p className="text-[11px] text-[#71717a]">Complete all mandatory fields marked with an asterisk (*)</p>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-[#71717a]" />
                  </div>

                  {/* Preset Amount Pills */}
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-[#a1a1aa] mb-2 font-medium">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, amount: amt }))}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-medium transition-all border ${
                            formData.amount === amt
                              ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold'
                              : 'bg-[#18181b] text-[#fafafa] border-[#27272a] hover:border-[#d4af37]/50'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleDonate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ayaan Khan"
                            className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] placeholder-[#52525b] text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="ayaan@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] placeholder-[#52525b] text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] placeholder-[#52525b] text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* PAN */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">PAN (For 80G Tax Exemption)</label>
                        <div className="relative">
                          <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
                          <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleInputChange}
                            placeholder="ABCDE1234F"
                            className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] placeholder-[#52525b] text-sm uppercase font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Amount */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">Amount (INR) *</label>
                        <div className="relative">
                          <BadgeIndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="5000"
                            min="1"
                            className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] font-mono text-base font-semibold"
                            required
                          />
                        </div>
                      </div>

                      {/* Purpose */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-[#a1a1aa]">Intended Purpose *</label>
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#18181b] border border-[#27272a] rounded-xl focus:border-[#d4af37] outline-none text-[#fafafa] text-sm"
                        >
                          <option value="General Donation">General Donation</option>
                          <option value="Zakat">Zakat</option>
                          <option value="Sadqa">Sadqa</option>
                          <option value="Education Support">Education Support</option>
                          <option value="Medical Help">Medical Help</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#d4af37] hover:bg-[#e5c07b] disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-[#d4af37]/15 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Establishing Encrypted Gateway...
                          </>
                        ) : (
                          <>
                            Proceed to Contribute <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Footer Note */}
                    <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#71717a]">
                      <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>256-Bit SSL Encrypted Razorpay Gateway • 80G Certified Non-Profit</span>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
