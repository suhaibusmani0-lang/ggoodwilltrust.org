'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  Clock,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  Share2,
  FileText,
  School,
  ArrowRight,
  Send,
  Star,
  Check,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon,
  Building2,
  HeartHandshake,
  Search,
  Loader2,
  CreditCard,
  Printer,
  Tag
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MedhaReceipt, { MedhaReceiptData } from '@/components/MedhaReceipt';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};

function MedhaParikshaContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Form & Payment state
  const [formData, setFormData] = useState({
    studentName: '',
    guardianName: '',
    category: 'Junior Category (Classes 9 & 10)',
    schoolName: '',
    schoolCode: '',
    referralCode: '',
    city: '',
    phone: '',
    email: '',
  });

  // Automatically read referral code from URL query parameter (e.g. ?ref=TEACHER10)
  useEffect(() => {
    const refParam = searchParams.get('ref') || searchParams.get('referral');
    if (refParam) {
      setFormData((prev) => ({ ...prev, referralCode: refParam.toUpperCase() }));
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<MedhaReceiptData | null>(null);

  // Receipt Lookup State (For candidates who already registered)
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Form submission with Razorpay Payment Integration (₹100 fee)
  const handlePaymentAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Create order in Backend & Store initial record with school_code and referral_code
      const res = await fetch('/api/medha-pariksha/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: formData.studentName,
          guardian_name: formData.guardianName,
          category: formData.category,
          school_name: formData.schoolName,
          school_code: formData.schoolCode,
          referral_code: formData.referralCode,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to initiate registration.');
      }

      const { order, registration_no, receipt_no, key_id } = data;

      // 2. Open Razorpay Checkout Modal
      const win = window as unknown as { Razorpay?: new (opts: unknown) => { open: () => void } };

      if (!win.Razorpay) {
        throw new Error('Payment gateway is loading. Please check your internet or retry.');
      }

      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'G Goodwill Trust',
        description: `Exam Fee (₹100) - ${formData.category}`,
        order_id: order.id,
        prefill: {
          name: formData.studentName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#d4af37',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 3. Verify Payment on Backend & Mark Record Completed
            await fetch('/api/medha-pariksha/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registration_no,
                razorpay_order_id: response.razorpay_order_id || order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            // 4. Show Instant Official Receipt
            setActiveReceipt({
              registrationNo: registration_no,
              receiptNo: receipt_no,
              studentName: formData.studentName,
              guardianName: formData.guardianName,
              category: formData.category,
              schoolName: formData.schoolName,
              schoolCode: formData.schoolCode,
              referralCode: formData.referralCode,
              city: formData.city,
              phone: formData.phone,
              email: formData.email,
              amount: 100,
              paymentId: response.razorpay_payment_id || 'PAY_' + Date.now(),
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            });

            // Reset form
            setFormData({
              studentName: '',
              guardianName: '',
              category: 'Junior Category (Classes 9 & 10)',
              schoolName: '',
              schoolCode: '',
              referralCode: '',
              city: '',
              phone: '',
              email: '',
            });
          } catch (vErr) {
            console.error('Verification error:', vErr);
            alert('Payment succeeded! Your receipt is generated with ID: ' + response.razorpay_payment_id);
          }
        },
      };

      const rzp = new win.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during registration.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lookup existing registration receipt
  const handleReceiptLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(`/api/medha-pariksha/registrations?search=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
        const item = data.data[0];
        setActiveReceipt({
          registrationNo: item.registration_no,
          receiptNo: item.receipt_no,
          studentName: item.student_name,
          guardianName: item.guardian_name,
          category: item.category,
          schoolName: item.school_name,
          schoolCode: item.school_code,
          referralCode: item.referral_code,
          city: item.city,
          phone: item.phone,
          email: item.email,
          amount: item.amount || 100,
          paymentId: item.razorpay_payment_id || item.razorpay_order_id || 'VERIFIED_OFFLINE',
          date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
      } else {
        setLookupError('No verified registration found for the provided Registration No or Mobile Number.');
      }
    } catch {
      setLookupError('Failed to search registration. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Partner NGOs with official logo URLs
  const partnerNgos = [
    {
      name: 'Spread Smiles Foundation',
      logo: '/partners/spread-smiles.svg',
      desc: 'Dedicated to child welfare, academic literacy, and underprivileged student aid.',
      tag: 'Partner NGO',
      accent: 'border-amber-200/80',
    },
    {
      name: 'No Crying Foundation',
      logo: '/partners/ncf.webp',
      desc: 'Grassroots humanitarian relief, child education, and emergency community outreach.',
      tag: 'Partner NGO',
      accent: 'border-blue-200/80',
    },
    {
      name: 'Musawat Welfare Trust',
      logo: '/partners/musawat.svg',
      desc: 'Championing educational equality, youth empowerment, and scholarship support.',
      tag: 'Partner NGO',
      accent: 'border-emerald-200/80',
    },
    {
      name: 'Nayab Training & Educational Trust',
      logo: '/partners/nayab.svg',
      desc: 'Fostering vocational skills, competitive exam training, and academic excellence.',
      tag: 'Partner NGO',
      accent: 'border-indigo-200/80',
    },
    {
      name: 'Buniyadi Sahara Trust',
      logo: '/partners/buniyadi-sahara.svg',
      desc: 'Providing foundational welfare, family support, and educational assistance.',
      tag: 'Partner NGO',
      accent: 'border-amber-200/80',
    },
  ];

  // Sponsors with official logo URLs
  const sponsors = [
    {
      name: 'Zarnetic',
      logo: '/partners/zarnetic.svg',
      category: 'Lead Technology & Digital Partner',
      desc: 'Powering high-performance digital platforms and educational tech for social impact.',
      tag: 'Lead Sponsor',
    },
    {
      name: 'Arshi Cafe',
      logo: '/partners/arshi-cafe.svg',
      category: 'Community & Hospitality Sponsor',
      desc: 'Proud local hospitality partner fueling youth talent drives and academic events.',
      tag: 'Official Sponsor',
    },
  ];

  // Combined Grand Prizes data
  const prizes = [
    {
      rank: '1st Mega Prize',
      title: 'Grand Champion Trophy',
      amount: '₹21,000',
      badge: 'Combined Overall Rank 1 • Gold Champion',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      cardBorder: 'border-amber-400 shadow-[0_12px_36px_rgba(212,175,55,0.25)]',
      cardBg: 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/30',
      icon: Trophy,
      iconBoxBg: 'bg-gradient-to-br from-amber-500 via-[#d4af37] to-amber-600 text-white shadow-amber-300/50',
      benefits: [
        '₹21,000 Direct Cash Scholarship',
        'Official Gold Grand Champion Trophy',
        'National Merit Certificate of Highest Distinction',
        'Special Felicitation at Annual Trust Ceremony',
        'Academic Mentorship from Eminent Educators',
        'Featured in Foundation Annual Honor Roll'
      ],
      popular: true,
    },
    {
      rank: '2nd Mega Prize',
      title: 'Excellence Trophy',
      amount: '₹11,000',
      badge: 'Combined Overall Rank 2 • Silver Achiever',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      cardBorder: 'border-slate-300 shadow-[0_8px_30px_rgba(100,116,139,0.12)]',
      cardBg: 'bg-gradient-to-b from-slate-50/90 via-white to-slate-50/20',
      icon: Medal,
      iconBoxBg: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 text-white shadow-slate-300/50',
      benefits: [
        '₹11,000 Direct Cash Scholarship',
        'Official Silver Achiever Trophy',
        'National Merit Certificate of Excellence',
        'Special Felicitation at Annual Trust Ceremony',
        'Advanced Academic Development Guidance',
        'Featured in Foundation Roll of Honor'
      ],
      popular: false,
    },
    {
      rank: '3rd Mega Prize',
      title: 'Distinction Trophy',
      amount: '₹5,100',
      badge: 'Combined Overall Rank 3 • Bronze Laureate',
      badgeBg: 'bg-orange-100 text-orange-950 border-orange-300',
      cardBorder: 'border-orange-300 shadow-[0_8px_30px_rgba(180,83,9,0.12)]',
      cardBg: 'bg-gradient-to-b from-orange-50/80 via-white to-orange-50/20',
      icon: Award,
      iconBoxBg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500 text-white shadow-orange-300/50',
      benefits: [
        '₹5,100 Direct Cash Scholarship',
        'Official Bronze Distinction Trophy',
        'National Merit Certificate of Honor',
        'Special Felicitation at Annual Trust Ceremony',
        'Academic Recognition & Scholarship Citation',
        'Permanent Listing on Trust Portal'
      ],
      popular: false,
    },
  ];

  // Exam categories
  const categories = [
    {
      id: 'sub-junior',
      name: 'Sub-Junior Category',
      classes: 'Classes 6 to 8',
      classesDetail: 'Open to Class 6th, 7th & 8th Students (CBSE, ICSE, State Boards)',
      subjects: ['Basic Maths', 'Science', 'GK', 'English'],
      subjectsDetail: [
        { name: 'Basic Mathematics', desc: 'Arithmetic, Fractions, Mensuration, Decimals, Number Systems' },
        { name: 'General Science', desc: 'Physical, Chemical & Biological fundamentals from NCERT syllabus' },
        { name: 'General Knowledge & Current Affairs', desc: 'National Milestones, Scientific Inventions, Kalam Life & Vision' },
        { name: 'English Language', desc: 'Grammar, Synonyms/Antonyms, Comprehension & Vocabulary' },
      ],
      examFormat: 'Objective Multiple Choice (MCQ)',
      totalQuestions: '100 Questions',
      duration: '90 Minutes',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    {
      id: 'junior',
      name: 'Junior Category',
      classes: 'Classes 9 & 10',
      classesDetail: 'Open to Class 9th & 10th Students (Secondary School Level)',
      subjects: ['Maths', 'Science', 'English', 'Logical Reasoning'],
      subjectsDetail: [
        { name: 'Mathematics', desc: 'Algebra, Geometry, Trigonometry, Statistics & Number Systems' },
        { name: 'Science (Physics, Chemistry, Bio)', desc: 'Fundamental Laws, Chemical Reactions, Energy, Life Processes' },
        { name: 'English Language', desc: 'Analytical Reading, Applied Grammar, Idioms & Error Detection' },
        { name: 'Logical Reasoning & Mental Ability', desc: 'Series, Patterns, Coding-Decoding, Blood Relations & Analytical Puzzles' },
      ],
      examFormat: 'Objective Multiple Choice (MCQ)',
      totalQuestions: '100 Questions',
      duration: '90 Minutes',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'senior',
      name: 'Senior Category',
      classes: 'Classes 11 & 12',
      classesDetail: 'Open to Class 11th & 12th Students (Higher Secondary / Intermediate)',
      subjects: ['Stream-wise', 'Aptitude'],
      subjectsDetail: [
        { name: 'Stream-wise Core Foundations', desc: 'Science (PCM/PCB) / Commerce / Humanities foundational syllabus' },
        { name: 'Quantitative & Analytical Aptitude', desc: 'Higher level data interpretation, quantitative math, critical problem-solving' },
        { name: 'General Aptitude & Reasoning', desc: 'Verbal & Non-verbal reasoning matching CUET/JEE/NEET foundation' },
        { name: 'English & Current Affairs', desc: 'Advanced comprehension, global and national science/current events' },
      ],
      examFormat: 'Objective Multiple Choice (MCQ)',
      totalQuestions: '100 Questions',
      duration: '90 Minutes',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ];

  const filteredCategories = selectedCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === selectedCategory);

  const faqs = [
    {
      q: 'How are the Mega Cash Prizes decided across the 3 categories?',
      a: 'The Mega Cash Prizes (₹21,000 for 1st Prize, ₹11,000 for 2nd Prize, and ₹5,100 for 3rd Prize) are awarded to the Combined Overall Top 3 Grand Winners across all categories (Sub-Junior, Junior, and Senior). Performance across tiers is benchmarked by the academic examination board.'
    },
    {
      q: 'What is the examination registration fee?',
      a: 'The registration fee is a nominal ₹100 only. This covers the official registration, computerized evaluation, and a verified Certificate of Participation for every candidate.'
    },
    {
      q: 'What is the role of School Code and Referral Code in the form?',
      a: 'The School Code links the student to their respective school for collective institutional reporting. The Referral Code identifies the teacher, coordinator, partner NGO, or volunteer who introduced the candidate, maintaining total transparency.'
    },
    {
      q: 'Will I receive an official receipt after paying ₹100?',
      a: 'Yes, immediately! Upon completing payment through Razorpay, a computer-generated receipt with your Unique Registration Number, Receipt Number, and Transaction ID opens on-screen to print or save as a PDF.'
    },
    {
      q: 'When will the Exam Date and Award Ceremony be announced?',
      a: 'The official Exam Date and Award Ceremony venue/date will be announced soon on this portal and notified directly via SMS and WhatsApp to all registered candidates.'
    },
    {
      q: 'Who are the collaborating partner NGOs and sponsors?',
      a: 'The programme is organized by G Goodwill Trust in collaboration with Spread Smiles Foundation, No Crying Foundation, Musawat Welfare Trust, Nayab Training & Educational Trust, and Buniyadi Sahara Trust, proudly supported by Zarnetic and Arshi Cafe.'
    },
    {
      q: 'What is the last date to apply?',
      a: 'The final date to submit the application is 31st December 2026.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-900 selection:bg-[#d4af37] selection:text-black">
      
      {/* ═══════════════════════════════════════
          1. HERO SECTION (TIGHTENED SPACING)
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-10 lg:pt-12 lg:pb-14 border-b border-slate-200">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          
          {/* Breadcrumb / Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-[11px] font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>G Goodwill Trust • National Merit Talent Hunt</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" />
              <span className="text-slate-800 font-extrabold">2026-2027</span>
            </div>
          </motion.div>

          {/* Main Title Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-slate-900 leading-[1.1] mb-4">
              Dr. A.P.J. Abdul Kalam <br className="hidden sm:inline" />
              <span className="italic font-serif text-[#b45309] relative inline-block">
                Medha Pariksha
                <span className="absolute bottom-1 left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-75" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto mb-3">
              A premier national merit scholarship examination empowering young students from Classes 6 to 12 with direct cash awards, championship trophies, and official recognition.
            </p>

            {/* Combined Winner Clarification & Fee Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 font-bold mb-3 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Combined Mega Winners Across All Categories: ₹21,000 &bull; ₹11,000 &bull; ₹5,100</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-3 text-xs">
              <span className="font-semibold text-slate-600">Application Fee:</span>
              <span className="font-extrabold text-[#b45309] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                ₹100 Only
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Instant Printable Receipt
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500 font-medium">School Code &amp; Referral Supported</span>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-4"
          >
            <a
              href="#apply-now"
              className="bg-[#d4af37] hover:bg-[#c59b27] text-slate-950 px-7 py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:scale-[1.02] transition-all flex items-center gap-2 group"
            >
              <span>Apply Online (₹100)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#download-receipt"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Download Receipt</span>
            </a>

            <a
              href="#partners"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-slate-600" />
              <span>Partners &amp; Sponsors</span>
            </a>

            <button
              onClick={handleShare}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 border border-slate-200"
              title="Share Program Link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </motion.div>

          {/* Key Dates Strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Item 1: Last Date */}
              <div className="flex items-start gap-3.5 pt-3 md:pt-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b45309] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Registrations Open (₹100)
                  </div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Date to Apply</h4>
                  <p className="text-xl font-serif font-bold text-slate-900">31.12.2026</p>
                  <p className="text-[11px] text-slate-500">31st December 2026</p>
                </div>
              </div>

              {/* Item 2: Exam Date */}
              <div className="flex items-start gap-3.5 pt-3 md:pt-0 md:pl-5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#b45309] border border-amber-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Upcoming Milestone
                  </div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exam Date</h4>
                  <p className="text-xl font-serif font-bold text-[#b45309]">To Be Announced</p>
                  <p className="text-[11px] text-slate-500">Will be announced soon</p>
                </div>
              </div>

              {/* Item 3: Award Ceremony */}
              <div className="flex items-start gap-3.5 pt-3 md:pt-0 md:pl-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Grand Ceremony
                  </div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Award Ceremony</h4>
                  <p className="text-xl font-serif font-bold text-slate-900">To Be Announced</p>
                  <p className="text-[11px] text-slate-500">Will be announced soon</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* ═══════════════════════════════════════
          2. MEGA PRIZE STRUCTURE (COMBINED 3 WINNERS)
          ═══════════════════════════════════════ */}
      <section id="prizes" className="py-10 lg:py-14 px-5 sm:px-8 lg:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#d4af37]" />
              Combined Mega Prize Pool
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight mb-2">
              Mega Grand Prize <span className="italic text-[#b45309] font-serif">Structure</span>
            </h2>
            <div className="max-w-2xl mx-auto bg-amber-50/70 border border-amber-300/80 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#b45309] font-bold uppercase tracking-wider block mb-0.5">
                Evaluation Benchmark:
              </strong>
              The 3 Mega Cash Prizes (<span className="font-bold text-slate-950">₹21,000</span>, <span className="font-bold text-slate-950">₹11,000</span>, and <span className="font-bold text-slate-950">₹5,100</span>) are awarded to the <strong>Top 3 Combined Grand Winners Overall</strong> across all three participating tiers (Sub-Junior, Junior, and Senior). All scores are normalized to reward true national academic talent.
            </div>
          </div>

          {/* 3 Mega Prize Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {prizes.map((prize) => {
              const IconComponent = prize.icon;
              return (
                <motion.div
                  key={prize.rank}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 transition-all duration-300 ${prize.cardBg} ${prize.cardBorder}`}
                >
                  {prize.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-600 text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-0.5 rounded-full shadow-md">
                      Overall Grand Champion
                    </div>
                  )}

                  <div>
                    {/* Header: Badge & Icon */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${prize.badgeBg}`}>
                        {prize.badge}
                      </span>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${prize.iconBoxBg}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Prize Title & Amount */}
                    <div className="mb-4">
                      <h3 className="text-xl font-serif font-bold text-slate-900">{prize.rank}</h3>
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">{prize.title}</p>
                      
                      <div className="inline-block p-3.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xs w-full">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Grand Cash Award</span>
                        <div className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-950 tracking-tight">
                          {prize.amount}
                        </div>
                        <div className="text-xs font-semibold text-[#b45309] mt-0.5 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> + Trophy + Certificate
                        </div>
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-2 pt-1 mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Honours &amp; Benefits:</p>
                      {prize.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-normal">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-3 border-t border-slate-200/70">
                    <a
                      href="#apply-now"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        prize.popular
                          ? 'bg-[#d4af37] hover:bg-[#c59b27] text-slate-950 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>Enroll in Competition (₹100)</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Participation Certificate Banner */}
          <div className="mt-8 bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-amber-500/10 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-white border border-amber-300 text-[#b45309] flex items-center justify-center shrink-0 shadow-xs mx-auto sm:mx-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-slate-900">Official Certificate of Participation for Every Candidate</h4>
                <p className="text-xs text-slate-600 font-light mt-0.5">
                  Beyond the Top 3 Combined Winners, every enrolled candidate attempting the examination receives a verifiable digital Certificate of Participation to enrich their academic portfolio.
                </p>
              </div>
            </div>

            <a
              href="#apply-now"
              className="bg-white hover:bg-amber-50 text-slate-900 border border-amber-300 font-bold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase shrink-0 transition-all shadow-xs"
            >
              Register Candidate (₹100)
            </a>
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════
          3. EXAM CATEGORIES (TIGHTENED SPACING)
          ═══════════════════════════════════════ */}
      <section id="categories" className="py-10 lg:py-14 px-5 sm:px-8 lg:px-12 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with View Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#d4af37]" />
                Curriculum &amp; Target Classes
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight">
                Exam <span className="italic text-[#b45309] font-serif">Categories</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light mt-1 max-w-xl">
                Structured into three distinct tiers catering from Middle School to Senior Secondary. Each tier features age-appropriate syllabus and transparent merit benchmarks.
              </p>
            </div>

            {/* View Switcher Controls */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'grid'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Card Grid</span>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'table'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Modern Table</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">Filter Tier:</span>
            {[
              { id: 'all', label: 'All Categories (6th-12th)' },
              { id: 'sub-junior', label: 'Sub-Junior (Classes 6-8)' },
              { id: 'junior', label: 'Junior (Classes 9-10)' },
              { id: 'senior', label: 'Senior (Classes 11-12)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedCategory(btn.id)}
                className={`text-xs px-3.5 py-1 rounded-full font-medium transition-all ${
                  selectedCategory === btn.id
                    ? 'bg-[#d4af37] text-slate-950 font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* View 1: Modern Card Grid */}
          {activeTab === 'grid' && (
            <motion.div
              layout
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {filteredCategories.map((cat) => (
                <motion.div
                  layout
                  key={cat.id}
                  variants={fadeInUp}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                        {cat.name}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">{cat.classes}</h3>
                    <p className="text-xs text-slate-500 font-light mb-4">{cat.classesDetail}</p>

                    {/* Subject Tags */}
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Core Examination Subjects:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200/80"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Syllabus Preview */}
                    <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Syllabus Highlights:</p>
                      {cat.subjectsDetail.map((item, iIdx) => (
                        <div key={iIdx} className="text-xs">
                          <span className="font-semibold text-slate-800">{item.name}: </span>
                          <span className="text-slate-500">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Format & Details Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Exam Pattern:</span>
                      <span className="font-semibold text-slate-800">{cat.examFormat}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-semibold text-slate-800">{cat.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Questions:</span>
                      <span className="font-semibold text-slate-800">{cat.totalQuestions}</span>
                    </div>

                    <a
                      href="#apply-now"
                      onClick={() => setFormData({ ...formData, category: `${cat.name} (${cat.classes})` })}
                      className="mt-3 w-full block text-center py-2 bg-slate-100 hover:bg-[#d4af37] hover:text-black text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Select &amp; Register for {cat.classes} (₹100)
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View 2: Modern Table */}
          {activeTab === 'table' && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="py-3 px-5">Category Tier</th>
                      <th className="py-3 px-5">Eligible Classes</th>
                      <th className="py-3 px-5">Examination Subjects</th>
                      <th className="py-3 px-5">Exam Format</th>
                      <th className="py-3 px-5">Duration &amp; Qs</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">
                          <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-800">
                          <span className="inline-block bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-800">
                            {cat.classes}
                          </span>
                        </td>
                        <td className="py-4 px-5 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {cat.subjects.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-amber-50 text-[#b45309] font-medium px-2 py-0.5 rounded-md border border-amber-200/60 text-[11px]"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {cat.examFormat}
                        </td>
                        <td className="py-4 px-5 text-slate-600">
                          <p className="font-semibold text-slate-800">{cat.totalQuestions}</p>
                          <p className="text-[10px] text-slate-400">{cat.duration}</p>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <a
                            href="#apply-now"
                            onClick={() => setFormData({ ...formData, category: `${cat.name} (${cat.classes})` })}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-[#d4af37] hover:text-black text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                          >
                            <span>Enroll (₹100)</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      </section>


      {/* ═══════════════════════════════════════
          4. PARTNER NGOS & SPONSORS (WITH REAL LOGOS)
          ═══════════════════════════════════════ */}
      <section id="partners" className="py-10 lg:py-14 px-5 sm:px-8 lg:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-[#d4af37]" />
              Collaborative Social Coalition
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight mb-2">
              Partner NGOs &amp; <span className="italic text-[#b45309] font-serif">Official Sponsors</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
              Dr. A.P.J. Abdul Kalam Medha Pariksha is organized under the unified patronage of esteemed non-profit foundations and institutional sponsors committed to transparent educational advancement.
            </p>
          </div>

          {/* 1. Partner NGOs Grid (with official logos) */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#b45309] flex items-center justify-center font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Partner Non-Profit Organizations</h3>
                <p className="text-[11px] text-slate-500">Collaborating welfare trusts supporting student outreach and academic invigilation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {partnerNgos.map((ngo, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl bg-white border ${ngo.accent} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    {/* Logo display container */}
                    <div className="h-14 w-full bg-slate-50/70 border border-slate-100 rounded-xl p-2.5 flex items-center justify-center mb-3">
                      <Image
                        src={ngo.logo}
                        alt={ngo.name}
                        width={200}
                        height={40}
                        className="max-h-10 w-auto object-contain"
                        unoptimized
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-serif font-bold text-slate-900">{ngo.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#b45309] border border-amber-200 shrink-0">
                        {ngo.tag}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">{ngo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Official Sponsors Grid (with official logos) */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Official Programme Sponsors</h3>
                <p className="text-[11px] text-slate-500">Industry &amp; community leaders providing prize endowments and digital backing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sponsors.map((sp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700 shadow-lg relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-300/30">
                        {sp.tag}
                      </div>
                      <h4 className="text-xl font-serif font-bold text-white mb-0.5">{sp.name}</h4>
                      <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2">{sp.category}</p>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">{sp.desc}</p>
                    </div>

                    {/* Sponsor Logo Box */}
                    <div className="w-36 h-16 bg-white/10 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-center shrink-0 border border-white/15">
                      <Image
                        src={sp.logo}
                        alt={sp.name}
                        width={140}
                        height={40}
                        className="max-h-11 w-auto object-contain brightness-0 invert"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════
          5. APPLICATION & REGISTRATION SECTION (TIGHTENED)
          ═══════════════════════════════════════ */}
      <section id="apply-now" className="py-10 lg:py-14 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#b45309] text-xs font-bold tracking-widest uppercase mb-2">
              <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
              Secure Online Registration (₹100)
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight mb-2">
              Register for <span className="italic text-[#b45309] font-serif">Medha Pariksha</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-lg mx-auto">
              Fill candidate details below and complete the nominal <strong className="text-slate-900">₹100</strong> registration fee. You will immediately receive a verifiable digital receipt.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg relative overflow-hidden">
            
            {/* Error notification */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Registration Alert</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handlePaymentAndRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Sharma / Ayesha Khan"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Father&apos;s / Mother&apos;s / Guardian&apos;s Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Exam Category / Class *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  >
                    <option value="Sub-Junior Category (Classes 6 to 8)">Sub-Junior Category: Classes 6 to 8</option>
                    <option value="Junior Category (Classes 9 & 10)">Junior Category: Classes 9 &amp; 10</option>
                    <option value="Senior Category (Classes 11 & 12)">Senior Category: Classes 11 &amp; 12</option>
                  </select>
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    School / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Public School, Okhla"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>

                {/* School Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    School Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. SCH-10492 / CBSE Affiliation Code"
                      value={formData.schoolCode}
                      onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all uppercase"
                    />
                    <School className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Referral Code / Referred By (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. TEACHER10 / Volunteer Name"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all uppercase font-semibold text-purple-800"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* City / State */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City &amp; State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi / Patna / Lucknow"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    WhatsApp / Mobile Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                  />
                </div>

              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address (For Admit Card &amp; Updates)
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                />
              </div>

              {/* Fee Notice Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Total Registration Fee Payable:</p>
                  <p className="text-[11px] text-slate-500">Includes examination paper, computerized OMR evaluation, and Participation Certificate</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif font-black text-[#b45309]">₹100</span>
                  <span className="text-[10px] text-slate-500 block">INR (One-Time)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#c59b27] text-slate-950 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting Payment Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹100 &amp; Generate Official Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center sm:text-left">
                  256-Bit SSL Encrypted Razorpay &bull; Helpdesk: <a href="tel:+917982804385" className="text-[#b45309] font-bold hover:underline">+91 79828 04385</a>
                </p>
              </div>
            </form>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          6. RECEIPT LOOKUP / RE-DOWNLOAD (TIGHTENED)
          ═══════════════════════════════════════ */}
      <section id="download-receipt" className="py-8 px-5 sm:px-8 lg:px-12 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#b45309] flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">Already Registered? Download Your Receipt</h3>
                <p className="text-xs text-slate-500">Enter your Registration Number (e.g. AKMP-2026-XXXXX) or registered Mobile Number</p>
              </div>
            </div>

            <form onSubmit={handleReceiptLookup} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Registration No or 10-digit Phone..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {lookupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Find Receipt</span>
              </button>
            </form>

            {lookupError && (
              <p className="text-xs text-rose-600 mt-2">{lookupError}</p>
            )}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          7. FAQS ACCORDION (TIGHTENED)
          ═══════════════════════════════════════ */}
      <section className="py-10 lg:py-14 px-5 sm:px-8 lg:px-12 bg-[#fafaf8] border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-widest uppercase mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#b45309]" />
              Need Guidance?
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight">
              Frequently Asked <span className="italic text-[#b45309] font-serif">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light mt-1">
              Everything you need to know about eligibility, dates, syllabus, fees, and results.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-slate-900 hover:text-[#b45309] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      openFaq === fIdx ? 'rotate-180 text-[#b45309]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === fIdx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 text-xs text-slate-600 font-light leading-relaxed border-t border-slate-100 pt-2.5"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════
          8. HELPLINE FOOTER BANNER
          ═══════════════════════════════════════ */}
      <section className="py-8 bg-slate-900 text-white px-5 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-300">
              Questions regarding Kalam Medha Pariksha?
            </h3>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              Contact our academic committee at G Goodwill Trust Secretariat, Shaheen Bagh, New Delhi.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+917982804385"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>+91 79828 04385</span>
            </a>

            <a
              href="mailto:globalgoodwill4@gmail.com"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              <span>globalgoodwill4@gmail.com</span>
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=917982804385&text=Hello%20G%20Goodwill%20Trust,%20I%20have%20an%20inquiry%20regarding%20Dr.%20A.P.J.%20Abdul%20Kalam%20Medha%20Pariksha"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OFFICIAL PRINTABLE RECEIPT MODAL
          ═══════════════════════════════════════ */}
      <MedhaReceipt
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

    </div>
  );
}

export default function MedhaParikshaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <Loader2 className="w-8 h-8 text-[#b45309] animate-spin" />
      </div>
    }>
      <MedhaParikshaContent />
    </Suspense>
  );
}
