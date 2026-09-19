'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  FileText,
  Award,
  LogOut,
  ExternalLink,
  Shield,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  Database,
  X,
  AlertCircle,
  Upload,
  ImageIcon,
  BarChart3,
  MessageSquare,
  Building2,
  Save,
  Check,
  Edit2
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'overview' | 'hero' | 'partners' | 'stats' | 'programs' | 'testimonials' | 'documents' | 'certificates' | 'donations';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data lists
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    stat_rations: 2000,
    stat_rakhis: 5100,
    stat_beneficiaries: 1100,
    stat_clinics: 1000,
    phone: '+91 79828 04385',
    email: 'globalgoodwill4@gmail.com',
    address: 'G-48 Shaheen Bagh, Okhla, New Delhi - 110025, India',
  });
  const [savingStats, setSavingStats] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  // Modal controls
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newHero, setNewHero] = useState({ headline: '', tag: 'Chapter 01 • Education', image_url: '', order: 0 });
  const [newPartner, setNewPartner] = useState({ name: '', subtitle: '', badge: 'Partner', logo_url: '', order: 0 });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', review: '', time: 'Recently', rating: 5 });
  const [newProgram, setNewProgram] = useState({ title: '', description: '', image_url: '' });
  const [newDoc, setNewDoc] = useState({ title: '', description: '', category: 'Reports', file_url: '' });
  const [newCert, setNewCert] = useState({ title: 'Certificate of Achievement', name: '', enrollment_no: '', course: '', dob: '', grade: 'A' });

  // Generic image upload state
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingPartner, setUploadingPartner] = useState(false);
  const [uploadingProgram, setUploadingProgram] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [heroRes, partRes, testRes, progRes, docRes, certRes, setRes] = await Promise.all([
        fetch('/api/hero').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/partners').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/testimonials').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/programs').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/documents').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/certificates').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/settings').then(r => r.json()).catch(() => ({ data: null })),
      ]);

      if (heroRes.data) setHeroSlides(heroRes.data);
      if (partRes.data) setPartners(partRes.data);
      if (testRes.data) setTestimonials(testRes.data);
      if (progRes.data) setPrograms(progRes.data);
      if (docRes.data) setDocuments(docRes.data);
      if (certRes.data) setCertificates(certRes.data);
      if (setRes.data) setStats(prev => ({ ...prev, ...setRes.data }));
    } catch {
      // Graceful fallback
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSeedData = async () => {
    setLoadingSeed(true);
    setSeedMessage(null);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedMessage({ type: 'success', text: data.message || 'Database loaded successfully with complete website data!' });
        fetchData();
      } else {
        setSeedMessage({ type: 'error', text: data.message || 'Failed to load initial data. Check MongoDB connection.' });
      }
    } catch (err: any) {
      setSeedMessage({ type: 'error', text: err.message || 'Connection error. Check MongoDB connection.' });
    } finally {
      setLoadingSeed(false);
    }
  };

  // Cloudinary upload helper
  const uploadToCloudinary = async (file: File, folder: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        return data.url;
      }
      alert(data.message || 'Image upload failed.');
      return null;
    } catch {
      alert('Network error while uploading image to Cloudinary.');
      return null;
    }
  };

  // Upload handlers
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    const url = await uploadToCloudinary(file, 'hero');
    if (url) setNewHero(prev => ({ ...prev, image_url: url }));
    setUploadingHero(false);
  };

  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPartner(true);
    const url = await uploadToCloudinary(file, 'partners');
    if (url) setNewPartner(prev => ({ ...prev, logo_url: url }));
    setUploadingPartner(false);
  };

  const handleProgramImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProgram(true);
    const url = await uploadToCloudinary(file, 'programs');
    if (url) setNewProgram(prev => ({ ...prev, image_url: url }));
    setUploadingProgram(false);
  };

  // --- CRUD HANDLERS ---

  // 1. Hero Slide CRUD
  const handleAddHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHero.headline || !newHero.image_url) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHero),
      });
      if (res.ok) {
        setShowHeroModal(false);
        setNewHero({ headline: '', tag: 'Chapter 01 • Education', image_url: '', order: 0 });
        fetchData();
      } else {
        alert('Failed to save hero slide.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      const res = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete hero slide.');
    }
  };

  // 2. Partner CRUD
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.logo_url) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });
      if (res.ok) {
        setShowPartnerModal(false);
        setNewPartner({ name: '', subtitle: '', badge: 'Partner', logo_url: '', order: 0 });
        fetchData();
      } else {
        alert('Failed to save partner.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete partner.');
    }
  };

  // 3. Testimonial CRUD
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.review) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });
      if (res.ok) {
        setShowTestimonialModal(false);
        setNewTestimonial({ name: '', review: '', time: 'Recently', rating: 5 });
        fetchData();
      } else {
        alert('Failed to save review.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete testimonial.');
    }
  };

  // 4. Save Stats
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStats(true);
    setStatsSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      if (res.ok) {
        setStatsSaved(true);
        setTimeout(() => setStatsSaved(false), 3000);
      } else {
        alert('Failed to save settings.');
      }
    } finally {
      setSavingStats(false);
    }
  };

  // 5. Program CRUD
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.title) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProgram.title,
          description: newProgram.description,
          image_urls: newProgram.image_url ? [newProgram.image_url] : ['/assets/hompage1.jpg'],
        }),
      });
      if (res.ok) {
        setShowProgramModal(false);
        setNewProgram({ title: '', description: '', image_url: '' });
        fetchData();
      } else {
        alert('Failed to save program.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await fetch(`/api/programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete program.');
    }
  };

  // 6. Document CRUD
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
      if (res.ok) {
        setShowDocModal(false);
        setNewDoc({ title: '', description: '', category: 'Reports', file_url: '' });
        fetchData();
      } else {
        alert('Failed to save document.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete document.');
    }
  };

  // 7. Certificate CRUD
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.enrollment_no) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...newCert }),
      });
      if (res.ok) {
        setShowCertModal(false);
        setNewCert({ title: 'Certificate of Achievement', name: '', enrollment_no: '', course: '', dob: '', grade: 'A' });
        fetchData();
      } else {
        alert('Failed to save certificate.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete certificate.');
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-black shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-normal text-lg tracking-wide text-white">G Goodwill Trust</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-[#d4af37] border border-amber-500/30 px-2 py-0.5 rounded-full">
                Full CMS Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">MongoDB Atlas &bull; Cloudinary CDN Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg transition-colors border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 px-3.5 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 mb-6 border-b border-slate-200 hide-scrollbar">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'hero', label: `Hero Photos (${heroSlides.length})`, icon: ImageIcon },
              { id: 'partners', label: `Brand Partners (${partners.length})`, icon: Building2 },
              { id: 'programs', label: `Programs (${programs.length})`, icon: BookOpen },
              { id: 'stats', label: 'Milestones & Stats', icon: BarChart3 },
              { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: MessageSquare },
              { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
              { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
              { id: 'donations', label: 'Donations', icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Seed Action Button */}
          <button
            onClick={handleSeedData}
            disabled={loadingSeed}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 shadow-md shadow-emerald-600/20 transition-all shrink-0 disabled:opacity-50"
          >
            {loadingSeed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            1-Click Populate All Initial Data
          </button>
        </div>

        {/* Seed Feedback Alert */}
        {seedMessage && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center justify-between border ${
              seedMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {seedMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span>{seedMessage.text}</span>
            </div>
            <button onClick={() => setSeedMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hero Slides</p>
                  <h3 className="text-3xl font-serif font-normal text-slate-900">{heroSlides.length}</h3>
                  <button onClick={() => setActiveTab('hero')} className="text-xs text-[#b45309] font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Carousel &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-[#b45309] rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Brand Partners</p>
                  <h3 className="text-3xl font-serif font-normal text-slate-900">{partners.length}</h3>
                  <button onClick={() => setActiveTab('partners')} className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Logos &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Programs</p>
                  <h3 className="text-3xl font-serif font-normal text-slate-900">{programs.length}</h3>
                  <button onClick={() => setActiveTab('programs')} className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Initiatives &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reviews</p>
                  <h3 className="text-3xl font-serif font-normal text-slate-900">{testimonials.length}</h3>
                  <button onClick={() => setActiveTab('testimonials')} className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Reviews &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Data Seeder Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-slate-900">Populate Initial Database Records</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Clicking this button synchronizes official Hero Carousel photos, 8 Brand Partner alliances (Times of India, Colgate, Vidyanjali, British Council, Mercedes-Benz, Zarnetic, NCF, Spread Smiles), impact milestones, and programs directly into MongoDB Atlas.
                </p>
              </div>
              <button
                onClick={handleSeedData}
                disabled={loadingSeed}
                className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {loadingSeed ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" /> ⚡ Populate MongoDB Data
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: HERO CAROUSEL PHOTOS ================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Hero Carousel Slides &amp; Photos</h2>
                <p className="text-sm text-slate-500 font-light">Manage the high-impact photos and headlines shown in the homepage header slider</p>
              </div>
              <button
                onClick={() => setShowHeroModal(true)}
                className="px-4 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Hero Slide
              </button>
            </div>

            {heroSlides.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No hero slides in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Load the default 5 slides or upload your own photos to Cloudinary.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Slides
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide, idx) => (
                  <div key={slide._id || idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                        <img src={slide.image_url} alt={slide.headline} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white tracking-widest uppercase">
                          {slide.tag || `Slide ${idx + 1}`}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-serif font-normal text-base text-slate-900 mb-2 leading-snug">&ldquo;{slide.headline}&rdquo;</h4>
                        <p className="text-[11px] text-slate-500 font-mono truncate">URL: {slide.image_url}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Order: #{slide.order ?? idx + 1}</span>
                      <button
                        onClick={() => handleDeleteHero(slide._id)}
                        className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: BRAND PARTNERS ================= */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Collaborative Brand Partners &amp; CSR Alliances</h2>
                <p className="text-sm text-slate-500 font-light">Manage company logos and affiliations displayed on the homepage marquee</p>
              </div>
              <button
                onClick={() => setShowPartnerModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Partner
              </button>
            </div>

            {partners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No partners in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Load the 8 default brand partners (Colgate, Times of India, Mercedes-Benz, etc.) or add new ones.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Brand Partners
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {partners.map((partner, idx) => (
                  <div key={partner._id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#b45309] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {partner.badge}
                        </span>
                        <button
                          onClick={() => handleDeletePartner(partner._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="h-16 w-full flex items-center justify-center p-2 mb-4 bg-slate-50 rounded-xl border border-slate-100">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="max-h-12 max-w-full object-contain" />
                        ) : (
                          <span className="font-bold text-slate-700 text-xs">{partner.name}</span>
                        )}
                      </div>

                      <h4 className="font-serif font-normal text-base text-slate-900 mb-1 text-center">{partner.name}</h4>
                      <p className="text-[11px] text-slate-500 text-center font-light leading-snug">{partner.subtitle}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center font-mono">
                      Order: #{partner.order ?? idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: IMPACT STATS & SETTINGS ================= */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-normal text-slate-900">Verifiable Impact Milestones &amp; Contact Info</h2>
              <p className="text-sm text-slate-500 font-light">Update live numbers displayed on the homepage counter and contact details</p>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">
                    Families Sustained with Rations *
                  </label>
                  <input
                    type="number"
                    value={stats.stat_rations}
                    onChange={e => setStats({ ...stats, stat_rations: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#b45309]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">
                    Rakhis Tied for Social Harmony *
                  </label>
                  <input
                    type="number"
                    value={stats.stat_rakhis}
                    onChange={e => setStats({ ...stats, stat_rakhis: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#b45309]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">
                    Beneficiaries Reached via Camps *
                  </label>
                  <input
                    type="number"
                    value={stats.stat_beneficiaries}
                    onChange={e => setStats({ ...stats, stat_beneficiaries: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#b45309]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">
                    Free Clinical Consultations *
                  </label>
                  <input
                    type="number"
                    value={stats.stat_clinics}
                    onChange={e => setStats({ ...stats, stat_clinics: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#b45309]"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Public Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">Official Phone</label>
                    <input
                      type="text"
                      value={stats.phone}
                      onChange={e => setStats({ ...stats, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">Official Email</label>
                    <input
                      type="email"
                      value={stats.email}
                      onChange={e => setStats({ ...stats, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">Secretariat Address</label>
                  <input
                    type="text"
                    value={stats.address}
                    onChange={e => setStats({ ...stats, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={savingStats}
                  className="px-6 py-3 bg-[#b45309] hover:bg-[#92400e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {savingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Milestones &amp; Settings
                </button>
                {statsSaved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Saved successfully to MongoDB!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 5: PROGRAMS ================= */}
        {activeTab === 'programs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Charitable Programs &amp; Initiatives</h2>
                <p className="text-sm text-slate-500 font-light">Add or update projects shown on public /programs pages</p>
              </div>
              <button
                onClick={() => setShowProgramModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Program
              </button>
            </div>

            {programs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No programs found in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Click below to add a program or load default initiatives.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Programs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((item) => (
                  <div key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group">
                    <div>
                      {item.image_urls && item.image_urls[0] && (
                        <div className="h-44 w-full bg-slate-100 overflow-hidden">
                          <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-serif font-normal text-lg text-slate-900">{item.title}</h4>
                          <button
                            onClick={() => handleDeleteProgram(item._id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                            title="Delete Program"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-3">{item.description}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>ID: {item._id.slice(-6)}</span>
                      <span className="text-emerald-600 font-semibold">Live in MongoDB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Community Reviews &amp; Testimonials</h2>
                <p className="text-sm text-slate-500 font-light">Manage beneficiary and donor feedback shown in the homepage marquee</p>
              </div>
              <button
                onClick={() => setShowTestimonialModal(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Review
              </button>
            </div>

            {testimonials.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No reviews in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Load the default reviews or add new ones.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Reviews
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((review) => (
                  <div key={review._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-900 font-serif text-base">{review.name}</span>
                        <button
                          onClick={() => handleDeleteTestimonial(review._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 font-light italic leading-relaxed mb-4">&ldquo;{review.review}&rdquo;</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{review.time || 'Recently'}</span>
                      <span className="text-[#d4af37] font-bold">★ {review.rating || 5}.0</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Official Trust Documents &amp; 80G</h2>
                <p className="text-sm text-slate-500 font-light">Manage 80G tax certificates, trust registration deeds, and impact reports</p>
              </div>
              <button
                onClick={() => setShowDocModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Document
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No documents in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Load official documents or add new files.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Documents
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{doc.title}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            {doc.category || 'Reports'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs max-w-xs truncate font-light">{doc.description}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteDoc(doc._id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 8: CERTIFICATES ================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-normal text-slate-900">Student &amp; Volunteer Certificates</h2>
                <p className="text-sm text-slate-500 font-light">Issue credentials verifiable on the public /certificates portal</p>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Issue Certificate
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No certificates in database</h4>
                <p className="text-sm text-slate-500 mb-4 font-light">Issue a certificate or load test credentials.</p>
                <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Load Initial Certificates
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4">Enrollment No</th>
                      <th className="p-4">Recipient Name</th>
                      <th className="p-4">Course / Program</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#b45309]">{cert.enrollment_no}</td>
                        <td className="p-4 font-semibold text-slate-900">{cert.name || 'N/A'}</td>
                        <td className="p-4 text-slate-600 text-xs font-light">{cert.course || cert.title}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {cert.grade || 'A'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteCert(cert._id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 9: DONATIONS ================= */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-serif font-normal text-slate-900">Donation Orders &amp; Razorpay Payments</h2>
              <p className="text-sm text-slate-500 font-light">Direct contributions collected via Razorpay with 80G tax deductions</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b45309] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-1">Razorpay Live Gateway Online</h4>
                <p className="text-slate-600 font-light leading-relaxed mb-2">
                  When donors contribute on the public <Link href="/donate" target="_blank" className="text-[#b45309] font-semibold underline">/donate</Link> page, their donation intent, PAN number, and amount are stored directly into the MongoDB <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">Donation</span> collection.
                </p>
                <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  80G Exemption Receipt Generated Automatically
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD HERO SLIDE ================= */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add New Hero Carousel Slide</h3>
              <button onClick={() => setShowHeroModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHero} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Chapter Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 06 • Winter Aid"
                  value={newHero.tag}
                  onChange={e => setNewHero({ ...newHero, tag: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Empowering orphan students with high school scholarships"
                  value={newHero.headline}
                  onChange={e => setNewHero({ ...newHero, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Photo Upload (Cloudinary CDN) *</label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#b45309] rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-amber-50/40 transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                      disabled={uploadingHero}
                    />
                    {uploadingHero ? (
                      <div className="flex items-center gap-2 text-[#b45309] text-xs font-semibold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#b45309] mb-1 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#b45309]">
                          Click to Browse &amp; Upload Hero Photo
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 10MB</span>
                      </div>
                    )}
                  </label>
                  {newHero.image_url && (
                    <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate font-mono">{newHero.image_url}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newHero.image_url}
                  className="px-5 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Hero Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD BRAND PARTNER ================= */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add Brand Partner Organization</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colgate, Mercedes-Benz, British Council"
                  value={newPartner.name}
                  onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Category Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. CSR Partner, Health Partner"
                    value={newPartner.badge}
                    onChange={e => setNewPartner({ ...newPartner, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Display Order</label>
                  <input
                    type="number"
                    value={newPartner.order}
                    onChange={e => setNewPartner({ ...newPartner, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Subtitle / Focus Area</label>
                <input
                  type="text"
                  placeholder="e.g. Oral Health & Hygiene Camps"
                  value={newPartner.subtitle}
                  onChange={e => setNewPartner({ ...newPartner, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Brand Logo (SVG/PNG to Cloudinary) *</label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors group">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={handlePartnerLogoUpload}
                      className="hidden"
                      disabled={uploadingPartner}
                    />
                    {uploadingPartner ? (
                      <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                          Click to Upload Brand Logo
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">SVG, PNG, WebP recommended</span>
                      </div>
                    )}
                  </label>
                  {newPartner.logo_url && (
                    <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate font-mono">{newPartner.logo_url}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newPartner.logo_url}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD TESTIMONIAL ================= */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add Community Testimonial</h3>
              <button onClick={() => setShowTestimonialModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Reviewer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohd Minhaj Alam"
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Time Frame</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 weeks ago"
                    value={newTestimonial.time}
                    onChange={e => setNewTestimonial({ ...newTestimonial, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Rating (1 to 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newTestimonial.rating}
                    onChange={e => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of the review or testimonial..."
                  value={newTestimonial.review}
                  onChange={e => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PROGRAM ================= */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add New Charitable Program</h3>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProgram} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Winter Sweaters Distribution"
                  value={newProgram.title}
                  onChange={e => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about this initiative..."
                  value={newProgram.description}
                  onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Program Photo (Cloudinary CDN)</label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgramImageUpload}
                      className="hidden"
                      disabled={uploadingProgram}
                    />
                    {uploadingProgram ? (
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 mb-1 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                          Click to Upload Program Photo
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 10MB</span>
                      </div>
                    )}
                  </label>
                  {newProgram.image_url && (
                    <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate font-mono">{newProgram.image_url}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD DOCUMENT ================= */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add Official Document</h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDoc} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 80G Tax Exemption Certificate"
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Category</label>
                <select
                  value={newDoc.category}
                  onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Certificates">Certificates &amp; Approvals</option>
                  <option value="Policies">Legal &amp; Policies</option>
                  <option value="Reports">Annual Reports</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief note about the registration / document..."
                  value={newDoc.description}
                  onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Public URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newDoc.file_url}
                  onChange={e => setNewDoc({ ...newDoc, file_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ISSUE CERTIFICATE ================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Issue Verifiable Certificate</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Enrollment No (Unique Identifier) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GGT-2026-103"
                  value={newCert.enrollment_no}
                  onChange={e => setNewCert({ ...newCert, enrollment_no: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#b45309]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Student / Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Khan"
                    value={newCert.name}
                    onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Date of Birth</label>
                  <input
                    type="date"
                    value={newCert.dob}
                    onChange={e => setNewCert({ ...newCert, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Course / Program</label>
                  <input
                    type="text"
                    placeholder="e.g. Vocational IT Literacy"
                    value={newCert.course}
                    onChange={e => setNewCert({ ...newCert, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Grade / Honor</label>
                  <input
                    type="text"
                    placeholder="e.g. A+, Distinction"
                    value={newCert.grade}
                    onChange={e => setNewCert({ ...newCert, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#b45309]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
