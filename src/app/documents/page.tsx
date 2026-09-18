'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Shield, Download, Eye, Sparkles } from 'lucide-react';

interface DocItem {
  _id: string;
  title: string;
  description: string;
  category?: string;
  file_url?: string;
  image_urls?: string[];
  created_at?: string;
}

const categories = ['All', 'Reports', 'Certificates', 'Policies'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.data) setDocs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDocs = activeTab === 'All' ? docs : docs.filter(d => d.category === activeTab);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Official Record';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] pt-32 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-6">
            <Shield className="w-3.5 h-3.5" /> Institutional Transparency
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#fafafa] mb-6 leading-tight">
            Official <span className="italic font-serif text-[#d4af37]">Documents</span>
          </h1>
          <p className="text-base md:text-lg text-[#a1a1aa] font-sans max-w-2xl mx-auto leading-relaxed">
            Direct access to our regulatory filings, financial audits, registered trust deeds, and official compliance charters.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-16 flex-wrap">
          <div className="bg-[#121214] p-1.5 rounded-full border border-[#27272a] inline-flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={
                  'px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ' +
                  (activeTab === cat
                    ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]')
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-28">
            <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#71717a]">Loading Registry Records...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-24 bg-[#121214] border border-[#27272a] rounded-3xl p-8">
            <FileText className="w-12 h-12 text-[#52525b] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-light text-[#fafafa] mb-2">No Documents In This Category</h3>
            <p className="text-sm text-[#71717a]">
              There are currently no filings published under &quot;{activeTab}&quot;.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocs.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }
                }}
                className="bg-[#121214] border border-[#27272a] hover:border-[#d4af37]/40 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col justify-between p-7 relative shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#18181b] border border-[#27272a] text-[#d4af37] flex items-center justify-center shrink-0 group-hover:border-[#d4af37]/40 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-3 py-1 rounded-full">
                      {doc.category || 'Official'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-light text-[#fafafa] mb-1 group-hover:text-[#d4af37] transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#71717a]">{formatDate(doc.created_at)}</p>
                  </div>

                  <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3">
                    {doc.description || 'Verified official document published by G Goodwill Trust executive board.'}
                  </p>
                </div>

                {doc.file_url && (
                  <div className="flex gap-3 pt-6 mt-6 border-t border-[#27272a]">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-semibold text-[#fafafa] hover:border-[#d4af37]/40 transition-all uppercase tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" /> View
                    </a>
                    <a
                      href={doc.file_url}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#d4af37] text-xs font-bold text-black hover:bg-[#e5c07b] transition-all uppercase tracking-wider shadow-lg shadow-[#d4af37]/15"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
