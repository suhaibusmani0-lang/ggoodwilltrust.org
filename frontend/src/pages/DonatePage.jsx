import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, IndianRupee, ShieldCheck, User, Mail, Sparkles, Building, Phone, MapPin, CheckCircle, Printer, ArrowLeft, Target } from 'lucide-react';

const DonatePage = () => {
    const [donor, setDonor] = useState({ name: '', email: '', amount: '', pan: '', purpose: 'For Education', customPurpose: '' });
    const [receiptData, setReceiptData] = useState(null); 
    const [isProcessing, setIsProcessing] = useState(false);

    const isPanRequired = donor.amount >= 2000;

    // 👇 NAYA CODE: Receipt aate hi page ka naam badalne ke liye taaki PDF donor ke naam se save ho
    useEffect(() => {
        if (receiptData) {
            // Space ko underscore (_) se replace karke naam banayenge
            const formattedName = receiptData.name.trim().replace(/\s+/g, '_');
            document.title = `Spread_Smiles_Receipt_${formattedName}`;
        } else {
            document.title = "Spread Smiles Foundation"; // Normal title
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
            const response = await fetch('http://localhost:5000/api/create-order', {
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
                    const verifyCall = await fetch('http://localhost:5000/api/verify-payment', {
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
        // Receipt me dikhane ke liye purpose decide karna
        const finalPurpose = receiptData.purpose === 'Other' ? receiptData.customPurpose : receiptData.purpose;

        return (
            <div className="min-h-screen bg-slate-100 print:bg-white text-slate-800 py-10 px-4 font-sans flex items-center justify-center">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl w-full bg-white p-10 md:p-14 rounded-none md:rounded-2xl shadow-2xl print:shadow-none print:p-0 relative overflow-hidden border border-slate-200 print:border-none">
                    
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
    // 🟢 UI 2: DONATION FORM SCREEN (Default)
    // =======================================================================
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
                    <Sparkles className="text-yellow-500 mx-auto mb-6" size={32} />
                    <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">
                        Support Our <span className="italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Mission</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto text-lg">Every contribution is 80G Tax Exempted. Join us in making a difference.</p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-12">
                    
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-7 bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/10 relative overflow-hidden">
                        {isProcessing && (
                            <div className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 font-bold text-blue-400 animate-pulse">Securely Processing Payment...</p>
                            </div>
                        )}
                        <form className="space-y-8" onSubmit={handleDonation}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <User className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input type="text" value={donor.name} placeholder="Full Name" required className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none" onChange={(e) => setDonor({...donor, name: e.target.value})} />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input type="email" value={donor.email} placeholder="Email Address" required className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none" onChange={(e) => setDonor({...donor, email: e.target.value})} />
                                </div>
                            </div>

                            {/* Dropdown for Purpose */}
                            <div className="relative group">
                                <Target className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                <select 
                                    value={donor.purpose} 
                                    onChange={(e) => setDonor({...donor, purpose: e.target.value})}
                                    className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none cursor-pointer appearance-none text-white"
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
                                <IndianRupee className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-400 transition" />
                                <input type="number" value={donor.amount} placeholder="Amount (INR)" required min="1" className="w-full bg-transparent border-b border-white/20 p-2 pl-8 focus:border-blue-400 outline-none" onChange={(e) => setDonor({...donor, amount: e.target.value})} />
                            </div>

                            <AnimatePresence>
                                {isPanRequired && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                        <div className="relative border-b border-yellow-500/50 pb-2 mt-6">
                                            <ShieldCheck className="absolute left-0 top-3 text-yellow-500" size={20} />
                                            <input type="text" value={donor.pan} placeholder="PAN Number (Required for > ₹2000)" required={isPanRequired} className="w-full bg-transparent p-2 pl-8 outline-none uppercase" onChange={(e) => setDonor({...donor, pan: e.target.value})} />
                                            <p className="text-yellow-500 text-[10px] mt-2 italic">* Mandatory per Income Tax norms.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button type="submit" className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-blue-400 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Proceed to Contribute
                            </button>
                        </form>
                    </motion.div>

                    {/* Right: NGO Credentials */}
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-5 space-y-6">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-300">
                                <Building size={20}/> Compliance Details
                            </h3>
                            <div className="space-y-4 text-sm text-slate-300">
                                <p><span className="text-slate-500">Reg No:</span> 719</p>
                                <p><span className="text-slate-500">PAN:</span> ABGTS6392E</p>
                                <p><span className="text-slate-500">80G Certificate:</span> ABGTS6392EF20231</p>
                                <p><span className="text-slate-500">Bank:</span> State Bank Of India</p>
                                <p><span className="text-slate-500">A/c:</span> 43386560812 | IFSC: SBIN0031630</p>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 p-8 rounded-3xl border border-blue-500/20 hover:bg-blue-900/30 transition-colors">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Phone size={20}/> Need Assistance?
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">Contact our office for any queries regarding your donation.</p>
                            <p className="flex items-center gap-2 text-sm text-blue-300 mb-1"><MapPin size={16}/> Shaheen Bagh, New Delhi</p>
                            <p className="flex items-center gap-2 text-sm text-blue-300">+91 7840008043</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DonatePage;