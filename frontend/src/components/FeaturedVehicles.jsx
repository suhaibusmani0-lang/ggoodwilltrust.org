import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800';

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${API}/vehicles?featured=true`);
        if (response.data.length === 0) {
          const all = await axios.get(`${API}/vehicles`);
          setVehicles(all.data.slice(0, 8));
        } else {
          setVehicles(response.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const scroll = (dir) => {
    if (!scrollerRef.current) return;
    const delta = scrollerRef.current.offsetWidth / 2;
    scrollerRef.current.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white tracking-wide">FEATURED VEHICLES</h2>
          <p className="text-center text-gray-400">Loading vehicles…</p>
        </div>
      </section>
    );
  }

  if (!vehicles.length) return null;

  return (
    <section className="py-16 bg-gray-900" data-testid="featured-section">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-white tracking-wide">## FEATURED VEHICLES ##</h2>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                to={`/vehicle/${vehicle.id}`}
                className="flex-shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] bg-white snap-start"
                data-testid={`featured-vehicle-${vehicle.id}`}
              >
                <div className="p-4 text-center">
                  <h3 className="text-base font-bold text-gray-900 leading-tight uppercase truncate">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  {vehicle.trim && <p className="text-xs text-gray-500 uppercase">{vehicle.trim}</p>}
                </div>
                <div className="flex items-stretch border-y border-gray-200 divide-x divide-gray-200">
                  <div className="flex-1 py-3 text-center">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-lg font-bold text-red-600">${Number(vehicle.price || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex-1 py-3 text-center">
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="text-lg font-bold text-gray-900">{Number(vehicle.mileage || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={(vehicle.images && vehicle.images[0]) || vehicle.image || FALLBACK_IMAGE}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </div>
                <div className="bg-gray-700 text-white text-center py-2.5 text-sm font-medium hover:bg-red-600 transition-colors">
                  View Details
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
