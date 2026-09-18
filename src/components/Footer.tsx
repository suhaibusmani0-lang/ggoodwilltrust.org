import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Globe, Lock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Programs & Projects', href: '/programs' },
    { name: 'Documents', href: '/documents' },
    { name: 'Certificates', href: '/certificates' },
  ];

  const supportLinks = [
    { name: 'Donation', href: '/donate' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const socials = [
    {
      href: 'https://www.instagram.com/ggoodwilltrust/',
      label: 'Instagram',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    },
    {
      href: 'https://www.facebook.com/ggoodwilltrust/',
      label: 'Facebook',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      href: 'https://www.youtube.com/@GOODWILLTRUST1',
      label: 'YouTube',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
    {
      href: 'https://api.whatsapp.com/send?phone=917982804385&text=Hello%20G%20Goodwill%20Trust!',
      label: 'WhatsApp',
      svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    },
  ];

  return (
    <footer className="print:hidden relative bg-slate-950 text-slate-300 overflow-hidden border-t border-white/10 pt-20 pb-8">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 mb-16">
          {/* Column 1: Brand */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="bg-white px-3 py-2 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] border border-white/20 transition-all duration-500 flex items-center justify-center">
                <Image src="/logo.png" alt="G Goodwill Trust Logo" width={120} height={56} className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="italic text-[9px] font-bold text-orange-400 tracking-wider">
                  &quot;Hope Starts Here&quot;
                </span>
                <div className="flex items-start leading-none mt-1">
                  <h3 className="font-black text-xl text-white tracking-wide">G GOODWILL TRUST</h3>
                  <span className="font-medium text-[10px] text-white align-top ml-1">&reg;</span>
                </div>
              </div>
            </Link>

            <div className="mb-6 pl-1 border-l-2 border-orange-500/50">
              <p className="text-[10px] text-white font-black tracking-widest mb-1.5 ml-3">NON-PROFIT ORGANISATION</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.1em] ml-3">EDUCATION / EMPOWERMENT / COMPASSION</p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-8 pr-4">
              Bridging the gap between privilege and disadvantage. Join our mission to create sustainable solutions for a brighter future.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center text-lg"
                  aria-label={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-6">Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-orange-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-4 mt-8">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-orange-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4">
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
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all duration-300 shrink-0 h-fit">
                  <Globe size={18} />
                </div>
                <a href="https://ggoodwilltrust.org" target="_blank" rel="noreferrer" className="pt-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                  ggoodwilltrust.org
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Map */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase mb-6">Our Location</h4>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group h-48">
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">Interactive Map</span>
              </div>
              <iframe
                title="G Goodwill Trust Location"
                src="https://maps.google.com/maps?q=G-48%20Shaheen%20Bagh,%20Okhla,%20New%20Delhi-110025&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 relative flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <p className="flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} G Goodwill Trust. All rights reserved. Registered Non-Profit Trust.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About Trust
            </Link>
            <Link href="/documents" className="hover:text-slate-300 transition-colors">
              80G & Legal
            </Link>
            <Link href="/admin/login" className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
              <Lock size={12} />
              Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
