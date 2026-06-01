import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, BookOpen, Stethoscope, ArrowRight, 
    ShieldCheck, MapPin, Award, Users, ChevronRight,
    Star, MessageSquareQuote
} from 'lucide-react';

const HomePage = () => {
    // IMAGE SLIDER STATE
    const [index, setIndex] = useState(0);
    const images = [
        "/assets/hompage1.jpg", 
        "/assets/hompage2.jpg", 
        "/assets/hompage3.jpg", 
        "/assets/hompage4.jpg", 
        "/assets/hompage5.jpg"
    ];

    useEffect(() => {
        const timer = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 6000);
        return () => clearInterval(timer);
    }, [images.length]);

    // GOOGLE REVIEWS DATA
    const googleReviews = [
        { 
            name: "Mohd Minhaj", 
            text: "Amazing NGO doing real work on the ground. I have seen them distribute food and organize medical camps in Shaheen Bagh perfectly.", 
            time: "2 weeks ago",
            initial: "M",
            color: "bg-blue-600"
        },
        { 
            name: "Dr. Bushra Shams", 
            text: "Very transparent and dedicated team. Their education and poverty alleviation programs are genuinely changing lives. Highly recommended!", 
            time: "1 month ago",
            initial: "D",
            color: "bg-emerald-600"
        },
        { 
            name: "Suhaib Abbasi", 
            text: "Proud to be associated with G Goodwill Trust. The team is highly motivated and their health camps help hundreds of underprivileged people.", 
            time: "2 months ago",
            initial: "S",
            color: "bg-orange-500"
        },
        { 
            name: "Ayesha Khan", 
            text: "The way they executed the winter relief drive was commendable. True dedication towards humanity. May God bless this foundation.", 
            time: "3 months ago",
            initial: "A",
            color: "bg-rose-600"
        }
    ];

    const scrollingReviews = [...googleReviews, ...googleReviews, ...googleReviews];

    return (
        <div className="bg-[#f8fafc] text-slate-800 font-sans overflow-x-hidden selection:bg-[#0f172a] selection:text-white">
            
            {/* MARQUEE CSS */}
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                        width: max-content;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            {/* 1. PROFESSIONAL HERO SECTION (FIXED PADDING) */}
            {/* Added pt-32 md:pt-48 to push content below the thick header */}
            <section className="relative h-[90svh] min-h-[600px] flex flex-col justify-center pt-32 md:pt-48 overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <img src={images[index]} className="w-full h-full object-cover" alt="G Goodwill Foundation Mission" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent"></div>
                    </motion.div>
                </AnimatePresence>

                {/* Added mt-8 md:mt-16 to ensure text stays clear of the floating header */}
                <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-10 w-full mt-8 md:mt-16">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-orange-500 text-white font-bold tracking-[0.15em] text-xs uppercase mb-6"
                        >
                            Hope Starts Here
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} 
                            className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.1] tracking-tight mb-6"
                        >
                            Empower Lives.<br/>
                            <span className="text-orange-400">Inspire Change.</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} 
                            className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed mb-10 font-medium"
                        >
                            We are committed to bridging the gap between privilege and disadvantage. Join G Goodwill Trust to create sustainable, long-term impact in education and healthcare.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/donate" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-md font-bold tracking-wide transition-colors shadow-md flex items-center justify-center gap-2">
                                Donate Now <Heart size={18} className="fill-current" />
                            </Link>
                            <Link to="/about" className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2">
                                Discover Our Mission <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. CLEAN STATS SECTION */}
            <section className="max-w-[85rem] mx-auto px-4 md:px-8 relative z-20 -mt-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="bg-white rounded-xl shadow-xl border border-slate-100 p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100"
                >
                    {[
                        { num: "2000+", label: "Families Fed", color: "text-orange-500" },
                        { num: "5100", label: "Rakhis Tied", color: "text-blue-600" },
                        { num: "1100+", label: "Awareness Created", color: "text-emerald-600" },
                        { num: "1000+", label: "Health Checks", color: "text-slate-800" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center px-4 pt-4 md:pt-0">
                            <h4 className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.num}</h4>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em]">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* 3. STRUCTURED INTERVENTIONS (PROGRAMS) */}
            <section className="py-24 md:py-32 max-w-[90rem] mx-auto px-6 md:px-10">
                <div className="mb-14 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
                    <div className="max-w-3xl">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Core Focus Areas</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">Our Interventions</h2>
                    </div>
                    <Link to="/programs" className="group inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                        View All Programs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <Link to="/programs" className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="bg-blue-50 p-8 flex justify-center items-center h-48 border-b border-slate-100">
                            <BookOpen size={64} className="text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Education Initiatives</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-grow">Providing scholarships, essential school supplies, and vocational training to cultivate an informed generation.</p>
                            <span className="inline-flex items-center gap-2 font-bold text-blue-600">
                                Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link to="/programs" className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="bg-emerald-50 p-8 flex justify-center items-center h-48 border-b border-slate-100">
                            <Stethoscope size={64} className="text-emerald-600 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Community Camps</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-grow">Organizing medical check-ups, vaccination drives, and vital documentation assistance directly in communities.</p>
                            <span className="inline-flex items-center gap-2 font-bold text-emerald-600">
                                Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>

                    {/* Card 3 */}
                    <Link to="/programs" className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="bg-orange-50 p-8 flex justify-center items-center h-48 border-b border-slate-100">
                            <ShieldCheck size={64} className="text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Poverty Alleviation</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-grow">Delivering essential resources like food and shelter, coupled with long-term financial literacy programs.</p>
                            <span className="inline-flex items-center gap-2 font-bold text-orange-500">
                                Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 4. PROFESSIONAL REVIEWS SECTION */}
            <section className="py-20 bg-white border-y border-slate-200 overflow-hidden relative">
                <div className="max-w-[90rem] mx-auto px-6 md:px-10 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Transparency & Trust</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight">Community Feedback</h2>
                    </div>

                    <a href="https://g.page/r/YOUR_GOOGLE_LINK_HERE/review" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-md hover:bg-slate-50 transition-colors shadow-sm group">
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-black text-slate-900 mr-1">4.9</span>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={`${i === 4 ? 'text-slate-300 fill-slate-300' : 'text-yellow-400 fill-yellow-400'}`} />
                            ))}
                        </div>
                        <div className="h-5 w-px bg-slate-300"></div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Read Google Reviews</span>
                    </a>
                </div>

                {/* MARQUEE CONTAINER */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    <div className="flex gap-6 animate-marquee py-4">
                        {scrollingReviews.map((review, i) => (
                            <div key={i} className="w-[320px] md:w-[380px] shrink-0 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${review.color} text-white flex items-center justify-center font-bold`}>
                                            {review.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium">{review.time}</p>
                                        </div>
                                    </div>
                                    <MessageSquareQuote size={18} className="text-slate-300" />
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} size={12} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CLEAN EVENT CALENDAR */}
            <section className="py-24 bg-slate-50 border-b border-slate-200">
                <div className="max-w-[90rem] mx-auto px-6 md:px-10 mb-12">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Get Involved</span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">Upcoming Events</h2>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 px-6 md:px-10 max-w-[90rem] mx-auto snap-x hide-scrollbar">
                    {[
                        { d: "15", m: "NOV", title: "Winter Relief Distribution", loc: "Delhi Region", type: "Relief Drive" },
                        { d: "25", m: "NOV", title: "Aadhar Document Camp", loc: "Community Center", type: "Assistance" },
                        { d: "02", m: "DEC", title: "Free Health Checkup", loc: "Local Clinic", type: "Healthcare" }
                    ].map((evt, i) => (
                        <div key={i} className="min-w-[320px] md:min-w-[400px] snap-center bg-white border border-slate-200 rounded-xl p-5 flex gap-5 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center min-w-[75px] flex flex-col justify-center">
                                <span className="text-2xl font-black text-slate-800 leading-none mb-1">{evt.d}</span>
                                <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">{evt.m}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{evt.type}</span>
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{evt.title}</h4>
                                <p className="text-slate-500 flex items-center gap-1.5 text-xs mt-2 font-medium"><MapPin size={12}/> {evt.loc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. AUTHORITATIVE CTA SECTION */}
            <section className="py-20 md:py-28 px-6 max-w-[90rem] mx-auto">
                <div className="bg-[#0f172a] rounded-2xl p-10 md:p-16 text-center shadow-xl border border-slate-800 relative overflow-hidden">
                    {/* Subtle Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-blue-500"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                        <Award size={36} className="text-orange-400 mb-6" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Make an Impact Today.</h2>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                            Your contribution directly funds our grassroots initiatives. Become an annual member for ₹1100 and help us sustain our operations throughout the year.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                            <Link to="/join" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-md font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
                                Become a Member 
                            </Link>
                            <Link to="/volunteer" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-md font-bold text-lg transition-colors flex items-center justify-center gap-2">
                                <Users size={20} /> Join as Volunteer
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;