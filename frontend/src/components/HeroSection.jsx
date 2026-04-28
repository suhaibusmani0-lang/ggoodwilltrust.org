import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makes } from '../mockData';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    maxPrice: '',
    maxMileage: ''
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i + 1);
  const prices = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000];
  const mileages = [10000, 25000, 50000, 75000, 100000, 150000];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchData).forEach(([k, v]) => { if (v) params.append(k, v); });
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <>
      {/* Hero image with title */}
      <div
        className="relative h-[360px] md:h-[420px] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wide">XEN MOTORS INC.</h1>
            <p className="text-lg md:text-2xl font-light tracking-wider mt-2">YOUR VEHICLE DESTINATION IN HICKSVILLE, NY</p>
          </div>
        </div>
      </div>

      {/* Search bar strip */}
      <div className="bg-gray-100 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-7 gap-2 items-end" data-testid="hero-search-form">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs text-gray-600 mb-1">Make</label>
              <select
                value={searchData.make}
                onChange={(e) => setSearchData({ ...searchData, make: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
                data-testid="hero-make"
              >
                <option value="">All Makes</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs text-gray-600 mb-1">Model</label>
              <select
                value={searchData.model}
                onChange={(e) => setSearchData({ ...searchData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
              >
                <option value="">All Models</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Year</label>
              <select
                value={searchData.minYear}
                onChange={(e) => setSearchData({ ...searchData, minYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
              >
                <option value="">Min Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Year</label>
              <select
                value={searchData.maxYear}
                onChange={(e) => setSearchData({ ...searchData, maxYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
              >
                <option value="">Max Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Price</label>
              <select
                value={searchData.maxPrice}
                onChange={(e) => setSearchData({ ...searchData, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
              >
                <option value="">Max Price</option>
                {prices.map((p) => <option key={p} value={p}>${p.toLocaleString()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Mileage</label>
              <select
                value={searchData.maxMileage}
                onChange={(e) => setSearchData({ ...searchData, maxMileage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 bg-white"
              >
                <option value="">Max Mileage</option>
                {mileages.map((m) => <option key={m} value={m}>{m.toLocaleString()}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="col-span-2 md:col-span-1 bg-gray-900 text-white py-2 px-4 text-sm font-medium hover:bg-red-600 transition-colors border border-gray-900"
              data-testid="hero-search-submit"
            >
              Search Inventory
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
