import mongoose from 'mongoose';

// --- Program ---
const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image_urls: [{ type: String }],
}, { timestamps: true });

// --- Document ---
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  file_url: { type: String },
}, { timestamps: true });

// --- Certificate ---
const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  enrollment_no: { type: String, trim: true, uppercase: true },
  dob: { type: Date },
  name: { type: String, trim: true },
  course: { type: String, trim: true },
  description: { type: String, trim: true },
  file_url: { type: String },
  grade: { type: String, trim: true },
}, { timestamps: true });

// --- Donation ---
const DonationSchema = new mongoose.Schema({
  receipt_no: { type: String, unique: true, sparse: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  pan: { type: String, trim: true, uppercase: true },
  amount: { type: Number, required: true, min: 1 },
  purpose: { type: String, trim: true, default: 'General Donation' },
  payment_id: { type: String, trim: true },
  razorpay_order_id: { type: String, trim: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
export const GDocument = mongoose.models.GDocument || mongoose.model('GDocument', DocumentSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);

