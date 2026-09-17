'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Loader2, Search, CheckCircle2, XCircle, Download, Calendar, Hash } from 'lucide-react';

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

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold mb-6">
            <Award className="w-4 h-4" /> Official Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Certificates &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Results</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Verify your achievements and download your official G Goodwill Trust certificates instantly using your credentials.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Instructions */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">How to verify?</h2>
              <p className="text-slate-600 leading-relaxed">
                Enter your unique Enrollment or Certificate Number along with your Date of Birth. Our system will securely fetch your verified records.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">100% Authentic & Verified</h3>
                <p className="text-sm text-slate-500">All certificates are digitally signed and stored securely in our database.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Instant PDF Download</h3>
                <p className="text-sm text-slate-500">Get a high-quality, print-ready PDF version of your certificate instantly.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Verification Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
              {verifyResult === 'idle' && !verifyLoading && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Credential</h2>
                  <p className="text-slate-500 mb-6">Please enter the details exactly as printed.</p>
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="enrollNumber"
                        value={enrollNumber}
                        onChange={(e) => setEnrollNumber(e.target.value.toUpperCase())}
                        required
                        placeholder="Enrollment or Certificate No."
                        className="w-full py-4 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 uppercase"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        className="w-full py-4 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <Search className="w-5 h-5" /> Verify Details
                    </button>
                  </form>
                </>
              )}

              {verifyLoading && (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Fetching Records...</h3>
                  <p className="text-slate-500">Securely connecting to database</p>
                </div>
              )}

              {verifyResult === 'success' && foundCert && (
                <div className="text-center py-8">
                  <div className="inline-block bg-emerald-100 p-4 rounded-full mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Verification Successful</h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-6">Valid Credential Found</span>
                  <div className="text-left space-y-4 bg-slate-50 p-6 rounded-xl">
                    <div><span className="text-sm text-slate-500">Name</span><p className="font-bold text-slate-900">{foundCert.name}</p></div>
                    <div><span className="text-sm text-slate-500">Course/Program</span><p className="font-bold text-slate-900">{foundCert.course}</p></div>
                    <div><span className="text-sm text-slate-500">Certificate ID</span><p className="font-bold text-slate-900">{foundCert.enrollNumber}</p></div>
                    <div><span className="text-sm text-slate-500">Issue Date</span><p className="font-bold text-slate-900">{foundCert.issueDate}</p></div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setVerifyResult('idle')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">Back</button>
                    <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                </div>
              )}

              {verifyResult === 'error' && (
                <div className="text-center py-12">
                  <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Record Not Found</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                    We could not find any certificate matching these details. Please check the Enrollment Number and Date of Birth.
                  </p>
                  <button
                    onClick={() => { setVerifyResult('idle'); setEnrollNumber(''); setDob(''); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Certificates Grid from DB */}
        {!loading && certs.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-black text-slate-900 mb-8">All Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => (
                <motion.div
                  key={cert._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                    {cert.image_urls && cert.image_urls.length > 0 ? (
                      <img src={cert.image_urls[0]} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Award className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-900">{cert.title}</h3>
                    <p className="text-sm text-slate-500">{cert.description}</p>
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
