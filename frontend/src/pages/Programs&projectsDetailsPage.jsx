import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Calendar, 
    MapPin, 
    Users, 
    Heart, 
    Share2, 
    DollarSign,
    Loader2,
    ImageIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const ProgramDetailsPage = () => {
    const { id } = useParams(); 
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProgramDetails();
    }, [id]);

    const fetchProgramDetails = async () => {
        try {
            setLoading(true);
            // FIX 1: Table ka naam 'programs_projects' update kar diya
            const { data, error } = await supabase
                .from('programs_projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProgram(data);
        } catch (error) {
            console.error('Error fetching program details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Loader State
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0f1c]">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                </div>
                <p className="text-slate-400 mt-4 font-medium animate-pulse">Loading details...</p>
            </div>
        );
    }

    // Error / Not Found State
    if (!program) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0f1c] gap-4">
                <h2 className="text-3xl font-bold text-white mb-2">Program Not Found</h2>
                <p className="text-slate-400 mb-6">The initiative you are looking for does not exist or has been removed.</p>
                <Link to="/programs-projects" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                    Go Back to Programs
                </Link>
            </div>
        );
    }

    // Cover Image Fallback
    const coverImage = program.image_urls && program.image_urls.length > 0 
        ? program.image_urls[0] 
        : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop";

    // Animations
    const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

    return (
        <div className="bg-[#0a0f1c] min-h-screen pb-20 font-sans selection:bg-blue-500/30 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* 1. Hero Banner Section */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-slate-900 border-b border-white/10">
                <img 
                    src={coverImage} 
                    alt={program.title} 
                    className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/60 to-transparent"></div>
                
                {/* Back Button & Share */}
                <div className="absolute top-8 left-6 md:left-12 flex justify-between w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] z-20">
                    <Link 
                        to="/programs-projects" // FIX 2: Correct route
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-white/20 transition-all hover:-translate-x-1"
                    >
                        <ArrowLeft size={16} /> Back to Programs
                    </Link>
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white shadow-lg hover:bg-white/20 transition-all">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Hero Title */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto right-0 z-20">
                    <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-sm">
                        {program.category || "Social Initiative"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                        {program.title}
                    </h1>
                </motion.div>
            </div>

            {/* 2. Main Grid Layout */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* Left & Center: Program Details */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Quick Stats Grid */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/10">
                            <div className="flex items-center gap-4 p-2">
                                <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-2xl text-blue-400"><MapPin size={22} /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-sm font-bold text-white truncate">
                                        {program.location || "India"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-2 border-t sm:border-t-0 sm:border-x border-white/10">
                                <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400"><Users size={22} /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-sm font-bold text-white">
                                        {program.status || "Active & Ongoing"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-2 border-t sm:border-t-0 border-white/10">
                                <div className="bg-rose-500/20 border border-rose-500/30 p-3 rounded-2xl text-rose-400"><Calendar size={22} /></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Launched In</p>
                                    <p className="text-sm font-bold text-white">
                                        {program.created_at ? new Date(program.created_at).getFullYear() : "Recently"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* About/Description Section */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <Heart className="text-rose-500" size={28} /> About the Initiative
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {program.description}
                            </p>
                        </motion.div>

                        {/* Rich Image Gallery */}
                        {program.image_urls && program.image_urls.length > 0 && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                    <ImageIcon className="text-cyan-400" size={28} /> Ground Reality
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {program.image_urls.map((img, index) => (
                                        <div key={index} className="rounded-2xl overflow-hidden shadow-lg border border-white/10 group aspect-video relative bg-slate-900">
                                            <img 
                                                src={img} 
                                                alt={`${program.title} - ${index + 1}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </div>

                    {/* Right: Sticky Donation/Action Sidebar */}
                    <div className="lg:sticky lg:top-32 space-y-6 z-20">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-gradient-to-b from-blue-900/40 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-blue-500/20 text-center relative overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                            
                            <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <DollarSign size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Support this Cause</h3>
                            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                                Your small contribution can create a huge impact. Join hands with G Goodwill Trust to support this initiative.
                            </p>
                            
                            <Link 
                                to="/donate" 
                                className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:-translate-y-1 transition-all text-lg mb-4"
                            >
                                Donate Now
                            </Link>
                            
                            <Link 
                                to="/contact" 
                                className="block w-full text-center bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Volunteer with Us
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProgramDetailsPage;