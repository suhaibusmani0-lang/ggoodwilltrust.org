import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Briefcase, Heart, LogOut, Plus, Loader2, Trash2, Edit, X, Search, Activity, FileText, UploadCloud, ChevronRight, IndianRupee, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    
    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Reports');
    const [files, setFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    
    // Pro Features States
    const [itemsList, setItemsList] = useState([]); 
    const [donationsList, setDonationsList] = useState([]); // Naya state donations ke liye
    const [searchQuery, setSearchQuery] = useState(''); 
    const [stats, setStats] = useState({ projects: 0, programs: 0, gallery: 0, documents: 0, totalDonations: 0 }); 
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [editingId, setEditingId] = useState(null); 

    useEffect(() => {
        fetchItems();
        fetchStats();
        resetForm();
        setSearchQuery(''); // Tab change hone par search clear
    }, [activeTab]);

    // --- 1. PRO STATS (Supabase + Node Backend) ---
    const fetchStats = async () => {
        try {
            // Supabase se counts lana
            const [
                { count: projCount }, 
                { count: progCount }, 
                { count: galCount },
                { count: docCount }
            ] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('programs').select('*', { count: 'exact', head: true }),
                supabase.from('gallery').select('*', { count: 'exact', head: true }),
                supabase.from('documents').select('*', { count: 'exact', head: true })
            ]);

            // Node.js Backend se Donations lana stats ke liye
            let totalAmt = 0;
            try {
                const res = await fetch('http://localhost:5000/api/donations');
                if (res.ok) {
                    const d = await res.json();
                    totalAmt = d.reduce((sum, item) => sum + (item.amount || 0), 0);
                }
            } catch (err) {
                console.log("Donations backend offline or not reachable for stats.");
            }

            setStats({ 
                projects: projCount || 0, 
                programs: progCount || 0, 
                gallery: galCount || 0, 
                documents: docCount || 0,
                totalDonations: totalAmt
            });
        } catch (error) {
            console.error("Stats Error:", error);
        }
    };

    // --- 2. FETCH DATA ---
    const fetchItems = async () => {
        setFetching(true);
        try {
            if (activeTab === 'donations') {
                // Fetching from Node.js (MongoDB)
                const response = await fetch('http://localhost:5000/api/donations');
                if (!response.ok) throw new Error("Failed to fetch donations");
                const data = await response.json();
                setDonationsList(data);
            } else {
                // Fetching from Supabase
                const { data, error } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setItemsList(data || []);
            }
        } catch (error) {
            toast.error(`Failed to load ${activeTab} data! Make sure backend is running.`);
        } finally {
            setFetching(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Reports');
        setFiles([]);
        setImagePreviews([]);
        setEditingId(null);
        if(document.getElementById('file-upload')) document.getElementById('file-upload').value = ''; 
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        if (activeTab !== 'documents') {
            const previews = selectedFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        } else {
            setImagePreviews([]);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    // --- 3. DELETE (Supabase Only) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this permanently?")) return;
        try {
            const { error } = await supabase.from(activeTab).delete().eq('id', id);
            if (error) throw error;
            toast.success("Item Deleted Successfully!");
            fetchItems();
            fetchStats();
        } catch (error) {
            toast.error("Error deleting item!");
        }
    };

    // --- 4. EDIT (Supabase Only) ---
    const handleEditClick = (item) => {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description || '');
        if (activeTab === 'documents') setCategory(item.category || 'Reports');
        setFiles([]); 
        setImagePreviews([]); 
        document.getElementById('file-upload').value = ''; 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        toast.info("Edit mode active. Make your changes.");
    };

    // --- 5. SUBMIT (Supabase Only) ---
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!title) return toast.error("Title is required!");
        if (!editingId && files.length === 0) return toast.error(`Please provide a ${activeTab === 'documents' ? 'PDF File' : 'Image'}!`);

        setLoading(true);
        try {
            let finalImageUrls = null;
            let finalSingleFileUrl = null;

            if (files.length > 0) {
                if (activeTab === 'gallery' || activeTab === 'documents') {
                    const file = files[0];
                    const filePath = `${activeTab}/${Date.now()}.${file.name.split('.').pop()}`;
                    const { error: uploadError } = await supabase.storage.from('ngo-images').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    finalSingleFileUrl = supabase.storage.from('ngo-images').getPublicUrl(filePath).data.publicUrl;
                } else {
                    const uploadedUrls = [];
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const filePath = `${activeTab}/${Date.now()}_${i}.${file.name.split('.').pop()}`;
                        await supabase.storage.from('ngo-images').upload(filePath, file);
                        uploadedUrls.push(supabase.storage.from('ngo-images').getPublicUrl(filePath).data.publicUrl);
                    }
                    finalImageUrls = uploadedUrls;
                }
            }

            const tableData = { title: title };
            if (activeTab !== 'gallery') tableData.description = description;

            if (activeTab === 'gallery' && finalSingleFileUrl) {
                tableData.image_url = finalSingleFileUrl;
            } else if (activeTab === 'documents') {
                tableData.category = category;
                if (finalSingleFileUrl) tableData.file_url = finalSingleFileUrl;
            } else if (activeTab !== 'gallery' && activeTab !== 'documents' && finalImageUrls) {
                tableData.image_urls = finalImageUrls;
            }

            if (editingId) {
                await supabase.from(activeTab).update(tableData).eq('id', editingId);
                toast.success("Updated Successfully!");
            } else {
                await supabase.from(activeTab).insert([tableData]);
                toast.success("Uploaded Successfully!");
            }

            resetForm();
            fetchItems(); 
            fetchStats();
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Filtering Logic based on active tab
    const filteredItems = activeTab === 'donations'
        ? donationsList.filter(item => 
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.paymentId?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : itemsList.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Animation Variants
    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* Premium Sidebar */}
            <div className="w-full md:w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>
                
                <div className="p-8 text-center border-b border-slate-800/80 relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 mb-4 shadow-lg shadow-indigo-500/30">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ADMIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">PRO</span></h2>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">Spread Smiles</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 mt-6 relative z-10">
                    {[
                        { id: 'projects', icon: Briefcase, label: 'Projects' },
                        { id: 'programs', icon: Heart, label: 'Programs' },
                        { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
                        { id: 'documents', icon: FileText, label: 'Documents' },
                        { id: 'donations', icon: IndianRupee, label: 'Donations' } // 💰 NEW TAB
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                            <div className="flex items-center gap-3">
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} /> 
                                <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-70" />}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800/80 relative z-10">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm tracking-wide">
                        <LogOut className="w-4 h-4" /> Secure Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto bg-[#f8fafc]">
                <div className="max-w-7xl mx-auto p-6 md:p-10">
                    
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 capitalize tracking-tight">
                                {activeTab === 'donations' ? 'Donation Records' : `Manage ${activeTab}`}
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">
                                {activeTab === 'donations' ? 'Track all incoming contributions and donor details.' : 'Control and publish content directly to your live platform.'}
                            </p>
                        </div>
                    </motion.div>

                    {/* --- STATS DASHBOARD --- */}
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                        {[
                            { label: 'Total Funds', count: `₹${stats.totalDonations.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-amber-500 to-orange-400', bg: 'bg-amber-50', text: 'text-amber-600' },
                            { label: 'Projects', count: stats.projects, icon: Briefcase, color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-600' },
                            { label: 'Programs', count: stats.programs, icon: Heart, color: 'from-rose-500 to-pink-400', bg: 'bg-rose-50', text: 'text-rose-600' },
                            { label: 'Gallery', count: stats.gallery, icon: ImageIcon, color: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', text: 'text-violet-600' },
                            { label: 'Documents', count: stats.documents, icon: FileText, color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-600' }
                        ].map((stat, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                                <div className="flex flex-col gap-4 relative z-10">
                                    <div className={`w-10 h-10 ${stat.bg} ${stat.text} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black text-slate-800 ${idx === 0 ? 'text-amber-600' : ''}`}>{stat.count}</h3>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* --- FORM SECTION (Hidden for Donations Tab) --- */}
                    <AnimatePresence mode='wait'>
                        {activeTab !== 'donations' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border mb-10 transition-all duration-500 relative overflow-hidden ${editingId ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white border-slate-200/60'}`}>
                                {editingId && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>}
                                
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className={`text-2xl font-extrabold flex items-center gap-3 ${editingId ? 'text-indigo-700' : 'text-slate-800'}`}>
                                        <div className={`p-2 rounded-lg ${editingId ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                                        </div>
                                        {editingId ? 'Edit Existing Item' : `Create New ${activeTab.slice(0, -1)}`}
                                    </h2>
                                    {editingId && (
                                        <button type="button" onClick={resetForm} className="text-sm font-bold text-slate-500 hover:text-red-500 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 hover:bg-red-50">
                                            <X className="w-4 h-4"/> Cancel Edit
                                        </button>
                                    )}
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className={activeTab === 'documents' ? 'col-span-1' : 'col-span-2'}>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50 font-medium text-slate-800 outline-none transition-all" placeholder="Enter an engaging title..." />
                                        </div>

                                        {activeTab === 'documents' && (
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50 font-medium text-slate-800 outline-none transition-all cursor-pointer">
                                                    <option value="Reports">Reports</option>
                                                    <option value="Certificates">Certificates</option>
                                                    <option value="Policies">Policies</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {activeTab !== 'gallery' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                            <textarea rows="4" required={activeTab === 'documents'} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/50 font-medium text-slate-800 outline-none transition-all resize-none" placeholder="Write the comprehensive details here..."></textarea>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            {editingId ? 'Replace Media (Leave empty to keep current)' : 'Media Upload'}
                                        </label>
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all duration-300 group overflow-hidden">
                                            <input id="file-upload" type="file" accept={activeTab === 'documents' ? ".pdf" : "image/*"} multiple={activeTab !== 'gallery' && activeTab !== 'documents'} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="p-10 text-center flex flex-col items-center justify-center pointer-events-none">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="w-8 h-8 text-indigo-500" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 mb-1">Drag and drop your files here, or click to browse</p>
                                                <p className="text-xs text-slate-500">{activeTab === 'documents' ? 'PDF files only up to 10MB' : 'PNG, JPG, WEBP up to 5MB'}</p>
                                            </div>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {imagePreviews.length > 0 && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 flex gap-4 overflow-x-auto py-2">
                                                    {imagePreviews.map((src, idx) => (
                                                        <div key={idx} className="relative rounded-xl overflow-hidden shadow-md border border-slate-200">
                                                            <img src={src} alt="preview" className="h-24 w-24 object-cover" />
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {files.length > 0 && activeTab === 'documents' && (
                                            <div className="mt-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold text-sm">
                                                <FileText className="w-5 h-5" /> Selected: {files[0].name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" disabled={loading} className={`w-full md:w-auto flex items-center justify-center gap-3 text-white px-10 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${editingId ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/30' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20'}`}>
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Published Item" : "Publish to Live Website")}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- TABLE SECTION --- */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden mb-20">
                        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-xl">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeTab === 'donations' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {activeTab === 'donations' ? <CreditCard className="w-5 h-5"/> : <Activity className="w-5 h-5"/>}
                                </div>
                                {activeTab === 'donations' ? 'Recent Transactions' : 'Live Database'}
                            </h2>
                            <div className="relative group w-full sm:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                                <input type="text" placeholder={activeTab === 'donations' ? "Search by name, email or ID..." : "Quick search..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-slate-50/50 transition-all" />
                            </div>
                        </div>
                        
                        {fetching ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                                <p className="text-slate-500 font-bold animate-pulse">Syncing with database...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">No matching records found</h3>
                                <p className="text-slate-500 mt-1 max-w-sm">Try adjusting your search query.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        {activeTab === 'donations' ? (
                                            <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-200/60">
                                                <th className="p-5 w-32">Date</th>
                                                <th className="p-5">Donor Details</th>
                                                <th className="p-5">Amount</th>
                                                <th className="p-5 text-right">Transaction ID</th>
                                            </tr>
                                        ) : (
                                            <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-200/60">
                                                <th className="p-5 w-24">Media</th>
                                                <th className="p-5">Details</th>
                                                {activeTab === 'documents' && <th className="p-5">Category</th>}
                                                <th className="p-5 text-right">Actions</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/80">
                                        <AnimatePresence>
                                            {filteredItems.map((item) => (
                                                <motion.tr 
                                                    key={item.id || item.paymentId} 
                                                    initial={{ opacity: 0, y: 10 }} 
                                                    animate={{ opacity: 1, y: 0 }} 
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="hover:bg-slate-50/80 transition-colors group"
                                                >
                                                    {/* --- DONATION TABLE ROW --- */}
                                                    {activeTab === 'donations' ? (
                                                        <>
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </div>
                                                            </td>
                                                            <td className="p-5">
                                                                <p className="font-extrabold text-slate-800 text-base">{item.name}</p>
                                                                <p className="text-slate-500 text-sm mt-1 font-medium">{item.email}</p>
                                                            </td>
                                                            <td className="p-5">
                                                                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-extrabold tracking-wide border border-green-200 flex items-center w-max gap-1">
                                                                    ₹{item.amount.toLocaleString('en-IN')}
                                                                </span>
                                                            </td>
                                                            <td className="p-5 text-right">
                                                                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                                    {item.paymentId}
                                                                </span>
                                                            </td>
                                                        </>
                                                    ) : (
                                                    /* --- REGULAR SUPABASE TABLE ROW --- */
                                                        <>
                                                            <td className="p-5">
                                                                {activeTab === 'documents' ? (
                                                                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm">
                                                                        <FileText className="w-6 h-6" />
                                                                    </div>
                                                                ) : (
                                                                    <img src={activeTab === 'gallery' ? item.image_url : (item.image_urls?.[0] || 'https://via.placeholder.com/150')} alt="thumb" className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
                                                                )}
                                                            </td>
                                                            <td className="p-5">
                                                                <p className="font-extrabold text-slate-800 text-base">{item.title}</p>
                                                                {activeTab !== 'gallery' && (
                                                                    <p className="text-slate-500 text-sm mt-1 max-w-xs truncate font-medium">{item.description}</p>
                                                                )}
                                                            </td>
                                                            {activeTab === 'documents' && (
                                                                <td className="p-5">
                                                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border border-indigo-100">{item.category}</span>
                                                                </td>
                                                            )}
                                                            <td className="p-5 text-right">
                                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => handleEditClick(item)} className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm" title="Edit">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm" title="Delete">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;