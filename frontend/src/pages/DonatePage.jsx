import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, IndianRupee, User, Mail, Building2, ChevronRight, Target, ShieldCheck, CreditCard, Phone, Download, CheckCircle, Loader2, Search, FileSearch, AlertCircle, Hash, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function: Number to Words (Rupees)
const numberToWords = (num) => {
    if (!num || isNaN(num) || num === 0) return "";
    let a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    let b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ""; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim() !== "" ? "Rupees " + str.trim() + " Only" : "";
};

const DonatePage = () => {
    // Page Mode: 'donate' | 'verify'
    const [pageMode, setPageMode] = useState('donate');

    // --- DONATION STATES ---
    const [donor, setDonor] = useState({ name: '', email: '', phone: '', amount: '', pan: '', purpose: 'General Donation' });
    const [status, setStatus] = useState('idle'); 
    const [receiptData, setReceiptData] = useState(null);

    // --- VERIFICATION STATES ---
    const [verifyInput, setVerifyInput] = useState('');
    const [verifyStatus, setVerifyStatus] = useState('idle'); // idle, loading, success, error
    const [verifiedData, setVerifiedData] = useState(null);

    // Generate Unique Receipt Number
    const generateReceiptNo = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const randomChar = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `GGT-${year}-${randomNum}-${randomChar}`;
    };

    // --- REAL RAZORPAY HANDLER ---
    const handleDonation = async (e) => {
        e.preventDefault();
        if(!donor.amount || Number(donor.amount) < 1) return toast.error("Please enter a valid amount!");
        
        setStatus('processing');

        try {
            // 1. Backend se Order ID create karo
            const res = await fetch('https://ggoodwilltrust-org.onrender.com/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: donor.amount })
            });

            if (!res.ok) throw new Error("Failed to create order");
            const order = await res.json();

            // 2. Razorpay Options setup karo
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Yahan VITE ko hata kar REACT_APP kiya gaya hai
                amount: order.amount,
                currency: "INR",
                name: "G Goodwill Trust",
                description: donor.purpose,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const receiptNo = generateReceiptNo();
                        const paymentId = response.razorpay_payment_id;

                        // 3. Payment Success hone par Supabase me data save karo
                        const { error } = await supabase.from('donations').insert([{
                            receipt_no: receiptNo,
                            name: donor.name,
                            email: donor.email,
                            phone: donor.phone,
                            pan: donor.pan,
                            amount: Number(donor.amount),
                            purpose: donor.purpose,
                            payment_id: paymentId
                        }]);

                        if (error) throw error;

                        setReceiptData({
                            ...donor,
                            receipt_no: receiptNo,
                            payment_id: paymentId,
                            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        });
                        setStatus('success');
                        toast.success("Payment Successful! Generating Receipt...");
                    } catch (dbError) {
                        console.error("Supabase Save Error:", dbError);
                        toast.error("Payment received, but receipt generation failed.");
                        setStatus('idle');
                    }
                },
                prefill: {
                    name: donor.name,
                    email: donor.email,
                    contact: donor.phone
                },
                theme: {
                    color: "#f97316" // Orange color theme
                },
                modal: {
                    ondismiss: function() {
                        setStatus('idle');
                        toast.info("Payment cancelled");
                    }
                }
            };

            // 4. Razorpay popup open karo
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(`Payment Failed: ${response.error.description}`);
                setStatus('idle');
            });
            rzp.open();

        } catch (error) {
            console.error("Error init payment:", error);
            toast.error("Could not initiate payment. Make sure backend is running.");
            setStatus('idle');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if(!verifyInput.trim()) return;
        setVerifyStatus('loading');
        
        try {
            // Backend Query: Exact match logic
            const { data, error } = await supabase
                .from('donations')
                .select('receipt_no, name, amount, date, purpose, payment_id')
                .eq('receipt_no', verifyInput.trim().toUpperCase()) 
                .single();
            
            if (error || !data) throw new Error("Receipt not found");
            
            setVerifiedData(data);
            setVerifyStatus('success');
            toast.success("Receipt Verified Successfully!");
        } catch (error) {
            setVerifiedData(null);
            setVerifyStatus('error');
        }
    };

    // Download PDF Logic
    const downloadReceiptPDF = () => {
        const receiptElement = document.getElementById('premium-receipt-card');
        toast.info("Preparing your PDF...");
        
        html2canvas(receiptElement, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`GGT_Receipt_${receiptData.receipt_no}.pdf`);
            toast.success("Receipt Downloaded!");
        });
    };

    const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500/30 overflow-hidden relative">
            
            {/* Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Hero Section & Tab Switcher */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-full mb-6 border border-orange-500/20">
                        {pageMode === 'donate' ? <Heart className="text-orange-500 w-6 h-6 animate-pulse" /> : <ShieldCheck className="text-emerald-500 w-6 h-6" />}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        {pageMode === 'donate' ? 'Support Our Mission' : 'Verify Donation Receipt'}
                    </h1>
                    
                    {/* Switcher Toggle */}
                    <div className="inline-flex bg-black/40 p-1.5 rounded-full border border-white/10 mb-8 backdrop-blur-md">
                        <button 
                            onClick={() => setPageMode('donate')}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${pageMode === 'donate' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Heart className="w-4 h-4" /> Make Donation
                        </button>
                        <button 
                            onClick={() => { setPageMode('verify'); setVerifyStatus('idle'); setVerifyInput(''); }}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${pageMode === 'verify' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <FileSearch className="w-4 h-4" /> Verify Receipt
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    
                    {/* ==========================================
                        MODE: VERIFY RECEIPT
                    ========================================== */}
                    {pageMode === 'verify' && (
                        <motion.div key="verify-mode" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto">
                            <div className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                                
                                <h2 className="text-2xl font-bold text-white mb-2">Check Authenticity</h2>
                                <p className="text-slate-400 mb-8 text-sm">Enter the unique Receipt Number (e.g., GGT-2026-1234-ABCD) to verify donation details.</p>
                                
                                <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <div className="relative flex-1 group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Enter Receipt Number..." 
                                            value={verifyInput}
                                            onChange={(e) => setVerifyInput(e.target.value.toUpperCase())}
                                            className="w-full bg-black/40 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase placeholder:text-slate-600 placeholder:normal-case font-mono tracking-wider" 
                                        />
                                    </div>
                                    <button type="submit" disabled={verifyStatus === 'loading'} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-70">
                                        {verifyStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Verify</>}
                                    </button>
                                </form>

                                {/* Verification Results */}
                                <AnimatePresence mode="wait">
                                    {verifyStatus === 'success' && verifiedData && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-4">
                                                <div className="bg-emerald-500/20 p-2 rounded-full">
                                                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-emerald-400 font-bold text-lg">Valid Receipt Found</h3>
                                                    <p className="text-emerald-500/80 text-xs font-mono">{verifiedData.receipt_no}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Donor Name</p>
                                                    <p className="text-white font-bold text-lg">{verifiedData.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Donation Amount</p>
                                                    <p className="text-emerald-400 font-black text-xl flex items-center gap-1">
                                                        <IndianRupee className="w-5 h-5" /> {Number(verifiedData.amount).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Purpose / Category</p>
                                                    <p className="text-white font-medium">{verifiedData.purpose}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Date & Time</p>
                                                    <p className="text-white font-medium flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-500"/> 
                                                        {new Date(verifiedData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {verifyStatus === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center">
                                            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                                            <h3 className="text-rose-400 font-bold text-lg">Receipt Not Found</h3>
                                            <p className="text-rose-500/80 text-sm mt-1">We couldn't find a donation matching this receipt number. Please check the number and try again.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {/* ==========================================
                        MODE: DONATE (FORM)
                    ========================================== */}
                    {pageMode === 'donate' && status !== 'success' && (
                        <motion.div key="donate-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
                            <form className="lg:col-span-7 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden" onSubmit={handleDonation}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                                <h2 className="text-2xl font-bold text-white mb-8">Donor Information</h2>
                                
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input type="text" placeholder="Full Name" required className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500" onChange={(e) => setDonor({...donor, name: e.target.value})} />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input type="email" placeholder="Email Address" required className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500" onChange={(e) => setDonor({...donor, email: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input type="tel" placeholder="Phone Number" required className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500" onChange={(e) => setDonor({...donor, phone: e.target.value})} />
                                        </div>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input type="text" placeholder="PAN Number (For 80G)" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all uppercase placeholder:text-slate-500 placeholder:normal-case" onChange={(e) => setDonor({...donor, pan: e.target.value.toUpperCase()})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <input type="number" placeholder="Amount (INR)" required min="1" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-500 font-bold text-orange-400" onChange={(e) => setDonor({...donor, amount: e.target.value})} />
                                        </div>
                                        <div className="relative">
                                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                            <select className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-xl border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-slate-300 appearance-none cursor-pointer" onChange={(e) => setDonor({...donor, purpose: e.target.value})}>
                                                <option value="General Donation" className="bg-slate-900">General Donation</option>
                                                <option value="Zakat" className="bg-slate-900">Zakat</option>
                                                <option value="Sadqa" className="bg-slate-900">Sadqa</option>
                                                <option value="Education Support" className="bg-slate-900">Education Support</option>
                                                <option value="Medical Help" className="bg-slate-900">Medical Help</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={status === 'processing'} className="group w-full bg-gradient-to-r from-orange-500 to-orange-600 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:hover:translate-y-0 text-lg">
                                    {status === 'processing' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Secure Payment...</> : <>Contribute Securely <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                </button>

                                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>100% Secure & Encrypted Payment Gateway</span>
                                </div>
                            </form>

                            {/* Bank & Trust Details Card */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                        <Building2 className="text-blue-500 w-6 h-6"/> Direct Bank Transfer
                                    </h3>
                                    <div className="space-y-5 text-sm">
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-slate-400">Account Name</span>
                                            <span className="font-semibold text-white tracking-wide">G Goodwill Trust</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-slate-400">Bank</span>
                                            <span className="font-semibold text-white">J&K Bank</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span className="text-slate-400">Account No</span>
                                            <span className="font-mono font-medium text-blue-400 text-base">0743010100002326</span>
                                        </div>
                                        <div className="flex justify-between pb-1">
                                            <span className="text-slate-400">IFSC Code</span>
                                            <span className="font-mono font-medium text-blue-400 text-base">JAKA0ZAAKIR</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 80G REGISTRATION & PAN COMPLIANCE BLOCK */}
                                <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 text-sm text-slate-300 space-y-4">
                                    <p className="flex items-center gap-2 font-bold text-emerald-400 text-base">
                                        <ShieldCheck className="w-5 h-5"/> 80G Registered NGO
                                    </p>
                                    <div className="space-y-2 font-mono text-xs text-slate-400 bg-black/20 p-4 rounded-xl border border-emerald-500/10">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 font-sans">Reg No:</span>
                                            <span className="text-emerald-400">2024/10/IV/1387</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 font-sans">80G Unique No:</span>
                                            <span className="text-emerald-400">AAETG8344FF20241</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 font-sans">PAN:</span>
                                            <span className="text-emerald-400">AAETG8344F</span>
                                        </div>
                                    </div>
                                    <p className="pt-2 text-[13px] leading-relaxed">
                                        Donations are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. You will receive an official PDF receipt immediately after payment.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ==========================================
                        MODE: DONATE (SUCCESS RECEIPT VIEW)
                    ========================================== */}
                    {pageMode === 'donate' && status === 'success' && receiptData && (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto flex flex-col items-center">
                            
                            <div className="text-center mb-8">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-black text-white">Payment Successful!</h2>
                                <p className="text-slate-400 mt-2">Thank you for your generous donation. Below is your official receipt.</p>
                            </div>

                            {/* THE PREMIUM RECEIPT */}
                            <div id="premium-receipt-card" className="bg-white text-black w-full p-8 md:p-12 relative overflow-hidden border-[3px] border-slate-800" style={{ fontFamily: "Arial, sans-serif" }}>
                                
                                {/* Header */}
                                <div className="flex justify-between items-center border-b-2 border-[#00008B] pb-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" onError={(e) => e.target.style.display='none'}/>
                                        <div>
                                            <h1 className="text-3xl font-black text-[#555555] m-0 tracking-wide">G GOODWILL TRUST<sup className="text-sm text-gray-500">®</sup></h1>
                                            <p className="text-[#5a7b9c] font-bold italic text-sm mt-1 tracking-wide">NON-PROFIT ORGANISATION</p>
                                            <p className="text-[#5a7b9c] font-bold italic text-xs tracking-wide">EDUCATION / EMPOWERMENT / COMPASSION</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="italic font-bold text-[#a87b4f] text-lg font-serif">"Hope Starts Here"</p>
                                    </div>
                                </div>

                                {/* Address & Meta */}
                                <div className="text-center text-xs text-gray-700 mb-6 pb-4 border-b border-gray-200 leading-relaxed">
                                    <strong className="text-black">Reg No:</strong> 2024/10/IV/1387 &nbsp;|&nbsp; <strong className="text-black">80G Unique No:</strong> AAETG8344FF20241 &nbsp;|&nbsp; <strong className="text-black">PAN:</strong> AAETG8344F<br/>
                                    Office: G-48 Shaheen Bagh, Okhla, New Delhi-110025 &nbsp;|&nbsp; Contact: +91 7982804385
                                </div>

                                <h2 className="text-center text-2xl font-black mb-6 uppercase underline decoration-double underline-offset-4">Donation Receipt</h2>

                                <div className="flex justify-between font-bold text-sm mb-8">
                                    <span>Receipt No: <span className="border-b border-dashed border-gray-500 pb-1 font-mono text-blue-900">{receiptData.receipt_no}</span></span>
                                    <span>Date: <span className="border-b border-dashed border-gray-500 pb-1">{receiptData.date}</span></span>
                                </div>

                                {/* Body */}
                                <div className="space-y-4 text-[15px]">
                                    <div className="flex items-end">
                                        <span className="font-semibold whitespace-nowrap mr-3">Received with thanks from Mr./Ms. :</span>
                                        <span className="flex-1 border-b-[1.5px] border-dotted border-black font-bold px-2 pb-1">{receiptData.name}</span>
                                    </div>
                                    <div className="flex items-end">
                                        <span className="font-semibold whitespace-nowrap mr-3">The sum of Rupees :</span>
                                        <span className="flex-1 border-b-[1.5px] border-dotted border-black font-bold px-2 pb-1">{Number(receiptData.amount).toLocaleString('en-IN')} Only</span>
                                    </div>
                                    <div className="flex items-end">
                                        <span className="font-semibold whitespace-nowrap mr-3">In Words :</span>
                                        <span className="flex-1 border-b-[1.5px] border-dotted border-black font-bold italic px-2 pb-1">{numberToWords(receiptData.amount)}</span>
                                    </div>
                                    <div className="flex items-end">
                                        <span className="font-semibold whitespace-nowrap mr-3">Via <span className="underline">ONLINE / UPI</span> for Donation Purpose :</span>
                                        <span className="flex-1 border-b-[1.5px] border-dotted border-black font-bold px-2 pb-1">{receiptData.purpose} {receiptData.pan ? ` | PAN: ${receiptData.pan}` : ''}</span>
                                    </div>
                                </div>

                                {/* Footer & Signatures */}
                                <div className="flex justify-between items-end mt-12 mb-8">
                                    <div>
                                        <div className="border-[2px] border-black bg-gray-50 px-8 py-3 text-2xl font-black">₹ {Number(receiptData.amount).toLocaleString('en-IN')}/-</div>
                                        <div className="font-bold text-xs mt-2 ml-1">OFFICIAL 80G RECEIPT</div>
                                    </div>
                                    <div className="w-48 text-center relative pt-12 border-t-[2px] border-black">
                                        <span className="font-bold text-sm">Authorized Signatory</span>
                                    </div>
                                </div>

                                {/* Bank Box */}
                                <div className="bg-[#f4f8fc] border border-[#7a9cbe] p-4 flex justify-between items-center mt-8 text-xs">
                                    <div>
                                        <strong>Bank Details:</strong> Jammu & Kashmir Bank (Zakir Nagar)<br/>
                                        <strong>A/c No:</strong> 0743010100002326 &nbsp;|&nbsp; <strong>IFSC:</strong> JAKA0ZAAKIR<br/>
                                        <div className="font-bold text-gray-600 mt-2 border-t border-gray-300 pt-2">📧 INFO@GGOODWILLTRUST.ORG &nbsp;|&nbsp; 🌐 WWW.GGOODWILLTRUST.ORG</div>
                                    </div>
                                    <div className="text-right border-l border-gray-300 pl-4">
                                        <p className="font-bold text-gray-700">Payment ID</p>
                                        <p className="font-mono text-[#00008B] font-bold mt-1">{receiptData.payment_id}</p>
                                    </div>
                                </div>

                                <div className="text-center italic text-[10px] text-gray-500 mt-4">
                                    This is a computer-generated receipt. Donations are eligible for tax deduction under Section 80G of the I.T. Act 1961.
                                </div>
                            </div>

                            {/* Download Action */}
                            <div className="mt-8 flex gap-4 w-full">
                                <button onClick={() => { setStatus('idle'); setDonor({...donor, amount: '', pan: ''}); }} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all">
                                    Donate Again
                                </button>
                                <button onClick={downloadReceiptPDF} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 text-lg">
                                    Download 80G Receipt PDF <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default DonatePage;