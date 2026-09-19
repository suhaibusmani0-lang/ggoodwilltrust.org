'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Loader2, Search, CheckCircle2, XCircle, Download, Calendar, Hash, Sparkles, ShieldCheck } from 'lucide-react';

interface Certificate {
  _id: string;
  title: string;
  description: string;
  image_urls?: string[];
  enrollNumber?: string;
  name?: string;
  course?: string;
  issueDate?: string;
  grade?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification state
  const [enrollNumber, setEnrollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [foundCert, setFoundCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.data) setCerts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyResult('idle');
    setFoundCert(null);

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_no: enrollNumber.trim(), dob }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setVerifyResult('success');
        setFoundCert({
          _id: data.data._id,
          title: data.data.title,
          description: data.data.description,
          name: data.data.name,
          course: data.data.course,
          enrollNumber: data.data.enrollment_no,
          issueDate: data.data.createdAt ? new Date(data.data.createdAt).toLocaleDateString('en-IN') : 'N/A',
          grade: data.data.grade,
          image_urls: data.data.image_urls,
        });
      } else {
        setVerifyResult('error');
      }
    } catch {
      setVerifyResult('error');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50/50 text-slate-900 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold tracking-widest uppercase mb-6 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-700" /> Credential Registry
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-slate-900 mb-6 leading-tight">
            Academic &amp; <span className="italic font-serif text-[#b45309]">Certificates</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Verify official diplomas, vocational course completion records, and merit awards issued by G Goodwill Trust educational initiatives.
          </p>
        </motion.div>

        {/* Two Column Layout: Guide & Form */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left: Instructions */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-normal text-slate-900 mb-4">
                Tamper-Proof <span className="italic text-[#b45309]">Verification</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Every certificate issued by G Goodwill Trust carries a cryptographic registry footprint. Enter the unique identifier printed on the credential along with the recipient&apos;s registered date of birth.
              </p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-6 flex items-start gap-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                  100% Genuine
                </div>
                <h3 className="font-serif text-lg font-normal text-slate-900 mb-1">Authenticated Ledger</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">Cross-referenced against our central student register with zero external alteration risk.</p>
              </div>
            </div>

            <div className="bg-white border border-blue-100 rounded-3xl p-6 flex items-start gap-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Instant Access
                </div>
                <h3 className="font-serif text-lg font-normal text-slate-900 mb-1">Direct PDF Certificate</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">Instantly access the archival print-resolution certificate once identity verification succeeds.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Verification Form Card */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-7">
            <div className="bg-white border border-amber-200/80 rounded-3xl p-8 md:p-10 shadow-sm relative">
              {verifyResult === 'idle' && !verifyLoading && (
                <>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-[11px] font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" /> Secure Verification
                    </div>
                    <h2 className="font-serif text-2xl font-normal text-slate-900 mb-1">Verify Credential</h2>
                    <p className="text-xs text-slate-500">Enter the enrollment code and registered birth date to proceed.</p>
                  </div>
                  <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Enrollment / Certificate ID *</label>
                      <div className="relative">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 w-4 h-4" />
                        <input
                          type="text"
                          name="enrollNumber"
                          value={enrollNumber}
                          onChange={(e) => setEnrollNumber(e.target.value.toUpperCase())}
                          required
                          placeholder="e.g. GGT-EDU-2025-0142"
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 font-mono text-sm uppercase placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider text-slate-700 font-medium">Date of Birth *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 w-4 h-4" />
                        <input
                          type="date"
                          name="dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#c59b27] hover:to-[#d97706] text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_4px_16px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
                    >
                      <Search className="w-4 h-4" /> Query Registry Records
                    </button>
                  </form>
                </>
              )}

              {verifyLoading && (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 text-[#b45309] animate-spin mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-normal text-slate-900 mb-2">Querying Ledger...</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Validating student credentials</p>
                </div>
              )}

              {verifyResult === 'success' && foundCert && (
                <div className="text-center py-4">
                  <div className="inline-flex p-4 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-700 mb-5 shadow-xs">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-3xl font-normal text-slate-900 mb-2">Credential Verified</h3>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-mono mb-6 font-bold shadow-2xs">
                    &bull; OFFICIAL RECORD MATCH &bull;
                  </span>

                  <div className="text-left space-y-3 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 border border-amber-200/70 p-6 rounded-2xl text-xs font-sans mb-6 shadow-xs">
                    <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                      <span className="text-slate-500 font-medium">Candidate Name</span>
                      <span className="font-bold text-slate-900 text-sm">{foundCert.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                      <span className="text-slate-500 font-medium">Program / Course</span>
                      <span className="font-semibold text-blue-700">{foundCert.course}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/80 pb-2.5">
                      <span className="text-slate-500 font-medium">Enrollment Number</span>
                      <span className="font-mono text-[#b45309] font-bold bg-amber-100/60 px-2 py-0.5 rounded">{foundCert.enrollNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Date of Issuance</span>
                      <span className="font-mono text-slate-700 font-medium">{foundCert.issueDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setVerifyResult('idle')}
                      className="flex-1 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs uppercase tracking-widest font-semibold transition-all"
                    >
                      New Search
                    </button>
                    <button className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#c59b27] hover:to-[#d97706] text-black text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-xs">
                      <Download className="w-4 h-4" /> Download Certificate
                    </button>
                  </div>
                </div>
              )}

              {verifyResult === 'error' && (
                <div className="text-center py-10">
                  <div className="inline-flex p-4 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mb-4 shadow-xs">
                    <XCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-slate-900 mb-2">Record Not Found</h3>
                  <p className="text-xs text-slate-600 mb-6 max-w-sm mx-auto leading-relaxed font-light">
                    No certificate matching this enrollment code and date of birth could be found in our directory. Please re-verify the entered data.
                  </p>
                  <button
                    onClick={() => { setVerifyResult('idle'); setEnrollNumber(''); setDob(''); }}
                    className="bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#c59b27] hover:to-[#d97706] text-black text-xs uppercase tracking-widest font-bold px-8 py-3.5 rounded-xl transition-all shadow-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Public Gallery of Issued Certificates */}
        {!loading && certs.length > 0 && (
          <div className="pt-16 border-t border-slate-200">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-[11px] font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" /> Official Records
              </div>
              <h2 className="font-serif text-4xl font-normal text-slate-900 mb-3">Published Awards &amp; Merits</h2>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">G Goodwill Trust Institutional Archive</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certs.map((cert) => (
                <motion.div
                  key={cert._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white border border-slate-200 hover:border-amber-300 rounded-3xl overflow-hidden transition-all duration-300 group shadow-xs hover:shadow-lg"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-50/50 to-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200">
                    {cert.image_urls && cert.image_urls.length > 0 ? (
                      <img src={cert.image_urls[0]} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <Award className="w-12 h-12 text-amber-500/60" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                      Verified Credential
                    </div>
                    <h3 className="font-serif text-xl font-normal mb-2 text-slate-900 group-hover:text-[#b45309] transition-colors">{cert.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">{cert.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
