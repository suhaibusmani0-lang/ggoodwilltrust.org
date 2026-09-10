require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const supabaseUrl = 'https://nupyxvsumptrtiufmnuw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cHl4dnN1bXB0cnRpdWZtbnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTg2ODQsImV4cCI6MjA5MTc3NDY4NH0.vA0T1Ah9qHLcCSk-cEGnI5_UIsrn5JAHABM0IhFtq28';
const supabase = createClient(supabaseUrl, supabaseKey);

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ProgramSchema = new mongoose.Schema({
  title: String,
  description: String,
  image_urls: [String],
  createdAt: Date
});

const DocumentSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  file_url: String,
  createdAt: Date
});

const CertificateSchema = new mongoose.Schema({
  title: String,
  enrollment_no: String,
  dob: Date,
  description: String,
  file_url: String,
  createdAt: Date
});

const DonationSchema = new mongoose.Schema({
  receipt_no: String,
  name: String,
  email: String,
  phone: String,
  pan: String,
  amount: Number,
  purpose: String,
  payment_id: String,
  createdAt: Date
});

const Program = mongoose.model('Program', ProgramSchema);
const Document = mongoose.model('Document', DocumentSchema);
const Certificate = mongoose.model('Certificate', CertificateSchema);
const Donation = mongoose.model('Donation', DonationSchema);

async function uploadToCloudinary(fileUrl) {
  if (!fileUrl) return null;
  try {
    console.log('Uploading:', fileUrl);
    const res = await cloudinary.uploader.upload(fileUrl, { resource_type: 'auto' });
    return res.secure_url;
  } catch (err) {
    console.log('Cloudinary Upload Error:', err.message);
    return fileUrl;
  }
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');

  // 1. Migrate Programs
  const { data: programs } = await supabase.from('programs_projects').select('*');
  for (const p of programs || []) {
    const newImageUrls = [];
    for (const url of p.image_urls || []) {
      const cUrl = await uploadToCloudinary(url);
      if (cUrl) newImageUrls.push(cUrl);
    }
    await Program.create({ title: p.title, description: p.description, image_urls: newImageUrls, createdAt: p.created_at });
  }
  console.log('Programs Migrated');

  // 2. Migrate Documents
  const { data: docs } = await supabase.from('documents').select('*');
  for (const d of docs || []) {
    const cUrl = await uploadToCloudinary(d.file_url);
    await Document.create({ title: d.title, description: d.description, category: d.category, file_url: cUrl, createdAt: d.created_at });
  }
  console.log('Documents Migrated');

  // 3. Migrate Certificates
  const { data: certs } = await supabase.from('certificates_results').select('*');
  for (const c of certs || []) {
    const cUrl = await uploadToCloudinary(c.file_url);
    await Certificate.create({ title: c.title, enrollment_no: c.enrollment_no, dob: c.dob, description: c.description, file_url: cUrl, createdAt: c.created_at });
  }
  console.log('Certificates Migrated');

  // 4. Migrate Donations
  const { data: donations } = await supabase.from('donations').select('*');
  for (const d of donations || []) {
    await Donation.create({ ...d, createdAt: d.created_at });
  }
  console.log('Donations Migrated');

  console.log('Migration Complete');
  process.exit(0);
}

migrate();
