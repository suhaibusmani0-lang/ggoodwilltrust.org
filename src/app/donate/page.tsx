'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  BadgeIndianRupee
} from 'lucide-react';

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<'donate' | 'verify'>('donate');
  
  // Verify State
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [receiptData, setReceiptData] = useState<any>(null);

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
        theme: { color: '#2563eb' }
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Support Our Cause</h1>
            <p className="text-lg text-slate-600">
              Your contribution helps us create meaningful impact in the lives of those who need it most.
            </p>
          </motion.div>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'donate'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Make Donation
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'verify'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Verify Receipt
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'verify' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="text-center mb-8">
                  <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900">Check Authenticity</h2>
                  <p className="text-slate-600 mt-2">
                    Enter the unique Receipt Number (e.g., GGT-2026-1234-ABCD) to verify donation details.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="Enter Receipt Number..."
                      className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !receiptNumber}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {isVerifying ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </form>

                {verifyStatus === 'success' && receiptData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 text-green-700 font-semibold mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                      <h3>Valid Receipt Found</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-600/80 mb-1">Donor Name</p>
                        <p className="font-medium text-green-900">{receiptData.donorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600/80 mb-1">Donation Amount</p>
                        <p className="font-medium text-green-900">{receiptData.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600/80 mb-1">Purpose/Category</p>
                        <p className="font-medium text-green-900">{receiptData.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600/80 mb-1">Date & Time</p>
                        <p className="font-medium text-green-900">{receiptData.date}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {verifyStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
                  >
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Receipt Not Found</h3>
                    <p className="text-red-600/90 text-sm">
                      We could not find a donation matching this receipt number. Please check the number and try again.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'donate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Impact Info */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Support Our Mission</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Your generous contributions empower us to drive sustainable change. Make a donation today and avail tax benefits while transforming lives.
                  </p>
                </div>

                {/* 80G Registration Block */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <FileText className="w-4 h-4" />
                    80G Registered NGO
                  </div>
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between items-center border-b border-blue-200/50 pb-2">
                      <span className="text-slate-600">Reg No:</span>
                      <span className="font-semibold text-slate-900">2024/10/IV/1387</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-200/50 pb-2">
                      <span className="text-slate-600">80G Unique No:</span>
                      <span className="font-semibold text-slate-900">AAETG8344FF20241</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">PAN:</span>
                      <span className="font-semibold text-slate-900">AAETG8344F</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-800/80 leading-relaxed">
                    Donations are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. You will receive an official PDF receipt immediately after payment.
                  </p>
                </div>

                {/* Bank Details */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Direct Bank Transfer
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Account Name</span>
                      <span className="font-semibold text-slate-900">G Goodwill Trust</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Bank</span>
                      <span className="font-semibold text-slate-900">J&K Bank</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Account No</span>
                      <span className="font-mono font-semibold text-slate-900">0743010100002326</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">IFSC Code</span>
                      <span className="font-mono font-semibold text-slate-900">JAKA0ZAAKIR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donation Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Donor Information</h2>
                  </div>

                  <form onSubmit={handleDonate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      {/* PAN */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">PAN Number (For 80G)</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleInputChange}
                            placeholder="ABCDE1234F"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900 uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Amount */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Amount (INR) *</label>
                        <div className="relative">
                          <BadgeIndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="5000"
                            min="1"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900 font-semibold text-lg"
                            required
                          />
                        </div>
                      </div>

                      {/* Purpose */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Purpose *</label>
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900 h-[46px]"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing Secure Payment...
                          </>
                        ) : (
                          <>
                            Contribute Securely <Heart className="w-5 h-5 fill-current" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Trust Note */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>100% Secure & Encrypted Payment Gateway</span>
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
