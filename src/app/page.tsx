'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'
import {
  Heart,
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
  Quote,
  CheckCircle2,
  ArrowUpRight,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
}

/* ═══════════════════════════════════════════
   HERO IMAGES
   ═══════════════════════════════════════════ */

const heroImages = [
  {
    src: '/assets/hompage1.jpg',
    tag: 'Education Drives',
    headline: 'Igniting young minds with education & dreams'
  },
  {
    src: '/assets/hompage2.jpg',
    tag: 'Health & Medical',
    headline: 'Healthcare reaching the most vulnerable corners'
  },
  {
    src: '/assets/hompage3.jpg',
    tag: 'Community Relief',
    headline: 'Warmth, food & compassion in times of crisis'
  },
  {
    src: '/assets/hompage4.jpg',
    tag: 'Women Empowerment',
    headline: 'Building self-reliance and vocational dignity'
  },
  {
    src: '/assets/hompage5.jpg',
    tag: 'Grassroots Smiles',
    headline: 'Spreading joy and brotherhood across New Delhi'
  }
]

/* ═══════════════════════════════════════════
   ANIMATED COUNTER COMPONENT (useInView)
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2200
    const step = Math.max(1, Math.ceil(target / (duration / 16)))
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
    <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-black text-white tabular-nums tracking-tight">
      {count.toLocaleString('en-IN')}{suffix}
    </div>
  )
}

/* ═══════════════════════════════════════════
   3D TILT CARD COMPONENT
   ═══════════════════════════════════════════ */

interface TiltCardProps {
  title: string
  desc: string
  icon: React.ElementType
  gradient: string
  badge: string
}

function InteractiveTiltCard({ title, desc, icon: Icon, gradient, badge }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative rounded-3xl p-8 sm:p-10 glass border border-white/10 group cursor-pointer transition-colors duration-500 hover:border-cyan-400/40 flex flex-col justify-between"
    >
      {/* Dynamic glow behind card */}
      <div 
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 blur-2xl transition duration-500 pointer-events-none`}
      />

      <div style={{ transform: 'translateZ(30px)' }}>
        <div className="flex justify-between items-center mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10">
            {badge}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          {desc}
        </p>
      </div>

      <div style={{ transform: 'translateZ(20px)' }}>
        <Link
          href="/programs"
          className="inline-flex items-center text-sm font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors"
        >
          View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   MAGNETIC GLOWING CTA BUTTON
   ═══════════════════════════════════════════ */

function GlowingDonateButton() {
  return (
    <Link
      href="/donate"
      className="relative group inline-flex items-center gap-3 px-9 py-4 text-base sm:text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(249,115,22,0.6)]"
    >
      {/* Animated Conic Border Glow */}
      <span className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 animate-gradient blur-sm opacity-90 group-hover:opacity-100 transition duration-300" />
      <span className="absolute inset-[1px] rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-amber-600" />
      
      <span className="relative flex items-center gap-2 tracking-wide">
        Donate Now <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
      </span>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(nextSlide, 6500)
    return () => clearInterval(timer)
  }, [nextSlide, isAutoPlay])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden -mt-20 selection:bg-blue-600 selection:text-white">

      {/* ═══════════════════════════════════════
          1. MODERN HERO SECTION (AURORA MESH BG)
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden">
        
        {/* Subtle Animated Mesh Gradient & Cyber Aurora Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] rounded-full bg-blue-600/25 blur-[150px] animate-aurora" />
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[160px] animate-aurora" style={{ animationDelay: '-6s' }} />
          <div className="absolute -bottom-40 left-10 w-[550px] h-[550px] rounded-full bg-indigo-600/25 blur-[140px] animate-aurora" style={{ animationDelay: '-12s' }} />
          
          {/* Subtle geometric dot grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.15]" 
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold High-Contrast Typography & Glowing CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 max-w-2xl"
            >
              {/* Trust Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-white/10 text-white/90 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>Govt. 80G Certified Non-Profit &bull; Shaheen Bagh, New Delhi</span>
              </motion.div>

              {/* Bold High-Contrast Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white"
              >
                Humanity First.{' '}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                  Real Grassroots Impact.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-xl"
              >
                G Goodwill Trust bridges the gap between privilege and disadvantage. From daily ration drives and free medical consultations to child education scholarships — every rupee delivers verifiable hope.
              </motion.p>

              {/* Action Buttons: Glowing Donate Button */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 mb-10">
                <GlowingDonateButton />

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base sm:text-lg font-semibold text-slate-200 glass border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  Our Mission <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Verified Trust Stats Pills */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/10"
              >
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5">Direct Aid Reached</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400">80G</span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5">Tax Exemption</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">4.9★</span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5">Google Rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Holographic Photo Showcase with Slide Descriptions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Outer Glowing Holographic Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-700 pointer-events-none" />

              <div className="relative rounded-[2.2rem] overflow-hidden glass border border-white/20 p-2 shadow-2xl shadow-black/80">
                {/* Carousel Container */}
                <div className="relative h-[380px] sm:h-[460px] w-full rounded-[1.8rem] overflow-hidden bg-slate-900">
                  {heroImages.map((item, idx) => (
                    <div
                      key={item.src}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        idx === currentSlide
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-105 z-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.headline}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      {/* Gradient bottom overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      {/* Slide Information */}
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase mb-2">
                          {item.tag}
                        </span>
                        <p className="text-white font-bold text-lg sm:text-xl drop-shadow-md leading-snug">
                          {item.headline}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Manual Arrow Controls */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom slide progress indicator */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03]">
                  <div className="flex items-center gap-2">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === currentSlide
                            ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    0{currentSlide + 1} / 0{heroImages.length}
                  </span>
                </div>
              </div>

              {/* Floating Live Active Status Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 glass border border-white/20 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3 backdrop-blur-xl z-30 animate-float">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Daily Ration & Camp</div>
                  <div className="text-slate-400 text-[10px]">Active in Okhla, New Delhi</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors pointer-events-none">
          <span className="text-[11px] font-medium tracking-widest uppercase">Explore Impact</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-slate-400" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. LIVE IMPACT COUNTERS (useInView)
          ═══════════════════════════════════════ */}
      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-blue-950/40 to-slate-950 border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-cyan-400 font-bold text-xs tracking-widest uppercase mb-2 inline-block">
              Verifiable Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Number Represents a Living Smile
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { label: 'Families Provided Food Kits', value: 2000, suffix: '+', icon: HandHeart, color: 'from-orange-500 to-amber-500' },
              { label: 'Rakhis Tied for Harmony', value: 5100, suffix: '+', icon: Heart, color: 'from-rose-500 to-pink-500' },
              { label: 'Citizens Reached via Drives', value: 1100, suffix: '+', icon: Users, color: 'from-cyan-500 to-blue-500' },
              { label: 'Free Health Consultations', value: 1000, suffix: '+', icon: HeartPulse, color: 'from-emerald-500 to-teal-500' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInScale}
                className="relative group"
              >
                <div className="h-full rounded-3xl glass border border-white/10 p-6 sm:p-8 text-center hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <div className="text-slate-300 text-xs sm:text-sm font-medium mt-2 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. ASYMMETRICAL BENTO BOX GRID (INTERVENTIONS)
          ═══════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 max-w-6xl mx-auto">
            <div>
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-3 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Strategic Architecture
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                Core Interventions.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg mt-3 max-w-xl">
                High-impact initiatives built with structured grassroots execution and verified accountability.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors group"
            >
              Explore All Projects <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetrical Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
            {/* Bento 1: Large Featured Card (Span 7) */}
            <div className="md:col-span-7">
              <InteractiveTiltCard
                title="Education & Lifelong Scholarships"
                desc="Enabling first-generation school learners from slum clusters with continuous school tuition support, digital literacy labs, textbooks, and career guidance counseling to eliminate dropout rates."
                icon={GraduationCap}
                gradient="from-blue-600 via-cyan-500 to-indigo-600"
                badge="High Priority &bull; Youth Future"
              />
            </div>

            {/* Bento 2: Secondary Card (Span 5) */}
            <div className="md:col-span-5">
              <InteractiveTiltCard
                title="Grassroots Health & Dental Care"
                desc="Regular diagnostic clinics with MBBS doctors, pediatricians, free medications, dental kits, and immediate hospital referrals for critical cases."
                icon={HeartPulse}
                gradient="from-rose-500 via-pink-500 to-red-600"
                badge="Monthly Camps"
              />
            </div>

            {/* Bento 3: Third Card (Span 5) */}
            <div className="md:col-span-5">
              <InteractiveTiltCard
                title="Ration & Emergency Poverty Relief"
                desc="Direct monthly grain kits, nutritional nourishment for malnourished children, and immediate winter blanket drives for homeless households."
                icon={HandHeart}
                gradient="from-amber-500 via-orange-500 to-red-500"
                badge="Direct Aid"
              />
            </div>

            {/* Bento 4: Fourth Card - Community Trust Spotlight (Span 7) */}
            <div className="md:col-span-7">
              <InteractiveTiltCard
                title="Legal Documentation & Citizen Rights"
                desc="Specialized camps assisting widows, laborers, and underprivileged families in procuring essential Aadhaar, Ayushman Bharat health cards, and pension benefits."
                icon={Shield}
                gradient="from-emerald-500 via-teal-500 to-cyan-600"
                badge="Empowerment & Advocacy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. INFINITE MARQUEE REVIEWS
          ═══════════════════════════════════════ */}
      <section className="py-24 bg-slate-900/60 border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 mb-14 text-center">
          <span className="text-amber-400 font-bold text-xs tracking-widest uppercase mb-2 inline-block">
            Voice of the People
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Trusted by the Community
          </h2>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-white/10">
            <span className="text-2xl font-black text-white">4.9</span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-slate-400 text-xs font-medium border-l border-white/10 pl-3">
              Verified Public Reviews
            </span>
          </div>
        </div>

        {/* Marquee Row */}
        <div className="relative w-full overflow-hidden">
          {/* Edge blur fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee hover:[animation-play-state:paused] w-max py-2">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-6 pr-6">
                {[
                  { name: 'Mohd Minhaj Alam', review: 'Amazing NGO doing real, impactful work on the ground in Shaheen Bagh. Truly inspiring commitment.', time: '2 weeks ago' },
                  { name: 'Dr. Bushra Shams', review: 'Very transparent and dedicated team. Their educational relief camps genuinely transform needy children.', time: '1 month ago' },
                  { name: 'Suhaib Abbasi', review: 'Proud to see the grassroots footprint of G Goodwill Trust. Professional, genuine, and selfless.', time: '2 months ago' },
                  { name: 'Farid Baig', review: 'Commendable ration relief drives. You can see your donation reaching right into the hands of widows and daily wagers.', time: '3 months ago' },
                  { name: 'Zainab Khan', review: 'Attended their free health camp in Okhla. Free doctors, diagnostics and medicine for all without bias.', time: '1 month ago' }
                ].map((review, idx) => (
                  <div
                    key={`${setIdx}-${idx}`}
                    className="w-[340px] sm:w-[400px] flex-shrink-0 glass border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">{review.name}</h4>
                        <p className="text-slate-400 text-xs">{review.time}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                      &quot;{review.review}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. UPCOMING EVENTS & CAMPS
          ═══════════════════════════════════════ */}
      <section className="py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 inline-block">
              Get Involved
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Upcoming Drives & Camps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { day: '20', month: 'JUN', type: 'Education', title: 'Educational Supply Drive', loc: 'Okhla, New Delhi', gradient: 'from-blue-600 to-cyan-500' },
              { day: '05', month: 'JUL', type: 'Assistance', title: 'Aadhaar & Document Help', loc: 'Shaheen Bagh Center', gradient: 'from-emerald-600 to-green-500' },
              { day: '18', month: 'JUL', type: 'Healthcare', title: 'Free Medical Consultation', loc: 'Local Community Clinic', gradient: 'from-rose-600 to-pink-500' }
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="rounded-3xl glass border border-white/10 overflow-hidden shadow-2xl hover:border-white/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`bg-gradient-to-r ${event.gradient} p-5 flex items-center justify-between`}>
                  <div className="text-white">
                    <span className="text-3xl font-black">{event.day}</span>
                    <span className="text-xs font-bold uppercase ml-2 tracking-wider opacity-90">{event.month} 2025</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-white text-[11px] font-bold">
                    {event.type}
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-slate-400 text-xs sm:text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                    {event.loc}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl glass hover:bg-white/10 text-xs font-bold text-white transition-colors"
                  >
                    Volunteer for Camp
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. GRAND CTA — MEMBERSHIP & SUPPORT
          ═══════════════════════════════════════ */}
      <section className="py-20 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden glass border border-white/15 p-8 sm:p-14 lg:p-20 text-center max-w-5xl mx-auto shadow-2xl shadow-blue-500/10">
            
            {/* Background glowing flare */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" /> Become a Pillar of Hope
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                Empower a Family with Just{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  ₹1100 / Year
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                Join our Annual Membership program. Your direct pledge provides uninterrupted ration, educational support, and basic healthcare security to households in dire need.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/donate"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:scale-105 shadow-xl shadow-orange-500/30 transition-all duration-300"
                >
                  Become a Member <Heart className="w-5 h-5 fill-white" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-base font-semibold text-slate-200 glass hover:bg-white/10 transition-all duration-300"
                >
                  Join as Volunteer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
