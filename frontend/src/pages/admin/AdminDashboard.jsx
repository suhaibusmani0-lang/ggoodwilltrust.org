import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, MessageSquare, DollarSign, RefreshCcw, Plus, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalContacts: 0,
    totalFinanceApplications: 0,
    totalTradeIns: 0
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, vehiclesRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/vehicles`)
      ]);
      setStats(statsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`${API}/vehicles/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-300">{user.email}</span>}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Vehicles</p>
                <p className="text-3xl font-bold">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Contact Inquiries</p>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Finance Apps</p>
                <p className="text-3xl font-bold">{stats.totalFinanceApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <RefreshCcw className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Trade-Ins</p>
                <p className="text-3xl font-bold">{stats.totalTradeIns}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <Link
              to="/admin/vehicles/new"
              className="bg-red-600 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <Plus size={20} />
              Add New Vehicle
            </Link>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Vehicle</th>
                    <th className="text-left py-3 px-4">Year</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Mileage</th>
                    <th className="text-left py-3 px-4">Body Type</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img src={vehicle.image} alt={vehicle.model} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="py-3 px-4 font-medium">{vehicle.make} {vehicle.model}</td>
                      <td className="py-3 px-4">{vehicle.year}</td>
                      <td className="py-3 px-4">${vehicle.price.toLocaleString()}</td>
                      <td className="py-3 px-4">{vehicle.mileage.toLocaleString()}</td>
                      <td className="py-3 px-4">{vehicle.bodyType}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/vehicles/edit/${vehicle.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link to="/admin/inbox" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow" data-testid="link-inbox-all">
            <h3 className="text-xl font-bold mb-2">Submissions Inbox</h3>
            <p className="text-gray-600">View all form submissions with photos in one place</p>
          </Link>

          <Link to="/admin/inbox" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow" data-testid="link-inbox-finance">
            <h3 className="text-xl font-bold mb-2">Finance Applications</h3>
            <p className="text-gray-600">Review finance applications</p>
          </Link>

          <Link to="/admin/inbox" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow" data-testid="link-inbox-trade-ins">
            <h3 className="text-xl font-bold mb-2">Trade-In Requests</h3>
            <p className="text-gray-600">Review trade-in valuations with photo thumbnails</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;