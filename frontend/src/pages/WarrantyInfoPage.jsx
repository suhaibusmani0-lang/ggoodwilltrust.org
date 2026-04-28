import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WarrantyInfoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleInfo: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/warranty-info`, formData);
      toast({
        title: "Request Submitted!",
        description: "We'll send you warranty information shortly.",
      });
      setFormData({ name: '', email: '', phone: '', vehicleInfo: '', message: '' });
    } catch (error) {
      console.error('Error submitting warranty info request:', error);
      toast({ title: 'Error', description: 'Failed to submit request.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">WARRANTY INFORMATION</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Protect Your Investment</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg mb-4">
                All vehicles not only come with manufacturer warranty, but also can add extended bumper to bumper coverage. Every vehicle undergoes a meticulous 185 point inspection for mechanical and cosmetics for your peace of mind.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Warranty Benefits:</h3>
                <ul className="space-y-2">
                  <li>• Comprehensive bumper-to-bumper coverage</li>
                  <li>• Powertrain protection</li>
                  <li>• Roadside assistance</li>
                  <li>• Rental car reimbursement</li>
                  <li>• Trip interruption coverage</li>
                  <li>• Transferable to new owner</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Request Warranty Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Information</label>
                <input
                  type="text"
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({...formData, vehicleInfo: e.target.value})}
                  placeholder="Year, Make, Model"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 px-8 font-bold text-lg hover:bg-red-700 transition-colors rounded-sm"
              >
                Request Information
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WarrantyInfoPage;