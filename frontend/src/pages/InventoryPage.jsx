import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, Search, ChevronLeft, ChevronRight, ChevronsRight, ChevronDown, Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const PAGE_SIZE = 24;
const CACHE_KEY = 'xen_inventory_cache';
const CACHE_TIME = 10 * 60 * 1000; 

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800';

const getPrimaryImage = (v) => {
  if (v.images && v.images.length) return v.images[0];
  return v.image || FALLBACK_IMAGE;
};

// ============== MOBILE-FIRST VEHICLE CARD ==============
const VehicleCard = ({ vehicle }) => (
  <div className="bg-white border-b md:border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
    {vehicle.status === 'hold' && (
      <div className="absolute top-2 left-2 bg-yellow-500 text-black px-3 py-1 font-black text-[10px] uppercase tracking-tighter rounded z-10 shadow-lg">HOLD</div>
    )}
    {vehicle.status === 'sold' && (
      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 font-black text-[10px] uppercase tracking-tighter rounded z-10 shadow-lg">SOLD</div>
    )}

    <div className="flex flex-col">
      <Link to={`/vehicle/${vehicle.id}`} className="relative group">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={getPrimaryImage(vehicle)}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${vehicle.status === 'sold' ? 'grayscale opacity-75' : ''}`}
            loading="lazy"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <Link to={`/vehicle/${vehicle.id}`}>
          <h3 className="text-sm md:text-lg font-black text-gray-900 leading-tight uppercase mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
        </Link>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Price</span>
            <span className="text-lg md:text-xl font-black text-red-600">${Number(vehicle.price || 0).toLocaleString()}</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Mileage</span>
            <span className="text-sm md:text-base font-bold text-gray-700">{Number(vehicle.mileage || 0).toLocaleString()} mi</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-[11px] border-t border-gray-100 pt-2 mb-4">
          <div className="flex justify-between"><span className="text-gray-400">Engine</span><span className="font-bold truncate ml-1">{vehicle.engine || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Color</span><span className="font-bold truncate ml-1">{vehicle.exteriorColor || 'N/A'}</span></div>
        </div>

        <div className="flex gap-2">
          <Link to="/contact" state={{ vehicleId: vehicle.id }} className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-tighter rounded transition-colors ${vehicle.status === 'sold' ? 'bg-gray-200 text-gray-400 pointer-events-none' : 'bg-gray-900 text-white hover:bg-red-600'}`}><Mail size={14} /> Message</Link>
          <a href={vehicle.status === 'sold' ? '#' : 'tel:5167885722'} className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-tighter border-2 rounded transition-colors ${vehicle.status === 'sold' ? 'border-gray-200 text-gray-300 pointer-events-none' : 'border-gray-900 text-gray-900 hover:bg-gray-50'}`}><Phone size={14} /> Call Now</a>
        </div>
      </div>
    </div>
  </div>
);

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [stockSearch, setStockSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    make: '', minPrice: '', maxPrice: '', bodyType: searchParams.get('bodyType') || '',
  });

  // ============== FAST LOADING CACHE ==============
  useEffect(() => {
    const fetchVehicles = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TIME) {
          setVehicles(data);
          setLoading(false);
          refreshDataInBackground(); 
          return;
        }
      }
      setLoading(true);
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, timestamp: Date.now() }));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    const refreshDataInBackground = async () => {
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, timestamp: Date.now() }));
      } catch (e) {}
    };
    fetchVehicles();
  }, []);

  const updateFilter = (field, value) => { setFilters(prev => ({ ...prev, [field]: value })); setPage(1); };

  const filteredSorted = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (filters.make && v.make !== filters.make) return false;
      if (filters.minPrice && Number(v.price) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && Number(v.price) > Number(filters.maxPrice)) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      return true;
    });
    if (stockSearch.trim()) {
      const q = stockSearch.trim().toLowerCase();
      list = list.filter((v) => (v.vin || '').toLowerCase().includes(q) || (v.stockNumber || '').toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sort === 'priceLow') return (a.price || 0) - (b.price || 0);
      if (sort === 'priceHigh') return (b.price || 0) - (a.price || 0);
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    return list;
  }, [vehicles, filters, stockSearch, sort]);

  const pagedVehicles = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="bg-[#222] text-white py-8 border-b-4 border-red-600">
        <div className="container mx-auto px-4"><h1 className="text-xl md:text-3xl font-black italic text-center uppercase tracking-tighter">Cars For Sale In Hicksville, NY</h1></div>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-4">
        {/* ======= NEW SEARCH/FILTER UI (IMAGE MATCH) ======= */}
        <div className="mb-4">
           <p className="text-sm font-bold text-gray-800 mb-2">Showing {((page-1)*PAGE_SIZE)+1} - {Math.min(page*PAGE_SIZE, filteredSorted.length)} of {filteredSorted.length}</p>
           
           <div className="flex gap-2 mb-2">
             <div className="relative flex-1">
               <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full h-[45px] border border-gray-300 bg-white px-3 font-bold text-sm outline-none appearance-none pr-8"
               >
                 <option value="newest">Date Added: Newest</option>
                 <option value="priceLow">Price: Low to High</option>
                 <option value="priceHigh">Price: High to Low</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
             <button 
               onClick={() => setShowMobileFilters(true)}
               className="bg-[#1a1a1a] text-white flex items-center gap-2 px-6 h-[45px] font-black text-sm uppercase tracking-tighter"
             >
               <Filter size={16} /> Filters
             </button>
           </div>

           <div className="flex h-[45px]">
             <input 
               type="text" 
               placeholder="Search Stock # or VIN"
               className="flex-1 border border-gray-300 border-r-0 px-4 font-bold text-sm outline-none"
               value={stockSearch}
               onChange={(e) => setStockSearch(e.target.value)}
             />
             <button className="bg-[#1a1a1a] text-white px-5 flex items-center justify-center">
               <Search size={20} />
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Mobile Filter Drawer */}
          <aside className={`${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} lg:block bg-white border p-4 h-fit lg:sticky lg:top-4`}>
            <div className="flex justify-between mb-4 border-b pb-2"><h2 className="font-black uppercase italic">Filter Results</h2><button onClick={() => setShowMobileFilters(false)} className="text-red-600 font-bold">CLOSE X</button></div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Make</label>
                <select onChange={(e) => updateFilter('make', e.target.value)} className="w-full border-2 p-2 font-bold text-sm">
                  <option value="">All Makes</option>
                  {[...new Set(vehicles.map(v => v.make))].sort().map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-red-600 text-white py-4 font-black uppercase tracking-widest">Show {filteredSorted.length} Cars</button>
            </div>
          </aside>

          <div className="min-w-0">
            {loading ? (
              <div className="text-center py-20 font-black italic text-gray-400 animate-pulse">Syncing Inventory...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-4">
                {pagedVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InventoryPage;