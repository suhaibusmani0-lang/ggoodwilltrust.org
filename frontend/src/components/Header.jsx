import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Heart, Globe } from 'lucide-react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('EN'); // Default label
    const [scrolled, setScrolled] = useState(false);
    
    const location = useLocation();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'en', label: 'EN', name: 'English' },
        { code: 'hi', label: 'HI', name: 'हिंदी' },
        { code: 'ar', label: 'AR', name: 'العربية' }
    ];

    // 🔴 MAGIC LOGIC: Custom button se hidden Google Translate ko trigger karna
    const handleLanguageChange = (langCode, langLabel) => {
        setCurrentLang(langLabel);
        setIsLangOpen(false);
        setIsMobileMenuOpen(false);

        // Google Translate ke dropdown box ko dhoondo aur value change karo
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change')); // Trigger the change
        }

        // Arabic ke liye page ko Right-to-Left (RTL) set karo
        document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    };

    // Creative Desktop Links
    const getDesktopLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `relative px-2.5 xl:px-3 py-2 font-bold text-[13px] xl:text-sm transition-all duration-300 whitespace-nowrap rounded-full ${
            isActive 
            ? "bg-blue-50 text-blue-600" 
            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
        }`;
    };

    // Mobile links
    const getMobileLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `block font-bold px-4 py-3 rounded-2xl transition-all duration-300 ${
            isActive
            ? "text-blue-600 bg-blue-50 shadow-sm border border-blue-100/50"
            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
        }`;
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'pt-2 md:pt-4 px-2 md:px-6 xl:px-8' : 'pt-4 md:pt-6 px-4 md:px-8 xl:px-10'}`}>
            
            <div className={`max-w-[90rem] mx-auto flex items-center justify-between gap-4 bg-white/90 backdrop-blur-xl border border-white/50 transition-all duration-500 ${
                scrolled 
                ? 'rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 px-4 md:px-6' 
                : 'rounded-2xl md:rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.04)] py-3 px-4 md:px-8'
            }`}>
                
                {/* 1. Logo Section */}
                <Link to="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3 group">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 rounded-full"></div>
                        <img 
                            src="/logo.png" 
                            alt="G Goodwill Trust Logo" 
                            className="relative h-14 sm:h-16 lg:h-[72px] w-auto object-contain drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-2xl" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    <div className="flex flex-col justify-center transition-transform duration-500 group-hover:translate-x-1.5">
                        <div className="text-right w-full pr-1 md:pr-4">
                            <span className="italic text-[7px] sm:text-[9px] lg:text-[10px] font-bold text-slate-600 tracking-wide transition-colors duration-300 group-hover:text-blue-500">
                                "Hope Starts Here"
                            </span>
                        </div>
                        <div className="flex items-start leading-none -mt-0.5 md:-mt-1">
                            <span className="font-black text-[1rem] sm:text-[1.2rem] lg:text-[1.6rem] text-slate-800 tracking-wide">
                                G GOODWILL TRUST
                            </span>
                            <span className="font-medium text-[8px] sm:text-[10px] lg:text-[12px] text-slate-800 align-top ml-1">
                                ®
                            </span>
                        </div>
                        <div className="flex flex-col items-center mt-0.5 md:mt-1">
                            <span className="italic font-bold text-[6px] sm:text-[7px] lg:text-[8.5px] text-blue-600 tracking-[0.15em] leading-tight">
                                NON-PROFIT ORGANISATION
                            </span>
                            <span className="italic font-bold text-[5.5px] sm:text-[6.5px] lg:text-[8px] text-slate-500 tracking-[0.1em] leading-tight group-hover:text-slate-600 transition-colors">
                                EDUCATION / EMPOWERMENT / COMPASSION
                            </span>
                        </div>
                    </div>
                </Link>

                {/* 2. Center Navigation (Desktop) - Normal text wapas aa gaya */}
                <nav className="hidden xl:flex items-center gap-0.5 flex-shrink-0">
                    <Link to="/" className={getDesktopLinkClass('/')}>Home</Link>
                    <Link to="/about" className={getDesktopLinkClass('/about')}>About Us</Link>
                    <Link to="/programs-projects" className={getDesktopLinkClass('/programs-projects')}>Programs & Projects</Link>
                    <Link to="/documents" className={getDesktopLinkClass('/documents')}>Documents</Link>
                    <Link to="/certificates-results" className={getDesktopLinkClass('/certificates-results')}>Certificates & Results</Link>
                    <Link to="/contact" className={getDesktopLinkClass('/contact')}>Contact</Link>
                </nav>

                {/* 3. Right Side (Language + CTA) */}
                <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
                    
                    {/* Language Switcher */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsLangOpen(true)}
                        onMouseLeave={() => setIsLangOpen(false)}
                    >
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full font-bold text-sm px-3 py-2 transition-all duration-300">
                            <Globe size={16} />
                            <span>{currentLang}</span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isLangOpen && (
                            <div className="absolute top-full right-0 pt-2 w-36">
                                <div className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-2xl overflow-hidden py-2 transform origin-top transition-all">
                                    {languages.map((lang) => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code, lang.label)}
                                            className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-all ${
                                                currentLang === lang.label 
                                                ? "text-blue-600 bg-blue-50" 
                                                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:pl-6"
                                            }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Donate Button */}
                    <Link to="/donate" className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 xl:px-7 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_15px_rgb(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgb(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group whitespace-nowrap">
                        Donate <Heart size={16} className="fill-white/80 group-hover:scale-125 group-hover:fill-white transition-all duration-300" />
                    </Link>
                </div>

                {/* Mobile Hamburger & Controls */}
                <div className="flex xl:hidden items-center gap-1 sm:gap-2">
                    <button 
                        onClick={() => {
                            const currentIndex = languages.findIndex(l => l.label === currentLang);
                            const nextLang = languages[(currentIndex + 1) % languages.length];
                            handleLanguageChange(nextLang.code, nextLang.label);
                        }}
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full font-bold text-xs sm:text-sm px-2 py-1.5 transition-all"
                    >
                        <Globe size={16} /> {currentLang}
                    </button>

                    <button 
                        className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="xl:hidden absolute top-[calc(100%+10px)] left-2 right-2 bg-white/95 backdrop-blur-2xl text-slate-900 p-4 sm:p-6 space-y-2 shadow-[0_20px_60px_rgb(0,0,0,0.1)] border border-white/50 rounded-3xl flex flex-col max-h-[85vh] overflow-y-auto z-50">
                    <div className="space-y-1">
                        <Link to="/" className={getMobileLinkClass('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/about" className={getMobileLinkClass('/about')} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/programs-projects" className={getMobileLinkClass('/programs-projects')} onClick={() => setIsMobileMenuOpen(false)}>Programs & Projects</Link>
                        <Link to="/documents" className={getMobileLinkClass('/documents')} onClick={() => setIsMobileMenuOpen(false)}>Documents</Link>
                        <Link to="/certificates-results" className={getMobileLinkClass('/certificates-results')} onClick={() => setIsMobileMenuOpen(false)}>Certificates & Results</Link>
                        <Link to="/contact" className={getMobileLinkClass('/contact')} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <Link to="/donate" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_25px_rgb(249,115,22,0.3)] active:scale-[0.98] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                            Donate Now <Heart size={20} className="fill-white/80" />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;