'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Target,
  Eye,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    icon: Calendar,
    label: 'Established',
    value: 'Sep 30, 2024',
  },
  {
    icon: Users,
    label: 'Lives Impacted',
    value: '5,000+ Citizens',
  },
  {
    icon: MapPin,
    label: 'Core Focus',
    value: 'Delhi NCR, India',
  },
];

const team = [
  {
    name: 'Miss Safia',
    role: 'Founder',
    desc: 'The visionary guiding force behind G Goodwill Trust, dedicating her efforts to creating equitable opportunities and championing core grassroots relief missions.',
    initial: 'S',
  },
  {
    name: 'Mr. Suhaib Usmani',
    role: 'Managing Director',
    desc: 'Guiding the foundation\'s strategic vision and operations, ensuring every philanthropic pledge translates into verified on-ground community progress.',
    initial: 'S',
  },
  {
    name: 'Mrs. Beena Verma',
    role: 'Treasurer',
    desc: 'Our trusted financial custodian, upholding strict institutional transparency and accountability across all public donations and audited accounts.',
    initial: 'B',
  },
  {
    name: 'Mr. Syed Iftekhar Ul Ameen',
    role: 'Operations Director',
    desc: 'Directing logistical frameworks and on-ground deployment for large-scale medical camps, educational distribution drives, and community food supply.',
    initial: 'S',
  },
  {
    name: 'Mr. Faizan Ansari',
    role: 'I.T. Head',
    desc: 'Leveraging digital platforms to modernize beneficiary verifications, public portal security, and transparent operational accountability.',
    initial: 'F',
  },
  {
    name: 'Mr. Bilal Akhtar',
    role: 'Development Manager',
    desc: 'Focusing on strategic community partnerships, sustainable program expansions, and building lasting relationships with patrons and institutions.',
    initial: 'B',
  },
  {
    name: 'Mr. Faheem Ahmad',
    role: 'Volunteer Coordinator',
    desc: 'Mobilizing, training, and coordinating our passionate grassroots youth volunteer corp across schools, community clinics, and distribution sites.',
    initial: 'F',
  },
  {
    name: 'Mr. Shahid Ali',
    role: 'Fundraiser',
    desc: 'Engaging patrons and institutional partners to secure vital resources for ongoing child education scholarships and emergency medical relief.',
    initial: 'S',
  },
];

const approachList = [
  'Institutional tie-ups with government schools under Vidyanjali',
  'Annual winter sweater and warm clothing distributions',
  'Complete school kits (uniforms, bags, stationery) for deserving students',
  'Regular free diagnostic and medical consultation camps',
  'Essential citizen documentation camps (Aadhaar, Ayushman Bharat)',
  'Direct emergency ration packages for destitute and widow households',
];

export default function AboutPage() {
  const roleColors: Record<string, { bg: string; text: string; border: string; initialBg: string }> = {
    'Founder': { bg: 'bg-amber-50', text: 'text-[#b45309]', border: 'border-amber-300', initialBg: 'bg-amber-100/70 text-[#b45309] border-amber-300' },
    'Managing Director': { bg: 'bg-amber-50', text: 'text-[#b45309]', border: 'border-amber-300', initialBg: 'bg-amber-100/70 text-[#b45309] border-amber-300' },
    'Treasurer': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', initialBg: 'bg-emerald-100/70 text-emerald-700 border-emerald-300' },
    'Operations Director': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', initialBg: 'bg-blue-100/70 text-blue-700 border-blue-300' },
    'I.T. Head': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', initialBg: 'bg-purple-100/70 text-purple-700 border-purple-300' },
    'Development Manager': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300', initialBg: 'bg-teal-100/70 text-teal-700 border-teal-300' },
    'Volunteer Coordinator': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', initialBg: 'bg-rose-100/70 text-rose-700 border-rose-300' },
    'Fundraiser': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', initialBg: 'bg-indigo-100/70 text-indigo-700 border-indigo-300' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50/50 text-slate-900 pt-12 pb-20">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-12 mb-16 lg:mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-8 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
            Foundational Charter &bull; 80G Certified Non-Profit
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight mb-8 text-slate-900 leading-[1.08]"
          >
            Rooted in Empathy.{' '}
            <span className="italic text-[#b45309] font-serif">
              Driven by Dignity.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Founded with an enduring commitment to humanity, G Goodwill Trust focuses on education, healthcare dignity, and compassionate relief. We work tirelessly to bridge the gap between privilege and vulnerability.
          </motion.p>
        </div>
      </section>

      {/* 2. CURATED KEY FACTS */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-12 mb-16 lg:mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Calendar, label: 'Established', value: 'Sep 30, 2024', color: 'bg-amber-50 border-amber-200 text-[#b45309]' },
              { icon: Users, label: 'Lives Impacted', value: '5,000+ Citizens', color: 'bg-blue-50 border-blue-200 text-blue-600' },
              { icon: MapPin, label: 'Core Focus', value: 'Delhi NCR, India', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 shadow-2xs ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1.5">{stat.label}</div>
                <div className="text-xl sm:text-2xl font-serif font-normal text-slate-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-12 mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-white via-amber-50/30 to-white p-10 sm:p-12 rounded-3xl border border-amber-200/80 relative overflow-hidden group hover:border-[#b45309]/50 transition-all duration-300 shadow-xs hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-center mb-8 text-[#b45309] shadow-2xs">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 mb-4">Our Institutional Mission</h2>
              <p className="text-slate-600 text-base leading-relaxed font-light">
                To serve humanity by providing foundational education, verified clinical care, and emergency sustenance to vulnerable families. We strive to empower communities with the tools and self-reliance required to live with lasting dignity.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-white via-emerald-50/20 to-white p-10 sm:p-12 rounded-3xl border border-emerald-200/80 relative overflow-hidden group hover:border-emerald-400 transition-all duration-300 shadow-xs hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center mb-8 text-emerald-700 shadow-2xs">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 mb-4">Our Enduring Vision</h2>
              <p className="text-slate-600 text-base leading-relaxed font-light">
                To build a compassionate, resilient society where systemic inequalities are actively dismantled. A world where every individual, regardless of socioeconomic background, has equitable access to quality education, healthcare, and human rights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY & ACTION */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-12 mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#b45309] font-bold text-xs tracking-[0.2em] uppercase mb-3 inline-block bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900">How We Operate On Ground</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-200 transition-all">
              <h3 className="text-xl font-serif font-normal text-slate-900 mb-6">Action Areas</h3>
              <ul className="space-y-4">
                {approachList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between bg-white p-10 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-200 transition-all">
              <div>
                <span className="text-[#b45309] text-xs uppercase tracking-widest font-bold mb-2 block">Headquarters</span>
                <h3 className="text-2xl font-serif font-normal text-slate-900 mb-4">Shaheen Bagh Relief Center</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light mb-8">
                  Currently active across New Delhi, we strategically deploy resources to areas with the greatest concentration of vulnerable families.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/50 via-slate-50 to-amber-50/30 border border-amber-200/70">
                <p className="text-xs text-[#b45309] uppercase tracking-wider mb-1 font-bold">Official Secretariat</p>
                <p className="text-sm font-semibold text-slate-900">G-48 Shaheen Bagh, Okhla, New Delhi - 110025</p>
                <p className="text-xs text-slate-600 mt-1">Delhi NCR, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOARD OF TRUSTEES */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[#b45309] font-bold text-xs tracking-[0.2em] uppercase mb-3 inline-block bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 mb-4">Board of Trustees</h2>
            <p className="text-slate-600 text-sm sm:text-base font-light">
              Our dedicated executive team ensuring transparent governance and compassionate ground execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => {
              const style = roleColors[member.role] || roleColors['Founder'];
              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-serif text-xl font-normal mb-5 shadow-2xs ${style.initialBg}`}>
                      {member.initial}
                    </div>
                    <span className={`text-[10px] tracking-[0.2em] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block mb-3 ${style.bg} ${style.text} ${style.border}`}>
                      {member.role}
                    </span>
                    <h3 className="text-lg font-serif font-normal text-slate-900 mb-3">{member.name}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-light mb-6">
                      {member.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

