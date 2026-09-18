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
          amount: '₹ ' + Number(data.data.amount).toLocaleString('en-IN'),
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
    <div className="min-h-screen bg-white text-slate-900 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-[#b45309] text-xs font-semibold tracking-widest uppercase mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" /> Direct Community Contribution
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-slate-900 mb-6 leading-tight">
            Empower With <span className="italic font-serif text-[#b45309]">Purpose</span>
          </h1>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Every contribution directly funds underprivileged education, critical healthcare initiatives, and dignity programs across New Delhi.
          </p>
        </motion.div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-50 rounded-full p-1.5 border border-slate-200 inline-flex shadow-2xs">
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === 'donate'
                  ? 'bg-[#d4af37] text-black shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contribute Now
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === 'verify'
                  ? 'bg-[#d4af37] text-black shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 relative overflow-hidden shadow-xs">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-[#b45309]">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h2 className="font-serif text-3xl font-normal text-slate-900 mb-3">Check Authenticity</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-light">
                    Enter your unique receipt number (e.g. GGT-2026-XXXX-XXXX) to instantly verify donation authenticity against our registry.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="GGT-2026-..."
                      className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none transition-all text-slate-900 placeholder-slate-400 text-sm tracking-wider uppercase font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !receiptNumber}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d4af37] hover:bg-[#c59b27] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-bold px-6 py-2.5 rounded-lg transition-all"
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
                      className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-6 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-4 text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Valid Official Receipt Verified</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                        <div className="p-3 bg-white rounded-xl border border-emerald-200">
                          <p className="text-slate-500 mb-1">Donor Name</p>
                          <p className="font-semibold text-slate-900 text-sm">{receiptData.donorName}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-emerald-200">
                          <p className="text-slate-500 mb-1">Contribution Amount</p>
                          <p className="font-serif font-medium text-[#b45309] text-base">{receiptData.amount}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-emerald-200">
                          <p className="text-slate-500 mb-1">Category / Purpose</p>
                          <p className="font-medium text-slate-900">{receiptData.purpose}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-emerald-200">
                          <p className="text-slate-500 mb-1">Date &amp; Time</p>
                          <p className="font-medium text-slate-600">{receiptData.date}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {verifyStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
                    >
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <h3 className="text-sm font-semibold text-red-900 mb-1">Receipt Not Found</h3>
                      <p className="text-xs text-red-700">
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
                  <h2 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 mb-4">
                    Direct Impact, <span className="italic text-[#b45309]">Complete</span> Clarity
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    100% of your contributions go straight to field operations. Every rupee is cataloged under audited financial frameworks and fully eligible for Section 80G tax benefits.
                  </p>
                </div>

                {/* 80G Registration Block */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#b45309] text-[11px] font-semibold uppercase tracking-wider border border-amber-200">
                      <FileText className="w-3.5 h-3.5" /> 80G Registered
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Tax Exemption</span>
                  </div>

                  <div className="space-y-3 mb-5 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Registration No:</span>
                      <span className="font-mono text-slate-900 font-semibold">2024/10/IV/1387</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">80G Unique No:</span>
                      <span className="font-mono text-[#b45309] font-bold">AAETG8344FF20241</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">PAN Number:</span>
                      <span className="font-mono text-slate-900 font-semibold">AAETG8344F</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                    Donations are 50% tax exempt under Section 80G of the Indian Income Tax Act. A formal digitally signed PDF receipt will be delivered instantly upon payment confirmation.
                  </p>
                </div>

                {/* Direct Bank Transfer */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4 tracking-wider uppercase text-xs">
                    <Building2 className="w-4 h-4 text-[#b45309]" />
                    Direct Bank Transfer (NEFT / RTGS)
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Account Name</span>
                      <span className="font-semibold text-slate-900">G Goodwill Trust</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Bank Name</span>
                      <span className="font-semibold text-slate-900">J&amp;K Bank</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Account Number</span>
                      <span className="font-mono text-[#b45309] font-bold">0743010100002326</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">IFSC Code</span>
                      <span className="font-mono text-slate-900 font-semibold">JAKA0ZAAKIR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donation Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-xs relative">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-normal text-slate-900">Donor Details</h2>
                        <p className="text-[11px] text-slate-500">Complete all mandatory fields marked with an asterisk (*)</p>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Preset Amount Pills */}
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-slate-700 mb-2 font-semibold">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, amount: amt }))}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-semibold transition-all border ${
                            formData.amount === amt
                              ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-[#b45309]'
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
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ayaan Khan"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 placeholder-slate-400 text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="ayaan@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 placeholder-slate-400 text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 placeholder-slate-400 text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* PAN */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">PAN (For 80G Tax Exemption)</label>
                        <div className="relative">
                          <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleInputChange}
                            placeholder="ABCDE1234F"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 placeholder-slate-400 text-sm uppercase font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Amount */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Amount (INR) *</label>
                        <div className="relative">
                          <BadgeIndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b45309]" />
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="5000"
                            min="1"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 font-mono text-base font-bold"
                            required
                          />
                        </div>
                      </div>

                      {/* Purpose */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Intended Purpose *</label>
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#b45309] outline-none text-slate-900 text-sm font-medium"
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
                        className="w-full bg-[#d4af37] hover:bg-[#c59b27] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2"
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
                    <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-[#b45309]" />
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
