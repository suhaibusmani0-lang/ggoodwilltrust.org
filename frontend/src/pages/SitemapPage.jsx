import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SitemapPage = () => {
  const [vehicles, setVehicles] = useState([]);

  // Fetch real-time inventory to update Sitemap automatically
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${API}/vehicles`);
        setVehicles(res.data);
      } catch (e) {
        console.error('Error fetching inventory for Sitemap', e);
      }
    };
    fetchVehicles();
  }, []);

  // Top par scroll karne ke liye helper function
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Automatically extract unique Body Styles
  const bodyStyles = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.bodyType).filter(Boolean))].sort();
  }, [vehicles]);

  // Automatically extract unique Makes (Brands)
  const makes = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.make).filter(Boolean))].sort();
  }, [vehicles]);

  // Automatically extract unique Make-Model combinations
  const makeModels = useMemo(() => {
    const uniqueMap = new Map();
    vehicles.forEach((v) => {
      if (v.make && v.model) {
        const key = `${v.make} ${v.model}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, { make: v.make, model: v.model, display: key });
        }
      }
    });
    return Array.from(uniqueMap.values()).sort((a, b) => a.display.localeCompare(b.display));
  }, [vehicles]);

  // Sub-link styling helper (Hollow bullet point style from image)
  const SubLink = ({ to, label }) => (
    <div className="flex items-center gap-2 mt-2.5 ml-4">
      <span className="w-[5px] h-[5px] border border-red-600 rounded-full inline-block flex-shrink-0"></span>
      <Link to={to} onClick={scrollToTop} className="text-[#c82128] text-[14px] hover:underline hover:text-red-700">
        {label}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-12 drop-shadow-sm uppercase" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          Sitemap
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* COLUMN 1: STATIC PAGES */}
          <div>
            <h2 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider mb-6">PAGES</h2>
            
            <div className="space-y-4">
              <Link to="/" onClick={scrollToTop} className="block text-[#c82128] text-[14px] hover:underline">Home</Link>
              <Link to="/inventory" onClick={scrollToTop} className="block text-[#c82128] text-[14px] hover:underline">Cars For Sale</Link>

              <div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase mt-5 mb-2">Find A Car</h3>
                <SubLink to="/start-your-vehicle-purchase" label="Start Your Vehicle Purchase" />
                <SubLink to="/find-car" label="Car Finder" />
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase mt-5 mb-2">Finance</h3>
                <SubLink to="/finance" label="Loan Application" />
                <SubLink to="/trade-in" label="Value My Trade" />
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase mt-5 mb-2">Services</h3>
                <SubLink to="/services/service-dept" label="Service Dept" />
                <SubLink to="/services/parts-dept" label="Parts Dept" />
                <SubLink to="/services/body-shop" label="Body Shop" />
                <SubLink to="/services/glass" label="Glass Installation and Repair" />
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase mt-5 mb-2">Warranty</h3>
                <SubLink to="/warranty/info" label="Request Warranty Information" />
                <SubLink to="/warranty/schedule" label="Schedule Warranty Appt" />
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase mt-5 mb-2">Contact Us</h3>
                <SubLink to="/about" label="About Us" />
                <SubLink to="/contact" label="Contact" />
                <SubLink to="/schedule-visit" label="Schedule Visit" />
                <SubLink to="/referral" label="Referral Program" />
              </div>
            </div>
          </div>

          {/* COLUMN 2: BODY STYLES (DYNAMIC) */}
          <div>
            <h2 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider mb-6">BODYSTYLES</h2>
            <div className="space-y-3.5">
              {bodyStyles.length === 0 ? <span className="text-gray-400 text-sm">Loading...</span> : null}
              {bodyStyles.map((style, idx) => (
                <Link 
                  key={idx} 
                  to={`/inventory?bodyType=${encodeURIComponent(style)}`} 
                  onClick={scrollToTop} 
                  className="block text-[#c82128] text-[14px] hover:underline"
                >
                  {style} For Sale
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 3: MAKES (DYNAMIC) */}
          <div>
            <h2 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider mb-6">MAKES</h2>
            <div className="space-y-3.5">
              {makes.length === 0 ? <span className="text-gray-400 text-sm">Loading...</span> : null}
              {makes.map((make, idx) => (
                <Link 
                  key={idx} 
                  to={`/inventory?make=${encodeURIComponent(make)}`} 
                  onClick={scrollToTop} 
                  className="block text-[#c82128] text-[14px] hover:underline"
                >
                  {make} For Sale
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 4: MAKE-MODELS (DYNAMIC) */}
          <div>
            <h2 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider mb-6">MAKE-MODELS</h2>
            <div className="space-y-3.5">
              {makeModels.length === 0 ? <span className="text-gray-400 text-sm">Loading...</span> : null}
              {makeModels.map((item, idx) => (
                <Link 
                  key={idx} 
                  to={`/inventory?make=${encodeURIComponent(item.make)}&model=${encodeURIComponent(item.model)}`} 
                  onClick={scrollToTop} 
                  className="block text-[#c82128] text-[14px] hover:underline leading-snug"
                >
                  {item.make} {item.model} For Sale
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SitemapPage;