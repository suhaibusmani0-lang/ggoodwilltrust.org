import mongoose from 'mongoose';

// --- Hero Slide ---
const HeroSlideSchema = new mongoose.Schema({
  headline: { type: String, required: true, trim: true },
  tag: { type: String, trim: true },
  image_url: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// --- Brand Partner ---
const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  badge: { type: String, trim: true },
  logo_url: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// --- Testimonial ---
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  review: { type: String, required: true, trim: true },
  time: { type: String, trim: true, default: 'Recently' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// --- Site Setting (Impact Counters & Global Config) ---
const SiteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

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

export const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
export const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
export const GDocument = mongoose.models.GDocument || mongoose.model('GDocument', DocumentSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
export const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
