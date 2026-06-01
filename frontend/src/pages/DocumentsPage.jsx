import React, { useEffect, useState } from 'react';
import { FileText, Eye, Download, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'; 
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

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

            // 1. Asli PDF ko fetch karna
            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());

            // 2. PDF ko edit karne ke liye kholna
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            
            // Bold Font Embed Kiya strict look ke liye
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            
            const pages = pdfDoc.getPages();

            // 3. Har page par Watermark lagana (3 Layers)
            pages.forEach((page) => {
                const { width, height } = page.getSize();
                
                // LAYER 1: Main Trust Name
                page.drawText('G GOODWILL TRUST', {
                    x: width / 2 - 260, 
                    y: height / 2 - 40,
                    size: 55,
                    font: boldFont,
                    color: rgb(0.12, 0.5, 0.88), // Brand Blue
                    opacity: 0.15, 
                    rotate: degrees(45), 
                });

                // LAYER 2: Strict Legal Warning
                page.drawText('STRICTLY NOT FOR UNAUTHORIZED MISUSE', {
                    x: width / 2 - 280, 
                    y: height / 2 - 80,
                    size: 22,
                    font: boldFont,
                    color: rgb(0.85, 0.15, 0.15), // Alert Red Color
                    opacity: 0.22,
                    rotate: degrees(45),
                });
                
                // LAYER 3: Source Tracker
                page.drawText('Property of ggoodwilltrust.org', {
                    x: width / 2 - 150, 
                    y: height / 2 - 110,
                    size: 15,
                    font: boldFont,
                    color: rgb(0.4, 0.4, 0.4), // Sophisticated Grey
                    opacity: 0.25,
                    rotate: degrees(45),
                });
            });

            // 4. Nayi PDF banakar user ko dena
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `${title}_Secured_G_Goodwill_Trust.pdf`); // Download file name me bhi 'Secured' add kar diya
            
            toast.success("Document Secured & Downloaded!");
        } catch (error) {
            console.error("Download Error:", error);
            toast.error("Failed to secure and download document.");
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredDocs = activeTab === 'All' ? documents : documents.filter(doc => doc.category === activeTab);

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
                        Transparency & Trust
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Official <span className="text-[#2081e2]">Documents</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Access our reports and legal certificates. All downloaded copies are digitally watermarked to prevent unauthorized misuse.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                                activeTab === category 
                                ? 'bg-[#2081e2] text-white border-[#2081e2] shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-[#2081e2]'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid Area */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-[#2081e2] animate-spin" />
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-4 bg-blue-50 rounded-xl text-[#2081e2] group-hover:scale-110 transition-transform duration-300 shrink-0">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-3">
                                            <span className="text-[#2081e2] bg-blue-50 px-2 py-0.5 rounded-md">{doc.category || "General"}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">{doc.description}</p>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
                                    <a 
                                        href={doc.fileUrl || doc.file_url}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#2081e2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
                                    >
                                        <Eye className="w-4 h-4" /> View Normal
                                    </a>
                                    
                                    <button 
                                        onClick={() => handleWatermarkDownload(doc.fileUrl || doc.file_url, doc.title, doc.id)}
                                        disabled={downloadingId === doc.id}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-2.5 border border-slate-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {downloadingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin text-[#2081e2]" /> : <Download className="w-4 h-4 text-[#2081e2]" />}
                                        <span className="hidden sm:inline">Secure Download</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsPage;