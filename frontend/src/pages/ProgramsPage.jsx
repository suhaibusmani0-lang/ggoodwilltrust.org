import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgram, setSelectedProgram] = useState(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-[#2081e2]">Programs</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We run dedicated programs to address the fundamental needs of underprivileged communities.
                    </p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-[#2081e2] animate-spin" />
                    </div>
                ) : programs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        No programs uploaded yet. Add some from the Admin Panel!
                    </div>
                ) : (
                    /* Beautiful Grid of Cards */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program) => (
                            <div 
                                key={program.id} 
                                onClick={() => setSelectedProgram(program)}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col border border-gray-100"
                            >
                                <div className="h-56 overflow-hidden relative bg-gray-100">
                                    {program.image_urls && program.image_urls.length > 0 ? (
                                        <img 
                                            src={program.image_urls[0]} 
                                            alt={program.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{program.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{program.description}</p>
                                    <button className="text-[#2081e2] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all w-fit">
                                        View Details <ArrowRight className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FULL DETAILS MODAL (Popup) */}
            {selectedProgram && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setSelectedProgram(null)}></div>
                    
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setSelectedProgram(null)} 
                            className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 hover:text-red-600 p-2 rounded-full transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-6 md:p-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedProgram.title}</h2>
                            
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-8 text-lg">
                                {selectedProgram.description}
                            </p>

                            {selectedProgram.image_urls && selectedProgram.image_urls.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Program Gallery</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedProgram.image_urls.map((img, idx) => (
                                            <img 
                                                key={idx} 
                                                src={img} 
                                                alt={`${selectedProgram.title} ${idx + 1}`} 
                                                className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramsPage;