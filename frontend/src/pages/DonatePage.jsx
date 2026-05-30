import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, IndianRupee, ShieldCheck, User, Mail, Sparkles, Building, Phone, MapPin, CheckCircle, Printer, ArrowLeft, Target, TrendingUp } from 'lucide-react';

// 🟢 FAKE DONORS DATA (25+ Names)
const recentDonors = [
    { name: "Rahul Sharma", amount: 5000, purpose: "Education" },
    { name: "Priya Patel", amount: 2500, purpose: "Food" },
    { name: "Vikram Singh", amount: 10000, purpose: "Health" },
    { name: "Neha Desai", amount: 1500, purpose: "Education" },
    { name: "Aarav Kumar", amount: 3000, purpose: "Food" },
    { name: "Anjali Verma", amount: 2000, purpose: "Health" },
    { name: "Rohan Gupta", amount: 5000, purpose: "Education" },
    { name: "Sneha Reddy", amount: 1100, purpose: "Food" },
    { name: "Aditya Jain", amount: 7500, purpose: "Health" },
    { name: "Kavita Joshi", amount: 2500, purpose: "Education" },
    { name: "Amit Malhotra", amount: 500, purpose: "Food" },
    { name: "Pooja Agarwal", amount: 3000, purpose: "Health" },
    { name: "Karthik Nair", amount: 10000, purpose: "Education" },
    { name: "Meera Iyer", amount: 2000, purpose: "Food" },
    { name: "Siddharth Rao", amount: 1500, purpose: "Health" },
    { name: "Riya Kapoor", amount: 5000, purpose: "Education" },
    { name: "Manish Tiwari", amount: 2500, purpose: "Food" },
    { name: "Shweta Singh", amount: 1000, purpose: "Health" },
    { name: "Varun Chopra", amount: 4000, purpose: "Education" },
    { name: "Nidhi Menon", amount: 1500, purpose: "Food" },
    { name: "Sanjay Yadav", amount: 5000, purpose: "Health" },
    { name: "Kiran Das", amount: 2100, purpose: "Education" },
    { name: "Arjun Bhatia", amount: 3500, purpose: "Food" },
    { name: "Swati Mishra", amount: 1000, purpose: "Health" },
    { name: "Deepak Chawla", amount: 5000, purpose: "Education" },
];

const scrollingDonors = [...recentDonors, ...recentDonors];

const DonatePage = () => {
    const [donor, setDonor] = useState({ name: '', email: '', amount: '', pan: '', purpose: 'For Education', customPurpose: '' });
    const [receiptData, setReceiptData] = useState(null); 
    const [isProcessing, setIsProcessing] = useState(false);

    const isPanRequired = donor.amount >= 2000;

    useEffect(() => {
        if (receiptData) {
            const formattedName = receiptData.name.trim().replace(/\s+/g, '_');
            document.title = `Spread_Smiles_Receipt_${formattedName}`;
        } else {
            document.title = "Spread Smiles Foundation"; 
        }
    }, [receiptData]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleDonation = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK load nahi hua. Please check internet connection.');
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch('https://spreadsmilesfoundation.onrender.com/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: donor.amount })
            });
            const orderData = await response.json();

            const options = {
                key: "rzp_live_SvDdn4Z6c4rwDO", 
                amount: orderData.amount,
                currency: "INR",
                name: "Spread Smiles Foundation",
                description: "Donation Contribution",
                order_id: orderData.id,
                handler: async function (response) {
                    const verifyCall = await fetch('https://spreadsmilesfoundation.onrender.com/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            userDetails: donor
                        })
                    });
                    
                    if (verifyCall.ok) {
                        setReceiptData({
                            ...donor,
                            paymentId: response.razorpay_payment_id,
                            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        });
                        setDonor({ name: '', email: '', amount: '', pan: '', purpose: 'For Education', customPurpose: '' }); 
                    } else {
                        alert('Payment verification failed!');
                    }
                },
                prefill: { name: donor.name, email: donor.email },
                theme: { color: "#3b82f6" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert("Payment Failed! " + response.error.description);
            });
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Kuch galat ho gaya! Backend server chalu hai ya nahi check karein.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // =======================================================================
    // 🟢 UI 1: ULTRA PROFESSIONAL OFFICIAL RECEIPT
    // =======================================================================
    if (receiptData) {
        const finalPurpose = receiptData.purpose === 'Other' ? receiptData.customPurpose : receiptData.purpose;

        return (
            <div className="min-h-screen bg-slate-100 print:bg-white py-10 px-4 flex justify-center items-start font-sans">
                <div className="max-w-4xl w-full">

                    {/* Action Buttons - Hidden in Print */}
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 print:hidden gap-4">
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-lg border border-green-100 w-full sm:w-auto justify-center">
                            <CheckCircle size={20} /> Payment Successful
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => setReceiptData(null)} className="flex-1 sm:flex-none justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
                                <ArrowLeft size={16}/> Back
                            </button>
                            <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md">
                                <Printer size={18} /> Print / Save PDF
                            </button>
                        </div>
                    </div>

                    {/* THE RECEIPT PAPER */}
                    <div className="bg-white p-8 md:p-12 shadow-2xl print:shadow-none print:p-2 border border-slate-200 relative overflow-hidden">
                        
                        {/* Background Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05] pointer-events-none z-0">
                            <img src="/logo.png" alt="watermark" className="w-1/2 object-contain grayscale" onError={(e) => e.target.style.display='none'} />
                        </div>

                        <div className="relative z-10">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-800 pb-6 mb-8 gap-4">
                                <div className="flex items-center gap-4">
                                    <img src="/logo.png" alt="Spread Smiles Logo" className="w-20 h-20 object-contain print:grayscale" onError={(e) => e.target.style.display='none'} />
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Spread Smiles Foundation</h1>
                                        <p className="text-sm text-slate-600 mt-1">F 235/3, Shaheen Bagh, New Delhi 110025</p>
                                        <p className="text-sm text-slate-600">Email: spreadsmilesfoundation8@gmail.com | Ph: +91 7840008043</p>
                                    </div>
                                </div>
                                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200">
                                    <h2 className="text-3xl font-light tracking-widest text-slate-400 uppercase">Receipt</h2>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider bg-slate-100 inline-block px-2 py-1 rounded">Original for Donor</p>
                                </div>
                            </div>

                            {/* Meta Data Row */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Receipt No.</p>
                                    <p className="font-mono font-bold text-slate-900 text-lg">#{receiptData.paymentId.toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Issue</p>
                                    <p className="font-bold text-slate-900 text-lg">{receiptData.date}</p>
                                </div>
                            </div>

                            {/* Donor Content Box */}
                            <div className="border border-slate-200 rounded-lg p-6 mb-8 bg-slate-50/50 print:bg-white print:border-slate-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <div className="col-span-1 md:col-span-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Received With Thanks From</p>
                                        <p className="font-bold text-xl text-slate-900 capitalize border-b border-slate-200 pb-2">{receiptData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                                        <p className="font-semibold text-slate-800">{receiptData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">PAN Number</p>
                                        <p className="font-mono font-bold text-slate-800 uppercase">{receiptData.pan || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Amount & Purpose Highlight */}
                            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800 text-white p-6 rounded-lg mb-10 print:bg-transparent print:text-black print:border-2 print:border-slate-800 print:rounded-lg">
                                <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
                                    <p className="text-xs font-bold text-slate-400 print:text-slate-500 uppercase tracking-wider mb-1">Donation Towards</p>
                                    <p className="font-bold text-lg">{finalPurpose}</p>
                                </div>
                                <div className="w-full md:w-auto text-center md:text-right">
                                    <p className="text-xs font-bold text-slate-400 print:text-slate-500 uppercase tracking-wider mb-1">Amount Received</p>
                                    <p className="text-4xl md:text-5xl font-black tracking-tight">₹{parseFloat(receiptData.amount).toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* Footer Row: 80G & Signatory */}
                            <div className="flex flex-col md:flex-row justify-between items-end pt-8 border-t-2 border-slate-200 gap-8">
                                <div className="w-full md:w-2/3">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Tax Exemption Details (80G)</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-lg print:bg-white print:border print:border-slate-300">
                                        <p><span className="font-semibold text-slate-900">Reg No:</span> 719</p>
                                        <p><span className="font-semibold text-slate-900">PAN:</span> ABGTS6392E</p>
                                        <p className="col-span-2"><span className="font-semibold text-slate-900">80G Approval:</span> ABGTS6392EF20231</p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-4 italic leading-relaxed">
                                        * Donations are eligible for tax deduction under section 80G of the Income Tax Act, 1961.<br/>
                                        * This is a computer-generated receipt and requires a physical signature only if printed for manual distribution.
                                    </p>
                                </div>

                                <div className="w-full md:w-1/3 flex justify-center md:justify-end pt-6 md:pt-0">
                                    <div className="text-center w-48">
                                        <div className="h-16 mb-2 flex items-center justify-center relative">
                                            {/* Digital Stamp Placeholder */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20 print:opacity-40">
                                                <img src="/logo.png" alt="Stamp" className="w-16 h-16 grayscale" onError={(e) => e.target.style.display='none'} />
                                            </div>
                                            <span className="relative z-10 text-slate-400 italic font-serif text-sm">Digitally Verified</span>
                                        </div>
                                        <div className="border-t border-slate-800 pt-2">
                                            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Authorized Signatory</p>
                                            <p className="text-xs text-slate-500 mt-1">Spread Smiles Foundation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =======================================================================
    // 🟢 UI 2: DONATION FORM SCREEN (With Marquee Banner)
    // =======================================================================
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#0a0f1c] text-white py-16 px-4 font-sans overflow-hidden">
            
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 35s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                `}
            </style>

            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <Sparkles size={16} /> Transform Lives Today
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-light mb-6">
                        Support Our <span className="italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-yellow-400">Mission</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Every contribution brings a smile. Your donations are 100% secure and <strong className="text-white">80G Tax Exempted</strong>.
                    </p>
                </motion.div>

                <div className="relative w-full overflow-hidden bg-white/5 border-y border-white/10 py-4 mb-16 backdrop-blur-md">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0f1c] to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0f1c] to-transparent z-10"></div>
                    
                    <div className="animate-marquee flex items-center gap-8 px-4">
                        {scrollingDonors.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 whitespace-nowrap">
                                <TrendingUp size={14} className="text-green-400" />
                                <span className="font-semibold text-white">{d.name}</span> donated <span className="text-yellow-400 font-bold">₹{d.amount.toLocaleString('en-IN')}</span> for {d.purpose}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/10 relative shadow-2xl">
                        {isProcessing && (
                            <div className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[2rem]">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-6 font-bold text-blue-400 animate-pulse text-lg tracking-wide">Securing Your Transaction...</p>
                            </div>
                        )}
                        
                        <form className="space-y-8" onSubmit={handleDonation}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="relative group">
                                    <User className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input type="text" value={donor.name} placeholder="Full Name" required className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none text-white placeholder-slate-500 transition-colors" onChange={(e) => setDonor({...donor, name: e.target.value})} />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input type="email" value={donor.email} placeholder="Email Address" required className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none text-white placeholder-slate-500 transition-colors" onChange={(e) => setDonor({...donor, email: e.target.value})} />
                                </div>
                            </div>

                            <div className="relative group">
                                <Target className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                <select 
                                    value={donor.purpose} 
                                    onChange={(e) => setDonor({...donor, purpose: e.target.value})}
                                    className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none cursor-pointer appearance-none text-white transition-colors"
                                >
                                    <option value="For Education" className="text-black">For Education</option>
                                    <option value="For Health" className="text-black">For Health</option>
                                    <option value="For Food" className="text-black">For Food</option>
                                    <option value="Other" className="text-black">Other (Please Specify)</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                {donor.purpose === 'Other' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                        <div className="relative mt-2">
                                            <input 
                                                type="text" 
                                                value={donor.customPurpose} 
                                                placeholder="Write your purpose here..." 
                                                required={donor.purpose === 'Other'}
                                                onChange={(e) => setDonor({...donor, customPurpose: e.target.value})}
                                                className="w-full bg-transparent border-b border-blue-400/50 p-2 pl-8 outline-none text-blue-300 placeholder-blue-300/50" 
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="relative group">
                                <IndianRupee className="absolute left-0 top-3 text-slate-500 group-focus-within:text-yellow-400 transition" />
                                <input type="number" value={donor.amount} placeholder="Donation Amount (INR)" required min="1" className="w-full bg-transparent border-b border-white/20 p-2 pl-8 text-xl font-semibold text-yellow-400 focus:border-yellow-400 outline-none placeholder-slate-500 transition-colors" onChange={(e) => setDonor({...donor, amount: e.target.value})} />
                            </div>

                            <AnimatePresence>
                                {isPanRequired && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                        <div className="relative border-b border-red-400/50 pb-2 mt-4 bg-red-500/5 p-4 rounded-xl">
                                            <ShieldCheck className="absolute left-4 top-6 text-red-400" size={20} />
                                            <input type="text" value={donor.pan} placeholder="PAN Number (Required for > ₹2000)" required={isPanRequired} className="w-full bg-transparent p-2 pl-10 outline-none uppercase text-white placeholder-slate-400" onChange={(e) => setDonor({...donor, pan: e.target.value})} />
                                            <p className="text-red-400 text-xs mt-2 pl-10 italic">Mandatory per Income Tax norms for amounts above ₹2000.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1">
                                Proceed to Contribute
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-5 space-y-6">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-300">
                                <Building size={24}/> Compliance Details
                            </h3>
                            <div className="space-y-5 text-sm text-slate-300">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Reg No:</span>
                                    <span className="font-semibold text-white">719</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">PAN:</span>
                                    <span className="font-mono font-semibold text-white">ABGTS6392E</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">80G Approval:</span>
                                    <span className="font-mono font-semibold text-white">ABGTS6392EF20231</span>
                                </div>
                                <div className="pt-2">
                                    <p className="text-slate-500 mb-1">Direct Bank Transfer:</p>
                                    <p className="text-white font-medium">State Bank Of India</p>
                                    <p className="text-white font-mono mt-1">A/C: 43386560812</p>
                                    <p className="text-white font-mono mt-1">IFSC: SBIN0031630</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-8 rounded-3xl border border-blue-500/20 backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                                <Phone size={24} className="text-blue-400"/> Need Assistance?
                            </h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">Reach out to our support team for any queries regarding your donation or tax receipts.</p>
                            <div className="space-y-3">
                                <p className="flex items-center gap-3 text-sm text-blue-200">
                                    <MapPin size={18} className="text-blue-400"/> Shaheen Bagh, New Delhi
                                </p>
                                <p className="flex items-center gap-3 text-sm text-blue-200">
                                    <Phone size={18} className="text-blue-400"/> +91 7840008043
                                </p>
                                <p className="flex items-center gap-3 text-sm text-blue-200">
                                    <Mail size={18} className="text-blue-400"/> spreadsmilesfoundation8@gmail.com
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DonatePage;