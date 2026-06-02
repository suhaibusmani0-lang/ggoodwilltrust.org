import React from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Users, 
    MapPin, 
    Target, 
    Eye, 
    CheckCircle2,
    Shield,
    HeartHandshake,
    Sparkles
} from 'lucide-react';

const AboutPage = () => {
    // UPDATED TEAM DATA FOR G GOODWILL TRUST
    const teamMembers = [
        {
            name: "Miss Safia",
            role: "Founder",
            description: "The visionary force behind G Goodwill Trust, dedicating her life to creating equitable opportunities and spearheading our core philanthropic missions.",
            image: "/team/safia.jpg",
            color: "text-orange-600 bg-orange-50 border-orange-200" 
        },
        {
            name: "Mr. Suhaib Usmani",
            role: "Managing Director",
            description: "Guiding the organization's strategic vision and operations, ensuring that every initiative translates into meaningful, on-ground community impact.",
            image: "/team/suhaib.jpg",
            color: "text-blue-600 bg-blue-50 border-blue-200"
        },
        {
            name: "Mrs. Beena Verma",
            role: "Treasurer",
            description: "Our trusted financial steward, maintaining absolute transparency and accountability to ensure every donation reaches those who need it most.",
            image: "/team/beena.jpg",
            color: "text-emerald-600 bg-emerald-50 border-emerald-200"
        },
        {
            name: "Mr. Syed Iftekhar Ul Ameen",
            role: "Operations Director",
            description: "Masterminding our logistical frameworks and flawlessly driving the execution of our large-scale community camps and relief distributions.",
            image: "/team/syed.jpg",
            color: "text-indigo-600 bg-indigo-50 border-indigo-200"
        },
        {
            name: "Mr. Faizan Ansari",
            role: "I.T. Head",
            description: "Leveraging modern technology to streamline our outreach, enhance our digital presence, and build robust platforms for our campaigns.",
            image: "/team/faizan.jpg",
            color: "text-slate-600 bg-slate-50 border-slate-200"
        },
        {
            name: "Mr. Bilal Akhtar",
            role: "Development Manager",
            description: "Focusing on program expansion and sustainable growth, forging strategic partnerships to scale our humanitarian efforts.",
            image: "/team/bilal.jpg",
            color: "text-purple-600 bg-purple-50 border-purple-200"
        },
        {
            name: "Mr. Faheem Ahmad",
            role: "Volunteer Coordinator",
            description: "The heart of our ground force, continuously mobilizing, training, and inspiring our dedicated network of volunteers to serve effectively.",
            image: "/team/faheem.jpg",
            color: "text-rose-600 bg-rose-50 border-rose-200"
        },
        {
            name: "Mr. Shahid Ali",
            role: "Fundraiser",
            description: "Championing our resource generation, connecting with compassionate donors and corporate sponsors to fuel our life-changing programs.",
            image: "/team/shahid.jpg",
            color: "text-amber-600 bg-amber-50 border-amber-200"
        }
    ];

    // ANIMATION VARIANTS
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <div className="bg-[#f8fafc] text-slate-800 font-sans overflow-x-hidden">
            
            {/* 1. PREMIUM HERO SECTION */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 overflow-hidden bg-slate-950">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-orange-500/20 to-transparent blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md"
                    >
                        <Sparkles size={14} />
                        Hope Starts Here
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight leading-[1.1]"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">G Goodwill</span> Trust
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
                    >
                        Founded with a steadfast commitment to humanity, G Goodwill Trust focuses on education, empowerment, and compassion. Our dedicated team works tirelessly to bridge the gap between privilege and disadvantage, ensuring every individual can live with dignity.
                    </motion.p>
                </div>
            </section>

            {/* 2. FLOATING STATS CARDS */}
            <section className="px-6 relative z-20 -mt-12 md:-mt-16">
                <motion.div 
                    variants={staggerContainer} initial="hidden" animate="visible"
                    className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform duration-300 flex items-start gap-5">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg mb-1">Established</h3>
                            <p className="text-slate-500 text-sm font-medium">Sep 30, 2024</p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform duration-300 flex items-start gap-5">
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shrink-0">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg mb-1">Lives Impacted</h3>
                            <p className="text-slate-500 text-sm font-medium">5,000+ Individuals</p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border-t-4 border-t-orange-500 hover:-translate-y-1 transition-transform duration-300 flex items-start gap-5">
                        <div className="bg-orange-50 p-3 rounded-xl text-orange-500 shrink-0">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg mb-1">Primary Location</h3>
                            <p className="text-slate-500 text-sm font-medium">Delhi, India</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* 3. MISSION & VISION (CORPORATE BENTO STYLE) */}
            <section className="py-24 px-6 max-w-[85rem] mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Mission */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="bg-slate-900 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm text-orange-400">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-6">Our Mission</h3>
                            <p className="text-slate-300 text-lg leading-relaxed font-medium">
                                To serve humanity by providing education, healthcare, and essential support to underprivileged communities. We strive to empower them with the necessary tools and resources to lead a life of dignity, hope, and limitless opportunity.
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Vision */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="bg-white border border-slate-200 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
                    >
                        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Our Vision</h3>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                            To create a compassionate, self-sustaining society where the systemic barriers of inequality are dismantled. A world where every individual, regardless of their background, has equitable access to quality education, healthcare, and the foundational resources required to thrive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 4. OUR APPROACH */}
            <section className="py-24 px-6 bg-white border-y border-slate-100">
                <div className="max-w-[85rem] mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Methodology</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How We Operate</h2>
                    </div>
                    
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* What We Do */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                            className="lg:col-span-7"
                        >
                            <h3 className="text-2xl font-black mb-8 text-slate-900 flex items-center gap-3">
                                <Shield className="text-blue-500" /> Action Areas
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Work with schools under Vidyanjali initiatives",
                                    "Distribute winter sweaters & clothing to students",
                                    "Provide school uniforms to underprivileged children",
                                    "Organize comprehensive health camps in communities",
                                    "Facilitate vital document creation (Aadhar, etc.)",
                                    "Deliver emergency relief and food distribution"
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-start gap-4 hover:border-blue-200 transition-colors">
                                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span className="text-slate-700 font-medium text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Where We Work */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-5"
                        >
                            <h3 className="text-2xl font-black mb-8 text-slate-900 flex items-center gap-3">
                                <HeartHandshake className="text-orange-500" /> Our Presence
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                Currently active in Delhi, we strategically focus our efforts on areas with the greatest need, maximizing our impact in Shaheen Bagh, Okhla, and surrounding communities.
                            </p>
                            
                            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px]"></div>
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-orange-400" /> Headquarters
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                    G Goodwill Trust<br/>
                                    G-48 Shaheen Bagh, Okhla,<br/>
                                    New Delhi-110025, India
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. LEADERSHIP TEAM */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-[85rem] mx-auto">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Leadership</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Board of Trustees</h2>
                        <p className="text-slate-500 mt-4 text-lg font-medium">
                            Our passionate executive team dedicated to driving the foundation's mission forward.
                        </p>
                    </div>

                    <motion.div 
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div 
                                variants={fadeUp} key={index} 
                                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-center hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                            >
                                {/* Profile Image with Initial Fallback styling */}
                                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 relative shrink-0">
                                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-300">
                                        {/* Fallback initial handling "Miss", "Mr.", "Mrs." */}
                                        {member.name.replace(/^(Mr\.|Mrs\.|Miss)\s+/, '').charAt(0)}
                                    </div>
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="relative z-10 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-white"
                                        onError={(e) => { e.target.style.opacity = '0'; }}
                                    />
                                </div>
                                
                                <h3 className="text-lg font-black text-slate-900 mb-2">{member.name}</h3>
                                <div className={`inline-block px-3 py-1 mb-5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${member.color}`}>
                                    {member.role}
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium mt-auto">
                                    {member.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;