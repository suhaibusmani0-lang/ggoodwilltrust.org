"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send, ShieldCheck, CheckCircle2, Loader2, Heart } from "lucide-react";

export default function ContactPage() {
  const [contactData, setContactData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [isContactSuccess, setIsContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const [volData, setVolData] = useState({ name: "", email: "", phone: "", city: "", reason: "" });
  const [isVolLoading, setIsVolLoading] = useState(false);
  const [isVolSuccess, setIsVolSuccess] = useState(false);
  const [volError, setVolError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactLoading(true);
    setContactError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setIsContactSuccess(true);
      setContactData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setContactError(err.message || "Something went wrong.");
    } finally {
      setIsContactLoading(false);
    }
  };

  const handleVolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVolLoading(true);
    setVolError("");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volData),
      });
      if (!res.ok) throw new Error("Failed to register");
      setIsVolSuccess(true);
      setVolData({ name: "", email: "", phone: "", city: "", reason: "" });
    } catch (err: any) {
      setVolError(err.message || "Something went wrong.");
    } finally {
      setIsVolLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-12 pb-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Contact Information & Volunteer Registration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-10"
        >
          <div>
            <span className="text-[#b45309] text-xs font-semibold tracking-[0.2em] uppercase mb-3 inline-block">
              Communication Secretariat
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-normal text-slate-900 mb-4 leading-tight">
              Connect With Our{' '}
              <span className="italic text-[#b45309] font-serif">
                Trustees.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Whether you wish to sponsor a relief camp, enroll as a volunteer, or seek institutional support — our secretariat is at your service.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-slate-900 mb-1">Headquarters</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-slate-900 mb-1">Official Inquiry</h3>
                <a href="mailto:globalgoodwill4@gmail.com" className="text-xs text-slate-600 hover:text-[#b45309] transition-colors font-medium">
                  globalgoodwill4@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-slate-900 mb-1">Direct Helpline</h3>
                <a href="tel:+917982804385" className="text-xs text-slate-600 hover:text-[#b45309] transition-colors font-medium">
                  +91 79828 04385
                </a>
              </div>
            </div>
          </div>

          {/* Volunteer Application Form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
            {isVolSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-[#b45309] mx-auto mb-4" />
                <h3 className="text-xl font-serif text-slate-900 mb-2">Application Acknowledged</h3>
                <p className="text-xs text-slate-600 font-light mb-6">Our volunteer management board will connect with you regarding upcoming camps.</p>
                <button
                  onClick={() => setIsVolSuccess(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-slate-200 border border-slate-300"
                >
                  Register Another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[#b45309] text-[10px] tracking-[0.2em] font-semibold uppercase block mb-1">
                    Grassroots Force
                  </span>
                  <h2 className="text-xl font-serif text-slate-900">Join as a Volunteer</h2>
                  <p className="text-xs text-slate-500 mt-1 font-light">Contribute your time to food drives and health camps.</p>
                </div>

                <form onSubmit={handleVolSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 mb-1.5 block font-medium">Full Name</label>
                      <input required type="text" value={volData.name} onChange={e => setVolData({...volData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 mb-1.5 block font-medium">Email</label>
                      <input required type="email" value={volData.email} onChange={e => setVolData({...volData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 mb-1.5 block font-medium">Phone Number</label>
                      <input required type="tel" value={volData.phone} onChange={e => setVolData({...volData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 mb-1.5 block font-medium">City</label>
                      <input required type="text" value={volData.city} onChange={e => setVolData({...volData, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-700 mb-1.5 block font-medium">Statement of Purpose</label>
                    <textarea required rows={3} value={volData.reason} onChange={e => setVolData({...volData, reason: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors resize-none"></textarea>
                  </div>
                  
                  {volError && <p className="text-red-600 text-xs font-medium">{volError}</p>}
                  
                  <button
                    disabled={isVolLoading}
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isVolLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Column: Direct Message Secretariat Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-7"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm h-full flex flex-col justify-between">
            {isContactSuccess ? (
              <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-3">Message Received</h3>
                <p className="text-sm text-slate-600 font-light mb-8 max-w-sm">
                  Your communication has been securely logged. The trustees will respond shortly.
                </p>
                <button
                  onClick={() => setIsContactSuccess(false)}
                  className="px-8 py-3.5 bg-[#d4af37] text-black rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#c59b27] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <span className="text-[#b45309] text-xs font-semibold tracking-[0.2em] uppercase mb-2 block">
                    Confidential Transmission
                  </span>
                  <h2 className="text-3xl font-serif text-slate-900 mb-2">Send Official Inquiry</h2>
                  <p className="text-slate-600 text-sm font-light">Direct communication channel to the executive trustees.</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-slate-700 mb-2 block font-medium">Full Name</label>
                        <input required type="text" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 mb-2 block font-medium">Email Address</label>
                        <input required type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-slate-700 mb-2 block font-medium">Phone</label>
                        <input required type="tel" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 mb-2 block font-medium">Subject</label>
                        <input required type="text" value={contactData.subject} onChange={e => setContactData({...contactData, subject: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-700 mb-2 block font-medium">Message Body</label>
                      <textarea required rows={5} value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-[#b45309] focus:outline-none transition-colors resize-none"></textarea>
                    </div>

                    {contactError && <p className="text-red-600 text-xs font-medium">{contactError}</p>}
                  </div>

                  <div className="pt-6">
                    <button
                      disabled={isContactLoading}
                      type="submit"
                      className="w-full py-4 bg-[#d4af37] hover:bg-[#c59b27] text-black rounded-full font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                    >
                      {isContactLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
                      ) : (
                        <>Transmit Message <Send className="w-3.5 h-3.5 ml-1" /></>
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>Encrypted direct communication to G Goodwill Trust.</span>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}