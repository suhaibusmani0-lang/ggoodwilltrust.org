'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Briefcase, Heart } from 'lucide-react';
import Link from 'next/link';

interface Program {
  _id: string;
  title: string;
  description: string;
  image_urls?: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.data) setPrograms(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6 border border-blue-200">
            <Briefcase className="text-blue-600 w-6 h-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Programs &amp; Projects
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the initiatives we run to address the fundamental needs of underprivileged communities and create a lasting impact.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
            </div>
            <p className="text-slate-500 mt-4 font-medium animate-pulse">Loading initiatives...</p>
          </div>
        ) : programs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm"
          >
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Programs Found</h3>
            <p className="text-slate-500">Add some programs from the Admin Panel to see them here!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <motion.div
                key={program._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }
                }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
              >
                <div className="h-60 overflow-hidden relative bg-slate-100">
                  {program.image_urls && program.image_urls.length > 0 ? (
                    <img
                      src={program.image_urls[0]}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Briefcase className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {program.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <Link href={`/programs/${program._id}`} className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all w-fit">Read Full Story <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}



