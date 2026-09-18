'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Heart } from 'lucide-react';
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
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] pt-32 pb-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#121214] rounded-full mb-6 border border-[#27272a] text-[#d4af37] text-xs font-medium tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            Ground Interventions
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal mb-6 tracking-normal leading-[1.08] text-white">
            Programs &amp;{' '}
            <span className="italic text-[#d4af37] font-serif">
              Philanthropic Drives
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#a1a1aa] font-light leading-relaxed max-w-2xl mx-auto">
            Explore our continuous initiatives designed to address the fundamental needs of vulnerable households across education, clinical care, and food security.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-28">
            <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-4" />
            <p className="text-xs text-[#71717a] uppercase tracking-widest font-medium">Loading Verified Initiatives...</p>
          </div>
        ) : programs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-[#121214] border border-[#27272a] rounded-3xl"
          >
            <Heart className="w-12 h-12 text-[#71717a] mx-auto mb-4" />
            <h3 className="text-xl font-serif font-normal text-white mb-2">No Active Records Found</h3>
            <p className="text-xs text-[#a1a1aa]">New relief programs will appear once confirmed by trustees.</p>
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
                className="bg-[#121214] rounded-2xl overflow-hidden border border-[#27272a] hover:border-[#d4af37]/50 transition-all duration-500 group flex flex-col h-full hover:-translate-y-1 shadow-xl"
              >
                <div className="h-64 overflow-hidden relative bg-[#09090b]">
                  {program.image_urls && program.image_urls.length > 0 ? (
                    <img
                      src={program.image_urls[0]}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#71717a] font-serif text-sm">
                      G Goodwill Trust Field Archive
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
                </div>

                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-normal text-white mb-3 group-hover:text-[#d4af37] transition-colors leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-[#a1a1aa] text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                      {program.description}
                    </p>
                  </div>

                  <Link
                    href={`/programs/${program._id}`}
                    className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#d4af37] group-hover:text-[#fef08a] transition-colors"
                  >
                    Examine Project Mandate <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
