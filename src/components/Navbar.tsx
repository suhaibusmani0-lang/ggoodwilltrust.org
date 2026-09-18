'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Mark as scrolled if past 20px
      setScrolled(currentScrollY > 20);

      // Auto hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & passed threshold
        setVisible(false);
      } else {
        // Scrolling up or top of page
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Programs & Projects', href: '/programs' },
    { name: 'Documents', href: '/documents' },
    { name: 'Certificates & Results', href: '/certificates' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <div 
        className={`w-full flex justify-center px-4 pt-4 fixed top-0 z-50 transition-transform duration-500 ease-in-out ${
          visible ? 'translate-y-0' : '-translate-y-28'
        }`}
      >
        <nav 
          className={`w-full max-w-7xl rounded-full px-6 h-[70px] flex items-center justify-between transition-all duration-500 ${
            scrolled 
              ? 'bg-[#09090b]/90 backdrop-blur-xl border border-[#27272a] shadow-[0_12px_40px_rgba(0,0,0,0.6)]' 
              : 'bg-[#09090b]/60 backdrop-blur-md border border-[#27272a]/50 shadow-none'
          }`}
        >
          {/* Logo with clean dark-mode typography pairing */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-full bg-[#18181b] border border-[#27272a] p-1 flex items-center justify-center shrink-0 group-hover:border-[#d4af37]/40 transition-colors">
              <Image 
                src="/logo-icon.png" 
                alt="G Goodwill Trust Emblem" 
                width={36} 
                height={36} 
                className="object-contain w-full h-full" 
                priority 
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[15px] sm:text-base font-normal tracking-wider text-[#fafafa] group-hover:text-white transition-colors">
                G GOODWILL TRUST
              </span>
              <span className="text-[9px] tracking-[0.2em] font-medium uppercase text-[#d4af37] mt-0.5">
                Non-Profit Org
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  'text-xs tracking-wider uppercase font-medium transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap ' +
                  (pathname === link.href
                    ? 'bg-[#18181b] text-[#d4af37] border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50')
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side CTA & Translate */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#71717a] cursor-pointer hover:text-white transition-colors">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <div id="google_translate_element" className="scale-[0.82] origin-left brightness-90" />
            </div>

            <Link href="/donate">
              <button className="relative group bg-[#d4af37] hover:bg-[#e5c07b] text-black rounded-full px-6 py-2.5 text-xs font-semibold tracking-wider uppercase shadow-[0_2px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_24px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2">
                Donate <Heart className="w-3.5 h-3.5 fill-black" />
              </button>
            </Link>
          </div>

          {/* Mobile toggle button */}
          <button
            className="xl:hidden p-2.5 text-slate-300 hover:bg-white/10 rounded-full transition-colors border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090b]/98 backdrop-blur-2xl pt-24 px-6 pb-8 overflow-y-auto xl:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  'text-base font-medium py-3.5 px-5 rounded-2xl transition-all ' +
                  (pathname === link.href
                    ? 'bg-[#18181b] text-[#d4af37] border border-[#27272a]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white')
                }
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-[#27272a] mt-6 pt-6">
              <div className="flex items-center gap-2 px-5 py-2 text-slate-400">
                <Globe className="w-4 h-4 text-[#d4af37]" />
                <div id="google_translate_element_mobile" />
              </div>
            </div>

            <Link href="/donate" onClick={() => setMobileOpen(false)} className="mt-4">
              <button className="w-full bg-[#d4af37] text-black rounded-2xl py-4 text-base font-bold shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 uppercase tracking-wider">
                Contribute Now <Heart className="w-5 h-5 fill-black" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
