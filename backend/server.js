require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. RAZORPAY SETUP (Donation ke liye)
// ==========================================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Order Create API
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // paise mein
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 2. NODEMAILER SETUP (Contact & Volunteer Forms ke liye)
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Yeh email aapko aayega
            replyTo: email, // Reply karne par user ki id par jayega
            subject: `New Website Contact: ${subject}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background-color: #f8fafc;">
                    <h2 style="color: #0f172a;">New Contact Request</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <p style="margin: 0;"><strong>Message:</strong><br/><br/>${message}</p>
                    </div>
                </div>
            `
        });
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Contact Email Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Volunteer Form API
app.post('/api/volunteer', async (req, res) => {
    const { name, email, phone, city, message } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            replyTo: email,
            subject: `New Volunteer Registration: ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background-color: #f0fdf4;">
                    <h2 style="color: #166534;">New Volunteer Application</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>City:</strong> ${city}</p>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <p style="margin: 0;"><strong>Why do you want to join us?</strong><br/><br/>${message}</p>
                    </div>
                </div>
            `
        });
        res.status(200).json({ success: true, message: 'Volunteer email sent successfully' });
    } catch (error) {
        console.error('Volunteer Email Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));