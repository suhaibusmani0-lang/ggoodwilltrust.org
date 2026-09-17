'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  FileText,
  Award,
  LogOut,
  ExternalLink,
  Users,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  Building,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'programs' | 'documents' | 'certificates'>('overview');
  const [loading, setLoading] = useState(false);
  const [programsCount, setProgramsCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);

  useEffect(() => {
    // Fetch counts from APIs
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.data) setProgramsCount(data.data.length);
      })
      .catch(() => {});

    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.data) setDocumentsCount(data.data.length);
      })
      .catch(() => {});

    fetch('/api/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.data) setCertificatesCount(data.data.length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-wide">G Goodwill Trust</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-400">globalgoodwill4@gmail.com</p>
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
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'donations', label: 'Donations & Receipts', icon: Heart },
            { id: 'programs', label: 'Programs & Projects', icon: BookOpen },
            { id: 'documents', label: 'Official Documents', icon: FileText },
            { id: 'certificates', label: 'Certificates & Results', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Programs</p>
                  <h3 className="text-3xl font-black text-slate-900">{programsCount}</h3>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published live
                  </span>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Documents</p>
                  <h3 className="text-3xl font-black text-slate-900">{documentsCount}</h3>
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Downloadable
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Certificates</p>
                  <h3 className="text-3xl font-black text-slate-900">{certificatesCount}</h3>
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-2">
                    <Award className="w-3.5 h-3.5" /> Verification ready
                  </span>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">System Status</p>
                  <h3 className="text-2xl font-black text-emerald-600">Active</h3>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-2">
                    <Clock className="w-3.5 h-3.5" /> Online &amp; secure
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Organization Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs font-semibold uppercase">NGO Name</span>
                    <p className="font-bold text-slate-800 mt-1">G Goodwill Trust</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs font-semibold uppercase">80G Unique Number</span>
                    <p className="font-bold text-slate-800 mt-1 font-mono">AAETG8344FF20241</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs font-semibold uppercase">PAN Number</span>
                    <p className="font-bold text-slate-800 mt-1 font-mono">AAETG8344F</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs font-semibold uppercase">Registered Address</span>
                    <p className="font-bold text-slate-800 mt-1">G-48 Shaheen Bagh, Okhla, New Delhi-110025</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    Quick Access
                  </span>
                  <h3 className="text-2xl font-bold mb-2">Live Public Portals</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Verify receipts, view documents, or check live certificates directly on public endpoints.
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/donate"
                    className="w-full py-2.5 px-4 bg-white text-blue-600 rounded-xl font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <span>Donation Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/certificates"
                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <span>Verify Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: DONATIONS */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Donations &amp; Payment Records</h2>
                <p className="text-sm text-slate-500">Live online contributions recorded via Razorpay Gateway</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
              <Heart className="w-12 h-12 text-blue-500 mx-auto mb-3 opacity-60" />
              <h3 className="font-bold text-slate-800 text-base mb-1">Razorpay Live Gateway Active</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Incoming donations are automatically verified and generate unique 80G tax receipts formatted as <span className="font-mono font-semibold">GGT-2026-XXXX</span>.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Programs &amp; Initiatives</h2>
                <p className="text-sm text-slate-500">Active campaigns on the ground</p>
              </div>
              <Link
                href="/programs"
                target="_blank"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Public Page
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Education Initiatives</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Vidyanjali school drives, free uniforms, sweaters &amp; supplies.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Community Camps</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Medical camps, dental checkups, and Aadhaar card assistance.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Poverty Alleviation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Food distribution drives, emergency relief, and seasonal care.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Official Trust Documents</h2>
                <p className="text-sm text-slate-500">Public reports, audit certificates, and trust deed</p>
              </div>
              <Link
                href="/documents"
                target="_blank"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Public Page
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">80G Certificate of Registration</h4>
                  <p className="text-xs text-slate-500">Income Tax Department Exemption Document</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Trust Registration Deed</h4>
                  <p className="text-xs text-slate-500">Official registration document dated Sep 30, 2024</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Issued Certificates &amp; Results</h2>
                <p className="text-sm text-slate-500">Search and verify credentials against student enrollment numbers</p>
              </div>
              <Link
                href="/certificates"
                target="_blank"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Verification
              </Link>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-60" />
              <h3 className="font-bold text-slate-800 text-base mb-1">Certificate System Online</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Students can enter their Enrollment ID and Date of Birth on the public portal to verify and download their official digital credentials.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

