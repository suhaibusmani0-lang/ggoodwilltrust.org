import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Real data fetch karne ke liye axios add kiya

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      staggerChildren: 0.1,
      delayChildren: 0.8 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const HeroSection = () => {
  const navigate = useNavigate();
  
  // States
  const [vehicles, setVehicles] = useState([]);
  const [searchData, setSearchData] = useState({
    make: '', model: '', minYear: '', maxYear: '', maxPrice: '', maxMileage: ''
  });

  const backgroundImages = [
    '/car (1).jpg', '/car (2).jpg', '/car (3).jpg', '/car (4).jpg', '/car (5).jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Background Image Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // NAYA CODE: Real inventory fetch karna jab Hero load ho
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
      } catch (e) {
        console.error('Error fetching inventory for hero section', e);
      }
    };
    fetchVehicles();
  }, []);

  // NAYA CODE: Real vehicles data se unique Makes aur Models nikalna (same logic as InventoryPage)
  const availableMakes = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean))).sort();
  }, [vehicles]);

  const availableModels = useMemo(() => {
    if (!searchData.make) {
      return Array.from(new Set(vehicles.map((v) => v.model).filter(Boolean))).sort();
    }
    return Array.from(
      new Set(vehicles.filter((v) => v.make === searchData.make).map((v) => v.model).filter(Boolean))
    ).sort();
  }, [vehicles, searchData.make]);

  // Make change hone par model ko empty/reset kar do
  const handleMakeChange = (e) => {
    setSearchData({ ...searchData, make: e.target.value, model: '' });
  };

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
      <div className="relative h-[360px] md:h-[420px] overflow-hidden flex items-center justify-center bg-black">
        
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={backgroundImages[currentImage]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Xen Motors Cars"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-start md:justify-center">
          <div className="text-left md:text-center text-white md:mt-0 mt-10">
            
            <motion.h1 
              initial={{ x: -100, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 60, duration: 1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl"
            >
              XEN MOTORS <span className="text-red-600">INC.</span>
            </motion.h1>

            <motion.p 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 60, delay: 0.4, duration: 1 }}
              className="text-lg md:text-2xl font-light tracking-[0.2em] mt-3 opacity-90"
            >
              YOUR VEHICLE DESTINATION IN HICKSVILLE, NY
            </motion.p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 shadow-xl relative z-30 transform -translate-y-6 mx-4 md:mx-auto md:max-w-6xl rounded-lg">
        <div className="px-6 py-5">
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSearch} 
            className="grid grid-cols-2 md:grid-cols-7 gap-4 items-end"
          >
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Make</label>
              <select
                value={searchData.make}
                onChange={handleMakeChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
              >
                <option value="">All Makes</option>
                {/* Dynamically mapped actual makes */}
                {availableMakes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Model</label>
              <select
                value={searchData.model}
                onChange={(e) => setSearchData({ ...searchData, model: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
                disabled={!searchData.make} 
              >
                <option value="">All Models</option>
                {/* Dynamically mapped actual models based on Make */}
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Year</label>
              <select
                value={searchData.minYear}
                onChange={(e) => setSearchData({ ...searchData, minYear: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
              >
                <option value="">Min Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Year</label>
              <select
                value={searchData.maxYear}
                onChange={(e) => setSearchData({ ...searchData, maxYear: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
              >
                <option value="">Max Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price</label>
              <select
                value={searchData.maxPrice}
                onChange={(e) => setSearchData({ ...searchData, maxPrice: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
              >
                <option value="">Max Price</option>
                {prices.map((p) => <option key={p} value={p}>${p.toLocaleString()}</option>)}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Mileage</label>
              <select
                value={searchData.maxMileage}
                onChange={(e) => setSearchData({ ...searchData, maxMileage: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 transition-all cursor-pointer"
              >
                <option value="">Max Mileage</option>
                {mileages.map((m) => <option key={m} value={m}>{m.toLocaleString()}</option>)}
              </select>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.03, backgroundColor: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="col-span-2 md:col-span-1 bg-gray-900 text-white py-2.5 px-4 rounded text-sm font-bold tracking-wide shadow-md transition-colors w-full h-[42px] flex items-center justify-center"
            >
              Search Inventory
            </motion.button>

          </motion.form>
        </div>
      </div>
    </>
  );
};

export default HeroSection;