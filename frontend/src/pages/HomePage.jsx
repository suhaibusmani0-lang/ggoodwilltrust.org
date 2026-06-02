import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, BookOpen, Stethoscope, ArrowRight, 
    ShieldCheck, MapPin, Award, Users, ChevronRight,
    Star, MessageSquareQuote
} from 'lucide-react';

const HomePage = () => {
    // --- IMAGE SLIDER ---
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

    // --- DATA ---
    const top3Projects = [
        {
            id: 'edu',
            title: "Education Initiatives",
            description: "Providing merit-based scholarships, school supplies, and vocational training to empower the next generation.",
            icon: <BookOpen size={40} className="text-blue-600" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            hoverBorder: "hover:border-blue-200"
        },
        {
            id: 'health',
            title: "Community Camps",
            description: "Bringing vital healthcare to grassroots levels through medical check-ups and vaccination drives.",
            icon: <Stethoscope size={40} className="text-emerald-600" />,
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            hoverBorder: "hover:border-emerald-200"
        },
        {
            id: 'poverty',
            title: "Poverty Alleviation",
            description: "Delivering immediate relief, monthly ration kits, and long-term support for vulnerable families.",
            icon: <ShieldCheck size={40} className="text-orange-500" />,
            bgColor: "bg-orange-50",
            textColor: "text-orange-500",
            hoverBorder: "hover:border-orange-200"
        }
    ];

    const allReviews = [
        { name: "Mohd Minhaj Alam", text: "Amazing NGO doing real, impactful work on the ground in Shaheen Bagh.", time: "2 weeks ago", initial: "M", color: "bg-slate-800" },
        { name: "Dr. Bushra Shams", text: "Very transparent and dedicated team. Their education programs are genuinely changing lives.", time: "1 month ago", initial: "D", color: "bg-blue-800" },
        { name: "Suhaib Abbasi", text: "Proud to see the impact of G Goodwill Trust. Highly motivated team working for humanity.", time: "2 months ago", initial: "S", color: "bg-emerald-800" },
        { name: "Farid Baig", text: "Commendable relief drives. True dedication towards society. Highly recommended for donations.", time: "3 months ago", initial: "F", color: "bg-orange-700" }
    ];
    
    // Looping for the clean marquee
    const scrollingReviews = [...allReviews, ...allReviews, ...allReviews];

    return (
        <div className="bg-[#fafafa] text-slate-800 font-sans overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
            
            <style>
                {`
                    @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
                    .animate-marquee { animation: marquee 35s linear infinite; width: max-content; }
                    .animate-marquee:hover { animation-play-state: paused; }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>

            {/* --- 1. HERO SECTION (CLEAN & ELEGANT) --- */}
            <section className="relative h-[85svh] min-h-[600px] flex flex-col justify-center pt-24 overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 z-0">
                        <img src={images[index]} className="w-full h-full object-cover" alt="NGO Mission" />
                        {/* Simple, dark overlay for text readability */}
                        <div className="absolute inset-0 bg-slate-900/60"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-orange-400 font-bold tracking-[0.15em] text-xs uppercase mb-6 bg-slate-900/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                            <Heart size={14} className="fill-orange-400" /> Hope Starts Here in New Delhi
                        </span>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                            Empower Lives.<br/>Inspire Change.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed mb-10 font-medium">
                            We are committed to bridging the gap between privilege and disadvantage. Join G Goodwill Trust to create sustainable, long-term impact in education and healthcare.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/donate" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg">
                                Donate Now <ArrowRight size={18} />
                            </Link>
                            <Link to="/about" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold tracking-wide transition-colors flex items-center justify-center gap-2">
                                Discover Our Mission
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. IMPACT STATS (MINIMALIST) --- */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 -mt-12">
                <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {[
                        { num: "2000+", label: "Families Fed" },
                        { num: "5100+", label: "Rakhis Tied" },
                        { num: "1100+", label: "Awareness Created" },
                        { num: "1000+", label: "Health Checks" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center px-4 pt-6 md:pt-0">
                            <h4 className="text-4xl md:text-5xl font-black mb-2 text-slate-900">{stat.num}</h4>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 3. OUR INTERVENTIONS (SPACIOUS & PROFESSIONAL) --- */}
            <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Interventions</h2>
                        <p className="text-slate-500 mt-2 text-lg">Structured programs driving real change on the ground.</p>
                    </div>
                    <Link to="/programs-projects" className="group flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                        View All Programs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {top3Projects.map((project) => (
                        <Link key={project.id} to="/programs-projects" className={`group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${project.hoverBorder}`}>
                            <div className="p-8 md:p-10 flex flex-col flex-grow">
                                <div className={`${project.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                                    {project.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">{project.title}</h3>
                                <p className="text-slate-600 text-base leading-relaxed flex-grow mb-6">{project.description}</p>
                                <span className={`inline-flex items-center gap-1 font-bold ${project.textColor} text-sm`}>
                                    Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* --- 4. COMMUNITY REVIEWS (CLEAN MARQUEE) --- */}
            <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Community Trust</h2>
                        <p className="text-slate-500 mt-2 text-lg">What people say about our grassroots work.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
                        <span className="text-lg font-black text-slate-900">4.9</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} className={`${i === 4 ? 'text-slate-300 fill-slate-300' : 'text-yellow-400 fill-yellow-400'}`} />)}
                        </div>
                        <span className="text-sm font-bold text-slate-600 ml-2">31 Reviews</span>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex gap-6 animate-marquee py-4">
                        {scrollingReviews.map((review, i) => (
                            <div key={i} className="w-[320px] md:w-[400px] shrink-0 bg-white border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full ${review.color} text-white flex items-center justify-center font-bold text-lg`}>
                                            {review.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{review.name}</h4>
                                            <p className="text-xs text-slate-500">{review.time}</p>
                                        </div>
                                    </div>
                                    <MessageSquareQuote size={24} className="text-slate-200" />
                                </div>
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />)}
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. UPCOMING EVENTS (MINIMAL) --- */}
            <section className="py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h2>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 px-6 lg:px-8 max-w-7xl mx-auto snap-x hide-scrollbar">
                    {[
                        { d: "20", m: "JUN", title: "Educational Supply Drive", loc: "Okhla, New Delhi", type: "Education" },
                        { d: "05", m: "JUL", title: "Aadhaar & Document Camp", loc: "Shaheen Bagh Center", type: "Assistance" },
                        { d: "18", m: "JUL", title: "Free Dental Checkup", loc: "Local Clinic", type: "Healthcare" }
                    ].map((evt, i) => (
                        <div key={i} className="min-w-[320px] snap-center bg-white border border-slate-200 rounded-xl p-6 flex gap-5 hover:border-slate-300 transition-colors">
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center min-w-[75px] flex flex-col justify-center">
                                <span className="text-2xl font-black text-slate-800 mb-1">{evt.d}</span>
                                <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">{evt.m}</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{evt.type}</span>
                                <h4 className="text-lg font-bold text-slate-900">{evt.title}</h4>
                                <p className="text-slate-500 flex items-center gap-1.5 text-xs mt-2"><MapPin size={12}/> {evt.loc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 6. SOLID CALL TO ACTION --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="bg-slate-900 rounded-2xl p-10 md:p-20 text-center shadow-xl border border-slate-800">
                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <Award size={40} className="text-orange-400 mb-6" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Make an Impact Today.</h2>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                            Your contribution directly funds our grassroots initiatives in New Delhi. Become an annual member for ₹1100 and help us sustain our operations throughout the year.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                            <Link to="/donate" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2">
                                Become a Member 
                            </Link>
                            <Link to="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2">
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