import React, { useEffect, useState } from 'react';
import { FileText, Eye, Download, Calendar, Loader2, ShieldCheck, FileBadge, ArrowDownToLine } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'; 
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [downloadingId, setDownloadingId] = useState(null); 

    const categories = ['All', 'Reports', 'Certificates', 'Policies'];

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error('Error fetching docs:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // 🛡️ SECURE LEGAL WATERMARK & DOWNLOAD LOGIC 🛡️
    const handleWatermarkDownload = async (fileUrl, title, id) => {
        try {
            setDownloadingId(id);
            toast.info(`Applying security watermark to ${title}...`);

            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();

            pages.forEach((page) => {
                const { width, height } = page.getSize();
                
                // LAYER 1: Main Trust Name
                page.drawText('G GOODWILL TRUST', {
                    x: width / 2 - 260, y: height / 2 - 40,
                    size: 55, font: boldFont,
                    color: rgb(0.12, 0.5, 0.88), opacity: 0.15, rotate: degrees(45), 
                });

                // LAYER 2: Strict Legal Warning
                page.drawText('STRICTLY NOT FOR UNAUTHORIZED MISUSE', {
                    x: width / 2 - 280, y: height / 2 - 80,
                    size: 22, font: boldFont,
                    color: rgb(0.85, 0.15, 0.15), opacity: 0.22, rotate: degrees(45),
                });
                
                // LAYER 3: Source Tracker
                page.drawText('Property of ggoodwilltrust.org', {
                    x: width / 2 - 150, y: height / 2 - 110,
                    size: 15, font: boldFont,
                    color: rgb(0.4, 0.4, 0.4), opacity: 0.25, rotate: degrees(45),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `${title}_Secured_G_Goodwill_Trust.pdf`); 
            
            toast.success("Document Secured & Downloaded!");
        } catch (error) {
            console.error("Download Error:", error);
            toast.error("Failed to secure and download document.");
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredDocs = activeTab === 'All' ? documents : documents.filter(doc => doc.category === activeTab);

    // --- Framer Motion Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Date Formatter Helper
    const formatDate = (dateString) => {
        if (!dateString) return "Recently Added";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-24 selection:bg-blue-100 selection:text-blue-900">
            
            {/* --- HEADER SECTION --- */}
            <div className="bg-white border-b border-slate-200 pt-28 pb-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                            <ShieldCheck size={14} /> Transparency & Trust
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Documents</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Access our annual reports, legal certificates, and policies. All downloaded copies are digitally watermarked to ensure authenticity and prevent unauthorized misuse.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                
                {/* --- FILTER TABS --- */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeTab === category 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* --- DOCUMENTS LIST VIEW --- */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-slate-400 font-medium animate-pulse">Loading documents securely...</p>
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileBadge className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Documents Found</h3>
                        <p className="text-slate-500">There are currently no documents available in the "{activeTab}" category.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants} 
                        initial="hidden" 
                        animate="show" 
                        className="flex flex-col gap-4"
                    >
                        {filteredDocs.map((doc) => (
                            <motion.div 
                                key={doc.id} 
                                variants={itemVariants} 
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group flex flex-col md:flex-row md:items-center gap-6"
                            >
                                
                                {/* 1. Icon & Title Area (Left) */}
                                <div className="flex items-center gap-5 w-full md:w-[40%]">
                                    <div className="p-4 bg-blue-50/50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                            {doc.category || "General"}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {doc.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(doc.created_at)}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Description Area (Middle) */}
                                <div className="w-full md:w-[35%]">
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 border-l-2 border-slate-100 pl-4">
                                        {doc.description || "Official document of G Goodwill Trust."}
                                    </p>
                                </div>

                                {/* 3. Action Buttons (Right) */}
                                <div className="w-full md:w-auto md:ml-auto flex flex-row gap-3 pt-4 md:pt-0 border-t md:border-none border-slate-100">
                                    <a 
                                        href={doc.fileUrl || doc.file_url}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm whitespace-nowrap"
                                    >
                                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View</span>
                                    </a>
                                    
                                    <button 
                                        onClick={() => handleWatermarkDownload(doc.fileUrl || doc.file_url, doc.title, doc.id)}
                                        disabled={downloadingId === doc.id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm group/btn whitespace-nowrap"
                                    >
                                        {downloadingId === doc.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <ArrowDownToLine className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        )}
                                        Secure Download
                                    </button>
                                </div>

                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DocumentsPage;