import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TABS = [
  { key: 'makes', label: 'POPULAR MAKES' },
  { key: 'models', label: 'POPULAR MAKE MODELS' },
  { key: 'bodystyles', label: 'POPULAR BODYSTYLES' }
];

const PopularBrowseSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('makes');

  useEffect(() => {
    axios.get(`${API}/vehicles`)
      .then((r) => setVehicles(r.data))
      .catch(() => setVehicles([]));
  }, []);

  const grouped = useMemo(() => {
    const byMake = {};
    const byModel = {};
    const byBody = {};

    vehicles.forEach((v) => {
      if (v.make) {
        if (!byMake[v.make]) byMake[v.make] = { count: 0, minPrice: Infinity };
        byMake[v.make].count += 1;
        if (v.price && v.price < byMake[v.make].minPrice) byMake[v.make].minPrice = v.price;
      }
      const mk = `${v.make} ${v.model}`.trim();
      if (mk) {
        if (!byModel[mk]) byModel[mk] = { count: 0, minPrice: Infinity, make: v.make };
        byModel[mk].count += 1;
        if (v.price && v.price < byModel[mk].minPrice) byModel[mk].minPrice = v.price;
      }
      if (v.bodyType) {
        if (!byBody[v.bodyType]) byBody[v.bodyType] = { count: 0, minPrice: Infinity };
        byBody[v.bodyType].count += 1;
        if (v.price && v.price < byBody[v.bodyType].minPrice) byBody[v.bodyType].minPrice = v.price;
      }
    });

    return { byMake, byModel, byBody };
  }, [vehicles]);

  const renderList = () => {
    let entries = [];
    let linkFor = () => '#';

    if (activeTab === 'makes') {
      entries = Object.entries(grouped.byMake);
      linkFor = (key) => `/inventory?make=${encodeURIComponent(key)}`;
    } else if (activeTab === 'models') {
      entries = Object.entries(grouped.byModel);
      linkFor = (key) => `/inventory?make=${encodeURIComponent(grouped.byModel[key].make || '')}`;
    } else {
      entries = Object.entries(grouped.byBody);
      linkFor = (key) => `/inventory?bodyType=${encodeURIComponent(key)}`;
    }

    entries.sort((a, b) => b[1].count - a[1].count);

    if (!entries.length) {
      return <p className="text-gray-500 col-span-full text-sm">No inventory yet.</p>;
    }

    return entries.slice(0, 12).map(([key, info]) => (
      <Link
        key={key}
        to={linkFor(key)}
        className="group py-3 hover:text-red-600"
        data-testid={`popular-${activeTab}-${key}`}
      >
        <p className="font-bold text-gray-900 uppercase group-hover:text-red-600">{key}</p>
        <p className="text-xs text-gray-600">
          {info.count} listing{info.count > 1 ? 's' : ''}
          {Number.isFinite(info.minPrice) ? ` starting at $${Number(info.minPrice).toLocaleString()}` : ''}
        </p>
      </Link>
    ));
  };

  return (
    <section className="bg-gray-100" data-testid="popular-browse-section">
      {/* Tab Header */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative py-4 text-sm font-semibold tracking-wider transition-colors ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                data-testid={`popular-tab-${t.key}`}
              >
                {t.label}
                <span className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-16 ${active ? 'bg-red-600' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-gray-300/60">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
            {renderList()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularBrowseSection;
