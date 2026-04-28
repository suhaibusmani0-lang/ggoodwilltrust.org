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
  images: [], // array of URL strings OR data:URIs
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
          featuresInput: ''
        });
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load vehicle', variant: 'destructive' });
      }
    };
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (formData.images.length + files.length > MAX_IMAGES) {
      toast({ title: 'Too many images', description: `You can have at most ${MAX_IMAGES} images.`, variant: 'destructive' });
      return;
    }
    const accepted = [];
    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) {
        toast({ title: 'Image too large', description: `${file.name} exceeds 5MB. Skipped.`, variant: 'destructive' });
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      const dataUrl = await readFileAsDataURL(file);
      accepted.push(dataUrl);
    }
    setField('images', [...formData.images, ...accepted]);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = formData.imageUrlInput.trim();
    if (!url) return;
    if (formData.images.length >= MAX_IMAGES) {
      toast({ title: 'Too many images', description: `Max ${MAX_IMAGES} allowed.`, variant: 'destructive' });
      return;
    }
    setField('images', [...formData.images, url]);
    setField('imageUrlInput', '');
  };

  const removeImage = (index) => {
    setField('images', formData.images.filter((_, i) => i !== index));
  };

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
      // Build vehicle payload
      const payload = {
        year: parseInt(formData.year, 10),
        make: formData.make,
        model: formData.model,
        trim: formData.trim,
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage, 10),
        image: formData.image || (formData.images[0] || ''),
        images: formData.images,
        engine: formData.engine,
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        exteriorColor: formData.exteriorColor,
        interiorColor: formData.interiorColor,
        bodyType: formData.bodyType,
        vin: formData.vin,
        stockNumber: formData.stockNumber,
        fuelType: formData.fuelType,
        mpgCity: formData.mpgCity ? parseInt(formData.mpgCity, 10) : null,
        mpgHwy: formData.mpgHwy ? parseInt(formData.mpgHwy, 10) : null,
        condition: formData.condition,
        description: formData.description,
        features: formData.features,
        seatingRows: formData.seatingRows ? parseInt(formData.seatingRows, 10) : null,
        maxSeating: formData.maxSeating ? parseInt(formData.maxSeating, 10) : null,
        vehicleType: formData.bodyType,
        featured: formData.featured
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
      toast({ title: 'Error', description: err.response?.data?.detail || 'Failed to save vehicle', variant: 'destructive' });
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
          <form onSubmit={handleSubmit} data-testid="vehicle-form">

            {/* Images */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Photos</h2>
              <p className="text-sm text-gray-600 mb-4">Upload up to {MAX_IMAGES} photos. First photo is the primary image. Max 5MB per photo.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group border border-gray-200 aspect-video bg-gray-50">
                    {img ? (
                      <img src={img} alt={`Vehicle view ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                    )}
                    {idx === 0 && <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] bg-red-600 text-white uppercase">Primary</span>}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {idx > 0 && (
                        <button type="button" onClick={() => reorderImage(idx, idx - 1)} className="p-1 bg-white/90 hover:bg-white rounded text-xs">↑</button>
                      )}
                      {idx < formData.images.length - 1 && (
                        <button type="button" onClick={() => reorderImage(idx, idx + 1)} className="p-1 bg-white/90 hover:bg-white rounded text-xs">↓</button>
                      )}
                      <button type="button" onClick={() => removeImage(idx)} className="p-1 bg-red-600 text-white rounded hover:bg-red-700" data-testid={`remove-image-${idx}`}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {formData.images.length < MAX_IMAGES && (
                  <label className="cursor-pointer border-2 border-dashed border-gray-300 aspect-video flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50" data-testid="upload-image-tile">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Click to upload</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} data-testid="image-file-input" />
                  </label>
                )}
              </div>

              {/* Or add by URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste image URL and click Add"
                  value={formData.imageUrlInput}
                  onChange={(e) => setField('imageUrlInput', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-sm"
                />
                <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">Add URL</button>
              </div>
            </section>

            {/* Basics */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Vehicle Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  <input type="text" value={formData.trim} onChange={(e) => setField('trim', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
                  <select required value={formData.bodyType} onChange={(e) => setField('bodyType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    {['Sedan','SUV','Coupe','Pickup','Minivan','Wagon','Hatchback','Convertible'].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select value={formData.condition} onChange={(e) => setField('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    <option>New</option><option>Used</option><option>Certified Pre-Owned</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <input type="text" value={formData.vin} onChange={(e) => setField('vin', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock #</label>
                  <input type="text" value={formData.stockNumber} onChange={(e) => setField('stockNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select value={formData.fuelType} onChange={(e) => setField('fuelType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    {['Gasoline','Diesel','Hybrid','Electric','Flex Fuel'].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Engine / Specs */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
                  <input type="text" value={formData.engine} onChange={(e) => setField('engine', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="2.0L I4 Turbo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <input type="text" value={formData.transmission} onChange={(e) => setField('transmission', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="8-Speed Automatic" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drivetrain</label>
                  <input type="text" value={formData.drivetrain} onChange={(e) => setField('drivetrain', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="All Wheel Drive" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
                  <input type="text" value={formData.exteriorColor} onChange={(e) => setField('exteriorColor', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
                  <input type="text" value={formData.interiorColor} onChange={(e) => setField('interiorColor', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MPG City</label>
                  <input type="number" value={formData.mpgCity} onChange={(e) => setField('mpgCity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MPG Hwy</label>
                  <input type="number" value={formData.mpgHwy} onChange={(e) => setField('mpgHwy', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Seating</label>
                  <input type="number" value={formData.maxSeating} onChange={(e) => setField('maxSeating', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seating Rows</label>
                  <input type="number" value={formData.seatingRows} onChange={(e) => setField('seatingRows', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
              <textarea rows={5} value={formData.description} onChange={(e) => setField('description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Describe the vehicle..."></textarea>
            </section>

            {/* Features */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Features</h2>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a feature (e.g., Heated Seats)"
                  value={formData.featuresInput}
                  onChange={(e) => setField('featuresInput', e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-sm"
                />
                <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-600 hover:text-red-800"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </section>

            <label className="flex items-center gap-2 mb-6">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setField('featured', e.target.checked)} className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Featured Vehicle (show on homepage)</span>
            </label>

            <div className="flex gap-4">
              <button type="submit" disabled={submitting} className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 disabled:opacity-50" data-testid="vehicle-submit">
                {submitting ? 'Saving…' : (isEdit ? 'Update Vehicle' : 'Add Vehicle')}
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="bg-gray-300 text-gray-700 px-8 py-3 rounded font-bold hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
