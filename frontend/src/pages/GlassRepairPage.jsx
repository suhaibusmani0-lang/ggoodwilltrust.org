import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GlassRepairPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    year: '',
    make: '',
    model: '',
    trim: '',
    bodyStyle: '',
    damageAreas: [],
    damageType: '',
    damagePhoto: null,
    comments: '',
    usingInsurance: '',
    insuranceCard: null,
    serviceLocation: '',
    preferredDate: '',
    preferredTime: '',
    alternativeDate: '',
    alternativeTime: '',
    serviceAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleCheckboxChange = (value) => {
    const current = formData.damageAreas;
    if (current.includes(value)) {
      setFormData({...formData, damageAreas: current.filter(item => item !== value)});
    } else {
      setFormData({...formData, damageAreas: [...current, value]});
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    setFormData({...formData, [field]: file});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      await axios.post(`${API}/glass-repairs`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: "Request Submitted!",
        description: "We'll contact you about your glass repair needs.",
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        bodyStyle: '',
        damageAreas: [],
        damageType: '',
        damagePhoto: null,
        comments: '',
        usingInsurance: '',
        insuranceCard: null,
        serviceLocation: '',
        preferredDate: '',
        preferredTime: '',
        alternativeDate: '',
        alternativeTime: '',
        serviceAddress: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: ''
      });
    } catch (error) {
      console.error('Error submitting glass repair:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">GLASS INSTALLATION AND REPAIR</h1>
          <p className="text-center text-gray-600 mb-12">Do you need an estimate or appointment for a cracked windshield or window replacement? Tell us how our service team can help.</p>
          
          <div className="bg-white p-8">
            <form onSubmit={handleSubmit}>
              {/* Contact Info */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Info</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Trim</label>
                    <input
                      type="text"
                      value={formData.trim}
                      onChange={(e) => setFormData({...formData, trim: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Body Style</label>
                  <select
                    value={formData.bodyStyle}
                    onChange={(e) => setFormData({...formData, bodyStyle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select One</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Damage Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Damage Info</h3>
                
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-3">What do you need fixed? <span className="text-gray-500">Check all that apply</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Windshield', 'Back Glass', "Driver's Side", "Passenger's Side", "Rear Driver's Side", "Rear Passenger's Side"].map((area) => (
                      <label key={area} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.damageAreas.includes(area)}
                          onChange={() => handleCheckboxChange(area)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">What kind of damage do you have?</label>
                  <select
                    value={formData.damageType}
                    onChange={(e) => setFormData({...formData, damageType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select One</option>
                    <option value="Cracks larger than 6 inches">Cracks larger than 6 inches</option>
                    <option value="More than 3 chips less than 6 inches">More than 3 chips less than 6 inches</option>
                    <option value="3 or less chips or cracks less than 6 inches">3 or less chips or cracks less than 6 inches</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Upload a photo of the damage.</label>
                  <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'damagePhoto')}
                      className="hidden"
                      id="damagePhoto"
                    />
                    <label htmlFor="damagePhoto" className="cursor-pointer">
                      <div className="text-gray-600">
                        <p className="font-medium">Upload</p>
                        <p className="text-sm">or Drag and Drop a File</p>
                      </div>
                    </label>
                    {formData.damagePhoto && (
                      <p className="mt-2 text-sm text-green-600">File uploaded: {formData.damagePhoto.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Comments</label>
                  <textarea
                    rows={4}
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                  ></textarea>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance Info</h3>
                
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Will you be using insurance for this repair or replacement?</label>
                  <select
                    value={formData.usingInsurance}
                    onChange={(e) => setFormData({...formData, usingInsurance: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select One</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {formData.usingInsurance === 'Yes' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Upload your insurance card if using insurance.</label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'insuranceCard')}
                        className="hidden"
                        id="insuranceCard"
                      />
                      <label htmlFor="insuranceCard" className="cursor-pointer">
                        <div className="text-gray-600">
                          <p className="font-medium">Upload</p>
                          <p className="text-sm">or Drag and Drop a File</p>
                        </div>
                      </label>
                      {formData.insuranceCard && (
                        <p className="mt-2 text-sm text-green-600">File uploaded: {formData.insuranceCard.name}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Info</h3>
                
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Where would you like this service?</label>
                  <select
                    value={formData.serviceLocation}
                    onChange={(e) => setFormData({...formData, serviceLocation: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select One</option>
                    <option value="We come to you">We come to you</option>
                    <option value="You come to our shop">You come to our shop</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Preferred Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    >
                      <option value="">Select One</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Alternative Date</label>
                    <input
                      type="date"
                      value={formData.alternativeDate}
                      onChange={(e) => setFormData({...formData, alternativeDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Alternative Time</label>
                    <select
                      value={formData.alternativeTime}
                      onChange={(e) => setFormData({...formData, alternativeTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                    >
                      <option value="">Select One</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>

                {formData.serviceLocation === 'We come to you' && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Service Location (if we are coming to you.)</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.serviceAddress}
                        onChange={(e) => setFormData({...formData, serviceAddress: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">State</label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                        >
                          <option value="">Select One</option>
                          <option value="NY">New York</option>
                          <option value="NJ">New Jersey</option>
                          <option value="CT">Connecticut</option>
                          <option value="PA">Pennsylvania</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Zip</label>
                        <input
                          type="text"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 px-8 font-medium text-lg hover:bg-gray-800 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GlassRepairPage;
