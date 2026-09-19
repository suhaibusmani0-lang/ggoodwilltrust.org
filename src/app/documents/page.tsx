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

  const getCategoryBadge = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'certificates':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'policies':
        return 'bg-amber-50 text-[#b45309] border-amber-300';
      case 'reports':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50/50 text-slate-900 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-6 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-amber-600" /> Institutional Transparency &bull; 80G Certified
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-slate-900 mb-6 leading-tight">
            Official <span className="italic font-serif text-[#b45309]">Documents</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Direct access to our regulatory filings, financial audits, registered trust deeds, and official compliance charters.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-16 flex-wrap">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 inline-flex gap-1 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={
                  'px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ' +
                  (activeTab === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b45309] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
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
            <Loader2 className="w-8 h-8 text-[#b45309] animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">Loading Registry Records...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-24 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-normal text-slate-900 mb-2">No Documents In This Category</h3>
            <p className="text-sm text-slate-500">
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
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col justify-between p-7 relative shadow-xs hover:shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#b45309] flex items-center justify-center shrink-0 group-hover:border-amber-400 transition-colors shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold border ${getCategoryBadge(doc.category)}`}>
                      {doc.category || 'Official'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-normal text-slate-900 mb-1 group-hover:text-[#b45309] transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">{formatDate(doc.created_at)}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-light">
                    {doc.description || 'Verified official document published by G Goodwill Trust executive board.'}
                  </p>
                </div>

                {doc.file_url && (
                  <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-900 hover:bg-slate-200 transition-all uppercase tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#b45309]" /> View
                    </a>
                    <a
                      href={doc.file_url}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#d4af37] text-xs font-bold text-black hover:bg-[#c59b27] transition-all uppercase tracking-wider shadow-xs"
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
