import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PartsDeptPage = () => {
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
      await axios.post(`${API}/parts-requests`, formData);
      toast({
        title: "Request Submitted!",
        description: "Our parts department will contact you soon.",
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
      console.error('Error submitting parts request:', error);
      toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">PARTS DEPT</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">GENUINE OEM PARTS</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our parts department carries a comprehensive inventory of genuine OEM parts and quality aftermarket alternatives. Whether you need parts for routine maintenance or a major repair, we can help you find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our Parts?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Genuine manufacturer parts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Quality aftermarket options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Competitive pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Expert guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span>Fast ordering & delivery</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Parts</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Brake Pads & Rotors</li>
                <li>• Filters (Oil, Air, Cabin)</li>
                <li>• Batteries</li>
                <li>• Spark Plugs</li>
                <li>• Wiper Blades</li>
                <li>• Belts & Hoses</li>
                <li>• Fluids & Lubricants</li>
                <li>• Lights & Bulbs</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Request a Part</h3>
            
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
                  placeholder="Please describe the part you need (Year, Make, Model, Part Name)"
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

export default PartsDeptPage;