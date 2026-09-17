'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Calendar, Briefcase } from 'lucide-react';
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
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </main>
    );
  }

  if (!program) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Program Not Found</h1>
        <Link href="/programs" className="text-blue-600 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/programs" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          {program.image_urls && program.image_urls.length > 0 ? (
            <div className="w-full h-[400px] overflow-hidden bg-slate-100">
              <img src={program.image_urls[0]} alt={program.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
              <Briefcase className="w-12 h-12" />
            </div>
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">{program.title}</h1>
            
            {program.createdAt && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
                <Calendar className="w-4 h-4" />
                {new Date(program.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
