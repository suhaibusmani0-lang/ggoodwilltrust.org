import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight, Briefcase, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProgramsAndProjectsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            // FIX 1: Table ka naam 'programs_projects' kar diya hai
            const { data, error } = await supabase.from('programs_projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Animations
    const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
    const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30 overflow-hidden relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
                        <Briefcase className="text-blue-400 w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Our <span className="text-blue-500">Programs & Projects</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Discover the initiatives we run to address the fundamental needs of underprivileged communities and create a lasting impact.
                    </p>
                </motion.div>
                
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-slate-400 mt-4 font-medium animate-pulse">Loading initiatives...</p>
                    </div>
                ) : programs.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
                        <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Programs Found</h3>
                        <p className="text-slate-400">Add some programs from the Admin Panel to see them here!</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {programs.map((program) => (
                            // FIX 2: Link route ko App.jsx ke hisaab se update kiya
                            <Link 
                                key={program.id} 
                                to={`/programs-projects/${program.id}`}
                                className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
                            >
                                <div className="h-60 overflow-hidden relative bg-slate-900 border-b border-white/5">
                                    {program.image_urls && program.image_urls.length > 0 ? (
                                        <img 
                                            src={program.image_urls[0]} 
                                            alt={program.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-black/20">
                                            <Briefcase className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/20 to-transparent opacity-80" />
                                </div>
                                
                                <div className="p-8 flex-1 flex flex-col relative">
                                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                        {program.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {program.description}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-white/10 mt-auto">
                                        <span className="text-blue-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all w-fit">
                                            Read Full Story <ArrowRight className="w-4 h-4"/>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProgramsAndProjectsPage;