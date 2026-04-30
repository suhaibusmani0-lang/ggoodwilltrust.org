import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone, Fuel, Star, ChevronDown, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800';

const StarRating = ({ value = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const BUSINESS_HOURS = [
  { label: 'Sunday', hours: 'Closed' },
  { label: 'Monday', hours: '8:00 AM - 8:00 PM' },
  { label: 'Tuesday', hours: '8:00 AM - 8:00 PM' },
  { label: 'Wednesday', hours: '8:00 AM - 8:00 PM' },
  { label: 'Thursday', hours: '8:00 AM - 8:00 PM' },
  { label: 'Friday', hours: '8:00 AM - 8:00 PM' },
  { label: 'Saturday', hours: '9:00 AM - 6:00 PM' }
];

// ============== Photo Gallery (With Zoom & Navigation) ==============
const PhotoGallery = ({ vehicle }) => {
  const photos = useMemo(() => {
    const list = (vehicle.images && vehicle.images.length ? vehicle.images : [vehicle.image]).filter(Boolean);
    return list.length ? list : [FALLBACK_IMAGE];
  }, [vehicle]);

  const [active, setActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = (e) => {
    e?.stopPropagation();
    setActive((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActive((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="relative">
      {/* Main Feature Image */}
      <div 
        className="aspect-[4/3] bg-gray-100 overflow-hidden mb-2 cursor-zoom-in group relative"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={photos[active]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/80 px-4 py-2 rounded-full text-xs font-bold shadow-lg">View Fullscreen</span>
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-1.5">
          {photos.slice(0, 10).map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border-2 transition-all ${i === active ? 'border-red-600 scale-95' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={p} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal (Lightbox) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[2001]">
            <X size={40} />
          </button>

          <button 
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[2001]"
            onClick={handlePrev}
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={photos[active]}
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              alt="Fullscreen view"
              onClick={(e) => e.stopPropagation()} 
            />
            <p className="text-white mt-4 font-bold tracking-widest">
              {active + 1} / {photos.length}
            </p>
          </div>

          <button 
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[2001]"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

// ============== Sidebar Message Form ==============
const SidebarMessage = ({ vehicle }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    hasTradeIn: false,
    message: `Could you provide more information about this ${vehicle.year} ${vehicle.make} ${vehicle.model}?`
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        message: form.message + (form.hasTradeIn ? ' [Has trade-in]' : ''),
        vehicleId: vehicle.id
      });
      toast({ title: 'Message Sent!', description: "We'll be in touch shortly." });
      setForm({ ...form, firstName: '', lastName: '', email: '', phone: '', hasTradeIn: false });
    } catch {
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-4 mb-4" data-testid="message-us-form">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input required type="text" placeholder="First Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500" />
        <input required type="text" placeholder="Last Name *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500" />
      </div>
      <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 mb-2" />
      <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 mb-2" />
      <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
        <input type="checkbox" checked={form.hasTradeIn} onChange={(e) => setForm({ ...form, hasTradeIn: e.target.checked })} className="w-4 h-4" />
        Do you have a trade-in?
      </label>
      <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gray-500 mb-3"></textarea>
      <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50" data-testid="send-message-btn">
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
};

// ============== Sidebar Dealership Info ==============
const SidebarDealership = () => {
  const [hoursOpen, setHoursOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 p-4 mb-4">
      <h3 className="font-bold text-gray-900 mb-3">Dealership Info</h3>
      <p className="text-sm font-semibold text-gray-900">Xen Motors Inc.</p>
      <p className="text-xs text-gray-600">45 W John Street Unit B</p>
      <p className="text-xs text-gray-600 mb-3">Hicksville, NY 11801</p>

      <div className="aspect-[16/9] bg-gray-100 mb-3 overflow-hidden">
        <iframe
          title="Dealership location"
          src="https://maps.google.com/maps?q=45+W+John+Street+Hicksville+NY+11801&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>

      <button onClick={() => setHoursOpen(!hoursOpen)} className="w-full inline-flex items-center justify-between text-xs text-gray-700 mb-2 py-1.5 px-2 border border-gray-200">
        <span className="inline-flex items-center gap-1 text-green-600 font-medium"><Clock className="w-3.5 h-3.5" /> Open Now</span>
        <span>8:00 am - 8:00 pm</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${hoursOpen ? 'rotate-180' : ''}`} />
      </button>
      {hoursOpen && (
        <div className="text-xs text-gray-700 mb-3 space-y-1 border border-gray-200 p-2">
          {BUSINESS_HOURS.map((h) => (
            <div key={h.label} className="flex justify-between"><span>{h.label}</span><span>{h.hours}</span></div>
          ))}
        </div>
      )}

      <a href="tel:5167885722" className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-800 mb-2"><Phone className="w-4 h-4" /> (516) 788-5722</a>
      <Link to="/schedule-visit" className="inline-flex items-center justify-center gap-2 w-full bg-white border border-gray-900 text-gray-900 py-2 text-sm font-medium hover:bg-gray-100">Schedule Test Drive</Link>
    </div>
  );
};

// ============== Sidebar Loan Calculator (FIXED) ==============
const SidebarLoanCalc = ({ price }) => {
  const [tradeInValue, setTradeInValue] = useState(0);
  const [interestRate, setInterestRate] = useState(5.85); 
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.1));
  const [creditScore, setCreditScore] = useState('Good');
  const [termMonths, setTermMonths] = useState(60);

  const creditRates = {
    'Rebuilding': 11,
    'Fair': 6.85,
    'Good': 5.85,
    'Excellent': 4
  };

  useEffect(() => { setDownPayment(Math.round(price * 0.1)); }, [price]);

  const { monthly, total } = useMemo(() => {
    const p = Math.max(0, (Number(price) || 0) - Number(tradeInValue) - Number(downPayment));
    const r = (Number(interestRate) || 0) / 100 / 12;
    const n = Number(termMonths) || 1;
    const m = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
    return { monthly: Math.max(0, m), total: p };
  }, [price, tradeInValue, interestRate, downPayment, termMonths]);

  const handleScoreClick = (label) => {
    setCreditScore(label);
    setInterestRate(creditRates[label]);
  };

  return (
    <div className="bg-white border border-gray-200 p-4" data-testid="loan-calculator">
      <h3 className="font-bold text-gray-900 mb-3">Estimate Loan &amp; Payment Calculator</h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-[11px] text-gray-600 mb-1">Vehicle Price</label>
          <input type="number" value={price} readOnly className="w-full px-2 py-1.5 border border-gray-300 text-sm bg-gray-50" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-600 mb-1">Trade-In Value</label>
          <input type="number" value={tradeInValue} onChange={(e) => setTradeInValue(Number(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-gray-300 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-600 mb-1">Interest Rate (APR %)</label>
          <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-gray-300 text-sm" />
        </div>
        <div>
          <label className="block text-[11px] text-gray-600 mb-1">Down Payment</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-gray-300 text-sm" />
        </div>
      </div>

      <div className="flex justify-around items-center py-3 border-y border-gray-200 mb-3 text-center">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Est. Monthly</p>
          <p className="text-xl font-bold text-gray-900">${monthly.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Total Loan</p>
          <p className="text-xl font-bold text-gray-900">${total.toLocaleString()}</p>
        </div>
      </div>

      <label className="block text-[11px] text-gray-600 mb-1">Estimated Credit Score</label>
      <div className="grid grid-cols-4 gap-0.5 border border-gray-300 mb-3">
        {Object.keys(creditRates).map((label) => (
          <button 
            key={label} 
            type="button" 
            onClick={() => handleScoreClick(label)} 
            className={`py-1.5 text-[10px] ${creditScore === label ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-[11px] text-gray-600 mb-1">Term Length (months)</label>
      <div className="grid grid-cols-5 gap-0.5 border border-gray-300 mb-4">
        {[36, 48, 60, 72, 84].map((m) => (
          <button key={m} type="button" onClick={() => setTermMonths(m)} className={`py-1.5 text-[10px] ${termMonths === m ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{m}</button>
        ))}
      </div>

      <Link to="/finance" className="block w-full text-center bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800" data-testid="apply-financing-btn">Apply for Financing</Link>
      <p className="text-[10px] text-gray-500 mt-2 leading-tight">Disclaimer: This interactive calculator is for illustrative purposes only.</p>
    </div>
  );
};

// ============== Helpers ==============
const SpecRow = ({ label, value }) => {
  if (value === '' || value === null || value === undefined) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
};

// ============== Main Page ==============
const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/vehicles/${id}`);
        setVehicle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center text-gray-600">Loading vehicle…</div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
          <Link to="/inventory" className="text-red-600 hover:underline">Back to Inventory</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const desc = vehicle.description || '';
  const descPreview = desc.slice(0, 320);
  const features = vehicle.features || [];
  const featurePreview = features.slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-3">
        <nav className="text-sm text-gray-600" data-testid="breadcrumb">
          <Link to="/" className="text-red-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/inventory" className="text-red-600 hover:underline">Cars For Sale</Link>
          <span className="mx-2">/</span>
          <Link to={`/inventory?make=${vehicle.make}`} className="text-red-600 hover:underline">{vehicle.make}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{vehicle.model}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
          <div>
            <PhotoGallery vehicle={vehicle} />
            <div className="bg-white border border-gray-200 p-4 mt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase leading-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              {(vehicle.trim || vehicle.bodyType) && <p className="text-sm text-gray-600 uppercase">{vehicle.trim} {vehicle.bodyType}</p>}
              <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">${Number(vehicle.price || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="text-base font-semibold text-gray-900">{Number(vehicle.mileage || 0).toLocaleString()} miles</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-4 h-fit">
            <SidebarMessage vehicle={vehicle} />
            <SidebarDealership />
            <SidebarLoanCalc price={vehicle.price || 0} />
          </aside>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Vehicle Info</h2>
                <SpecRow label="Condition" value={vehicle.condition} />
                <SpecRow label="Engine" value={vehicle.engine} />
                <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
                <SpecRow label="Trim" value={vehicle.trim} />
                <SpecRow label="Max Seating" value={vehicle.maxSeating} />
                <SpecRow label="Fuel" value={vehicle.fuelType} />
                <SpecRow label="NHTSA Rating" value={<StarRating value={5} />} />
                <SpecRow label="EPA MPG Rating" value={(vehicle.mpgCity && vehicle.mpgHwy) ? `${vehicle.mpgCity} City / ${vehicle.mpgHwy} Hwy` : ''} />
                <SpecRow label="Exterior Color" value={vehicle.exteriorColor} />
                <SpecRow label="Interior Color" value={vehicle.interiorColor} />
                <SpecRow label="Stock #" value={vehicle.stockNumber} />
                <SpecRow label="VIN" value={vehicle.vin} />
                <SpecRow label="Seating Rows" value={vehicle.seatingRows} />
                <SpecRow label="Vehicle Type" value={vehicle.vehicleType || vehicle.bodyType} />
                <SpecRow label="Size" value={vehicle.size} />
              </div>

              <div>
                <div className="bg-white border border-gray-200 p-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Description</h2>
                  {desc ? (
                    <>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {showMoreDesc ? desc : descPreview}
                        {!showMoreDesc && desc.length > 320 ? '…' : ''}
                      </p>
                      {desc.length > 320 && (
                        <button onClick={() => setShowMoreDesc(!showMoreDesc)} className="text-red-600 hover:underline text-sm mt-2">{showMoreDesc ? 'Show Less' : 'Show More'}</button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No description available.</p>
                  )}
                </div>

                {features.length > 0 && (
                  <div className="bg-white border border-gray-200 p-4">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Features</h2>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {(showMoreFeatures ? features : featurePreview).map((f, i) => (
                        <li key={i} className="flex gap-2"><span className="text-gray-400">•</span>{f}</li>
                      ))}
                    </ul>
                    {features.length > 12 && (
                      <button onClick={() => setShowMoreFeatures(!showMoreFeatures)} className="text-red-600 hover:underline text-sm mt-3">{showMoreFeatures ? 'Show Less' : 'Show More'}</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(vehicle.mpgCity || vehicle.mpgHwy) && (
              <div className="bg-white border border-gray-200 p-4 mb-6 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase">City</p>
                    <p className="text-xl font-bold text-gray-900">{vehicle.mpgCity || '—'}</p>
                  </div>
                  <Fuel className="w-7 h-7 text-gray-400" />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase">Hwy</p>
                    <p className="text-xl font-bold text-gray-900">{vehicle.mpgHwy || '—'}</p>
                  </div>
                  <p className="text-sm text-gray-600">Fuel Economy</p>
                </div>
                <Link to="/finance" className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-300">
                  Financing Available — <span className="text-red-600 font-bold">Apply Now!</span>
                </Link>
              </div>
            )}

            {vehicle.engine && (
              <div className="bg-white border border-gray-200 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Engine</h2>
                <p className="text-sm text-gray-700">{vehicle.engine}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Standard Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-700">
                {vehicle.transmission && <div>• Transmission: {vehicle.transmission}</div>}
                {vehicle.drivetrain && <div>• Drivetrain: {vehicle.drivetrain}</div>}
                {vehicle.fuelType && <div>• Fuel Type: {vehicle.fuelType}</div>}
                {vehicle.maxSeating && <div>• Max Seating: {vehicle.maxSeating}</div>}
                {vehicle.seatingRows && <div>• Seating Rows: {vehicle.seatingRows}</div>}
                {vehicle.bodyType && <div>• Body Style: {vehicle.bodyType}</div>}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">NHTSA Crash Test Ratings</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  ['Frontal Driver', 5], ['Frontal Overall', 5], ['Frontal Passenger', 5],
                  ['Combined Front', 4], ['Combined Rear', 5], ['Side Overall', 5],
                  ['Rollover', 4]
                ].map(([label, rating]) => (
                  <div key={label}>
                    <p className="text-gray-600 mb-1 text-xs">{label}</p>
                    <StarRating value={rating} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Awards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">Automotive Science Group</p>
                  <p className="text-xs text-gray-600">Automotive Performance, Execution and Layout (APEAL) Award.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Edmunds</p>
                  <p className="text-xs text-gray-600">Edmunds Best Retained Value Award.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Insurance Institute for Highway Safety</p>
                  <p className="text-xs text-gray-600">IIHS Top Safety Pick Award.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Safety Equipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-700">
                {['Anti-lock Brakes', 'Airbags Side Curtain', 'Airbags Side Impact', 'Daytime Running Lights', 'Electronic Stability Control', 'Brake Assist', 'Tire Pressure Monitoring System', 'Electronic Traction Control'].map((s) => (
                  <div key={s}>• {s}</div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">EPA Green Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-700">
                <div>• Air Pollution Score: 5</div>
                <div>• Greenhouse Gas Score: 6</div>
                <div>• Greenhouse Gas Emissions: A</div>
                <div>• Hydrogen Vehicle: No</div>
                <div>• Greenhouse CO2: 372 g/mile</div>
                <div>• Fuel Type: {vehicle.fuelType || 'Gasoline'}</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetailPage;