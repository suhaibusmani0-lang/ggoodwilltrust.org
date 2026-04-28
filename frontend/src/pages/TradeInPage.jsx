import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  year: '',
  make: '',
  model: '',
  trim: '',
  bodyStyle: '',
  mileage: '',
  vin: '',
  exteriorColor: '',
  interiorColor: '',
  transmission: '',
  drivetrain: '',
  titleStatus: '',
  lienHolder: '',
  payoffAmount: '',
  overallCondition: '',
  accidentHistory: '',
  mechanicalIssues: [],
  modifications: '',
  askingPrice: '',
  comments: '',
  photoExteriorFront: null,
  photoExteriorRear: null,
  photoExteriorDriver: null,
  photoExteriorPassenger: null,
  photoInteriorFront: null,
  photoInteriorRear: null
};

const TradeInPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value) => {
    const current = formData.mechanicalIssues;
    if (current.includes(value)) {
      handleChange('mechanicalIssues', current.filter((i) => i !== value));
    } else {
      handleChange('mechanicalIssues', [...current, value]);
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 5MB per photo.', variant: 'destructive' });
      return;
    }
    handleChange(field, file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (Array.isArray(value)) {
          payload.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          payload.append(key, value);
        } else {
          payload.append(key, String(value));
        }
      });

      await axios.post(`${API}/trade-ins`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: 'Trade-In Request Submitted!',
        description: "We'll evaluate your vehicle and get back to you shortly."
      });
      setFormData(initialState);
    } catch (error) {
      console.error('Error submitting trade-in:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit trade-in request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const photoFields = [
    { key: 'photoExteriorFront', label: 'Exterior - Front' },
    { key: 'photoExteriorRear', label: 'Exterior - Rear' },
    { key: 'photoExteriorDriver', label: "Exterior - Driver's Side" },
    { key: 'photoExteriorPassenger', label: "Exterior - Passenger's Side" },
    { key: 'photoInteriorFront', label: 'Interior - Front Seats / Dashboard' },
    { key: 'photoInteriorRear', label: 'Interior - Rear Seats / Odometer' }
  ];

  const mechanicalChecklist = [
    'Engine Issues',
    'Transmission Issues',
    'Brake Problems',
    'Tire Wear / Replacement Needed',
    'A/C or Heating Issues',
    'Electrical Problems',
    'Suspension Issues',
    'Exhaust Problems',
    'Body / Paint Damage',
    'Interior Damage',
    'Warning Lights On',
    'No Known Issues'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">VALUE MY TRADE</h1>
          <p className="text-center text-gray-600 mb-12">
            We offer top-dollar for trade-ins and direct purchases. Tell us about your vehicle and we'll have an offer ready shortly.
          </p>

          <div className="bg-white p-8">
            <form onSubmit={handleSubmit} data-testid="trade-in-form">
              {/* Contact Info */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">First Name *</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} data-testid="trade-firstname" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Last Name *</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} data-testid="trade-lastname" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => handleChange('email', e.target.value)} data-testid="trade-email" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} data-testid="trade-phone" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Year *</label>
                    <input type="number" required value={formData.year} onChange={(e) => handleChange('year', e.target.value)} data-testid="trade-year" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Make *</label>
                    <input type="text" required value={formData.make} onChange={(e) => handleChange('make', e.target.value)} data-testid="trade-make" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Model *</label>
                    <input type="text" required value={formData.model} onChange={(e) => handleChange('model', e.target.value)} data-testid="trade-model" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Trim</label>
                    <input type="text" value={formData.trim} onChange={(e) => handleChange('trim', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Body Style</label>
                    <select value={formData.bodyStyle} onChange={(e) => handleChange('bodyStyle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select One</option>
                      <option>Pickup Truck</option>
                      <option>SUV</option>
                      <option>Sedan</option>
                      <option>Wagon</option>
                      <option>Coupe</option>
                      <option>Hatchback</option>
                      <option>Convertible</option>
                      <option>Minivan</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Mileage *</label>
                    <input type="number" required value={formData.mileage} onChange={(e) => handleChange('mileage', e.target.value)} data-testid="trade-mileage" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">VIN</label>
                  <input type="text" value={formData.vin} onChange={(e) => handleChange('vin', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Exterior Color</label>
                    <input type="text" value={formData.exteriorColor} onChange={(e) => handleChange('exteriorColor', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Interior Color</label>
                    <input type="text" value={formData.interiorColor} onChange={(e) => handleChange('interiorColor', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Transmission</label>
                    <select value={formData.transmission} onChange={(e) => handleChange('transmission', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select One</option>
                      <option>Automatic</option>
                      <option>Manual</option>
                      <option>CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Drivetrain</label>
                    <select value={formData.drivetrain} onChange={(e) => handleChange('drivetrain', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select One</option>
                      <option>FWD</option>
                      <option>RWD</option>
                      <option>AWD</option>
                      <option>4WD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Title & Lien Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Title Info</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">Do you have the title?</label>
                  <select value={formData.titleStatus} onChange={(e) => handleChange('titleStatus', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                    <option value="">Select One</option>
                    <option value="Yes - Clean Title">Yes - Clean Title</option>
                    <option value="Yes - Lien on Title">Yes - Lien on Title</option>
                    <option value="No - Still Financing">No - Still Financing</option>
                    <option value="Salvage / Rebuilt">Salvage / Rebuilt</option>
                  </select>
                </div>

                {(formData.titleStatus === 'Yes - Lien on Title' || formData.titleStatus === 'No - Still Financing') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Lien Holder / Lender</label>
                      <input type="text" value={formData.lienHolder} onChange={(e) => handleChange('lienHolder', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Estimated Payoff Amount ($)</label>
                      <input type="number" value={formData.payoffAmount} onChange={(e) => handleChange('payoffAmount', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Condition */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Condition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Overall Condition</label>
                    <select value={formData.overallCondition} onChange={(e) => handleChange('overallCondition', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select One</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Accident History</label>
                    <select value={formData.accidentHistory} onChange={(e) => handleChange('accidentHistory', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select One</option>
                      <option>No Accidents</option>
                      <option>Minor Accident (Cosmetic)</option>
                      <option>Major Accident (Structural)</option>
                      <option>Unsure</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-3">Mechanical Issues <span className="text-gray-500">(Check all that apply)</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mechanicalChecklist.map((item) => (
                      <label key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={formData.mechanicalIssues.includes(item)} onChange={() => handleCheckboxChange(item)} className="w-4 h-4 mt-1" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Modifications / Aftermarket Parts</label>
                  <textarea rows={3} value={formData.modifications} onChange={(e) => handleChange('modifications', e.target.value)} placeholder="List any modifications (wheels, exhaust, tuning, etc.)" className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"></textarea>
                </div>
              </div>

              {/* Photo Uploads */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Photos</h3>
                <p className="text-sm text-gray-600 mb-6">Please upload clear photos of your vehicle. Max 5MB per photo. (JPG / PNG)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {photoFields.map((p) => (
                    <div key={p.key}>
                      <label className="block text-sm text-gray-700 mb-2">{p.label}</label>
                      <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, p.key)} className="hidden" id={p.key} data-testid={`upload-${p.key}`} />
                        <label htmlFor={p.key} className="cursor-pointer">
                          <div className="text-gray-600">
                            <p className="font-medium">Upload</p>
                            <p className="text-sm">or Drag and Drop a File</p>
                          </div>
                        </label>
                        {formData[p.key] && (
                          <p className="mt-2 text-sm text-green-600 break-all">Uploaded: {formData[p.key].name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asking price + comments */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Info</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">Asking Price ($) <span className="text-gray-500">Optional</span></label>
                  <input type="number" value={formData.askingPrice} onChange={(e) => handleChange('askingPrice', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Comments</label>
                  <textarea rows={4} value={formData.comments} onChange={(e) => handleChange('comments', e.target.value)} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"></textarea>
                </div>
              </div>

              <button type="submit" disabled={submitting} data-testid="trade-submit" className="w-full bg-gray-900 text-white py-3 px-8 font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TradeInPage;
