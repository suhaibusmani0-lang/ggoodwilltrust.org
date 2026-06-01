import React, { useState, useEffect } from 'react';
import { Briefcase, LogOut, Plus, Loader2, Trash2, Edit, X, Search, Activity, FileText, UploadCloud, ChevronRight, IndianRupee, Calendar, CreditCard, ShieldCheck, Award, Hash } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('programs_projects');
    
    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Reports');
    const [enrollmentNo, setEnrollmentNo] = useState(''); 
    const [dob, setDob] = useState(''); 
    const [files, setFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    
    // Data States
    const [itemsList, setItemsList] = useState([]); 
    const [donationsList, setDonationsList] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [stats, setStats] = useState({ programs_projects: 0, documents: 0, certificates_results: 0, totalDonations: 0 }); 
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [editingId, setEditingId] = useState(null); 

    useEffect(() => {
        fetchItems();
        fetchStats();
        resetForm();
        setSearchQuery(''); 
    }, [activeTab]);

    // --- 1. PRO STATS (Supabase Connected) ---
    const fetchStats = async () => {
        try {
            const [
                { count: ppCount }, 
                { count: docCount }, 
                { count: certCount }
            ] = await Promise.all([
                supabase.from('programs_projects').select('*', { count: 'exact', head: true }),
                supabase.from('documents').select('*', { count: 'exact', head: true }),
                supabase.from('certificates_results').select('*', { count: 'exact', head: true })
            ]);

            // Fetch Total Donations Amount from Supabase Directly
            let totalAmt = 0;
            const { data: donData, error: donError } = await supabase.from('donations').select('amount');
            if (!donError && donData) {
                totalAmt = donData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
            }

            setStats({ 
                programs_projects: ppCount || 0, 
                documents: docCount || 0, 
                certificates_results: certCount || 0,
                totalDonations: totalAmt
            });
        } catch (error) {
            console.error("Stats Error:", error);
        }
    };

    // --- 2. FETCH DATA (Supabase Connected) ---
    const fetchItems = async () => {
        setFetching(true);
        try {
            if (activeTab === 'donations') {
                // Fetching from Supabase instead of Node.js API
                const { data, error } = await supabase.from('donations').select('*').order('date', { ascending: false });
                if (error) throw error;
                setDonationsList(data || []);
            } else {
                const { data, error } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setItemsList(data || []);
            }
        } catch (error) {
            toast.error(`Failed to load ${activeTab} data!`);
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Reports');
        setEnrollmentNo('');
        setDob('');
        setFiles([]);
        setImagePreviews([]);
        setEditingId(null);
        if(document.getElementById('file-upload')) document.getElementById('file-upload').value = ''; 
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        if (activeTab === 'programs_projects') {
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

    // --- 3. DELETE ---
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

    // --- 4. EDIT ---
    const handleEditClick = (item) => {
        setEditingId(item.id);
        setTitle(item.title || item.name);
        setDescription(item.description || '');
        if (activeTab === 'documents') setCategory(item.category || 'Reports');
        if (activeTab === 'certificates_results') {
            setEnrollmentNo(item.enrollment_no || '');
            setDob(item.dob || '');
        }
        setFiles([]); 
        setImagePreviews([]); 
        document.getElementById('file-upload').value = ''; 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        toast.info("Edit mode active. Upload a new file to replace the old one.");
    };

    // --- 5. SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!title) return toast.error("Title/Name is required!");
        if (!editingId && files.length === 0) return toast.error(`Please provide a ${activeTab === 'programs_projects' ? 'Image' : 'PDF File'}!`);

        setLoading(true);
        try {
            let finalImageUrls = null;
            let finalSingleFileUrl = null;

            if (files.length > 0) {
                if (activeTab === 'documents' || activeTab === 'certificates_results') {
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

            if (activeTab === 'programs_projects') {
                tableData.description = description;
                if (finalImageUrls) tableData.image_urls = finalImageUrls;
            } else if (activeTab === 'documents') {
                tableData.description = description;
                tableData.category = category;
                if (finalSingleFileUrl) tableData.file_url = finalSingleFileUrl;
            } else if (activeTab === 'certificates_results') {
                tableData.enrollment_no = enrollmentNo;
                tableData.dob = dob;
                tableData.description = description;
                if (finalSingleFileUrl) tableData.file_url = finalSingleFileUrl;
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

    // Filtering Logic
    const filteredItems = activeTab === 'donations'
        ? donationsList.filter(item => 
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.receipt_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.payment_id?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : itemsList.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.enrollment_no?.toLowerCase().includes(searchQuery.toLowerCase())
          );

    // Animations
    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex flex-col md:flex-row font-sans selection:bg-blue-500/30 overflow-hidden relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Premium Sidebar */}
            <div className="w-full md:w-72 bg-[#060913] border-r border-white/5 flex flex-col shadow-2xl z-20 relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
                
                <div className="p-8 text-center border-b border-white/5 relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 mb-4 shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">ADMIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">PRO</span></h2>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em] font-bold">G Goodwill Trust</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 mt-4 relative z-10">
                    {[
                        { id: 'programs_projects', icon: Briefcase, label: 'Programs & Projects' },
                        { id: 'documents', icon: FileText, label: 'Documents' },
                        { id: 'certificates_results', icon: Award, label: 'Certificates & Results' },
                        { id: 'donations', icon: IndianRupee, label: 'Donations' }
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20 border border-blue-500/30' : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'}`}>
                            <div className="flex items-center gap-3">
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} /> 
                                <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-70" />}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 relative z-10">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm tracking-wide shadow-lg hover:shadow-rose-500/20">
                        <LogOut className="w-4 h-4" /> Secure Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto z-10">
                <div className="max-w-7xl mx-auto p-6 md:p-10">
                    
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white capitalize tracking-tight">
                                {activeTab.replace('_', ' ')}
                            </h1>
                            <p className="text-slate-400 mt-2 font-medium">
                                {activeTab === 'donations' ? 'Track all incoming contributions securely.' : 'Control and publish content directly to your live platform.'}
                            </p>
                        </div>
                    </motion.div>

                    {/* --- STATS DASHBOARD --- */}
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Total Funds', count: `₹${stats.totalDonations.toLocaleString('en-IN')}`, icon: IndianRupee, border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400' },
                            { label: 'Progs & Projects', count: stats.programs_projects, icon: Briefcase, border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
                            { label: 'Documents', count: stats.documents, icon: FileText, border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
                            { label: 'Certificates', count: stats.certificates_results, icon: Award, border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
                        ].map((stat, idx) => (
                            <motion.div key={idx} variants={itemVariants} className={`bg-white/[0.02] backdrop-blur-xl p-5 rounded-2xl border ${stat.border} shadow-lg relative overflow-hidden group hover:bg-white/[0.04] transition-all`}>
                                <div className="flex flex-col gap-4 relative z-10">
                                    <div className={`w-10 h-10 ${stat.bg} ${stat.text} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">{stat.count}</h3>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* --- FORM SECTION --- */}
                    <AnimatePresence mode='wait'>
                        {activeTab !== 'donations' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl border mb-10 transition-all duration-500 relative overflow-hidden ${editingId ? 'bg-blue-900/10 border-blue-500/50' : 'bg-white/[0.03] border-white/10'}`}>
                                {editingId && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                                
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-extrabold flex items-center gap-3 text-white capitalize">
                                        <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                                            {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                                        </div>
                                        {editingId ? 'Edit Existing Item' : `Create New ${activeTab.replace('_', ' ').slice(0, -1)}`}
                                    </h2>
                                    {editingId && (
                                        <button type="button" onClick={resetForm} className="text-sm font-bold text-rose-400 hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30">
                                            <X className="w-4 h-4"/> Cancel Edit
                                        </button>
                                    )}
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Standard Title Field */}
                                        <div className={activeTab === 'documents' ? 'col-span-1' : 'col-span-2'}>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                {activeTab === 'certificates_results' ? 'Student Name' : 'Title'}
                                            </label>
                                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-black/30 text-white outline-none transition-all placeholder:text-slate-600" placeholder={activeTab === 'certificates_results' ? "Enter Student Full Name" : "Enter an engaging title..."} />
                                        </div>

                                        {/* Dynamic Fields based on Tab */}
                                        {activeTab === 'documents' && (
                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-black/30 text-white outline-none transition-all cursor-pointer appearance-none">
                                                    <option value="Reports" className="bg-slate-900">Reports</option>
                                                    <option value="Certificates" className="bg-slate-900">Certificates</option>
                                                    <option value="Policies" className="bg-slate-900">Policies</option>
                                                </select>
                                            </div>
                                        )}

                                        {activeTab === 'certificates_results' && (
                                            <>
                                                <div className="col-span-1 relative group">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Enrollment Number</label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400" />
                                                        <input type="text" required value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} className="w-full pl-12 pr-5 py-4 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-black/30 text-white outline-none transition-all placeholder:text-slate-600 uppercase" placeholder="e.g. GGT2026101" />
                                                    </div>
                                                </div>
                                                <div className="col-span-1 relative group">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400" />
                                                        <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} style={{ colorScheme: 'dark' }} className="w-full pl-12 pr-5 py-4 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-black/30 text-slate-300 outline-none transition-all" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            {activeTab === 'certificates_results' ? 'Course / Grade Details' : 'Description'}
                                        </label>
                                        <textarea rows="3" required={activeTab === 'documents'} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-black/30 text-white outline-none transition-all resize-none placeholder:text-slate-600" placeholder="Write comprehensive details here..."></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            {editingId ? 'Replace Media (Leave empty to keep current)' : 'Media Upload'}
                                        </label>
                                        <div className="relative border-2 border-dashed border-white/20 rounded-2xl hover:border-blue-500/50 bg-black/20 hover:bg-blue-500/5 transition-all duration-300 group overflow-hidden">
                                            <input id="file-upload" type="file" accept={activeTab === 'programs_projects' ? "image/*" : ".pdf"} multiple={activeTab === 'programs_projects'} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="p-10 text-center flex flex-col items-center justify-center pointer-events-none">
                                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <UploadCloud className="w-8 h-8 text-blue-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-300 mb-1">Drag and drop your files here, or click to browse</p>
                                                <p className="text-xs text-slate-500">{activeTab === 'programs_projects' ? 'PNG, JPG, WEBP up to 5MB (Multiple Allowed)' : 'PDF files only up to 10MB'}</p>
                                            </div>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {imagePreviews.length > 0 && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 flex gap-4 overflow-x-auto py-2">
                                                    {imagePreviews.map((src, idx) => (
                                                        <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg border border-white/20">
                                                            <img src={src} alt="preview" className="h-24 w-24 object-cover" />
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {files.length > 0 && activeTab !== 'programs_projects' && (
                                            <div className="mt-4 flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-sm">
                                                <FileText className="w-5 h-5" /> Selected: {files[0].name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" disabled={loading} className={`w-full md:w-auto flex items-center justify-center gap-3 text-white px-10 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border ${editingId ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border-transparent' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}>
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Published Item" : "Publish to Live Website")}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- TABLE SECTION --- */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden mb-20">
                        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
                                <div className={`p-2 rounded-lg border ${activeTab === 'donations' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {activeTab === 'donations' ? <CreditCard className="w-5 h-5"/> : <Activity className="w-5 h-5"/>}
                                </div>
                                {activeTab === 'donations' ? 'Recent Transactions' : 'Live Database'}
                            </h2>
                            <div className="relative group w-full sm:w-72">
                                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
                                <input type="text" placeholder={activeTab === 'donations' ? "Search by name, email or receipt no..." : "Search title or enroll ID..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-black/30 text-white placeholder:text-slate-600 transition-all" />
                            </div>
                        </div>
                        
                        {fetching ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                                <p className="text-slate-400 font-bold animate-pulse">Syncing with database...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white">No matching records found</h3>
                                <p className="text-slate-500 mt-1 max-w-sm">Try adjusting your search query.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        {activeTab === 'donations' ? (
                                            <tr className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold border-b border-white/5">
                                                <th className="p-5 w-32">Date</th>
                                                <th className="p-5">Donor Details</th>
                                                <th className="p-5">Amount</th>
                                                <th className="p-5 text-right">Receipt / Trans ID</th>
                                                <th className="p-5 text-right">Action</th>
                                            </tr>
                                        ) : activeTab === 'certificates_results' ? (
                                            <tr className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold border-b border-white/5">
                                                <th className="p-5 w-24">Media</th>
                                                <th className="p-5">Student Info</th>
                                                <th className="p-5">Enrollment No.</th>
                                                <th className="p-5 text-right">Actions</th>
                                            </tr>
                                        ) : (
                                            <tr className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold border-b border-white/5">
                                                <th className="p-5 w-24">Media</th>
                                                <th className="p-5">Details</th>
                                                {activeTab === 'documents' && <th className="p-5">Category</th>}
                                                <th className="p-5 text-right">Actions</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence>
                                            {filteredItems.map((item) => (
                                                <motion.tr 
                                                    key={item.id} 
                                                    initial={{ opacity: 0, y: 10 }} 
                                                    animate={{ opacity: 1, y: 0 }} 
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="hover:bg-white/[0.04] transition-colors group"
                                                >
                                                    {activeTab === 'donations' ? (
                                                        <>
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm">
                                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </div>
                                                            </td>
                                                            <td className="p-5">
                                                                <p className="font-extrabold text-white text-base">{item.name}</p>
                                                                <p className="text-slate-400 text-sm mt-1 font-medium">{item.email || item.phone || 'No Contact Info'}</p>
                                                            </td>
                                                            <td className="p-5">
                                                                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-extrabold tracking-wide border border-emerald-500/20 flex items-center w-max gap-1">
                                                                    ₹{item.amount?.toLocaleString('en-IN')}
                                                                </span>
                                                            </td>
                                                            <td className="p-5 text-right">
                                                                <div className="flex flex-col items-end gap-1">
                                                                    <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                                                        {item.receipt_no}
                                                                    </span>
                                                                    {item.payment_id && (
                                                                        <span className="font-mono text-[10px] text-slate-500">
                                                                            {item.payment_id}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-5 text-right">
                                                                <button onClick={() => handleDelete(item.id)} className="text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm" title="Delete">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="p-5">
                                                                {activeTab !== 'programs_projects' ? (
                                                                    <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20 shadow-sm">
                                                                        <FileText className="w-6 h-6" />
                                                                    </div>
                                                                ) : (
                                                                    <img src={item.image_urls?.[0] || 'https://via.placeholder.com/150'} alt="thumb" className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow-sm" />
                                                                )}
                                                            </td>
                                                            
                                                            <td className="p-5">
                                                                <p className="font-extrabold text-white text-base">{item.title}</p>
                                                                {activeTab === 'certificates_results' ? (
                                                                    <p className="text-slate-400 text-sm mt-1 font-medium">DOB: {item.dob}</p>
                                                                ) : (
                                                                    <p className="text-slate-400 text-sm mt-1 max-w-xs truncate font-medium">{item.description}</p>
                                                                )}
                                                            </td>
                                                            
                                                            {activeTab === 'documents' && (
                                                                <td className="p-5">
                                                                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border border-blue-500/20">{item.category}</span>
                                                                </td>
                                                            )}

                                                            {activeTab === 'certificates_results' && (
                                                                <td className="p-5">
                                                                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded uppercase">
                                                                        {item.enrollment_no}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            
                                                            <td className="p-5 text-right">
                                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => handleEditClick(item)} className="text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-500/20 p-2.5 rounded-xl transition-all duration-300 shadow-sm" title="Edit">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(item.id)} className="text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 p-2.5 rounded-xl transition-all duration-300 shadow-sm" title="Delete">
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