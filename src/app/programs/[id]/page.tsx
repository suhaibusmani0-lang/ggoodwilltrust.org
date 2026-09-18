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
      <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#71717a]">Loading Initiative Blueprint...</p>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-[#fafafa] mb-4">Program Not Found</h1>
        <p className="text-sm text-[#71717a] mb-8">The requested intervention profile could not be located.</p>
        <Link href="/programs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#27272a] bg-[#121214] text-xs uppercase tracking-widest text-[#d4af37] hover:border-[#d4af37]/40 transition-all font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to All Programs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#d4af37] transition-colors mb-12 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Programs
        </Link>

        {/* Program Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-[#121214] rounded-3xl overflow-hidden border border-[#27272a] shadow-2xl"
        >
          {program.image_urls && program.image_urls.length > 0 ? (
            <div className="w-full h-[460px] overflow-hidden bg-[#18181b] relative">
              <img 
                src={program.image_urls[0]} 
                alt={program.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-64 bg-[#18181b] flex items-center justify-center text-[#52525b] border-b border-[#27272a]">
              <Briefcase className="w-16 h-16 stroke-[1.2]" />
            </div>
          )}

          <div className="p-8 md:p-14">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Core Strategic Pillar
              </span>
              {program.createdAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#71717a]">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(program.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-light text-[#fafafa] mb-8 leading-tight">
              {program.title}
            </h1>

            <div className="border-t border-[#27272a] pt-8 mb-12">
              <div className="text-[#d4d4d8] leading-relaxed whitespace-pre-wrap font-sans text-base space-y-4">
                {program.description}
              </div>
            </div>

            {/* Impact & Donate Action Banner */}
            <div className="p-8 rounded-2xl bg-[#18181b] border border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Directed Funding
                </div>
                <p className="text-xs text-[#a1a1aa] max-w-md">
                  Help us expand this specific initiative to serve more families and children in need.
                </p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#d4af37] hover:bg-[#e5c07b] text-black text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-[#d4af37]/15 shrink-0"
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
