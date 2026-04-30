import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PopularBrowseSection from '../components/PopularBrowseSection';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, Search, ChevronLeft, ChevronRight, ChevronsRight, ChevronDown } from 'lucide-react';

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

// ============== Vehicle Card (With HOLD & SOLD Stickers) ==============
const VehicleCard = ({ vehicle }) => (
  <div className="bg-white border border-gray-200 hover:shadow-md transition-shadow relative" data-testid={`vehicle-card-${vehicle.id}`}>
    
    {/* ===== HIGH-CLASS STATUS STICKERS ===== */}
    {vehicle.status === 'hold' && (
      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1.5 font-extrabold text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10 border border-yellow-300">
        Hold / Deposit
      </div>
    )}
    
    {vehicle.status === 'sold' && (
      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-1.5 font-extrabold text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(220,38,38,0.6)] z-10 border border-red-500">
        Sold Out
      </div>
    )}
    {/* ======================================= */}

    <Link to={`/vehicle/${vehicle.id}`} className="block">
      <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
        {/* Agar gaadi sold hai, toh photo ko thoda black-and-white (grayscale) kar denge taaki aur realistic lage */}
        <img
          src={getPrimaryImage(vehicle)}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${vehicle.status === 'sold' ? 'grayscale opacity-80' : ''}`}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </div>
    </Link>

    <div className="p-4">
      <Link to={`/vehicle/${vehicle.id}`} className="block">
        <h3 className="text-base font-bold text-gray-900 leading-tight uppercase truncate hover:text-red-600">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
      </Link>

      {/* Agar gaadi Sold hai, toh "Apply Now" button chhupa do */}
      {vehicle.status !== 'sold' ? (
        <Link to="/finance" className="inline-block text-xs text-red-600 hover:underline mt-1 mb-3">Apply Now</Link>
      ) : (
        <div className="text-xs text-gray-400 mt-1 mb-3">Unavailable for Financing</div>
      )}

      <div className="flex justify-between items-end mb-3 pb-3 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-xl font-bold text-gray-900">${Number(vehicle.price || 0).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Mileage</p>
          <p className="text-base font-semibold text-gray-900">{Number(vehicle.mileage || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs mb-3">
        {vehicle.engine && (
          <div className="flex justify-between gap-2"><span className="text-gray-500">Engine</span><span className="text-gray-900 text-right">{vehicle.engine}</span></div>
        )}
        {vehicle.transmission && (
          <div className="flex justify-between gap-2"><span className="text-gray-500">Transmission</span><span className="text-gray-900 text-right">{vehicle.transmission}</span></div>
        )}
        {vehicle.drivetrain && (
          <div className="flex justify-between gap-2"><span className="text-gray-500">Drivetrain</span><span className="text-gray-900 text-right">{vehicle.drivetrain}</span></div>
        )}
        {vehicle.exteriorColor && (
          <div className="flex justify-between gap-2"><span className="text-gray-500">Ext. Color</span><span className="text-gray-900 text-right">{vehicle.exteriorColor}</span></div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Link
          to="/contact"
          state={{ vehicleId: vehicle.id }}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${vehicle.status === 'sold' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          onClick={(e) => vehicle.status === 'sold' && e.preventDefault()}
          data-testid={`email-vehicle-${vehicle.id}`}
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </Link>
        <a
          href={vehicle.status === 'sold' ? '#' : 'tel:5167885722'}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium border transition-colors ${vehicle.status === 'sold' ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-100'}`}
          onClick={(e) => vehicle.status === 'sold' && e.preventDefault()}
          data-testid={`call-vehicle-${vehicle.id}`}
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-900"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
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
    <form onSubmit={handleSubmit} className="space-y-2 text-sm" data-testid="sidebar-contact-form">
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

  const [filters, setFilters] = useState({
    conditions: [],
    make: '',
    model: '',
    trim: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    minYear: '',
    maxYear: '',
    bodyType: searchParams.get('bodyType') || '',
    exteriorColors: [],
    interiorColors: []
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
        setPage(1);
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

  // Derive filter options dynamically from inventory
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
        default:
          return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
    });
    return list;
  }, [vehicles, filters, stockSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const pagedVehicles = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showingFrom = filteredSorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filteredSorted.length);

  // Body type counts for sidebar
  const bodyCounts = useMemo(() => {
    const counts = {};
    vehicles.forEach((v) => { counts[v.bodyType] = (counts[v.bodyType] || 0) + 1; });
    return counts;
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero - small dark band */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-center">CARS FOR SALE IN HICKSVILLE, NY</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600" data-testid="breadcrumb">
          <Link to="/" className="text-red-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Cars For Sale</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ============= LEFT SIDEBAR ============= */}
          <aside className="bg-white border border-gray-200 p-4 h-fit lg:sticky lg:top-4" data-testid="filter-sidebar">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-2">
              <h2 className="font-bold text-gray-900">Filter Inventory</h2>
              <button onClick={clearFilters} className="text-xs text-red-600 hover:underline" data-testid="clear-filters">Clear</button>
            </div>

            <FilterGroup title="Condition">
              <div className="space-y-2">
                {CONDITIONS.map((c) => {
                  const count = vehicles.filter((v) => v.condition === c).length;
                  return (
                    <label key={c} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={filters.conditions.includes(c)}
                        onChange={() => toggleArray('conditions', c)}
                        className="w-4 h-4"
                      />
                      <span>{c} {count > 0 && <span className="text-gray-500">({count})</span>}</span>
                    </label>
                  );
                })}
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
                <span className="text-xs text-gray-500">to</span>
                <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="$200K" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
              </div>
            </FilterGroup>

            <FilterGroup title="Mileage">
              <div className="flex gap-2 items-center">
                <input type="number" value={filters.minMileage} onChange={(e) => updateFilter('minMileage', e.target.value)} placeholder="0" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
                <span className="text-xs text-gray-500">to</span>
                <input type="number" value={filters.maxMileage} onChange={(e) => updateFilter('maxMileage', e.target.value)} placeholder="200K" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
              </div>
            </FilterGroup>

            <FilterGroup title="Year">
              <div className="flex gap-2 items-center">
                <input type="number" value={filters.minYear} onChange={(e) => updateFilter('minYear', e.target.value)} placeholder="2000" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
                <span className="text-xs text-gray-500">to</span>
                <input type="number" value={filters.maxYear} onChange={(e) => updateFilter('maxYear', e.target.value)} placeholder="2026" className="w-full px-2 py-1.5 border border-gray-300 text-xs" />
              </div>
            </FilterGroup>

            <FilterGroup title="Body Style">
              <select value={filters.bodyType} onChange={(e) => updateFilter('bodyType', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 text-sm">
                <option value="">All Body Styles</option>
                {allBodyStyles.map((b) => <option key={b}>{b} ({bodyCounts[b] || 0})</option>)}
              </select>
            </FilterGroup>

            <FilterGroup title="Exterior Color" defaultOpen={false}>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {EXTERIOR_COLORS.map((c) => (
                  <label key={c} className="flex items-center gap-1.5 text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.exteriorColors.includes(c)}
                      onChange={() => toggleArray('exteriorColors', c)}
                      className="w-3.5 h-3.5"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Interior Color" defaultOpen={false}>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {INTERIOR_COLORS.map((c) => (
                  <label key={c} className="flex items-center gap-1.5 text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.interiorColors.includes(c)}
                      onChange={() => toggleArray('interiorColors', c)}
                      className="w-3.5 h-3.5"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </FilterGroup>

            {/* Contact Us inline form */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h2 className="font-bold text-gray-900 mb-3">Contact Us</h2>
              <SidebarContact />
            </div>
          </aside>

          {/* ============= RIGHT GRID ============= */}
          <div className="min-w-0">
            {/* Top results bar */}
            <div className="bg-white border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-gray-700" data-testid="results-count">
                Showing {showingFrom} - {showingTo} of {filteredSorted.length}
              </p>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                data-testid="inventory-sort"
              >
                <option value="newest">Date Added: Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="mileageLow">Mileage: Low to High</option>
                <option value="yearNew">Year: Newest First</option>
                <option value="yearOld">Year: Oldest First</option>
              </select>

              <div className="flex-1 min-w-[200px] ml-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search Stock # or VIN"
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                    data-testid="search-stock-vin"
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="text-center py-16 text-gray-600">Loading inventory…</div>
            ) : filteredSorted.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200">
                <p className="text-gray-700 mb-3">No vehicles match your search.</p>
                <Link to="/find-a-car" className="inline-block bg-red-600 text-white py-2 px-6 hover:bg-red-700">
                  No matches? Let us find it for you →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="inventory-grid">
                {pagedVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2" data-testid="pagination">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 border text-sm ${p === page ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-2 border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                  <ChevronsRight className="w-4 h-4" />
                </button>
                <span className="ml-2 text-xs text-gray-600 w-full text-center sm:w-auto sm:ml-4">
                  Showing {showingFrom} - {showingTo} of {filteredSorted.length} Results
                </span>
              </div>
            )}

            {/* CTA Footer */}
            <div className="mt-12 py-8 border-t border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">FIND YOUR NEXT VEHICLE IN HICKSVILLE, NY AT XEN MOTORS INC.</h2>
              <p className="text-sm text-gray-600 max-w-3xl">
                Xen Motors Inc. has {bodyCounts.Sedan || 0} Sedan, {bodyCounts.SUV || 0} SUV{(bodyCounts.Coupe ? `, and ${bodyCounts.Coupe} Coupe` : '')} listings for sale in Hicksville, NY. Shop top brands and get a great deal on your next vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Browse tabs at bottom */}
      <PopularBrowseSection />

      <Footer />
    </div>
  );
};

export default InventoryPage;