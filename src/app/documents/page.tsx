'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Shield, Download, Eye } from 'lucide-react';

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
  hidden: { opacity: 0, y: 30 },
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
    if (!dateStr) return 'Recently Added';
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold mb-6">
            <Shield className="w-4 h-4" /> Transparency &amp; Trust
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Official{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Documents</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Access our annual reports, legal certificates, and policies. All downloaded copies are digitally watermarked to ensure authenticity and prevent unauthorized misuse.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={
                'px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ' +
                (activeTab === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300')
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading documents securely...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Documents Found</h3>
            <p className="text-slate-500">
              There are currently no documents available in the &quot;{activeTab}&quot; category.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }
                }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {doc.category || 'General'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{formatDate(doc.created_at)}</p>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2">
                    {doc.description || 'Official document of G Goodwill Trust.'}
                  </p>

                  {doc.file_url && (
                    <div className="flex gap-3 pt-2">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </a>
                      <a
                        href={doc.file_url}
                        download
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                      >
                        <Download className="w-4 h-4" /> Secure Download
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
