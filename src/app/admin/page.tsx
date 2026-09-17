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
  ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'programs' | 'documents' | 'certificates'>('overview');
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data lists
  const [programs, setPrograms] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal controls
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newProgram, setNewProgram] = useState({ title: '', description: '', image_url: '' });
  const [newDoc, setNewDoc] = useState({ title: '', description: '', category: 'Reports', file_url: '' });
  const [newCert, setNewCert] = useState({ title: 'Certificate of Achievement', name: '', enrollment_no: '', course: '', dob: '', grade: 'A' });

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [progRes, docRes, certRes] = await Promise.all([
        fetch('/api/programs').then(r => r.json()),
        fetch('/api/documents').then(r => r.json()),
        fetch('/api/certificates').then(r => r.json()),
      ]);

      if (progRes.data) setPrograms(progRes.data);
      if (docRes.data) setDocuments(docRes.data);
      if (certRes.data) setCertificates(certRes.data);
    } catch {
      // Graceful fallback
    } finally {
      setLoadingData(false);
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
        setSeedMessage({ type: 'success', text: data.message || 'Database loaded successfully!' });
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

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewProgram(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert(data.message || 'Image upload failed. Please try again.');
      }
    } catch {
      alert('Error uploading image to Cloudinary.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Program
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

  // Delete Program
  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await fetch(`/api/programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete program.');
    }
  };

  // Add Document
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

  // Delete Document
  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to delete document.');
    }
  };

  // Add Certificate
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

  // Delete Certificate
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
                Admin Portal
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
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 mb-6 border-b border-slate-200 hide-scrollbar">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'programs', label: `Programs (${programs.length})`, icon: BookOpen },
              { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
              { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
              { id: 'donations', label: 'Donations', icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
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

          {/* Quick Seed Action Button */}
          <button
            onClick={handleSeedData}
            disabled={loadingSeed}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 shadow-md shadow-emerald-600/20 transition-all shrink-0 disabled:opacity-50"
          >
            {loadingSeed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            1-Click Load Initial Data
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
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Programs</p>
                  <h3 className="text-3xl font-black text-slate-900">{programs.length}</h3>
                  <button onClick={() => setActiveTab('programs')} className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Programs &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Documents</p>
                  <h3 className="text-3xl font-black text-slate-900">{documents.length}</h3>
                  <button onClick={() => setActiveTab('documents')} className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Documents &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Certificates</p>
                  <h3 className="text-3xl font-black text-slate-900">{certificates.length}</h3>
                  <button onClick={() => setActiveTab('certificates')} className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-2 hover:underline">
                    Manage Certificates &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Database Sync</p>
                  <h3 className="text-2xl font-black text-emerald-600">Connected</h3>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-2">
                    <Clock className="w-3.5 h-3.5" /> MongoDB Atlas
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Data Seeder Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-slate-900">Load Initial Website Data</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Agar aapka database naya ya empty hai, to ye button click karke official Programs (Education, Healthcare, Relief), 80G Documents, aur Sample Verification Certificates ko 1 click me database me insert kar sakte hain.
                </p>
              </div>
              <button
                onClick={handleSeedData}
                disabled={loadingSeed}
                className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {loadingSeed ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading into Database...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" /> ⚡ Populate Initial Data
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROGRAMS ================= */}
        {activeTab === 'programs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Programs &amp; Initiatives</h2>
                <p className="text-sm text-slate-500">Add or manage charitable projects shown on the public site</p>
              </div>
              <button
                onClick={() => setShowProgramModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Program
              </button>
            </div>

            {programs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No programs found in database</h4>
                <p className="text-sm text-slate-500 mb-4">Click below to add a program or load the initial default programs.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowProgramModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
                    + Add Program
                  </button>
                  <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                    Load Default Programs
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((item) => (
                  <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between group">
                    <div>
                      {item.image_urls && item.image_urls[0] && (
                        <div className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-100">
                          <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                        <button
                          onClick={() => handleDeleteProgram(item._id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                          title="Delete Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>ID: {item._id.slice(-6)}</span>
                      <span className="text-blue-600 font-semibold">Live on website</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Official Trust Documents</h2>
                <p className="text-sm text-slate-500">Manage 80G tax forms, deeds, and impact reports</p>
              </div>
              <button
                onClick={() => setShowDocModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Document
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No documents in database</h4>
                <p className="text-sm text-slate-500 mb-4">Click below to upload a document record or load the initial 80G documents.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowDocModal(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                    + Add Document
                  </button>
                  <button onClick={handleSeedData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
                    Load Default Documents
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
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
                        <td className="p-4 font-bold text-slate-900">{doc.title}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            {doc.category || 'Reports'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs max-w-xs truncate">{doc.description}</td>
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

        {/* ================= TAB 4: CERTIFICATES ================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Certificates &amp; Student Credentials</h2>
                <p className="text-sm text-slate-500">Issue credentials verifiable on the public Certificates portal</p>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Issue Certificate
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No certificates in database</h4>
                <p className="text-sm text-slate-500 mb-4">Click below to issue a student certificate or load sample certificates.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowCertModal(true)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold">
                    + Issue Certificate
                  </button>
                  <button onClick={handleSeedData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
                    Load Sample Certificates
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4">Enrollment No</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Course / Event</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">{cert.enrollment_no}</td>
                        <td className="p-4 font-semibold text-slate-900">{cert.name || 'N/A'}</td>
                        <td className="p-4 text-slate-600 text-xs">{cert.course || cert.title}</td>
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

        {/* ================= TAB 5: DONATIONS ================= */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Donations &amp; Payment Gateway</h2>
              <p className="text-sm text-slate-500">Live contributions collected via Razorpay with 80G tax deductions</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-1">Razorpay Live Gateway Online</h4>
                <p className="text-slate-600 leading-relaxed mb-2">
                  When donors contribute on the public <Link href="/donate" target="_blank" className="text-blue-600 font-semibold underline">/donate</Link> page, their donation intent, PAN number, and amount are stored directly into the MongoDB <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">Donation</span> collection.
                </p>
                <span className="inline-block text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  80G Exemption Receipt Generated Automatically
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD PROGRAM ================= */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Program</h3>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about this initiative..."
                  value={newProgram.description}
                  onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Program Image</label>
                <div className="space-y-3">
                  {/* Upload file box */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                          Click to Browse &amp; Upload Image
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP supported</span>
                      </div>
                    )}
                  </label>

                  {/* Preview if uploaded */}
                  {newProgram.image_url && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center gap-3 p-2">
                      <img
                        src={newProgram.image_url}
                        alt="Program Preview"
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block truncate">Image Uploaded</span>
                        <span className="text-[10px] text-slate-500 block truncate font-mono">{newProgram.image_url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewProgram(prev => ({ ...prev, image_url: '' }))}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove Image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Manual URL Input fallback */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Or paste image URL / local path:</span>
                    <input
                      type="text"
                      placeholder="/assets/hompage1.jpg or https://..."
                      value={newProgram.image_url}
                      onChange={e => setNewProgram({ ...newProgram, image_url: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Program'}
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
              <h3 className="text-lg font-bold text-slate-900">Add New Document</h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDoc} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Report 2025-2026"
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
                  <option value="Reports">Reports</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Policies">Policies</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the document..."
                  value={newDoc.description}
                  onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">File Download URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newDoc.file_url}
                  onChange={e => setNewDoc({ ...newDoc, file_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CERTIFICATE ================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Issue Student Certificate</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCert} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohd Rehan"
                    value={newCert.name}
                    onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Enrollment No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GGT-2026-105"
                    value={newCert.enrollment_no}
                    onChange={e => setNewCert({ ...newCert, enrollment_no: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Course / Initiative</label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Literacy"
                    value={newCert.course}
                    onChange={e => setNewCert({ ...newCert, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Grade / Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Distinction or A+"
                    value={newCert.grade}
                    onChange={e => setNewCert({ ...newCert, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Date of Birth (For Verification)</label>
                <input
                  type="date"
                  value={newCert.dob}
                  onChange={e => setNewCert({ ...newCert, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-slate-700"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50"
                >
                  {submitting ? 'Issuing...' : 'Save & Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
