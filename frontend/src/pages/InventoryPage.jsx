import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PopularBrowseSection from '../components/PopularBrowseSection';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, Search, ChevronLeft, ChevronRight, ChevronsRight, ChevronDown, Filter, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const PAGE_SIZE = 24;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800';

const EXTERIOR_COLORS = ['Black', 'Silver', 'White', 'Blue', 'Red', 'Tan', 'Gray'];
const INTERIOR_COLORS = ['Black', 'Beige', 'Gray', 'Off-White', 'Tan', 'Brown'];
const CONDITIONS = ['Certified', 'New', 'Used'];

const getPrimaryImage = (v) => {
  if (v.images && v.images.length) return v.images[0];
  return v.image || FALLBACK_IMAGE;
};

// ============== Vehicle Card (UPDATED TO MATCH PHOTO) ==============
const VehicleCard = ({ vehicle }) => (
  <div className="bg-white border border-gray-200 hover:shadow-md transition-shadow relative flex flex-col h-full" data-testid={`vehicle-card-${vehicle.id}`}>
    {vehicle.status === 'hold' && (
      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1.5 font-extrabold text-xs uppercase tracking-widest rounded shadow-lg z-10 border border-yellow-300">
        Hold / Deposit
      </div>
    )}
    {vehicle.status === 'sold' && (
      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-1.5 font-extrabold text-xs uppercase tracking-widest rounded shadow-lg z-10 border border-red-500">
        Sold Out
      </div>
    )}

    <Link to={`/vehicle/${vehicle.id}`} className="block">
      <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
        <img
          src={getPrimaryImage(vehicle)}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${vehicle.status === 'sold' ? 'grayscale opacity-80' : ''}`}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </div>
    </Link>

    <div className="p-4 flex flex-col flex-grow">
      {/* Title & Trim (Centered like image) */}
      <Link to={`/vehicle/${vehicle.id}`} className="block text-center mb-1">
        <h3 className="text-base font-bold text-gray-900 leading-tight uppercase truncate hover:text-red-600">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-xs text-gray-500 font-medium truncate mt-1">{vehicle.trim || '\u00A0'}</p>
      </Link>

      {/* Finance Link */}
      <div className="text-center">
        {vehicle.status !== 'sold' ? (
          <Link to="/finance" className="inline-block text-[11px] font-bold text-red-600 hover:underline mt-1 mb-3">Apply Now</Link>
        ) : (
          <div className="text-[11px] text-gray-400 mt-1 mb-3">Unavailable for Financing</div>
        )}
      </div>

      {/* Price & Mileage (Centered Side by Side) */}
      <div className="flex justify-center items-center gap-8 mb-4 pb-4 border-b border-gray-200">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Price</p>
          <p className="text-xl font-extrabold text-gray-900">${Number(vehicle.price || 0).toLocaleString()}</p>
        </div>
        <div className="w-px h-10 bg-gray-300"></div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Mileage</p>
          <p className="text-lg font-bold text-gray-900">{Number(vehicle.mileage || 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">mi</span></p>
        </div>
      </div>

      {/* Detailed Specs List (From Photo) */}
      <div className="space-y-1.5 mb-5 text-[11px] text-gray-700">
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Engine</span>
          <span className="text-right font-medium">{vehicle.engine || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Trans</span>
          <span className="text-right font-medium">{vehicle.transmission || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Ext. Color</span>
          <span className="text-right font-medium">{vehicle.exteriorColor || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Int. Color</span>
          <span className="text-right font-medium">{vehicle.interiorColor || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Stock #</span>
          <span className="text-right font-medium">{vehicle.stockNumber || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider">VIN</span>
          <span className="text-right font-medium uppercase">{vehicle.vin || '-'}</span>
        </div>
      </div>

      {/* Buttons (Pushed to bottom) */}
      <div className="grid grid-cols-2 gap-1.5 mt-auto">
        <Link
          to="/contact"
          state={{ vehicleId: vehicle.id }}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${vehicle.status === 'sold' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          onClick={(e) => vehicle.status === 'sold' && e.preventDefault()}
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </Link>
        <a
          href={vehicle.status === 'sold' ? '#' : 'tel:5167885722'}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${vehicle.status === 'sold' ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-100'}`}
          onClick={(e) => vehicle.status === 'sold' && e.preventDefault()}
        >
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
      </div>
    </div>
  </div>
);

// ============== Filter Section (collapsible) ==============
const FilterGroup = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-3">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-900">
        {title} <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

// ============== Sidebar Contact Form ==============
const SidebarContact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', comments: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        message: form.comments
      });
      toast({ title: 'Message Sent!', description: "We'll get back to you shortly." });
      setForm({ firstName: '', lastName: '', email: '', phone: '', comments: '' });
    } catch {
      toast({ title: 'Error', description: 'Failed to send.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <input required type="text" placeholder="First Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
      <input required type="text" placeholder="Last Name *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
      <input required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
      <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
      <textarea rows={3} placeholder="Comments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"></textarea>
      <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white py-2.5 font-medium hover:bg-gray-800 disabled:opacity-50">
        {submitting ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
};

// ============== Main Page ==============
const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [stockSearch, setStockSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    conditions: [],
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    trim: searchParams.get('trim') || '',
    minPrice: '',
    maxPrice: searchParams.get('maxPrice') || '',
    minMileage: '',
    maxMileage: searchParams.get('maxMileage') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    bodyType: searchParams.get('bodyType') || '',
    exteriorColors: [],
    interiorColors: []
  });

  // NEW: Synchronize filters when URL search params change (Dropdown fix)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      make: searchParams.get('make') || '',
      model: searchParams.get('model') || '',
      bodyType: searchParams.get('bodyType') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      maxMileage: searchParams.get('maxMileage') || '',
    }));
    setPage(1);
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
      } catch (e) {
        console.error('fetch inventory error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const toggleArray = (field, value) => {
    const list = filters[field];
    setFilters({ ...filters, [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const updateFilter = (field, value) => setFilters({ ...filters, [field]: value });

  const clearFilters = () => {
    setFilters({
      conditions: [], make: '', model: '', trim: '',
      minPrice: '', maxPrice: '', minMileage: '', maxMileage: '',
      minYear: '', maxYear: '', bodyType: '',
      exteriorColors: [], interiorColors: []
    });
    setSearchParams({}, { replace: true });
  };

  const allMakes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean))).sort(), [vehicles]);
  const allModels = useMemo(() => {
    if (!filters.make) return Array.from(new Set(vehicles.map((v) => v.model).filter(Boolean))).sort();
    return Array.from(new Set(vehicles.filter((v) => v.make === filters.make).map((v) => v.model).filter(Boolean))).sort();
  }, [vehicles, filters.make]);
  const allBodyStyles = useMemo(() => Array.from(new Set(vehicles.map((v) => v.bodyType).filter(Boolean))).sort(), [vehicles]);

  const filteredSorted = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (filters.conditions.length && !filters.conditions.includes(v.condition)) return false;
      if (filters.make && v.make !== filters.make) return false;
      if (filters.model && v.model !== filters.model) return false;
      if (filters.trim && !(v.trim || '').toLowerCase().includes(filters.trim.toLowerCase())) return false;
      if (filters.minPrice && Number(v.price) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && Number(v.price) > Number(filters.maxPrice)) return false;
      if (filters.minMileage && Number(v.mileage) < Number(filters.minMileage)) return false;
      if (filters.maxMileage && Number(v.mileage) > Number(filters.maxMileage)) return false;
      if (filters.minYear && Number(v.year) < Number(filters.minYear)) return false;
      if (filters.maxYear && Number(v.year) > Number(filters.maxYear)) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      if (filters.exteriorColors.length && !filters.exteriorColors.some((c) => (v.exteriorColor || '').toLowerCase().includes(c.toLowerCase()))) return false;
      if (filters.interiorColors.length && !filters.interiorColors.some((c) => (v.interiorColor || '').toLowerCase().includes(c.toLowerCase()))) return false;
      return true;
    });

    if (stockSearch.trim()) {
      const q = stockSearch.trim().toLowerCase();
      list = list.filter((v) => (v.vin || '').toLowerCase().includes(q) || (v.stockNumber || '').toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'priceLow': return (a.price || 0) - (b.price || 0);
        case 'priceHigh': return (b.price || 0) - (a.price || 0);
        case 'mileageLow': return (a.mileage || 0) - (b.mileage || 0);
        case 'yearNew': return (b.year || 0) - (a.year || 0);
        case 'yearOld': return (a.year || 0) - (b.year || 0);
        case 'newest':
        default: return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });
    return list;
  }, [vehicles, filters, stockSearch, sort]);

  const totalPages = Math.ceil(filteredSorted.length / PAGE_SIZE);
  const pagedVehicles = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showingFrom = filteredSorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filteredSorted.length);
  const bodyCounts = useMemo(() => {
    const counts = {};
    vehicles.forEach((v) => { counts[v.bodyType] = (counts[v.bodyType] || 0) + 1; });
    return counts;
  }, [vehicles]);

  const FilterSidebarContent = () => (
    <>
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-2">
        <h2 className="font-bold text-gray-900">Filter Inventory</h2>
        <button onClick={clearFilters} className="text-xs text-red-600 hover:underline">Clear</button>
      </div>

      <FilterGroup title="Condition">
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={filters.conditions.includes(c)} onChange={() => toggleArray('conditions', c)} className="w-4 h-4" />
              <span>{c} {vehicles.filter((v) => v.condition === c).length > 0 && <span className="text-gray-500">({vehicles.filter((v) => v.condition === c).length})</span>}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Make, Model & Trim">
        <select value={filters.make} onChange={(e) => updateFilter('make', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 text-sm mb-2">
          <option value="">All Makes</option>
          {allMakes.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={filters.model} onChange={(e) => updateFilter('model', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 text-sm mb-2">
          <option value="">All Models</option>
          {allModels.map((m) => <option key={m}>{m}</option>)}
        </select>
        <input type="text" value={filters.trim} onChange={(e) => updateFilter('trim', e.target.value)} placeholder="All Trims" className="w-full px-2 py-1.5 border border-gray-300 text-sm" />
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex gap-2 items-center">
          <input type="number" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="$0" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
          <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="$200K" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
        </div>
      </FilterGroup>

      <FilterGroup title="Body Style">
        <select value={filters.bodyType} onChange={(e) => updateFilter('bodyType', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 text-sm">
          <option value="">All Body Styles</option>
          {allBodyStyles.map((b) => <option key={b}>{b} ({bodyCounts[b] || 0})</option>)}
        </select>
      </FilterGroup>
      
      {/* View Results Button for Mobile */}
      <button 
        onClick={() => setIsMobileFilterOpen(false)}
        className="lg:hidden w-full bg-red-600 text-white py-3 mt-6 font-bold uppercase tracking-widest"
      >
        View {filteredSorted.length} Results
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-center uppercase">CARS FOR SALE IN HICKSVILLE, NY</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600">
          <Link to="/" className="text-red-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Cars For Sale</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-white border border-gray-300 py-3 px-4 flex justify-between items-center font-bold text-gray-900 shadow-sm"
          >
            <div className="flex items-center gap-2 uppercase tracking-tighter">
              <Filter size={18} /> Filter Inventory
            </div>
            <div className="flex items-center gap-1 text-gray-400">
               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
               <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block bg-white border border-gray-200 p-4 h-fit sticky top-4">
            <FilterSidebarContent />
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h2 className="font-bold text-gray-900 mb-3">Contact Us</h2>
              <SidebarContact />
            </div>
          </aside>

          {/* Right Section */}
          <div className="min-w-0">
            <div className="bg-white border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-gray-700">Showing {showingFrom} - {showingTo} of {filteredSorted.length}</p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 border border-gray-300 text-sm outline-none">
                <option value="newest">Date Added: Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="mileageLow">Mileage: Low to High</option>
              </select>
              <div className="flex-1 min-w-[200px] ml-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Search Stock # or VIN" className="w-full pl-9 pr-3 py-1.5 border border-gray-300 text-sm focus:outline-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-600">Loading inventory…</div>
            ) : filteredSorted.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200"><p className="text-gray-700 mb-3">No vehicles match your search.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagedVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 border border-gray-300 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 border text-sm ${p === page ? 'bg-red-600 text-white border-red-600' : 'border-gray-300'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 border border-gray-300 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-[400px] bg-white shadow-xl animate-in slide-in-from-right duration-300 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase italic text-gray-900">Filter Options</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <FilterSidebarContent />
          </div>
        </div>
      )}

      <PopularBrowseSection />
      <Footer />
    </div>
  );
};

export default InventoryPage;