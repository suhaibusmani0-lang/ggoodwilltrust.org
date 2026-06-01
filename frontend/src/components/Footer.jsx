import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MapPin, 
    Mail, 
    Phone, 
    MessageCircle,
    Globe,
    Lock,
    ChevronRight,
    Heart,
    Map
} from 'lucide-react'; // 👈 Yahan se 'Youtube' hata diya hai

const Footer = () => {
    return (
        <footer className="print:hidden relative bg-slate-950 text-slate-300 overflow-hidden border-t border-white/10 pt-20 pb-8">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-8 xl:px-10">
                
                {/* Main Grid Content (12 Columns System) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-16">
                    
                    {/* Column 1: Brand & Socials (4 Columns Width) */}
                    <div className="lg:col-span-4 flex flex-col">
                        
                        <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex w-fit">
                            <div className="bg-white px-3 py-2 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-white/20 transition-all duration-500 flex items-center justify-center">
                                <img src="/logo.png" alt="G Goodwill Trust Logo" className="relative h-12 lg:h-14 object-contain group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="italic text-[9px] font-bold text-orange-400 tracking-wider">
                                    "Hope Starts Here"
                                </span>
                                <div className="flex items-start leading-none mt-1">
                                    <h3 className="font-black text-xl text-white tracking-wide">
                                        G GOODWILL TRUST
                                    </h3>
                                    <span className="font-medium text-[10px] text-white align-top ml-1">®</span>
                                </div>
                            </div>
                        </Link>
                        
                        <div className="mb-6 pl-1 border-l-2 border-orange-500/50">
                            <p className="text-[10px] text-white font-black tracking-widest mb-1.5 ml-3">
                                NON-PROFIT ORGANISATION
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold tracking-[0.1em] ml-3">
                                EDUCATION / EMPOWERMENT / COMPASSION
                            </p>
                        </div>
                        
                        <p className="text-sm text-slate-400 leading-relaxed mb-8 pr-4">
                            Bridging the gap between privilege and disadvantage. Join our mission to create sustainable solutions for a brighter future.
                        </p>
                        
                        {/* Social Icons - YouTube Fixed Here */}
                        <div className="flex flex-wrap gap-3">
                            <a href="https://www.instagram.com/ggoodwilltrust/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-tr hover:from-pink-600 hover:to-orange-500 hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 text-slate-300 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/ggoodwilltrust/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(24,119,242,0.2)] transition-all duration-300 text-slate-300 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            {/* 👇 YouTube Icon Ka Asli SVG Code Laga Diya Hai */}
                            <a href="https://www.youtube.com/@GOODWILLTRUST1" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,0,0,0.2)] transition-all duration-300 text-slate-300 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=917982804385&text=Hello%20G%20Goodwill%20Trust!" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(37,211,102,0.2)] transition-all duration-300 text-slate-300 hover:text-white">
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links (2 Columns Width) */}
                    <div className="lg:col-span-2">
                        {/* Quick Links */}
                        <div className="mb-8">
                            <h4 className="text-white font-black tracking-wide mb-5 text-lg flex items-center gap-2">
                                Links
                                <span className="h-1 w-4 bg-orange-500 rounded-full"></span>
                            </h4>
                            <ul className="flex flex-col space-y-3 text-sm">
                                {[
                                    { path: "/about", label: "About Us" },
                                    { path: "/programs-projects", label: "Programs & Projects" },
                                    { path: "/documents", label: "Documents" },
                                    { path: "/certificates-results", label: "Certificates" }
                                ].map((link, idx) => (
                                    <li key={`ql-${idx}`}>
                                        <Link to={link.path} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300">
                                            <ChevronRight size={14} className="text-orange-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-black tracking-wide mb-5 text-lg flex items-center gap-2">
                                Support
                                <span className="h-1 w-4 bg-blue-500 rounded-full"></span>
                            </h4>
                            <ul className="flex flex-col space-y-3 text-sm">
                                {[
                                    { path: "/donate", label: "Donation" },
                                    { path: "/contact", label: "Contact Us" }
                                ].map((link, idx) => (
                                    <li key={`sup-${idx}`}>
                                        <Link to={link.path} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300">
                                            <ChevronRight size={14} className="text-blue-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Contact Info (3 Columns Width) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-black tracking-wide mb-6 text-lg flex items-center gap-2">
                            Contact Us
                            <span className="h-1 w-6 bg-emerald-500 rounded-full"></span>
                        </h4>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 group">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 group-hover:text-orange-400 transition-all duration-300 shrink-0 h-fit">
                                    <MapPin size={18} />
                                </div>
                                <span className="pt-1 text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                                    G-48 Shaheen Bagh, Okhla, New Delhi-110025
                                </span>
                            </li>
                            <li className="flex gap-4 group">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300 shrink-0 h-fit">
                                    <Mail size={18} />
                                </div>
                                <a href="mailto:globalgoodwill4@gmail.com" className="pt-1.5 text-slate-400 hover:text-blue-400 transition-colors break-all">
                                    globalgoodwill4@gmail.com
                                </a>
                            </li>
                            <li className="flex gap-4 group">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all duration-300 shrink-0 h-fit">
                                    <Phone size={18} />
                                </div>
                                <a href="tel:+917982804385" className="pt-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
                                    +91 7982804385
                                </a>
                            </li>
                            <li className="flex gap-4 group">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all duration-300 shrink-0 h-fit">
                                    <Globe size={18} />
                                </div>
                                <a href="https://ggoodwilltrust.org" target="_blank" rel="noreferrer" className="pt-1.5 text-slate-400 hover:text-purple-400 transition-colors">
                                    ggoodwilltrust.org
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: GMB Map Embed (3 Columns Width) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-black tracking-wide mb-6 text-lg flex items-center gap-2">
                            Our Location
                            <span className="h-1 w-6 bg-rose-500 rounded-full"></span>
                        </h4>
                        
                        {/* Map Container with Hover Effects */}
                        <div className="w-full h-[220px] lg:h-[260px] rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-slate-900">
                            
                            {/* Overlay that fades out on hover to reveal interactive map */}
                            <div className="absolute inset-0 bg-slate-900/40 pointer-events-none group-hover:bg-transparent transition-all duration-500 z-10 flex items-center justify-center group-hover:opacity-0">
                                <div className="bg-slate-950/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-2">
                                    <Map size={14} className="text-rose-500" /> Interactive Map
                                </div>
                            </div>

                            <iframe
                                title="G Goodwill Trust Location"
                                src="https://maps.google.com/maps?q=G-48%20Shaheen%20Bagh,%20Okhla,%20New%20Delhi-110025&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 w-full h-full object-cover"
                            ></iframe>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar - Engineered Separator */}
                <div className="pt-8 mt-12 relative flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                    {/* Gradient Line Separator */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    
                    <p className="flex items-center gap-1.5">
                        © {new Date().getFullYear()} G Goodwill Trust. Made with <Heart size={12} className="text-orange-500 fill-orange-500 animate-pulse" /> for humanity.
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <Link to="/admin/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10">
                            <Lock size={12} /> Secure Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;