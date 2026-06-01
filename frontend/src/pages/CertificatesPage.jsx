import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Calendar, Hash, Download, 
    CheckCircle, AlertCircle, FileCheck, Award, Loader2, ShieldCheck
} from 'lucide-react';

const CertificatesPage = () => {
    // --- States ---
    const [formData, setFormData] = useState({ enrollNumber: '', dob: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [certData, setCertData] = useState(null); // Holds dummy fetched data

    // --- Handlers ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleVerify = (e) => {
        e.preventDefault();
        setStatus('loading');

        // Simulating an API call to verify details
        setTimeout(() => {
            if (formData.enrollNumber.length > 3 && formData.dob) {
                // Fake successful response
                setCertData({
                    name: 'Mohd Ali',
                    course: 'Vocational Training & Skill Development',
                    issueDate: '12 August 2025',
                    grade: 'A+',
                    certId: formData.enrollNumber.toUpperCase()
                });
                setStatus('success');
            } else {
                // Fake error response
                setStatus('error');
            }
        }, 1500);
    };

    const handleDownload = () => {
        alert("Downloading Certificate PDF...");
        // Yahan actual PDF download ya Blob generation ka logic aayega
    };

    // --- Animations ---
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    const slideInLeft = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };
    const slideInRight = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0f1c] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto z-10">
                
                {/* Hero Section */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
                        <Award className="text-blue-400 w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide text-slate-300">Official Portal</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                        Certificates & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Results</span>
                    </motion.h1>
                    
                    <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Verify your achievements and download your official <strong className="text-white">G Goodwill Trust</strong> certificates instantly using your credentials.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    
                    {/* LEFT COLUMN: Instructions & Trust Badges */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideInLeft}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How to verify?</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Enter your unique Enrollment or Certificate Number along with your Date of Birth. Our system will securely fetch your verified records.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 shrink-0">
                                    <ShieldCheck className="text-blue-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">100% Authentic & Verified</h3>
                                    <p className="text-sm text-slate-500">All certificates are digitally signed and stored securely in our database.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 shrink-0">
                                    <FileCheck className="text-emerald-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Instant PDF Download</h3>
                                    <p className="text-sm text-slate-500">Get a high-quality, print-ready PDF version of your certificate instantly.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Verification Form / Result Card */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideInRight}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[450px] flex flex-col justify-center">
                            
                            {/* Decorative top gradient line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                            <AnimatePresence mode="wait">
                                
                                {/* 1. IDLE / FORM STATE */}
                                {status === 'idle' && (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleVerify} 
                                        className="space-y-6"
                                    >
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-white mb-2">Verify Credential</h3>
                                            <p className="text-slate-400 text-sm">Please enter the details exactly as printed.</p>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="relative group">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input 
                                                    type="text" 
                                                    name="enrollNumber" 
                                                    value={formData.enrollNumber} 
                                                    onChange={handleChange} 
                                                    required 
                                                    placeholder="Enrollment or Certificate No." 
                                                    className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all placeholder:text-slate-600 uppercase" 
                                                />
                                            </div>
                                            
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input 
                                                    type="date" 
                                                    name="dob" 
                                                    value={formData.dob} 
                                                    onChange={handleChange} 
                                                    required 
                                                    style={{ colorScheme: 'dark' }}
                                                    className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-slate-300" 
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 mt-4 text-lg">
                                            Verify Details <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </motion.form>
                                )}

                                {/* 2. LOADING STATE */}
                                {status === 'loading' && (
                                    <motion.div 
                                        key="loading"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center justify-center h-full text-center space-y-4"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Fetching Records...</h3>
                                        <p className="text-slate-400 text-sm">Securely connecting to database</p>
                                    </motion.div>
                                )}

                                {/* 3. SUCCESS / RESULT STATE */}
                                {status === 'success' && certData && (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col h-full"
                                    >
                                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                                            <CheckCircle className="text-emerald-400 w-8 h-8 shrink-0" />
                                            <div>
                                                <h3 className="text-xl font-bold text-white leading-tight">Verification Successful</h3>
                                                <p className="text-emerald-400/80 text-sm font-medium">Valid Credential Found</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-auto">
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-slate-500 text-sm">Name</span>
                                                <span className="text-white font-semibold">{certData.name}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-slate-500 text-sm">Course/Program</span>
                                                <span className="text-white font-semibold text-right max-w-[60%]">{certData.course}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-slate-500 text-sm">Certificate ID</span>
                                                <span className="text-blue-400 font-mono font-semibold">{certData.certId}</span>
                                            </div>
                                            <div className="flex justify-between pb-2">
                                                <span className="text-slate-500 text-sm">Issue Date</span>
                                                <span className="text-white font-semibold">{certData.issueDate}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button onClick={() => { setStatus('idle'); setFormData({ enrollNumber: '', dob: '' }); }} className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 w-1/3">
                                                Back
                                            </button>
                                            <button onClick={handleDownload} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2">
                                                Download PDF <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 4. ERROR STATE */}
                                {status === 'error' && (
                                    <motion.div 
                                        key="error"
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center"
                                    >
                                        <div className="bg-red-500/10 p-4 rounded-full mb-6">
                                            <AlertCircle className="w-12 h-12 text-red-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Record Not Found</h3>
                                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                            We couldn't find any certificate matching these details. Please check the Enrollment Number and Date of Birth.
                                        </p>
                                        <button onClick={() => setStatus('idle')} className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/10">
                                            Try Again
                                        </button>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default CertificatesPage;