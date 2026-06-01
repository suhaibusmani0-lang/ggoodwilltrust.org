import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    MapPin, Mail, Phone, Send, CheckCircle, 
    Loader2, User, FileText, HeartHandshake, 
    MessageSquare, ShieldCheck, Sparkles
} from 'lucide-react';

const ContactPage = () => {
    // --- States for Forms ---
    const [volunteerData, setVolunteerData] = useState({ name: '', email: '', phone: '', city: '', message: '' });
    const [volStatus, setVolStatus] = useState('idle');

    const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [contactStatus, setContactStatus] = useState('idle'); 

    // --- Handlers ---
    const handleVolChange = (e) => setVolunteerData({ ...volunteerData, [e.target.name]: e.target.value });
    const handleContactChange = (e) => setContactData({ ...contactData, [e.target.name]: e.target.value });

    const handleVolSubmit = async (e) => {
        e.preventDefault();
        setVolStatus('submitting');
        try {
            // 👇 YAHAN URL UPDATE KIYA HAI
            const response = await fetch('https://ggoodwilltrust-org.onrender.com/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(volunteerData)
            });
            if (response.ok) {
                setVolStatus('success');
                setVolunteerData({ name: '', email: '', phone: '', city: '', message: '' });
            } else setVolStatus('error');
        } catch (error) { setVolStatus('error'); }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus('submitting');
        try {
            // 👇 YAHAN URL UPDATE KIYA HAI
            const response = await fetch('https://ggoodwilltrust-org.onrender.com/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            if (response.ok) {
                setContactStatus('success');
                setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else setContactStatus('error');
        } catch (error) { setContactStatus('error'); }
    };

    // --- Framer Motion Animation Variants ---
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0f1c] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 overflow-hidden">
            
            {/* Ambient Background Glows (Adds Warmth & Professionalism) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto z-10">
                
                {/* Hero Section */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center mb-20"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
                        <Sparkles className="text-orange-400 w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide text-slate-300">Together we can make a difference</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Let's Connect & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Create Impact</span>
                    </motion.h1>
                    
                    <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Whether you need support, wish to volunteer, or want to partner with <strong className="text-white font-semibold">G Goodwill Trust</strong>, we are just a message away.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT COLUMN: Contact Details & Volunteer */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="lg:col-span-5 space-y-6"
                    >
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <motion.div variants={slideInLeft} className="group bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-start gap-5">
                                <div className="bg-blue-500/20 p-3.5 rounded-2xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <MapPin className="text-blue-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Head Office</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">G-48 Shaheen Bagh, Okhla, New Delhi-110025</p>
                                </div>
                            </motion.div>

                            <motion.div variants={slideInLeft} className="group bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-start gap-5">
                                <div className="bg-emerald-500/20 p-3.5 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Mail className="text-emerald-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                                    <p className="text-slate-400 text-sm">globalgoodwill4@gmail.com</p>
                                </div>
                            </motion.div>

                            <motion.div variants={slideInLeft} className="group bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-start gap-5">
                                <div className="bg-orange-500/20 p-3.5 rounded-2xl border border-orange-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Phone className="text-orange-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                                    <p className="text-slate-400 text-sm">+91 7982804385</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* VOLUNTEER REGISTRATION FORM */}
                        <motion.div variants={slideInLeft} className="bg-gradient-to-b from-blue-900/40 to-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden shadow-2xl">
                            {volStatus === 'success' ? (
                                <div className="text-center py-10">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-blue-500/20 p-4 rounded-full mb-4">
                                        <CheckCircle className="w-10 h-10 text-blue-400" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h2>
                                    <p className="text-slate-400 mb-6">Your volunteer request has been received. We are excited to have you.</p>
                                    <button onClick={() => setVolStatus('idle')} className="text-blue-400 text-sm font-semibold hover:text-blue-300 underline underline-offset-4">Register another volunteer</button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                        <HeartHandshake className="text-blue-400 w-7 h-7" /> Join the Movement
                                    </h3>
                                    <p className="text-slate-400 mb-8 text-sm">Become a volunteer and help us spread smiles.</p>
                                    
                                    <form onSubmit={handleVolSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" name="name" value={volunteerData.name} onChange={handleVolChange} required placeholder="Full Name" className="w-full bg-black/20 py-3.5 px-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-sm placeholder:text-slate-500" />
                                            <input type="email" name="email" value={volunteerData.email} onChange={handleVolChange} required placeholder="Email Address" className="w-full bg-black/20 py-3.5 px-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-sm placeholder:text-slate-500" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="tel" name="phone" value={volunteerData.phone} onChange={handleVolChange} required placeholder="Phone Number" className="w-full bg-black/20 py-3.5 px-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-sm placeholder:text-slate-500" />
                                            <input type="text" name="city" value={volunteerData.city} onChange={handleVolChange} required placeholder="City" className="w-full bg-black/20 py-3.5 px-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-sm placeholder:text-slate-500" />
                                        </div>
                                        <textarea rows="3" name="message" value={volunteerData.message} onChange={handleVolChange} required placeholder="Why do you want to join us?" className="w-full bg-black/20 py-3.5 px-4 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-sm resize-none placeholder:text-slate-500"></textarea>
                                        
                                        {volStatus === 'error' && <p className="text-red-400 text-xs text-center">Registration failed. Please try again.</p>}
                                        
                                        <button type="submit" disabled={volStatus === 'submitting'} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                                            {volStatus === 'submitting' ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : <>Submit Application</>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: Main Contact Form */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={slideInRight}
                        className="lg:col-span-7 bg-white/[0.03] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative h-fit"
                    >
                        {/* Decorative glow inside form */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                        {contactStatus === 'success' ? (
                            <div className="text-center py-24 z-10 relative">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-emerald-500/20 p-5 rounded-full mb-6">
                                    <CheckCircle className="w-14 h-14 text-emerald-400" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h2>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">Thank you for reaching out to G Goodwill Trust. Our dedicated team will get back to you shortly.</p>
                                <button onClick={() => setContactStatus('idle')} className="bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/10">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <div className="z-10 relative">
                                <div className="mb-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How can we help?</h2>
                                    <p className="text-slate-400 text-lg">Fill out the form below and we'll be in touch as soon as possible.</p>
                                </div>
                                
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-orange-400 transition-colors" />
                                            <input type="text" name="name" value={contactData.name} onChange={handleContactChange} required placeholder="Your Name" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-orange-500/5 outline-none transition-all placeholder:text-slate-600" />
                                        </div>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-orange-400 transition-colors" />
                                            <input type="email" name="email" value={contactData.email} onChange={handleContactChange} required placeholder="Email Address" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-orange-500/5 outline-none transition-all placeholder:text-slate-600" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-orange-400 transition-colors" />
                                            <input type="tel" name="phone" value={contactData.phone} onChange={handleContactChange} required placeholder="Phone Number" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-orange-500/5 outline-none transition-all placeholder:text-slate-600" />
                                        </div>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-orange-400 transition-colors" />
                                            <input type="text" name="subject" value={contactData.subject} onChange={handleContactChange} required placeholder="Subject" className="w-full bg-black/30 py-4 pl-12 pr-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-orange-500/5 outline-none transition-all placeholder:text-slate-600" />
                                        </div>
                                    </div>

                                    <textarea rows="5" name="message" value={contactData.message} onChange={handleContactChange} required placeholder="Write your message here..." className="w-full bg-black/30 py-4 px-5 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-orange-500/5 outline-none transition-all resize-none placeholder:text-slate-600"></textarea>
                                    
                                    {contactStatus === 'error' && <p className="text-red-400 text-sm text-center">Failed to send message. Please try again.</p>}
                                    
                                    <button type="submit" disabled={contactStatus === 'submitting'} className="group w-full bg-gradient-to-r from-orange-500 to-rose-500 py-4 rounded-2xl font-bold text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_10px_40px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 text-lg">
                                        {contactStatus === 'submitting' ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Your information is safe and securely encrypted.</span>
                                    </div>
                                </form>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;