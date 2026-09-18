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
    <main className="min-h-screen bg-white text-slate-900 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-600 hover:text-[#b45309] transition-colors mb-12 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Programs
        </Link>

        {/* Program Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
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
            <div className="w-full h-64 bg-slate-50 flex items-center justify-center text-slate-400 border-b border-slate-200">
              <Briefcase className="w-16 h-16 stroke-[1.2]" />
            </div>
          )}

          <div className="p-8 md:p-14">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#b45309] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Core Strategic Pillar
              </span>
              {program.createdAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
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
            <div className="p-8 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#b45309] text-xs uppercase tracking-widest font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Directed Funding
                </div>
                <p className="text-xs text-slate-600 max-w-md font-light">
                  Help us expand this specific initiative to serve more families and children in need.
                </p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d4af37] hover:bg-[#c59b27] text-black text-xs uppercase tracking-widest font-bold transition-all shadow-xs shrink-0"
              >
                Support This Cause <Heart className="w-4 h-4 fill-current" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

