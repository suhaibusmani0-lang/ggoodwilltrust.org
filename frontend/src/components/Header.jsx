import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="bg-[#f8f9fc] py-4 px-6 md:px-8 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* 1. Logo Section */}
                <Link to="/" className="flex-shrink-0">
                    {/* Yahan aap apne actual logo ki path update kar dijiyega (jaise '/logo.png') */}
                    <img 
                        src="/logo.png" 
                        alt="Spread Smiles Foundation" 
                        className="h-14 object-contain" 
                        onError={(e) => {
                            e.target.style.display = 'none'; // Agar image na mile toh error na aaye
                        }}
                    />
                    {/* Agar logo image abhi nahi hai, toh ye text dikhega */}
                    <span className="font-bold text-sm text-[#ea3a72] hidden">Spread Smiles Foundation</span>
                </Link>

                {/* 2. Center Navigation Pill (Desktop) */}
                <nav className="hidden lg:flex items-center bg-white shadow-sm rounded-full px-2 py-1.5">
                    
                    <Link to="/" className="bg-[#2081e2] text-white px-6 py-2 rounded-full font-semibold text-sm">
                        Home
                    </Link>
                    
                    <Link to="/about" className="text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors">
                        About Us
                    </Link>
                    
                    <Link to="/programs" className="text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors">
                        Programs
                    </Link>
                    
                    <Link to="/projects" className="text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors">
                        Projects
                    </Link>
                    
                    <Link to="/donate" className="text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors">
                        Donate
                    </Link>
                    
                    <Link to="/contact" className="text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors">
                        Contact
                    </Link>

                    {/* Dropdown Menu for Press Releases */}
                    <div 
                        className="relative px-2 py-2"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-gray-700 hover:text-[#2081e2] px-2 font-semibold text-sm focus:outline-none transition-colors">
                            Press Releases
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {/* Dropdown Items */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden py-2">
                                <Link to="/press/news-gallery" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2081e2]">
                                    News Gallery
                                </Link>
                                <Link to="/press/documents" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2081e2]">
                                    Documents
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* 3. Call to Action Button (Right Side) */}
                <div className="hidden lg:block">
                    {/* 👇 Link changed to /contact 👇 */}
                    <Link to="/contact" className="bg-[#2081e2] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm">
                        Join the Movement
                    </Link>
                </div>

                {/* Mobile Menu Hamburger Icon */}
                <button 
                    className="lg:hidden text-gray-700 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown (Simplified for small screens) */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white text-black p-4 space-y-4 shadow-lg border-t">
                    <Link to="/" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/about" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                    <Link to="/programs" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Programs</Link>
                    <Link to="/projects" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
                    <Link to="/donate" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Donate</Link>
                    <Link to="/contact" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    <Link to="/press/news-gallery" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>News Gallery</Link>
                    <Link to="/press/documents" className="block font-medium hover:text-[#2081e2]" onClick={() => setIsMobileMenuOpen(false)}>Documents</Link>
                    {/* 👇 Link changed to /contact 👇 */}
                    <Link to="/contact" className="block text-center bg-[#2081e2] text-white py-3 rounded-lg font-bold mt-4 shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
                        Join the Movement
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;