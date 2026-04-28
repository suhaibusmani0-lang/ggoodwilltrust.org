import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VEHICLE_MAKES = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Porsche','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other'];

const BODY_STYLES = ['Sedan','SUV','Coupe','Pickup Truck','Minivan','Wagon','Hatchback','Convertible'];
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD'];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Flex Fuel'];
const SEATS = ['2', '4', '5', '6', '7', '8', '9+'];
const SEATING_ROWS = ['1', '2', '3'];
const DOORS = ['2', '3', '4', '5'];
const MPG_OPTIONS = ['20+', '25+', '30+', '35+', '40+'];
const MILEAGE_CAPS = ['25,000', '50,000', '75,000', '100,000', '150,000'];
const PRICE_TIERS = ['$5,000','$10,000','$15,000','$20,000','$25,000','$30,000','$40,000','$50,000','$75,000','$100,000+'];
const PAYMENT_TIERS = ['$200','$300','$400','$500','$600','$750','$1,000+'];
const PURCHASE_TIMELINES = ['Within 30 Days', '1-3 Months', '3-6 Months', '6+ Months', 'Just Browsing'];

const INTERIOR_FEATURES = ['Adjustable Pedals','Airconditioned Seats','Auto Climate Control','Bucket Seats','Cruise Control','Extra Cab','Heated Seats','Heated Steering Wheel','Keyless Entry','Leather Seats','Memory Seats','Power Doors','Power Seats','Push-button Start','Quad Seats','Rear Air','Rear Heated Seats','Remote Start','Third Row Seat','Tilt Wheel','Tinted Windows'];

const EXTERIOR_FEATURES = ['Bed Cover','Bedliner','Convertible Top','Fog Lights','Power Tailgate','Roof Rack','Running Boards','Rear Spoiler','Sunroof/Moonroof','Tool Box','Tow Hitch'];

const INFOTAINMENT_FEATURES = ['AM/FM','Bluetooth','CD','CD Changer','Satellite/XM Radio','Navigation','Apple CarPlay','Android Auto','Alexa Auto','TV/DVD','TV/VCR','USB Integration','Voice Activation','Premium Audio'];

const SAFETY_FEATURES = ['Adaptive Cruise Control','Alarm System','Anti-Lock Brakes','Back Up Camera','Back Up Sonar','Blindspot Monitoring','Collision Avoidance','Daytime Running Lights','Driver Airbag','HID Headlights','Heads-Up Display','Parking Sensors','Passenger Airbag','Night View','Side Airbags','Rear Defroster','Traction Control'];

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zip: '',
  condition: '',
  bodyStyle: '',
  make: '',
  model: '',
  trim: '',
  transmission: '',
  minMpg: '',
  maxMileage: '',
  yearMin: '',
  yearMax: '',
  exteriorColor: '',
  interiorColor: '',
  minPrice: '',
  maxPrice: '',
  maxMonthlyPayment: '',
  engine: '',
  drivetrain: '',
  fuelType: '',
  seats: '',
  seatingRows: '',
  doors: '',
  interiorFeatures: [],
  exteriorFeatures: [],
  infotainmentFeatures: [],
  safetyFeatures: [],
  comments: '',
  purchaseTimeline: ''
};

const CheckboxGroup = ({ title, options, selected, onChange, testId }) => (
  <div className="mb-6">
    <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
    <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onChange(opt)}
            className="w-4 h-4"
            data-testid={`${testId}-${opt.replace(/[^a-z0-9]/gi, '')}`}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CarFinderPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleList = (listField, value) => {
    const list = formData[listField];
    setField(listField, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/car-finder-requests`, formData);
      toast({ title: 'Request Received!', description: "We'll find your perfect fit and reach out shortly." });
      setFormData(initialState);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">SHOPPING REQUEST</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">We're ready to take the work out of car shopping! Simply tell us what you're looking for and we'll find your perfect fit.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8">
          <form onSubmit={handleSubmit} data-testid="car-finder-form">

            {/* Tell Us About You */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tell Us About You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setField('firstName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="cf-firstname" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setField('lastName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="cf-lastname" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email *</label>
                  <input required type="email" value={formData.email} onChange={(e) => setField('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="cf-email" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                  <input required type="tel" placeholder="(___) ___-____" value={formData.phone} onChange={(e) => setField('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="cf-phone" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Zip *</label>
                <input required type="text" value={formData.zip} onChange={(e) => setField('zip', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="cf-zip" />
              </div>
            </div>

            {/* Tell us what you're looking for */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tell us what you're looking for</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Condition *</label>
                  <select required value={formData.condition} onChange={(e) => setField('condition', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Body Style</label>
                  <select value={formData.bodyStyle} onChange={(e) => setField('bodyStyle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {BODY_STYLES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Make</label>
                  <select value={formData.make} onChange={(e) => setField('make', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {VEHICLE_MAKES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Model</label>
                  <input type="text" value={formData.model} onChange={(e) => setField('model', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Trim / Package</label>
                  <input type="text" value={formData.trim} onChange={(e) => setField('trim', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Transmission</label>
                  <select value={formData.transmission} onChange={(e) => setField('transmission', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {TRANSMISSIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Min Highway MPG</label>
                  <select value={formData.minMpg} onChange={(e) => setField('minMpg', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {MPG_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Mileage</label>
                  <select value={formData.maxMileage} onChange={(e) => setField('maxMileage', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {MILEAGE_CAPS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Year Min</label>
                  <input type="number" value={formData.yearMin} onChange={(e) => setField('yearMin', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Year Max</label>
                  <input type="number" value={formData.yearMax} onChange={(e) => setField('yearMax', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Preferred Exterior Color</label>
                  <input type="text" value={formData.exteriorColor} onChange={(e) => setField('exteriorColor', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Preferred Interior Color</label>
                  <input type="text" value={formData.interiorColor} onChange={(e) => setField('interiorColor', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Min Price</label>
                  <select value={formData.minPrice} onChange={(e) => setField('minPrice', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {PRICE_TIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Price</label>
                  <select value={formData.maxPrice} onChange={(e) => setField('maxPrice', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {PRICE_TIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Monthly Payment</label>
                  <select value={formData.maxMonthlyPayment} onChange={(e) => setField('maxMonthlyPayment', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {PAYMENT_TIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Engine</label>
                  <input type="text" value={formData.engine} onChange={(e) => setField('engine', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Drivetrain</label>
                  <select value={formData.drivetrain} onChange={(e) => setField('drivetrain', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {DRIVETRAINS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Fuel Type</label>
                  <select value={formData.fuelType} onChange={(e) => setField('fuelType', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {FUEL_TYPES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Seats</label>
                  <select value={formData.seats} onChange={(e) => setField('seats', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {SEATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Seating Rows</label>
                  <select value={formData.seatingRows} onChange={(e) => setField('seatingRows', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {SEATING_ROWS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Doors</label>
                  <select value={formData.doors} onChange={(e) => setField('doors', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {DOORS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Which of the following features are you looking for?</h3>
              <CheckboxGroup title="Interior Features" options={INTERIOR_FEATURES} selected={formData.interiorFeatures} onChange={(v) => toggleList('interiorFeatures', v)} testId="cf-int" />
              <CheckboxGroup title="Exterior Features" options={EXTERIOR_FEATURES} selected={formData.exteriorFeatures} onChange={(v) => toggleList('exteriorFeatures', v)} testId="cf-ext" />
              <CheckboxGroup title="Infotainment Features" options={INFOTAINMENT_FEATURES} selected={formData.infotainmentFeatures} onChange={(v) => toggleList('infotainmentFeatures', v)} testId="cf-info" />
              <CheckboxGroup title="Safety Features" options={SAFETY_FEATURES} selected={formData.safetyFeatures} onChange={(v) => toggleList('safetyFeatures', v)} testId="cf-safe" />
            </div>

            {/* Comments + Timeline */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Comments</label>
                <textarea rows={4} value={formData.comments} onChange={(e) => setField('comments', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">When do you plan to purchase this vehicle?</label>
                <select value={formData.purchaseTimeline} onChange={(e) => setField('purchaseTimeline', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                  <option value="">Select One</option>
                  {PURCHASE_TIMELINES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white py-3 px-8 font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50" data-testid="cf-submit">
              {submitting ? 'Submitting...' : 'Send'}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By clicking Send, I consent to be contacted by Xen Motors Inc. at any email or phone number I provide.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarFinderPage;
