import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const VEHICLE_MAKES = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Porsche','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other'];

const WARRANTIES = [
  'Accessory Warranties',
  'Bumper-to-bumper',
  'Corrosion',
  'Emissions Control',
  'Hybrid or EV Component Powertrain',
  'Restraint System',
  'Service Package'
];

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  driversLicense: '',
  dlFile: null,

  purchaseVin: '',
  purchaseYear: '',
  purchaseMake: '',
  purchaseModel: '',
  purchaseTrim: '',
  vehicleDescription: '',

  purchaseMethod: '',
  downPayment: '',
  hasTrade: '',

  tradeVin: '',
  tradeYear: '',
  tradeMake: '',
  tradeModel: '',
  tradeBodyStyle: '',
  tradeTrim: '',

  deliveryMethod: '',
  preferredDate: '',
  preferredTime: '',
  deliveryLocation: '',
  deliveryAddress: '',
  deliveryAddressLine2: '',
  deliveryCity: '',
  deliveryState: '',
  deliveryZip: '',

  warranties: [],
  comments: ''
};

const StartPurchasePage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleWarranty = (w) => {
    setField('warranties', formData.warranties.includes(w)
      ? formData.warranties.filter((x) => x !== w)
      : [...formData.warranties, w]
    );
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 5MB.', variant: 'destructive' });
      return;
    }
    setField('dlFile', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (Array.isArray(v)) payload.append(k, JSON.stringify(v));
        else if (v instanceof File) payload.append(k, v);
        else payload.append(k, String(v));
      });
      await axios.post(`${API}/purchase-requests`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast({ title: 'Purchase Request Submitted!', description: "We'll contact you to finalize your purchase." });
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">START YOUR VEHICLE PURCHASE</h1>
          <p className="text-gray-300 text-lg">Save time at the dealership and start your purchase online.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8">
          <form onSubmit={handleSubmit} data-testid="start-purchase-form">

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setField('firstName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="sp-firstname" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setField('lastName', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="sp-lastname" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email *</label>
                  <input required type="email" value={formData.email} onChange={(e) => setField('email', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="sp-email" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                  <input required type="tel" placeholder="(___) ___-____" value={formData.phone} onChange={(e) => setField('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" data-testid="sp-phone" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Address *</label>
                <input required type="text" value={formData.address} onChange={(e) => setField('address', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Address Line 2</label>
                <input type="text" value={formData.addressLine2} onChange={(e) => setField('addressLine2', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">City *</label>
                  <input required type="text" value={formData.city} onChange={(e) => setField('city', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">State *</label>
                  <select required value={formData.state} onChange={(e) => setField('state', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Zip *</label>
                  <input required type="text" value={formData.zip} onChange={(e) => setField('zip', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Driver's License</label>
                <input type="text" value={formData.driversLicense} onChange={(e) => setField('driversLicense', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  <input type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" id="dlFile" data-testid="sp-dl-upload" />
                  <label htmlFor="dlFile" className="cursor-pointer">
                    <button type="button" onClick={() => document.getElementById('dlFile').click()} className="bg-gray-900 text-white px-6 py-2 mb-2 text-sm">Upload</button>
                    <p className="text-sm text-gray-600">or Drag and Drop a File</p>
                  </label>
                  {formData.dlFile && <p className="mt-2 text-sm text-green-600 break-all">Uploaded: {formData.dlFile.name}</p>}
                </div>
              </div>
            </div>

            {/* Vehicle You are Purchasing */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle You are Purchasing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">VIN</label>
                  <input type="text" value={formData.purchaseVin} onChange={(e) => setField('purchaseVin', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Year</label>
                  <input type="number" value={formData.purchaseYear} onChange={(e) => setField('purchaseYear', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Make</label>
                  <select value={formData.purchaseMake} onChange={(e) => setField('purchaseMake', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {VEHICLE_MAKES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Model</label>
                  <input type="text" value={formData.purchaseModel} onChange={(e) => setField('purchaseModel', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Trim</label>
                <input type="text" value={formData.purchaseTrim} onChange={(e) => setField('purchaseTrim', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Please describe your vehicle and the condition of your vehicle.</label>
                <textarea rows={4} value={formData.vehicleDescription} onChange={(e) => setField('vehicleDescription', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"></textarea>
              </div>
            </div>

            {/* Financing */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">How do you plan to purchase?</label>
                  <select value={formData.purchaseMethod} onChange={(e) => setField('purchaseMethod', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    <option>Cash</option>
                    <option>Finance with Dealer</option>
                    <option>Finance with Outside Lender</option>
                    <option>Lease</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Est. Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input type="number" value={formData.downPayment} onChange={(e) => setField('downPayment', e.target.value)} className="w-full pl-8 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Do you have a trade?</label>
                <select value={formData.hasTrade} onChange={(e) => setField('hasTrade', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                  <option value="">Select One</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            {/* Trade-in Info (conditional) */}
            {formData.hasTrade === 'Yes' && (
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trade-in Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">VIN</label>
                    <input type="text" value={formData.tradeVin} onChange={(e) => setField('tradeVin', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Year</label>
                    <input type="number" value={formData.tradeYear} onChange={(e) => setField('tradeYear', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Make</label>
                    <select value={formData.tradeMake} onChange={(e) => setField('tradeMake', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                      <option value="">Select One</option>
                      {VEHICLE_MAKES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Model</label>
                    <input type="text" value={formData.tradeModel} onChange={(e) => setField('tradeModel', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Body Style</label>
                    <select value={formData.tradeBodyStyle} onChange={(e) => setField('tradeBodyStyle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                      <option value="">Select One</option>
                      <option>Sedan</option><option>SUV</option><option>Coupe</option><option>Pickup Truck</option><option>Minivan</option><option>Wagon</option><option>Hatchback</option><option>Convertible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Trim</label>
                    <input type="text" value={formData.tradeTrim} onChange={(e) => setField('tradeTrim', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Options */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">How would you like to get your vehicle?</label>
                  <select value={formData.deliveryMethod} onChange={(e) => setField('deliveryMethod', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    <option>Pick Up at Dealership</option>
                    <option>Home Delivery</option>
                    <option>Off-site Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Preferred Date</label>
                  <input type="date" value={formData.preferredDate} onChange={(e) => setField('preferredDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Preferred Time</label>
                  <select value={formData.preferredTime} onChange={(e) => setField('preferredTime', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    <option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option><option>5:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Delivery Location (if applicable)</label>
                  <input type="text" value={formData.deliveryLocation} onChange={(e) => setField('deliveryLocation', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.deliveryAddress} onChange={(e) => setField('deliveryAddress', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Address Line 2</label>
                <input type="text" value={formData.deliveryAddressLine2} onChange={(e) => setField('deliveryAddressLine2', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">City</label>
                  <input type="text" value={formData.deliveryCity} onChange={(e) => setField('deliveryCity', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">State</label>
                  <select value={formData.deliveryState} onChange={(e) => setField('deliveryState', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500">
                    <option value="">Select One</option>
                    {US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Zip</label>
                  <input type="text" value={formData.deliveryZip} onChange={(e) => setField('deliveryZip', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            {/* Protections and Warranties */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protections and Warranties</h3>
              <p className="text-sm text-gray-700 mb-2 font-medium">Which of the following Warranties and Protection Programs are you interested in?</p>
              <p className="text-xs text-gray-500 mb-4">Select All that Apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WARRANTIES.map((w) => (
                  <label key={w} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={formData.warranties.includes(w)} onChange={() => toggleWarranty(w)} className="w-4 h-4" />
                    <span>{w}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>
              <textarea rows={4} value={formData.comments} onChange={(e) => setField('comments', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"></textarea>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white py-3 px-8 font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50" data-testid="sp-submit">
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

export default StartPurchasePage;
