'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  Heart,
  BookOpen,
  HeartPulse,
  ArrowRight,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Users,
  GraduationCap,
  HandHeart,
  Shield,
  Quote
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
}

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

/* ═══════════════════════════════════════════
   HERO IMAGES
   ═══════════════════════════════════════════ */

const heroImages = [
  '/assets/hompage1.jpg',
  '/assets/hompage2.jpg',
  '/assets/hompage3.jpg',
  '/assets/hompage4.jpg',
  '/assets/hompage5.jpg',
]

/* ═══════════════════════════════════════════
   ANIMATED COUNTER COMPONENT
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <div ref={ref} className="text-4xl md:text-6xl font-black text-white tabular-nums">
      {count.toLocaleString('en-IN')}{suffix}
    </div>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden -mt-20">

      {/* ═══════════════════════════════════════
          1. CINEMATIC HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/hompage1.jpg"
            className="w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
          </video>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Floating Aurora Blobs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] animate-aurora" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-cyan-400/10 blur-[150px] animate-aurora" style={{ animationDelay: '-5s' }} />
          <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] animate-aurora" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Image Carousel (behind text, subtle) */}
        <div className="absolute inset-0 z-[0] opacity-30">
          {heroImages.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`G Goodwill Trust community work ${idx + 1}`}
                fill
                className="object-cover animate-ken-burns"
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-8">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-white/90 text-sm font-semibold tracking-wide">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  Transforming Lives Since 2020 — New Delhi, India
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
              >
                <span className="text-white">Empower Lives.</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Inspire Change.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Bridging the gap between privilege and disadvantage. Join G Goodwill Trust
                to create sustainable, long-term impact in education, healthcare, and empowerment.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/donate"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-cyan-400" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient" />
                  <span className="relative flex items-center gap-2">
                    Donate Now <Heart className="w-5 h-5 fill-current" />
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold glass text-white rounded-full hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                >
                  Our Mission <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 80G Tax Exempt
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Govt. Registered NGO
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 100% Transparent
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Nav Dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <button onClick={prevSlide} className="w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all" aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentSlide ? 'bg-white w-10' : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
          <button onClick={nextSlide} className="w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 text-xs font-medium">
          <span>Scroll to Explore</span>
          <ChevronDown className="w-5 h-5 animate-scroll-bounce" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. IMPACT STATS — ANIMATED COUNTERS
          ═══════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 animate-gradient" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-[20%] w-[300px] h-[300px] rounded-full bg-cyan-400 blur-[100px] animate-float" />
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] rounded-full bg-blue-300 blur-[120px] animate-float-slow" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-blue-200 font-semibold tracking-widest text-sm uppercase mb-3">
              Our Impact in Numbers
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white">
              Real Change, Real Lives
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { label: 'Families Fed', value: 2000, suffix: '+', icon: HandHeart, color: 'from-orange-400 to-amber-400' },
              { label: 'Rakhis Tied', value: 5100, suffix: '+', icon: Heart, color: 'from-pink-400 to-rose-400' },
              { label: 'Awareness Created', value: 1100, suffix: '+', icon: Users, color: 'from-cyan-400 to-blue-400' },
              { label: 'Health Checks', value: 1000, suffix: '+', icon: HeartPulse, color: 'from-emerald-400 to-green-400' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInScale}
                className="relative group"
              >
                <div className="glass rounded-3xl p-6 md:p-8 text-center hover:bg-white/15 transition-all duration-500 group-hover:scale-105">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  {/* Counter */}
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  {/* Label */}
                  <div className="text-blue-100 font-medium text-sm mt-2 tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. OUR INTERVENTIONS — 3D TILT CARDS
          ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.p variants={fadeInUp} className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-3">
                What We Do
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4">
                Our{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Interventions
                </span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-500 text-lg">
                Structured programs creating real, measurable change on the ground.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/programs" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full">
                View All Programs <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Education Initiatives',
                desc: 'Providing merit-based scholarships, school supplies, and vocational training to empower the next generation with knowledge and opportunity.',
                icon: GraduationCap,
                gradient: 'from-blue-500 to-cyan-500',
                bg: 'bg-blue-50',
                shadow: 'shadow-blue-500/10'
              },
              {
                title: 'Community Health Camps',
                desc: 'Bringing vital healthcare to grassroots levels through free medical check-ups, vaccinations, dental camps, and health awareness drives.',
                icon: HeartPulse,
                gradient: 'from-rose-500 to-pink-500',
                bg: 'bg-rose-50',
                shadow: 'shadow-rose-500/10'
              },
              {
                title: 'Poverty Alleviation',
                desc: 'Delivering immediate relief through monthly ration kits, clothing drives, and long-term livelihood support for vulnerable families.',
                icon: HandHeart,
                gradient: 'from-amber-500 to-orange-500',
                bg: 'bg-amber-50',
                shadow: 'shadow-amber-500/10'
              }
            ].map((program, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`tilt-card bg-white rounded-3xl p-8 md:p-10 border border-slate-100 relative overflow-hidden group ${program.shadow} shadow-xl`}
              >
                {/* Hover gradient reveal */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <program.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-900">{program.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">{program.desc}</p>

                <Link href="/programs" className="inline-flex items-center text-slate-900 font-bold group-hover:text-blue-600 transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. COMMUNITY REVIEWS — INFINITE MARQUEE
          ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-20 left-10 text-blue-100 pointer-events-none opacity-30">
          <Quote className="w-40 h-40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16 flex flex-col items-center text-center"
          >
            <motion.p variants={fadeInUp} className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-3">
              Testimonials
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4">
              Community{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Trust</span>
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 glass-light px-6 py-3 rounded-full shadow-sm mt-4">
              <span className="text-3xl font-black text-slate-900">4.9</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-slate-500 font-medium text-sm ml-2">31 Google Reviews</span>
            </motion.div>
          </motion.div>

          {/* Infinite Marquee */}
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
                {/* Duplicate for seamless loop */}
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex gap-6 pr-6">
                    {[
                      { name: 'Mohd Minhaj Alam', review: 'Amazing NGO doing real, impactful work on the ground in Shaheen Bagh. Their dedication to the community is truly inspiring and heartwarming.', time: '2 weeks ago', rating: 5 },
                      { name: 'Dr. Bushra Shams', review: 'Very transparent and dedicated team. Their education programs are genuinely changing lives. I have seen the impact firsthand in the community.', time: '1 month ago', rating: 5 },
                      { name: 'Suhaib Abbasi', review: 'Proud to see the impact of G Goodwill Trust. A highly motivated team working selflessly for humanity and making a real difference.', time: '2 months ago', rating: 5 },
                      { name: 'Farid Baig', review: 'Commendable relief drives during tough times. True dedication towards society and underprivileged communities. Highly recommended for donations.', time: '3 months ago', rating: 5 },
                      { name: 'Zainab Khan', review: 'The health camp organized by G Goodwill Trust was amazing. Free dental checkup and medicines distributed. Great initiative for the community.', time: '1 month ago', rating: 5 },
                      { name: 'Ahmed Raza', review: 'Witnessed their Ramadan food distribution drive. Every family in the neighborhood received quality ration kits. Truly professional and caring.', time: '3 weeks ago', rating: 5 }
                    ].map((review, idx) => (
                      <div
                        key={`${setIdx}-${idx}`}
                        className="w-[380px] flex-shrink-0 bg-white rounded-3xl p-7 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Header */}
                        <div className="flex items-center mb-5">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 mr-4">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{review.name}</h4>
                            <p className="text-xs text-slate-400">{review.time}</p>
                          </div>
                        </div>
                        {/* Stars */}
                        <div className="flex text-amber-400 mb-4">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        {/* Review text */}
                        <p className="text-slate-600 text-sm leading-relaxed">&quot;{review.review}&quot;</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. UPCOMING EVENTS — PREMIUM CARDS
          ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.p variants={fadeInUp} className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-3">
              Stay Updated
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black">
              Upcoming{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Events</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { day: '20', month: 'JUN', type: 'Education', title: 'Educational Supply Drive', loc: 'Okhla, New Delhi', gradient: 'from-blue-500 to-cyan-500' },
              { day: '05', month: 'JUL', type: 'Assistance', title: 'Aadhaar & Document Camp', loc: 'Shaheen Bagh Center', gradient: 'from-emerald-500 to-green-500' },
              { day: '18', month: 'JUL', type: 'Healthcare', title: 'Free Dental Checkup Camp', loc: 'Local Community Clinic', gradient: 'from-rose-500 to-pink-500' }
            ].map((event, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="tilt-card bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 group"
              >
                {/* Date Badge */}
                <div className={`bg-gradient-to-r ${event.gradient} p-5 flex items-center justify-between`}>
                  <div className="text-white">
                    <span className="block text-4xl font-black leading-none">{event.day}</span>
                    <span className="block text-sm font-bold opacity-80 mt-1">{event.month} 2025</span>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                    {event.type}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-slate-300" />
                    {event.loc}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. DRAMATIC CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-[3rem] overflow-hidden"
          >
            {/* Animated gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 animate-gradient" />
            
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-blue-500/20 animate-float-slow" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border border-cyan-500/20 animate-float" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px]" />
              <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-blue-400/30 animate-float" />
              <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-cyan-400/30 animate-float-slow" />
              <div className="absolute top-20 right-[30%] w-2 h-2 rounded-full bg-purple-400/40 animate-float" style={{ animationDelay: '-2s' }} />
            </div>

            <div className="relative z-10 p-10 md:p-20 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="mb-6">
                  <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                </motion.div>
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
                >
                  Make an Impact{' '}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Today.
                  </span>
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Your contribution directly funds our grassroots initiatives in New Delhi.
                  Become an annual member for ₹1100 and help us sustain our operations throughout the year.
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/donate"
                    className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/30 animate-pulse-glow"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:from-orange-400 group-hover:to-amber-400" />
                    <span className="relative flex items-center gap-2">
                      Become a Member <Heart className="w-5 h-5 fill-current" />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold glass text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    Join as Volunteer <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
