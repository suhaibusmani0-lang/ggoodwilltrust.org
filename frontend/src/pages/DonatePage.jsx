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

// Duplicate list for seamless infinite scroll
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
    // 🟢 UI 1: PREMIUM SUCCESS RECEIPT SCREEN
    // =======================================================================
    if (receiptData) {
        const finalPurpose = receiptData.purpose === 'Other' ? receiptData.customPurpose : receiptData.purpose;

        return (
            <div className="min-h-screen bg-slate-100 print:bg-white text-slate-800 py-10 px-4 font-sans flex items-center justify-center">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl w-full bg-white p-10 md:p-14 rounded-none md:rounded-3xl shadow-2xl print:shadow-none print:p-0 relative overflow-hidden border border-slate-200 print:border-none">
                    
                    <div className="absolute inset-0 opacity-[0.02] print:opacity-[0.04] pointer-events-none flex items-center justify-center">
                        <Heart size={400} className="text-slate-900" />
                    </div>

                    <div className="flex justify-between items-center mb-10 print:hidden border-b border-slate-100 pb-6 relative z-10">
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                            <CheckCircle size={20} /> Payment Secured
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setReceiptData(null)} className="text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 transition-colors flex items-center gap-2">
                                <ArrowLeft size={16}/> Back
                            </button>
                            <button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md">
                                <Printer size={18} /> Print Official Receipt
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-800 pb-8 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">SPREAD SMILES</h1>
                                <h2 className="text-lg md:text-xl font-bold text-slate-600 uppercase tracking-[0.2em] mt-1">FOUNDATION</h2>
                                <div className="mt-4 text-sm text-slate-500 space-y-1">
                                    <p className="flex items-center gap-1"><MapPin size={14}/> Shaheen Bagh, New Delhi 110025</p>
                                    <p className="flex items-center gap-1"><Mail size={14}/> spreadsmilesfoundation8@gmail.com</p>
                                    <p className="flex items-center gap-1"><Phone size={14}/> +91 7840008043</p>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 md:text-right">
                                <h3 className="text-2xl md:text-3xl font-light text-slate-400 uppercase tracking-widest">RECEIPT</h3>
                                <div className="mt-4 text-sm">
                                    <p className="text-slate-500 mb-1">Receipt Number</p>
                                    <p className="font-mono font-bold text-slate-900 text-base">#{receiptData.paymentId.toUpperCase()}</p>
                                    <p className="text-slate-500 mt-3 mb-1">Date of Issue</p>
                                    <p className="font-bold text-slate-900">{receiptData.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Donor Information</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Received With Thanks From</p>
                                    <p className="font-bold text-slate-900 text-lg capitalize">{receiptData.name}</p>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="font-semibold text-slate-800">{receiptData.email}</p>
                                </div>
                                {receiptData.pan && (
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">PAN Number</p>
                                        <p className="font-mono font-bold text-slate-900 uppercase">{receiptData.pan}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl flex flex-col md:flex-row justify-between items-center mb-10 print:bg-transparent print:border-t-2 print:border-b-2 print:border-l-0 print:border-r-0 print:rounded-none">
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Donation Amount</p>
                                <p className="text-sm text-slate-600">Towards: <span className="font-semibold text-slate-800">{finalPurpose}</span></p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">₹{parseFloat(receiptData.amount).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
                            <div className="w-1/2">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Tax Exemption Info (80G)</h4>
                                <ul className="text-xs text-slate-500 space-y-1">
                                    <li><span className="font-semibold text-slate-700">Reg No:</span> 719</li>
                                    <li><span className="font-semibold text-slate-700">PAN:</span> ABGTS6392E</li>
                                    <li><span className="font-semibold text-slate-700">80G Approval:</span> ABGTS6392EF20231</li>
                                </ul>
                                <p className="text-[10px] text-slate-400 mt-4 leading-tight max-w-xs">
                                    Donations are eligible for deduction under section 80G of the Income Tax Act, 1961. Please preserve this receipt for tax filing.
                                </p>
                            </div>
                            
                            <div className="text-center w-48">
                                <div className="border-b-2 border-slate-800 mb-3 h-12 flex items-end justify-center pb-1">
                                    <span className="text-slate-300 italic font-serif text-sm">Digitally Verified</span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Authorized Signatory</p>
                                <p className="text-[10px] text-slate-500 mt-1">Spread Smiles Foundation</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // =======================================================================
    // 🟢 UI 2: DONATION FORM SCREEN (With Marquee Banner)
    // =======================================================================
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-[#0a0f1c] text-white py-16 px-4 font-sans overflow-hidden">
            
            {/* Injecting CSS for Marquee Animation */}
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
                
                {/* Header Section */}
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

                {/* 🟢 RECENT DONORS TICKER */}
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
                    
                    {/* Donation Form */}
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

                            {/* Dropdown for Purpose */}
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

                            {/* Conditional Custom Purpose Field */}
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

                    {/* Right: NGO Credentials */}
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