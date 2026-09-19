'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Calendar, Briefcase, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Program {
  _id: string;
  title: string;
  description: string;
  image_urls?: string[];
  createdAt?: string;
}

export default function ProgramDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const found = data.data.find((p: Program) => p._id === id);
          setProgram(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#b45309] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Loading Initiative Blueprint...</p>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-slate-900 mb-4">Program Not Found</h1>
        <p className="text-sm text-slate-600 mb-8">The requested intervention profile could not be located.</p>
        <Link href="/programs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white text-xs uppercase tracking-widest text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all font-semibold shadow-xs">
          <ArrowLeft className="w-4 h-4" /> Back to All Programs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50/50 text-slate-900 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-600 hover:text-[#b45309] transition-colors mb-10 font-semibold px-4 py-2 rounded-full border border-slate-200 bg-white shadow-2xs hover:border-amber-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Programs
        </Link>

        {/* Program Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl overflow-hidden border border-amber-200/60 shadow-sm"
        >
          {program.image_urls && program.image_urls.length > 0 ? (
            <div className="w-full h-[460px] overflow-hidden bg-slate-100 relative">
              <img 
                src={program.image_urls[0]} 
                alt={program.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-amber-50/50 flex items-center justify-center text-amber-500/60 border-b border-slate-200">
              <Briefcase className="w-16 h-16 stroke-[1.2]" />
            </div>
          )}

          <div className="p-8 md:p-14">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-600" /> Core Strategic Pillar
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 80G Tax Deductible
              </span>
              {program.createdAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 ml-auto">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(program.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-normal text-slate-900 mb-8 leading-tight">
              {program.title}
            </h1>

            <div className="border-t border-slate-200 pt-8 mb-12">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-base space-y-4 font-light">
                {program.description}
              </div>
            </div>

            {/* Impact & Donate Action Banner */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/30 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 text-xs uppercase tracking-widest font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Directed Humanitarian Funding
                </div>
                <p className="text-xs text-slate-600 max-w-md font-light">
                  Help us expand this specific initiative to serve more families, women, and children across New Delhi.
                </p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#c59b27] hover:to-[#d97706] text-black text-xs uppercase tracking-widest font-bold transition-all shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:scale-[1.02] shrink-0"
              >
                Support This Cause <Heart className="w-4 h-4 fill-black" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

