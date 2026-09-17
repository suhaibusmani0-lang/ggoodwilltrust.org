'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  Heart,
  BookOpen,
  HeartPulse,
  ArrowRight,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const heroImages = [
  '/assets/hompage1.jpg',
  '/assets/hompage2.jpg',
  '/assets/hompage3.jpg',
  '/assets/hompage4.jpg',
  '/assets/hompage5.jpg',
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-medium mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                Hope Starts Here in New Delhi
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                Empower Lives.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Inspire Change.
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-8 leading-relaxed">
                We are committed to bridging the gap between privilege and disadvantage. Join G Goodwill Trust to create sustainable, long-term impact in education and healthcare.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/donate" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-8 py-3.5 text-lg font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                  Donate Now
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-lg font-semibold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-all">
                  Discover Our Mission
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group"
            >
              {heroImages.map((src, idx) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`G Goodwill Trust community work ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              {/* Nav buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATS */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50"
          >
            {[
              { label: 'Families Fed', value: '2000+' },
              { label: 'Rakhis Tied', value: '5100+' },
              { label: 'Awareness Created', value: '1100+' },
              { label: 'Health Checks', value: '1000+' }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center px-4">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. OUR INTERVENTIONS */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Our Interventions
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-600 text-lg">
                Structured programs driving real change on the ground.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/programs" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                View All Programs <ChevronRight className="w-5 h-5 ml-1" />
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
                desc: 'Providing merit-based scholarships, school supplies, and vocational training to empower the next generation.',
                icon: BookOpen,
                color: 'text-blue-600',
                bg: 'bg-blue-100'
              },
              {
                title: 'Community Camps',
                desc: 'Bringing vital healthcare to grassroots levels through medical check-ups and vaccination drives.',
                icon: HeartPulse,
                color: 'text-rose-500',
                bg: 'bg-rose-100'
              },
              {
                title: 'Poverty Alleviation',
                desc: 'Delivering immediate relief, monthly ration kits, and long-term support for vulnerable families.',
                icon: Heart,
                color: 'text-amber-500',
                bg: 'bg-amber-100'
              }
            ].map((program, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                <div className={`w-14 h-14 rounded-2xl ${program.bg} ${program.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <program.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                  {program.desc}
                </p>
                <Link href="/programs" className="inline-flex items-center text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. COMMUNITY REVIEWS */}
      <section className="py-24 bg-slate-100/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12 flex flex-col items-center text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Community Trust
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 text-lg mb-6">
              What people say about our grassroots work.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
              <span className="text-2xl font-bold text-slate-900">4.9</span>
              <div className="flex text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-slate-300 text-slate-300" />
              </div>
              <span className="text-slate-500 font-medium text-sm ml-2">31 Reviews</span>
            </motion.div>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
              {[
                { name: 'Mohd Minhaj Alam', review: 'Amazing NGO doing real, impactful work on the ground in Shaheen Bagh.', time: '2 weeks ago' },
                { name: 'Dr. Bushra Shams', review: 'Very transparent and dedicated team. Their education programs are genuinely changing lives.', time: '1 month ago' },
                { name: 'Suhaib Abbasi', review: 'Proud to see the impact of G Goodwill Trust. Highly motivated team working for humanity.', time: '2 months ago' },
                { name: 'Farid Baig', review: 'Commendable relief drives. True dedication towards society. Highly recommended for donations.', time: '3 months ago' }
              ].map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] snap-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-shrink-0"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{review.name}</h4>
                      <p className="text-xs text-slate-500">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">&quot;{review.review}&quot;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Upcoming Events
            </h2>
          </motion.div>

          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {[
              { date: '20 JUN', type: 'Education', title: 'Educational Supply Drive', loc: 'Okhla, New Delhi' },
              { date: '05 JUL', type: 'Assistance', title: 'Aadhaar & Document Camp', loc: 'Shaheen Bagh Center' },
              { date: '18 JUL', type: 'Healthcare', title: 'Free Dental Checkup', loc: 'Local Clinic' }
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[300px] md:min-w-[380px] snap-center bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0 group hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <span className="block text-sm font-semibold text-blue-600">{event.date.split(' ')[1]}</span>
                      <span className="block text-xl font-bold text-slate-900">{event.date.split(' ')[0]}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-slate-900">{event.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.loc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Make an Impact Today.
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Your contribution directly funds our grassroots initiatives in New Delhi. Become an annual member for {'₹'}1100 and help us sustain our operations throughout the year.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/donate" className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-8 py-3.5 text-lg font-semibold shadow-lg transition-all hover:-translate-y-0.5">
                  Become a Member
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-lg font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                  Join as Volunteer
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
