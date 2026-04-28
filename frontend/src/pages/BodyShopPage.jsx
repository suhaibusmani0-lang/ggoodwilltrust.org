import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BodyShopPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: 'Phone',
    comments: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/body-shop-requests`, formData);
      toast({
        title: "Request Submitted!",
        description: "Our body shop will contact you soon for an estimate.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredContact: 'Phone',
        comments: ''
      });
    } catch (error) {
      console.error('Error submitting body shop request:', error);
      toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">BODY SHOP</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">PROFESSIONAL COLLISION REPAIR</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our state-of-the-art body shop is equipped to handle everything from minor dents and scratches to major collision repairs. We work with all insurance companies and guarantee our work to restore your vehicle to its pre-accident condition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Services</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Collision Repair</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Dent Removal & Paintless Dent Repair</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Paint & Refinishing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Frame Straightening</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Bumper Repair & Replacement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Scratch Removal</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>I-CAR certified technicians</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>State-of-the-art equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Work with all insurance companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Lifetime warranty on repairs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Free estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Quick turnaround time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Request an Estimate</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method of Contact *</label>
                <select
                  required
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  rows={5}
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Please describe the damage or repair needed"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 px-8 font-bold text-lg hover:bg-red-600 transition-colors rounded-sm"
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

export default BodyShopPage;