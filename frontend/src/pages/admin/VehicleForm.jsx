import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

const emptyForm = {
  year: new Date().getFullYear(),
  make: '',
  model: '',
  trim: '',
  price: '',
  mileage: '',
  image: '',
  imageUrlInput: '',
  images: [], 
  engine: '',
  transmission: '',
  drivetrain: '',
  exteriorColor: '',
  interiorColor: '',
  bodyType: 'Sedan',
  vin: '',
  stockNumber: '',
  fuelType: 'Gasoline',
  mpgCity: '',
  mpgHwy: '',
  condition: 'Used',
  status: 'available', // Naya status field
  description: '',
  features: [],
  featuresInput: '',
  seatingRows: '',
  maxSeating: '',
  featured: false
};

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`${API}/vehicles/${id}`);
        setFormData({
          ...emptyForm,
          ...data,
          images: data.images && data.images.length ? data.images : (data.image ? [data.image] : []),
          features: data.features || [],
          imageUrlInput: '',
          featuresInput: '',
          status: data.status || 'available' // Purana status load karo
        });
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load vehicle', variant: 'destructive' });
      }
    };
    fetchVehicle();
  }, [id, isEdit]);

  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (formData.images.length + files.length > MAX_IMAGES) {
      toast({ title: 'Too many images', description: `Max ${MAX_IMAGES} images.`, variant: 'destructive' });
      return;
    }
    const accepted = [];
    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) {
        toast({ title: 'Image too large', description: `${file.name} exceeds 5MB.`, variant: 'destructive' });
        continue;
      }
      const dataUrl = await readFileAsDataURL(file);
      accepted.push(dataUrl);
    }
    setField('images', [...formData.images, ...accepted]);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = formData.imageUrlInput.trim();
    if (!url || formData.images.length >= MAX_IMAGES) return;
    setField('images', [...formData.images, url]);
    setField('imageUrlInput', '');
  };

  const removeImage = (index) => setField('images', formData.images.filter((_, i) => i !== index));

  const reorderImage = (from, to) => {
    if (to < 0 || to >= formData.images.length) return;
    const list = [...formData.images];
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    setField('images', list);
  };

  const handleAddFeature = () => {
    const f = formData.featuresInput.trim();
    if (!f) return;
    setField('features', [...formData.features, f]);
    setField('featuresInput', '');
  };

  const removeFeature = (index) => setField('features', formData.features.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage, 10),
        image: formData.image || (formData.images[0] || ''),
        mpgCity: formData.mpgCity ? parseInt(formData.mpgCity, 10) : null,
        mpgHwy: formData.mpgHwy ? parseInt(formData.mpgHwy, 10) : null,
        seatingRows: formData.seatingRows ? parseInt(formData.seatingRows, 10) : null,
        maxSeating: formData.maxSeating ? parseInt(formData.maxSeating, 10) : null,
        status: formData.status // Status backend bhejo
      };

      if (isEdit) {
        await axios.put(`${API}/vehicles/${id}`, payload);
        toast({ title: 'Success', description: 'Vehicle updated' });
      } else {
        await axios.post(`${API}/vehicles`, payload);
        toast({ title: 'Success', description: 'Vehicle added' });
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to save', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>

            {/* Images Section */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative border border-gray-200 aspect-video bg-gray-50">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded"><X className="w-3 h-3"/></button>
                  </div>
                ))}
                {formData.images.length < MAX_IMAGES && (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 aspect-video flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Upload</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </section>

            {/* Basics & High-Class Status Management */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Vehicle Basics & Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* INVENTORY STATUS DROPDOWN */}
                <div className="bg-gray-50 p-3 border border-gray-200 rounded-md">
                  <label className="block text-sm font-bold text-red-600 mb-1 uppercase tracking-tighter">Inventory Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-gray-900 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="available">✅ Available</option>
                    <option value="hold">⏳ Hold (Deposit Received)</option>
                    <option value="sold">⛔ Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input required type="number" value={formData.year} onChange={(e) => setField('year', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                  <input required type="text" value={formData.make} onChange={(e) => setField('make', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input required type="text" value={formData.model} onChange={(e) => setField('model', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input required type="number" value={formData.price} onChange={(e) => setField('price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage *</label>
                  <input required type="number" value={formData.mileage} onChange={(e) => setField('mileage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select value={formData.condition} onChange={(e) => setField('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    <option>New</option><option>Used</option><option>Certified Pre-Owned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <input type="text" value={formData.vin} onChange={(e) => setField('vin', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock #</label>
                  <input type="text" value={formData.stockNumber} onChange={(e) => setField('stockNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
              </div>
            </section>

            {/* Specifications */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={formData.engine} onChange={(e) => setField('engine', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Engine" />
                <input type="text" value={formData.transmission} onChange={(e) => setField('transmission', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Transmission" />
                <input type="text" value={formData.drivetrain} onChange={(e) => setField('drivetrain', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Drivetrain" />
              </div>
            </section>

            {/* Description & Features (unchanged) */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
              <textarea rows={5} value={formData.description} onChange={(e) => setField('description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
            </section>

            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setField('featured', e.target.checked)} className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Featured (Show on Home)</span>
            </label>

            <div className="flex gap-4">
              <button type="submit" disabled={submitting} className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700">
                {submitting ? 'Saving…' : (isEdit ? 'Update Vehicle' : 'Add Vehicle')}
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="bg-gray-300 px-8 py-3 rounded font-bold">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;