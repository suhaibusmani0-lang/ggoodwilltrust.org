'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
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
      <div className="w-full flex justify-center px-4 pt-4 fixed top-0 z-50">
        <nav className={`w-full max-w-7xl rounded-full shadow-slate-200/50 border border-slate-100 px-6 h-[72px] flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-white/90 backdrop-blur-md shadow-sm'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="G Goodwill Trust Logo" width={160} height={50} className="object-contain h-12 w-auto" priority />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  'text-[13px] font-semibold transition-all duration-200 px-3 py-2 rounded-full whitespace-nowrap ' +
                  (pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500 cursor-pointer hover:text-blue-600 transition-colors">
              <Globe className="w-4 h-4" />
              <div id="google_translate_element" className="scale-[0.85] origin-left" />
            </div>

            <Link href="/donate">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-5 py-2.5 text-sm font-bold shadow-lg shadow-orange-500/20 transition-all duration-200 hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center gap-2 border-0">
                Donate <Heart className="w-4 h-4 fill-white" />
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
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
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-8 overflow-y-auto xl:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  'text-lg font-semibold py-3 px-4 rounded-xl transition-colors ' +
                  (pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50')
                }
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 text-slate-500">
                <Globe className="w-4 h-4" />
                <div id="google_translate_element_mobile" />
              </div>
            </div>

            <Link href="/donate" onClick={() => setMobileOpen(false)} className="mt-4">
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl py-4 text-lg font-bold shadow-lg flex items-center justify-center gap-2">
                Donate Now <Heart className="w-5 h-5 fill-white" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
