import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, BookOpen, Stethoscope, Target, Eye, ArrowRight } from 'lucide-react';

const HomePage = () => {
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
    }, []);

    return (
        <div className="bg-white text-gray-900 overflow-hidden">
            
            {/* 1. HERO SECTION - LUXURY SLIDER */}
            <section className="relative h-screen flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={index}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <img src={images[index]} className="w-full h-full object-cover" alt="Hero Slider" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 text-center px-6">
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-blue-400 tracking-[0.3em] uppercase text-sm mb-4">Spread Smiles Foundation</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-6xl md:text-8xl font-serif font-bold text-white mb-8">
                        Empowering <span className="italic text-yellow-500">Lives</span>
                    </motion.h1>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        <Link to="/donate" className="border border-white/30 px-10 py-4 text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md">
                            Join the Movement
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. LUXURY STATS SECTION */}
            <section className="max-w-7xl mx-auto -mt-20 relative z-20 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-12 shadow-2xl rounded-sm">
                    {[
                        { val: "5,000+", label: "Lives Impacted" },
                        { val: "10,000+", label: "Meals Served" },
                        { val: "1,000+", label: "Education" },
                        { val: "2,000+", label: "Health" }
                    ].map((s, i) => (
                        <div key={i} className="text-center border-r border-gray-100 last:border-none">
                            <h3 className="text-4xl font-bold text-blue-900 mb-2">{s.val}</h3>
                            <p className="text-[10px] tracking-widest uppercase text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. FEATURE SECTION */}
            <section className="py-32 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl font-serif mb-8">Creating a legacy of <span className="text-blue-500">compassion.</span></h2>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8">Humari foundation sirf madad nahi karti, balki logo ki zindagi mein ek naya sawera lati hai. Hum har kadam par purani maryadao aur nayi soch ke saath chalte hain.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-10 h-64 flex flex-col justify-end"> <Target className="mb-4 text-blue-500"/> <h4 className="font-bold">Mission</h4> </div>
                    <div className="bg-blue-900 p-10 h-64 flex flex-col justify-end text-white mt-10"> <Eye className="mb-4 text-white"/> <h4 className="font-bold">Vision</h4> </div>
                </div>
            </section>

            {/* 4. PROGRAMS SECTION */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Our <span className="text-blue-500">Programs</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                             <BookOpen className="w-10 h-10 text-blue-500 mb-4"/>
                             <h3 className="text-xl font-bold mb-3">Education for All</h3>
                             <p className="text-gray-500 text-sm mb-6">Providing basic learning and school kits.</p>
                             <Link to="/programs" className="text-blue-500 font-semibold flex items-center gap-1">Learn More <ArrowRight size={16}/></Link>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                             <Stethoscope className="w-10 h-10 text-green-500 mb-4"/>
                             <h3 className="text-xl font-bold mb-3">Healthcare Camps</h3>
                             <p className="text-gray-500 text-sm mb-6">Regular health checkups and sessions.</p>
                             <Link to="/programs" className="text-green-500 font-semibold flex items-center gap-1">Learn More <ArrowRight size={16}/></Link>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                             <Heart className="w-10 h-10 text-yellow-500 mb-4"/>
                             <h3 className="text-xl font-bold mb-3">Food & Nutrition</h3>
                             <p className="text-gray-500 text-sm mb-6">Daily meal programs and food drives.</p>
                             <Link to="/programs" className="text-yellow-500 font-semibold flex items-center gap-1">Learn More <ArrowRight size={16}/></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;