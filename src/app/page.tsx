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
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 }
  }
}

/* ═══════════════════════════════════════════
   HERO IMAGES
   ═══════════════════════════════════════════ */

const heroImages = [
  {
    src: '/assets/hompage1.jpg',
    tag: 'Chapter 01 &bull; Education',
    headline: 'Nurturing young minds with dignity, books & dreams'
  },
  {
    src: '/assets/hompage2.jpg',
    tag: 'Chapter 02 &bull; Healthcare',
    headline: 'Bringing vital medical expertise to underserved communities'
  },
  {
    src: '/assets/hompage3.jpg',
    tag: 'Chapter 03 &bull; Sustenance',
    headline: 'Direct food security & emergency humanitarian aid'
  },
  {
    src: '/assets/hompage4.jpg',
    tag: 'Chapter 04 &bull; Empowerment',
    headline: 'Vocational avenues fostering financial independence'
  },
  {
    src: '/assets/hompage5.jpg',
    tag: 'Chapter 05 &bull; Brotherhood',
    headline: 'Spreading harmony and grassroots care across New Delhi'
  }
]

/* ═══════════════════════════════════════════
   ANIMATED COUNTER (useInView)
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2400
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
    <div ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-light font-serif text-[#f4f4f5] tabular-nums tracking-normal">
      {count.toLocaleString('en-IN')}{suffix}
    </div>
  )
}

/* ═══════════════════════════════════════════
   3D TILT BENTO CARD (LUXURY ARCHITECTURE)
   ═══════════════════════════════════════════ */

interface TiltCardProps {
  title: string
  desc: string
  icon: React.ElementType
  badge: string
  number: string
}

function LuxuryBentoCard({ title, desc, icon: Icon, badge, number }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])

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
      className="relative rounded-2xl p-8 sm:p-10 bg-[#121214] border border-[#27272a] group cursor-pointer transition-all duration-700 hover:border-[#d4af37]/60 flex flex-col justify-between overflow-hidden shadow-2xl"
    >
      {/* Subtle gold ambient glow on hover */}
      <div 
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#d4af37]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      <div style={{ transform: 'translateZ(25px)' }}>
        <div className="flex justify-between items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-[#d4af37] group-hover:border-[#d4af37]/40 transition-colors duration-500">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#a1a1aa] px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a]">
              {badge}
            </span>
            <span className="font-serif text-lg text-[#52525b] font-light">
              {number}
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#f4f4f5] tracking-wide mb-3 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-[#a1a1aa] text-sm leading-relaxed font-light mb-8">
          {desc}
        </p>
      </div>

      <div style={{ transform: 'translateZ(15px)' }}>
        <Link
          href="/programs"
          className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#d4af37] hover:text-[#fef08a] transition-colors"
        >
          View Detailed Mandate <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   LUXURY GOLD BUTTON
   ═══════════════════════════════════════════ */

function LuxuryDonateButton() {
  return (
    <Link
      href="/donate"
      className="relative group inline-flex items-center gap-3 px-9 py-4 text-sm font-semibold tracking-wider uppercase text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.45)]"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#c59b27] transition-all duration-300 group-hover:brightness-110" />
      <span className="relative flex items-center gap-2">
        Make a Contribution <Heart className="w-4 h-4 fill-black text-black" />
      </span>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE (LUXURY EDITORIAL STANDARDS)
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
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [nextSlide, isAutoPlay])

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-hidden -mt-20 selection:bg-[#d4af37] selection:text-black">

      {/* ═══════════════════════════════════════
          1. EDITORIAL HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-28 flex items-center justify-center overflow-hidden border-b border-[#27272a]/40">
        
        {/* Deep Atmospheric Lighting */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] rounded-full bg-[#1e293b]/25 blur-[160px]" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-[#d4af37]/5 blur-[180px]" />
          
          {/* Refined fine line overlay */}
          <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            {/* Left Column: Refined Typography & Grand Editorial Presence */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 max-w-2xl"
            >
              {/* Trust Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#121214] border border-[#27272a] text-[#a1a1aa] text-xs font-medium tracking-wide mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <span className="tracking-widest uppercase text-[11px]">80G Registered Trust &bull; New Delhi</span>
              </motion.div>

              {/* Grand Editorial Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-normal leading-[1.08] mb-8 text-[#fafafa]"
              >
                Where Compassion Meets{' '}
                <span className="italic text-[#d4af37] font-light font-serif">
                  Dignity.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-[#a1a1aa] font-light leading-relaxed mb-10 max-w-xl"
              >
                G Goodwill Trust operates at the intersection of human empathy and structured grassroots execution. Providing food security, verified medical clinics, and educational scholarships across underprivileged households.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 mb-14">
                <LuxuryDonateButton />

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-wider uppercase text-[#d4d4d8] bg-[#121214] border border-[#27272a] rounded-full hover:border-[#52525b] hover:text-white transition-all duration-300"
                >
                  Our Philosophy <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa]" />
                </Link>
              </motion.div>

              {/* Verified Statistics Border */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-[#27272a]"
              >
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#f4f4f5]">100%</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#71717a] mt-1 font-medium">Direct Aid</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#d4af37]">Section 80G</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#71717a] mt-1 font-medium">Tax Exemption</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#f4f4f5]">4.9 / 5.0</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#71717a] mt-1 font-medium">Public Trust</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Editorial Photo Exhibition Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Outer Luxury Shadow Ring */}
              <div className="relative rounded-2xl overflow-hidden bg-[#121214] border border-[#27272a] p-2 shadow-2xl">
                {/* Image Frame */}
                <div className="relative h-[390px] sm:h-[480px] w-full rounded-xl overflow-hidden bg-black">
                  {heroImages.map((item, idx) => (
                    <div
                      key={item.src}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentSlide
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.headline}
                        fill
                        priority={idx === 0}
                        className="object-cover brightness-95"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      {/* Vignette Shadow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent" />
                      
                      {/* Captions */}
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                        <span className="inline-block text-[#d4af37] text-[10px] tracking-[0.25em] font-semibold uppercase mb-2">
                          {item.tag}
                        </span>
                        <p className="text-white font-serif text-lg sm:text-xl font-normal leading-snug">
                          &ldquo;{item.headline}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Curated Navigation Controls */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#121214]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:border-[#d4af37] transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#121214]/80 backdrop-blur-md border border-[#27272a] flex items-center justify-center text-white hover:border-[#d4af37] transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Counter Bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#0c0c0e]">
                  <div className="flex items-center gap-2">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          idx === currentSlide
                            ? 'w-6 bg-[#d4af37]'
                            : 'w-1.5 bg-[#27272a] hover:bg-[#3f3f46]'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#71717a]">
                    0{currentSlide + 1} / 0{heroImages.length}
                  </span>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#121214]/90 backdrop-blur-xl border border-[#27272a] rounded-xl p-3.5 shadow-2xl flex items-center gap-3 z-30">
                <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#d4af37]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[#f4f4f5] text-xs font-medium">Shaheen Bagh Relief Center</div>
                  <div className="text-[#71717a] text-[10px]">Open for public assistance</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#71717a] pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase">Scroll</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#71717a]" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. LIVE VERIFIABLE IMPACT COUNTERS
          ═══════════════════════════════════════ */}
      <section className="relative py-24 bg-[#0c0c0e] border-b border-[#27272a]/40">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#d4af37] font-medium text-xs tracking-[0.2em] uppercase mb-3 inline-block">
              Verifiable Milestones
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#f4f4f5] leading-tight">
              Human Lives Touched & Sustained.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { label: 'Families Sustained with Rations', value: 2000, suffix: '+', icon: HandHeart },
              { label: 'Rakhis Tied for Social Harmony', value: 5100, suffix: '+', icon: Heart },
              { label: 'Beneficiaries Reached via Camps', value: 1100, suffix: '+', icon: Users },
              { label: 'Free Clinical Consultations', value: 1000, suffix: '+', icon: HeartPulse }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInScale}
                className="relative"
              >
                <div className="h-full rounded-2xl bg-[#121214] border border-[#27272a] p-7 text-center hover:border-[#3f3f46] transition-all duration-500">
                  <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-5 text-[#d4af37]">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <div className="text-[#a1a1aa] text-xs font-light tracking-wide mt-3 leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. ASYMMETRICAL BENTO BOX (INTERVENTIONS)
          ═══════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 max-w-6xl mx-auto">
            <div>
              <span className="text-[#d4af37] font-medium tracking-[0.2em] text-xs uppercase mb-3 inline-block">
                Core Initiatives
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white">
                Our Core Interventions.
              </h2>
              <p className="text-[#a1a1aa] text-base sm:text-lg mt-3 max-w-xl font-light">
                Continuous on-ground programs engineered to foster educational growth, health resilience, and social justice.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#fef08a] text-xs font-semibold uppercase tracking-wider transition-colors group"
            >
              Explore All Projects <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetrical Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
            {/* Bento 1: Primary Education (Span 7) */}
            <div className="md:col-span-7">
              <LuxuryBentoCard
                title="Education & Lifelong Scholarships"
                desc="Empowering first-generation school learners from slum clusters with continuous school tuition grants, school bags, notebooks, and digital literacy labs to prevent school dropouts."
                icon={GraduationCap}
                badge="High Priority"
                number="01"
              />
            </div>

            {/* Bento 2: Healthcare (Span 5) */}
            <div className="md:col-span-5">
              <LuxuryBentoCard
                title="Community Health & Dental Clinics"
                desc="Organizing free monthly clinics with certified doctors, diagnostic tests, pediatric medicine distributions, and dental consultations in Shaheen Bagh and Okhla."
                icon={HeartPulse}
                badge="Monthly"
                number="02"
              />
            </div>

            {/* Bento 3: Sustenance (Span 5) */}
            <div className="md:col-span-5">
              <LuxuryBentoCard
                title="Direct Ration & Emergency Relief"
                desc="Distributing essential food kits (flour, pulses, oil, spices) and winter blankets directly to widows, daily wagers, and families facing immediate distress."
                icon={HandHeart}
                badge="Direct Aid"
                number="03"
              />
            </div>

            {/* Bento 4: Citizen Rights & Legal (Span 7) */}
            <div className="md:col-span-7">
              <LuxuryBentoCard
                title="Legal Documentation & Citizen Rights"
                desc="Helping impoverished families procure government welfare documents including Aadhaar, Ayushman Bharat health insurance cards, and pension support schemes."
                icon={Shield}
                badge="Advocacy"
                number="04"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. INFINITE MARQUEE REVIEWS (CURATED)
          ═══════════════════════════════════════ */}
      <section className="py-24 bg-[#0c0c0e] border-y border-[#27272a]/40 relative overflow-hidden">
        <div className="container mx-auto px-6 mb-16 text-center">
          <span className="text-[#d4af37] font-medium text-xs tracking-[0.2em] uppercase mb-3 inline-block">
            Voice of the Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white mb-5">
            Public Trust & Community Testimonials.
          </h2>
          <div className="inline-flex items-center gap-3.5 px-6 py-2 rounded-full bg-[#121214] border border-[#27272a] shadow-sm">
            <span className="text-2xl font-serif font-normal text-white">4.9</span>
            <div className="flex text-[#d4af37] gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[#71717a] text-xs border-l border-[#27272a] pl-3.5">
              Verified Public Reviews
            </span>
          </div>
        </div>

        {/* Marquee Row */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0c0c0e] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#0c0c0e] to-transparent z-10 pointer-events-none" />

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
                    className="w-[340px] sm:w-[390px] flex-shrink-0 bg-[#121214] border border-[#27272a] rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#3f3f46] transition-colors duration-300 flex flex-col justify-between"
                  >
                    <p className="text-[#d4d4d8] text-sm leading-relaxed font-light italic mb-6">
                      &ldquo;{review.review}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-[#27272a] pt-4">
                      <div>
                        <h4 className="font-serif font-normal text-white text-base">{review.name}</h4>
                        <p className="text-[#71717a] text-xs">{review.time}</p>
                      </div>
                      <div className="flex text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. UPCOMING EVENTS & DRIVES
          ═══════════════════════════════════════ */}
      <section className="py-28">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#d4af37] font-medium text-xs tracking-[0.2em] uppercase mb-3 inline-block">
              Community Calendar
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white">
              Upcoming Relief Drives & Camps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { day: '20', month: 'JUN', type: 'Education', title: 'Educational Supply Drive', loc: 'Okhla, New Delhi' },
              { day: '05', month: 'JUL', type: 'Assistance', title: 'Aadhaar & Citizen Rights Camp', loc: 'Shaheen Bagh Center' },
              { day: '18', month: 'JUL', type: 'Healthcare', title: 'Free Medical & Dental Camp', loc: 'Local Community Clinic' }
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="rounded-2xl bg-[#121214] border border-[#27272a] overflow-hidden shadow-xl hover:border-[#3f3f46] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 border-b border-[#27272a] flex items-center justify-between bg-[#151518]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-light text-[#d4af37]">{event.day}</span>
                    <span className="text-xs uppercase tracking-widest text-[#a1a1aa]">{event.month} 2025</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1c1c20] border border-[#27272a] text-[#a1a1aa] text-[10px] tracking-wider uppercase">
                    {event.type}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-lg font-serif font-normal text-white mb-3">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-[#a1a1aa] text-xs font-light">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-[#d4af37]" />
                    {event.loc}
                  </div>
                </div>

                <div className="px-7 pb-7">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-[#18181b] hover:bg-[#202024] text-xs font-semibold tracking-wider uppercase text-[#d4d4d8] hover:text-white transition-colors border border-[#27272a]"
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
          6. GRAND CTA — PATRONAGE & MEMBERSHIP
          ═══════════════════════════════════════ */}
      <section className="py-20 pb-32">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative rounded-3xl overflow-hidden bg-[#121214] border border-[#27272a] p-10 sm:p-16 lg:p-20 text-center max-w-5xl mx-auto shadow-2xl">
            
            {/* Ambient Gold Flare */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-[130px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181b] border border-[#27272a] text-[#d4af37] text-xs font-medium tracking-widest uppercase mb-8">
                <Sparkles className="w-3.5 h-3.5" /> Annual Patronage
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight mb-6 leading-tight">
                Empower a Household with Just{' '}
                <span className="italic text-[#d4af37] font-serif">
                  ₹1100 / Year
                </span>
              </h2>

              <p className="text-[#a1a1aa] text-base sm:text-lg mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                Join our Annual Membership program. Your direct pledge ensures sustainable rations, school kits, and emergency medical security for vulnerable families throughout the calendar year.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <LuxuryDonateButton />

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-xs font-semibold tracking-wider uppercase text-[#d4d4d8] bg-[#18181b] border border-[#27272a] hover:border-[#52525b] hover:text-white transition-all duration-300"
                >
                  Join as Volunteer <ArrowRight className="w-3.5 h-3.5 text-[#71717a]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
