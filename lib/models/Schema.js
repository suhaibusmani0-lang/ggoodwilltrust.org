import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image_urls: [{ type: String }],
}, { timestamps: true });

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  file_url: { type: String },
}, { timestamps: true });

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  enrollment_no: { type: String },
  dob: { type: Date },
  description: { type: String },
  file_url: { type: String },
}, { timestamps: true });

const DonationSchema = new mongoose.Schema({
  receipt_no: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  pan: { type: String },
  amount: { type: Number, required: true },
  purpose: { type: String },
  payment_id: { type: String },
}, { timestamps: true });

export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
