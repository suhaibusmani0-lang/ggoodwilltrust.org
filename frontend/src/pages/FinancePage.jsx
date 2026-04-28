import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FinancePage = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCobuyer, setShowCobuyer] = useState(false);
  
  const [formData, setFormData] = useState({
    // Vehicle
    vehicleId: '',
    // Personal Info - Contact
    firstName: '',
    middleInitial: '',
    lastName: '',
    phone: '',
    phoneType: 'Cell',
    email: '',
    ssn: '',
    birthdate: '',
    // Driver License
    dlNumber: '',
    dlIssueDate: '',
    dlExpirationDate: '',
    dlState: '',
    dlCounty: '',
    // Address
    residenceType: 'Rent',
    monthlyRent: '',
    yearsAtResidence: '',
    monthsAtResidence: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    // Employment
    employmentStatus: 'Full Time',
    income: '',
    incomeInterval: 'Monthly',
    employer: '',
    jobTitle: '',
    employerPhone: '',
    yearsAtJob: '',
    monthsAtJob: '',
    otherMonthlyIncome: '',
    // Lending Terms
    desiredAmount: '',
    loanTerm: '60 Months',
    desiredPayment: '',
    downPayment: '',
    agreedToTerms: false
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API}/vehicles`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({...formData, vehicleId: vehicle.id});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Please Accept Terms",
        description: "You must accept the terms to submit the application.",
        variant: "destructive"
      });
      return;
    }

    try {
      await axios.post(`${API}/finance-applications`, formData);
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      
      // Reset form
      setSelectedVehicle(null);
      setFormData({
        vehicleId: '',
        firstName: '',
        middleInitial: '',
        lastName: '',
        phone: '',
        phoneType: 'Cell',
        email: '',
        ssn: '',
        birthdate: '',
        dlNumber: '',
        dlIssueDate: '',
        dlExpirationDate: '',
        dlState: '',
        dlCounty: '',
        residenceType: 'Rent',
        monthlyRent: '',
        yearsAtResidence: '',
        monthsAtResidence: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        employmentStatus: 'Full Time',
        income: '',
        incomeInterval: 'Monthly',
        employer: '',
        jobTitle: '',
        employerPhone: '',
        yearsAtJob: '',
        monthsAtJob: '',
        otherMonthlyIncome: '',
        desiredAmount: '',
        loanTerm: '60 Months',
        desiredPayment: '',
        downPayment: '',
        agreedToTerms: false
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const states = ['AL','AK','AZ','AR','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WI','WV','WY'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">AUTO LOAN FINANCING</h1>
          <p className="text-center text-gray-600 mb-12">Get approved for an auto loan in minutes. Apply online from anywhere.</p>
          
          {/* Vehicle Selection */}
          {!selectedVehicle && (
            <div className="bg-white p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
              <p className="text-gray-600 mb-6">Select a Vehicle to Finance</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vehicles.slice(0, 12).map((vehicle) => (
                  <div key={vehicle.id} className="border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => handleVehicleSelect(vehicle)}>
                    <img src={vehicle.image} alt={vehicle.model} className="w-full h-40 object-cover" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800'} />
                    <div className="p-4">
                      <h3 className="font-bold text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                      <p className="text-xs text-gray-600 mb-2">{vehicle.trim}</p>
                      <p className="text-red-600 font-bold">${vehicle.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{vehicle.mileage.toLocaleString()} miles</p>
                      <button className="mt-3 w-full bg-gray-700 text-white py-2 text-sm hover:bg-gray-800">Select</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedVehicle && (
            <div className="bg-white p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Vehicle</h2>
              <div className="flex items-center gap-4 p-4 border border-gray-200">
                <img src={selectedVehicle.image} alt={selectedVehicle.model} className="w-24 h-24 object-cover" />
                <div>
                  <h3 className="font-bold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h3>
                  <p className="text-gray-600">{selectedVehicle.trim}</p>
                  <p className="text-red-600 font-bold">${selectedVehicle.price.toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="ml-auto text-red-600 hover:text-red-800">Change</button>
              </div>
            </div>
          )}

          {/* Application Form */}
          <div className="bg-white p-8">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">First Name</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Middle Initial</label>
                    <input type="text" maxLength="1" value={formData.middleInitial} onChange={(e) => setFormData({...formData, middleInitial: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone Type</label>
                    <select value={formData.phoneType} onChange={(e) => setFormData({...formData, phoneType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option>Home</option>
                      <option>Work</option>
                      <option>Cell</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Social Security Number</label>
                    <input type="text" value={formData.ssn} onChange={(e) => setFormData({...formData, ssn: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" placeholder="XXX-XX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Birthdate</label>
                    <input type="date" value={formData.birthdate} onChange={(e) => setFormData({...formData, birthdate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-6">Driver's License</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Driver's License Number</label>
                    <input type="text" value={formData.dlNumber} onChange={(e) => setFormData({...formData, dlNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Issue Date</label>
                    <input type="date" value={formData.dlIssueDate} onChange={(e) => setFormData({...formData, dlIssueDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Expiration Date</label>
                    <input type="date" value={formData.dlExpirationDate} onChange={(e) => setFormData({...formData, dlExpirationDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Driver's License State</label>
                    <select value={formData.dlState} onChange={(e) => setFormData({...formData, dlState: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">License County</label>
                    <input type="text" value={formData.dlCounty} onChange={(e) => setFormData({...formData, dlCounty: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Residence Type</label>
                    <select value={formData.residenceType} onChange={(e) => setFormData({...formData, residenceType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option>Rent</option>
                      <option>Own</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Monthly Rent/Mortgage</label>
                    <input type="number" value={formData.monthlyRent} onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Years</label>
                      <input type="number" value={formData.yearsAtResidence} onChange={(e) => setFormData({...formData, yearsAtResidence: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Months</label>
                      <input type="number" max="11" value={formData.monthsAtResidence} onChange={(e) => setFormData({...formData, monthsAtResidence: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">Address</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">Address 2</label>
                  <input type="text" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">City</label>
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">State</label>
                    <select required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Zip</label>
                    <input type="text" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Employment Status</label>
                    <select value={formData.employmentStatus} onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Self-Employed</option>
                      <option>Retired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Income</label>
                    <input type="number" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Income Interval</label>
                    <select value={formData.incomeInterval} onChange={(e) => setFormData({...formData, incomeInterval: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option>Annually</option>
                      <option>Monthly</option>
                      <option>Semi-Monthly</option>
                      <option>Bi-Weekly</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Employer</label>
                    <input type="text" value={formData.employer} onChange={(e) => setFormData({...formData, employer: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Job Title</label>
                    <input type="text" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone</label>
                    <input type="tel" value={formData.employerPhone} onChange={(e) => setFormData({...formData, employerPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Years at Job</label>
                    <input type="number" value={formData.yearsAtJob} onChange={(e) => setFormData({...formData, yearsAtJob: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Months at Job</label>
                    <input type="number" max="11" value={formData.monthsAtJob} onChange={(e) => setFormData({...formData, monthsAtJob: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Other Monthly Income</label>
                  <input type="number" value={formData.otherMonthlyIncome} onChange={(e) => setFormData({...formData, otherMonthlyIncome: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  <p className="text-xs text-gray-500 mt-1">Alimony, child support or separate maintenance income need not be revealed if you do not wish to have it considered as a basis for repaying this obligation.</p>
                </div>

                <button type="button" onClick={() => setShowCobuyer(!showCobuyer)} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">+ Add Co-Buyer</button>
              </div>

              {/* Desired Lending Terms */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Desired Lending Terms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Desired Amount</label>
                    <input type="number" value={formData.desiredAmount} onChange={(e) => setFormData({...formData, desiredAmount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Term - Length of Loan</label>
                    <select value={formData.loanTerm} onChange={(e) => setFormData({...formData, loanTerm: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400">
                      <option>24 Months</option>
                      <option>36 Months</option>
                      <option>48 Months</option>
                      <option>60 Months</option>
                      <option>72 Months</option>
                      <option>84 Months</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Desired Monthly Payment</label>
                    <input type="number" value={formData.desiredPayment} onChange={(e) => setFormData({...formData, desiredPayment: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Down Payment</label>
                    <input type="number" value={formData.downPayment} onChange={(e) => setFormData({...formData, downPayment: e.target.value})} className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-400" />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="mb-8 border-t border-gray-200 pt-8">
                <div className="bg-gray-50 p-6 mb-4 text-sm text-gray-700 space-y-3">
                  <p>I agree that by submitting this application, I authorize and give this dealership, as well as any potential financing source this dealership presents this application to, my consent to obtain my credit report from any credit reporting agency used to complete an investigation of my credit.</p>
                  <p>By submitting this application, I certify that all information herein is true and complete. I agree I am providing this information to the dealer identified in this application and acknowledge that my information may be shared pursuant to the dealer's privacy policy.</p>
                </div>
                <label className="flex items-start gap-3">
                  <input type="checkbox" required checked={formData.agreedToTerms} onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})} className="w-5 h-5 mt-1" />
                  <span className="text-sm text-gray-700">I accept these terms.</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-gray-900 text-white py-3 px-8 font-medium text-lg hover:bg-gray-800 transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FinancePage;