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
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Let's Connect & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Create Impact</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Whether you need support, wish to volunteer, or want to partner with G Goodwill Trust, we are just a message away.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Head Office</h3>
                <p className="text-sm text-slate-600">G-48 Shaheen Bagh, Okhla, New Delhi-110025</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <p className="text-sm text-slate-600">globalgoodwill4@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                <p className="text-sm text-slate-600">+91 7982804385</p>
              </div>
            </div>
          </div>

          {/* Volunteer Registration */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100">
            {isVolSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h3>
                <p className="text-slate-600 mb-8">Your volunteer request has been received. We are excited to have you.</p>
                <button
                  onClick={() => setIsVolSuccess(false)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Register another volunteer
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Join the Movement</h2>
                    <p className="text-sm text-slate-500 mt-1">Become a volunteer and help us spread smiles.</p>
                  </div>
                </div>

                <form onSubmit={handleVolSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <input required type="text" value={volData.name} onChange={e => setVolData({...volData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input required type="email" value={volData.email} onChange={e => setVolData({...volData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <input required type="tel" value={volData.phone} onChange={e => setVolData({...volData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">City</label>
                      <input required type="text" value={volData.city} onChange={e => setVolData({...volData, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Why do you want to join us?</label>
                    <textarea required rows={3} value={volData.reason} onChange={e => setVolData({...volData, reason: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"></textarea>
                  </div>
                  
                  {volError && <p className="text-red-500 text-sm">{volError}</p>}
                  
                  <button
                    disabled={isVolLoading}
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isVolLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</> : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col">
            {isContactSuccess ? (
              <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h3>
                <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">
                  Thank you for reaching out to G Goodwill Trust. Our dedicated team will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsContactSuccess(false)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">How can we help?</h2>
                  <p className="text-slate-500 text-lg">Fill out the form below and we will be in touch as soon as possible.</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <input required type="text" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input required type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <input required type="tel" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Subject</label>
                      <input required type="text" value={contactData.subject} onChange={e => setContactData({...contactData, subject: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea required rows={6} value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
                  </div>

                  {contactError && <p className="text-red-500 text-sm">{contactError}</p>}

                  <div className="pt-2">
                    <button
                      disabled={isContactLoading}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-500/20"
                    >
                      {isContactLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                      ) : (
                        <>Send Message <Send className="w-5 h-5 ml-1" /></>
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>Your information is safe and securely encrypted.</span>
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