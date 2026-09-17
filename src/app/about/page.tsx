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
  Mail,
  Globe,
  Map
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
    label: 'Established',
    value: 'Sep 30, 2024',
    bg: 'bg-blue-100',
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    label: 'Lives Impacted',
    value: '5,000+ Individuals',
    bg: 'bg-emerald-100',
  },
  {
    icon: <MapPin className="w-6 h-6 text-amber-600" />,
    label: 'Primary Location',
    value: 'Delhi, India',
    bg: 'bg-amber-100',
  },
];

const team = [
  {
    name: 'Miss Safia',
    role: 'Founder',
    desc: 'The visionary force behind G Goodwill Trust, dedicating her life to creating equitable opportunities and spearheading our core philanthropic missions.',
    initial: 'S',
    color: 'orange',
    colorClass: 'bg-orange-100 text-orange-600',
    borderClass: 'border-orange-200',
  },
  {
    name: 'Mr. Suhaib Usmani',
    role: 'Managing Director',
    desc: 'Guiding the organizations strategic vision and operations, ensuring that every initiative translates into meaningful, on-ground community impact.',
    initial: 'S',
    color: 'blue',
    colorClass: 'bg-blue-100 text-blue-600',
    borderClass: 'border-blue-200',
  },
  {
    name: 'Mrs. Beena Verma',
    role: 'Treasurer',
    desc: 'Our trusted financial steward, maintaining absolute transparency and accountability to ensure every donation reaches those who need it most.',
    initial: 'B',
    color: 'emerald',
    colorClass: 'bg-emerald-100 text-emerald-600',
    borderClass: 'border-emerald-200',
  },
  {
    name: 'Mr. Syed Iftekhar Ul Ameen',
    role: 'Operations Director',
    desc: 'Masterminding our logistical frameworks and flawlessly driving the execution of our large-scale community camps and relief distributions.',
    initial: 'S',
    color: 'indigo',
    colorClass: 'bg-indigo-100 text-indigo-600',
    borderClass: 'border-indigo-200',
  },
  {
    name: 'Mr. Faizan Ansari',
    role: 'I.T. Head',
    desc: 'Leveraging modern technology to streamline our outreach, enhance our digital presence, and build robust platforms for our campaigns.',
    initial: 'F',
    color: 'slate',
    colorClass: 'bg-slate-100 text-slate-600',
    borderClass: 'border-slate-200',
  },
  {
    name: 'Mr. Bilal Akhtar',
    role: 'Development Manager',
    desc: 'Focusing on program expansion and sustainable growth, forging strategic partnerships to scale our humanitarian efforts.',
    initial: 'B',
    color: 'purple',
    colorClass: 'bg-purple-100 text-purple-600',
    borderClass: 'border-purple-200',
  },
  {
    name: 'Mr. Faheem Ahmad',
    role: 'Volunteer Coordinator',
    desc: 'The heart of our ground force, continuously mobilizing, training, and inspiring our dedicated network of volunteers to serve effectively.',
    initial: 'F',
    color: 'rose',
    colorClass: 'bg-rose-100 text-rose-600',
    borderClass: 'border-rose-200',
  },
  {
    name: 'Mr. Shahid Ali',
    role: 'Fundraiser',
    desc: 'Championing our resource generation, connecting with compassionate donors and corporate sponsors to fuel our life-changing programs.',
    initial: 'S',
    color: 'amber',
    colorClass: 'bg-amber-100 text-amber-600',
    borderClass: 'border-amber-200',
  },
];

const approachList = [
  'Work with schools under Vidyanjali initiatives',
  'Distribute winter sweaters & clothing to students',
  'Provide school uniforms to underprivileged children',
  'Organize comprehensive health camps in communities',
  'Facilitate vital document creation (Aadhar, etc.)',
  'Deliver emergency relief and food distribution',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-28">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-medium text-sm mb-6 border border-blue-200"
          >
            <Heart className="w-4 h-4" />
            Hope Starts Here
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">G Goodwill Trust</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed"
          >
            Founded with a steadfast commitment to humanity, G Goodwill Trust focuses on education, empowerment, and compassion. Our dedicated team works tirelessly to bridge the gap between privilege and disadvantage, ensuring every individual can live with dignity.
          </motion.p>
        </div>
      </section>

      {/* 2. FLOATING STATS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div className="text-slate-500 font-medium mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                <Target className="w-32 h-32 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To serve humanity by providing education, healthcare, and essential support to underprivileged communities. We strive to empower them with the necessary tools and resources to lead a life of dignity, hope, and limitless opportunity.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                <Eye className="w-32 h-32 text-emerald-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To create a compassionate, self-sustaining society where the systemic barriers of inequality are dismantled. A world where every individual, regardless of their background, has equitable access to quality education, healthcare, and the foundational resources required to thrive.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. OUR APPROACH */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Methodology</span>
            <h2 className="text-3xl md:text-4xl font-bold">How We Operate</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-2xl font-bold mb-6">Action Areas</h3>
              <ul className="space-y-4">
                {approachList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-2xl font-bold mb-4">Our Presence</h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Currently active in Delhi, we strategically focus our efforts on areas with the greatest need, maximizing our impact in Shaheen Bagh, Okhla, and surrounding communities.
              </p>
              
              <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                <Map className="absolute top-4 right-4 w-24 h-24 text-slate-800 opacity-50" />
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-2">G Goodwill Trust</h4>
                  <p className="text-slate-300">G-48 Shaheen Bagh, Okhla,</p>
                  <p className="text-slate-300">New Delhi-110025, India</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. BOARD OF TRUSTEES */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Board of Trustees</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Our passionate executive team dedicated to driving the foundations mission forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 flex flex-col h-full text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white shadow-sm ${member.colorClass}`}>
                  {member.initial}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 w-fit mx-auto ${member.colorClass}`}>
                  {member.role}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{member.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

