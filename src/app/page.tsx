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
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 }
  }
}

/* ═══════════════════════════════════════════
   DEFAULT / FALLBACK DATA
   ═══════════════════════════════════════════ */

interface HeroSlideData {
  _id?: string
  src?: string
  image_url?: string
  tag: string
  headline: string
}

const DEFAULT_HERO_IMAGES: HeroSlideData[] = [
  {
    image_url: '/assets/hompage1.jpg',
    tag: 'Chapter 01 • Education',
    headline: 'Nurturing young minds with dignity, books & dreams'
  },
  {
    image_url: '/assets/hompage2.jpg',
    tag: 'Chapter 02 • Healthcare',
    headline: 'Bringing vital medical expertise to underserved communities'
  },
  {
    image_url: '/assets/hompage3.jpg',
    tag: 'Chapter 03 • Sustenance',
    headline: 'Direct food security & emergency humanitarian aid'
  },
  {
    image_url: '/assets/hompage4.jpg',
    tag: 'Chapter 04 • Empowerment',
    headline: 'Vocational avenues fostering financial independence'
  },
  {
    image_url: '/assets/hompage5.jpg',
    tag: 'Chapter 05 • Brotherhood',
    headline: 'Spreading harmony and grassroots care across New Delhi'
  }
]

interface PartnerData {
  _id?: string
  name: string
  subtitle: string
  badge: string
  logo_url: string
}

const DEFAULT_PARTNERS: PartnerData[] = [
  {
    name: 'The Times of India',
    subtitle: 'Media & Civic Outreach',
    badge: 'Media Alliance',
    logo_url: '/partners/times-of-india.svg'
  },
  {
    name: 'Colgate',
    subtitle: 'Oral Health & Hygiene Camps',
    badge: 'Health Partner',
    logo_url: '/partners/colgate.svg'
  },
  {
    name: 'Vidyanjali',
    subtitle: 'Ministry of Education, Govt. of India',
    badge: 'Govt. Initiative',
    logo_url: '/partners/vidyanjali.png'
  },
  {
    name: 'British Council',
    subtitle: 'International Education & Cultural Relations',
    badge: 'Global Council',
    logo_url: '/partners/british-council.svg'
  },
  {
    name: 'Mercedes-Benz',
    subtitle: 'Corporate Social Responsibility (CSR)',
    badge: 'CSR Partner',
    logo_url: '/partners/mercedes-benz.svg'
  },
  {
    name: 'Zarnetic',
    subtitle: 'Digital Infrastructure & IT Operations',
    badge: 'Technology Partner',
    logo_url: '/partners/zarnetic.svg'
  },
  {
    name: 'NCF',
    subtitle: 'Noble Citizen Foundation',
    badge: 'Civic Foundation',
    logo_url: '/partners/ncf.webp'
  },
  {
    name: 'Spread Smiles Foundation',
    subtitle: 'Grassroots Community & Child Welfare',
    badge: 'Community NGO',
    logo_url: '/partners/spread-smiles.svg'
  }
]

interface TestimonialData {
  _id?: string
  name: string
  review: string
  time: string
  rating?: number
}

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  { name: 'Mohd Minhaj Alam', review: 'Amazing NGO doing real, impactful work on the ground in Shaheen Bagh. Truly inspiring commitment.', time: '2 weeks ago', rating: 5 },
  { name: 'Dr. Bushra Shams', review: 'Very transparent and dedicated team. Their educational relief camps genuinely transform needy children.', time: '1 month ago', rating: 5 },
  { name: 'Suhaib Abbasi', review: 'Proud to see the grassroots footprint of G Goodwill Trust. Professional, genuine, and selfless.', time: '2 months ago', rating: 5 },
  { name: 'Farid Baig', review: 'Commendable ration relief drives. You can see your donation reaching right into the hands of widows and daily wagers.', time: '3 months ago', rating: 5 },
  { name: 'Zainab Khan', review: 'Attended their free health camp in Okhla. Free doctors, diagnostics and medicine for all without bias.', time: '1 month ago', rating: 5 }
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
    <div ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-normal font-serif text-slate-900 tabular-nums tracking-normal">
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
  colorTheme?: 'amber' | 'emerald' | 'rose' | 'blue'
}

function LuxuryBentoCard({ title, desc, icon: Icon, badge, number, colorTheme = 'amber' }: TiltCardProps) {
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

  // Theme styling presets
  const themeStyles = {
    amber: {
      iconBg: 'bg-amber-50 text-[#b45309] border-amber-200 group-hover:border-amber-400',
      badgeBg: 'bg-amber-50 text-[#b45309] border-amber-300',
      glow: 'bg-[#d4af37]/15',
      hoverBorder: 'hover:border-amber-400',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:border-emerald-400',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      glow: 'bg-emerald-500/10',
      hoverBorder: 'hover:border-emerald-400',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:border-rose-400',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
      glow: 'bg-rose-500/10',
      hoverBorder: 'hover:border-rose-400',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:border-blue-400',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
      glow: 'bg-blue-500/10',
      hoverBorder: 'hover:border-blue-400',
    },
  }[colorTheme];

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
      className={`relative rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 group cursor-pointer transition-all duration-700 ${themeStyles.hoverBorder} flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl`}
    >
      {/* Subtle ambient glow on hover */}
      <div 
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${themeStyles.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />

      <div style={{ transform: 'translateZ(25px)' }}>
        <div className="flex justify-between items-center mb-8">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors duration-500 shadow-2xs ${themeStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] tracking-[0.2em] font-bold uppercase px-3 py-1 rounded-full border ${themeStyles.badgeBg}`}>
              {badge}
            </span>
            <span className="font-serif text-lg text-slate-400 font-light">
              {number}
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-normal text-slate-900 tracking-wide mb-3 group-hover:text-[#b45309] transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed font-light mb-8">
          {desc}
        </p>
      </div>

      <div style={{ transform: 'translateZ(15px)' }}>
        <Link
          href="/programs"
          className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#b45309] hover:text-black transition-colors"
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
      className="relative group inline-flex items-center gap-3 px-9 py-4 text-sm font-bold tracking-wider uppercase text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.5)]"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#c59b27] transition-all duration-300 group-hover:brightness-105" />
      <span className="relative flex items-center gap-2">
        Make a Contribution <Heart className="w-4 h-4 fill-black text-black" />
      </span>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE (HIGH-CONTRAST EDITORIAL WHITE THEME)
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Dynamic state loaded from MongoDB
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>(DEFAULT_HERO_IMAGES)
  const [partners, setPartners] = useState<PartnerData[]>(DEFAULT_PARTNERS)
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(DEFAULT_TESTIMONIALS)
  const [stats, setStats] = useState({
    stat_rations: 2000,
    stat_rakhis: 5100,
    stat_beneficiaries: 1100,
    stat_clinics: 1000,
  })

  // Fetch dynamic content from MongoDB APIs on mount
  useEffect(() => {
    // 1. Hero Slides
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setHeroSlides(data.data)
        }
      })
      .catch(() => {})

    // 2. Brand Partners
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPartners(data.data)
        }
      })
      .catch(() => {})

    // 3. Impact Stats
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats(prev => ({
            ...prev,
            ...(data.data.stat_rations && { stat_rations: Number(data.data.stat_rations) }),
            ...(data.data.stat_rakhis && { stat_rakhis: Number(data.data.stat_rakhis) }),
            ...(data.data.stat_beneficiaries && { stat_beneficiaries: Number(data.data.stat_beneficiaries) }),
            ...(data.data.stat_clinics && { stat_clinics: Number(data.data.stat_clinics) }),
          }))
        }
      })
      .catch(() => {})

    // 4. Testimonials
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTestimonials(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [heroSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [heroSlides.length])

  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [nextSlide, isAutoPlay])

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden -mt-20 selection:bg-[#d4af37] selection:text-black">

      {/* ═══════════════════════════════════════
          1. EDITORIAL HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-28 flex items-center justify-center overflow-hidden border-b border-slate-200">
        
        {/* Soft Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] rounded-full bg-amber-100/40 blur-[140px]" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-slate-100/80 blur-[140px]" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{
              backgroundImage: 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
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
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide mb-8 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#b45309]" />
                <span className="tracking-widest uppercase text-[11px] text-[#b45309]">80G Registered Trust • New Delhi</span>
              </motion.div>

              {/* Grand Editorial Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight leading-[1.08] mb-8 text-slate-900"
              >
                Where Compassion Meets{' '}
                <span className="italic text-[#b45309] font-serif">
                  Dignity.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-10 max-w-xl"
              >
                G Goodwill Trust operates at the intersection of human empathy and structured grassroots execution. Providing food security, verified medical clinics, and educational scholarships across underprivileged households.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 mb-14">
                <LuxuryDonateButton />

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-wider uppercase text-slate-800 bg-white border border-slate-300 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 shadow-2xs"
                >
                  Our Philosophy <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </motion.div>

              {/* Verified Statistics Border */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200"
              >
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">100%</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Direct Aid</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-normal text-[#b45309]">Section 80G</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Tax Exemption</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">4.9 / 5.0</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Public Trust</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Photo Exhibition Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Outer Shadow Ring */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 p-2.5 shadow-xl">
                {/* Image Frame */}
                <div className="relative h-[390px] sm:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-900">
                  {heroSlides.map((item, idx) => {
                    const imgSrc = item.image_url || item.src || '/assets/hompage1.jpg'
                    return (
                      <div
                        key={item._id || imgSrc + idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          idx === currentSlide
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <Image
                          src={imgSrc}
                          alt={item.headline}
                          fill
                          priority={idx === 0}
                          className="object-cover brightness-95"
                          sizes="(max-width: 1024px) 100vw, 45vw"
                        />
                        {/* Vignette Shadow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        
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
                    )
                  })}

                  {/* Curated Navigation Controls */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:border-[#d4af37] transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:border-[#d4af37] transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Counter Bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          idx === currentSlide
                            ? 'w-6 bg-[#b45309]'
                            : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    0{currentSlide + 1} / 0{heroSlides.length}
                  </span>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-lg flex items-center gap-3 z-30">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-slate-900 text-xs font-semibold">Shaheen Bagh Relief Center</div>
                  <div className="text-slate-500 text-[10px]">Open for public assistance</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase">Scroll</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-slate-400" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. LIVE VERIFIABLE IMPACT COUNTERS
          ═══════════════════════════════════════ */}
      <section className="relative py-16 lg:py-20 bg-[#f8fafc] border-b border-slate-200">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#b45309] font-semibold text-xs tracking-[0.2em] uppercase mb-3 inline-block">
              Verifiable Milestones
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 leading-tight">
              Human Lives Touched &amp; Sustained.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { label: 'Families Sustained with Rations', value: stats.stat_rations, suffix: '+', icon: HandHeart, color: 'rose', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
              { label: 'Rakhis Tied for Social Harmony', value: stats.stat_rakhis, suffix: '+', icon: Heart, color: 'amber', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
              { label: 'Beneficiaries Reached via Camps', value: stats.stat_beneficiaries, suffix: '+', icon: Users, color: 'blue', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
              { label: 'Free Clinical Consultations', value: stats.stat_clinics, suffix: '+', icon: HeartPulse, color: 'emerald', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInScale}
                className="relative"
              >
                <div className="h-full rounded-2xl bg-white border border-slate-200 p-7 text-center hover:border-amber-300 transition-all duration-300 shadow-xs hover:shadow-md">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-5 shadow-2xs ${stat.bg}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <div className="text-slate-600 text-xs font-light tracking-wide mt-3 leading-relaxed">
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
      <section className="py-16 lg:py-20 relative bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6 max-w-6xl mx-auto">
            <div>
              <span className="text-[#b45309] font-bold tracking-[0.2em] text-xs uppercase mb-3 inline-block bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Core Initiatives
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900">
                Our Core Interventions.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-xl font-light">
                Continuous on-ground programs engineered to foster educational growth, health resilience, and social justice.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-[#b45309] hover:text-black text-xs font-bold uppercase tracking-wider transition-colors group"
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
                colorTheme="amber"
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
                colorTheme="emerald"
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
                colorTheme="rose"
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
                colorTheme="blue"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. INFINITE MARQUEE REVIEWS (CURATED & DYNAMIC)
          ═══════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-[#f8fafc] border-y border-slate-200 relative overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <span className="text-[#b45309] font-semibold text-xs tracking-[0.2em] uppercase mb-3 inline-block">
            Voice of the Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900 mb-5">
            Public Trust &amp; Community Testimonials.
          </h2>
          <div className="inline-flex items-center gap-3.5 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="text-2xl font-serif font-normal text-slate-900">4.9</span>
            <div className="flex text-[#d4af37] gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-slate-500 text-xs border-l border-slate-200 pl-3.5 font-medium">
              Verified Public Reviews
            </span>
          </div>
        </div>

        {/* Marquee Row */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee hover:[animation-play-state:paused] w-max py-2">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-6 pr-6">
                {testimonials.map((review, idx) => (
                  <div
                    key={`${setIdx}-${review._id || idx}`}
                    className="w-[340px] sm:w-[390px] flex-shrink-0 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#b45309]/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <p className="text-slate-700 text-sm leading-relaxed font-light italic mb-6">
                      &ldquo;{review.review}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <h4 className="font-serif font-normal text-slate-900 text-base">{review.name}</h4>
                        <p className="text-slate-400 text-xs">{review.time}</p>
                      </div>
                      <div className="flex text-[#d4af37]">
                        {[...Array(review.rating || 5)].map((_, star) => (
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
      <section className="pt-16 pb-8 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#b45309] font-semibold text-xs tracking-[0.2em] uppercase mb-3 inline-block">
              Community Calendar
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900">
              Upcoming Relief Drives &amp; Camps
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
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-[#b45309]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-normal text-[#b45309]">{event.day}</span>
                    <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">{event.month} 2025</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] tracking-wider uppercase font-semibold">
                    {event.type}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-lg font-serif font-normal text-slate-900 mb-3">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-slate-600 text-xs font-light">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-[#b45309]" />
                    {event.loc}
                  </div>
                </div>

                <div className="px-7 pb-7">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold tracking-wider uppercase text-slate-900 transition-colors border border-slate-300"
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
      <section className="pt-8 pb-20 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-10 sm:p-16 lg:p-20 text-center max-w-5xl mx-auto shadow-xl">
            
            {/* Ambient Gold Flare */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#d4af37]/20 blur-[130px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-8">
                <Sparkles className="w-3.5 h-3.5" /> Annual Patronage
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight mb-6 leading-tight">
                Empower a Household with Just{' '}
                <span className="italic text-[#d4af37] font-serif">
                  ₹1100 / Year
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                Join our Annual Membership program. Your direct pledge ensures sustainable rations, school kits, and emergency medical security for vulnerable families throughout the calendar year.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <LuxuryDonateButton />

                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Join as Volunteer <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. COLLABORATIVE BRAND PARTNERS & ALLIANCES (DYNAMIC FROM MONGODB)
          ═══════════════════════════════════════ */}
      <section className="pt-6 pb-20 bg-[#f8fafc] border-t border-slate-200 relative overflow-hidden">
        <div className="container mx-auto px-6 mb-12 text-center">
          <span className="text-[#b45309] font-semibold text-xs tracking-[0.25em] uppercase mb-3 inline-block">
            Collaborative Alliances &amp; CSR Engagements
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 mb-4">
            Organizations We Have Worked &amp; Collaborated With
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-light max-w-xl mx-auto">
            Honored to have partnered with leading institutional bodies, global corporations, and grassroots foundations for education, health, and social welfare drives.
          </p>
        </div>

        {/* Infinite Partners Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fades for clean aesthetic */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee hover:[animation-play-state:paused] w-max py-2 items-center">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-6 pr-6 items-center">
                {partners.map((partner, idx) => (
                  <div
                    key={`${setIdx}-${partner._id || idx}`}
                    className="w-[280px] sm:w-[320px] flex-shrink-0 h-[120px] bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-xs hover:border-[#b45309]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#b45309] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {partner.badge}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#b45309] transition-colors" />
                    </div>

                    <div className="flex items-center justify-center my-auto relative h-10 w-full">
                      {partner.logo_url ? (
                        <Image
                          src={partner.logo_url}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <span className="font-serif text-sm font-semibold text-slate-800">{partner.name}</span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 tracking-wide text-center truncate font-light">
                      {partner.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
