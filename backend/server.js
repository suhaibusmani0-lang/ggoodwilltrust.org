require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
// Nodemailer hata diya gaya hai, ab hum direct API fetch use karenge

const app = express();

// 🔒 CORS setup updated for security
app.use(cors({
    origin: ["https://spreadsmilesfoundation.com", "https://www.spreadsmilesfoundation.com", "http://localhost:5173"], 
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());

// --- DEBUG: CHECK ENVIRONMENT VARIABLES ---
console.log("-----------------------------------");
console.log("🔍 Checking Environment Variables:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Found" : "❌ MISSING");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✅ Found" : "❌ MISSING");
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "✅ Found" : "❌ MISSING");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Found" : "❌ MISSING");
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Found" : "❌ MISSING");
console.log("-----------------------------------");

// 1. Database Connection (MongoDB)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/spreadsmiles")
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => console.log("❌ Database Error: ", err.message));

// Database Schema
const donationSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount: Number,
    paymentId: String,
    orderId: String,
    date: { type: Date, default: Date.now }
});
const Donation = mongoose.model('Donation', donationSchema);

// 2. Razorpay Setup
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay Configured Successfully");
} else {
    console.warn("⚠️ Razorpay Keys Missing! Payments will not work.");
}

// 3. Email Helper Function (Using Brevo REST API instead of SMTP)
const sendEmailViaBrevo = async (toEmail, subject, htmlContent) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Spread Smiles Foundation", email: process.env.EMAIL_USER },
                to: [{ email: toEmail }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const errInfo = await response.text();
            console.error("Brevo API Error:", errInfo);
            throw new Error("Failed to send via Brevo");
        }
        console.log("✅ Email sent successfully via Brevo");
    } catch (error) {
        console.error("Email sending function failed:", error);
        throw error;
    }
};

// 4. API: Order Create Karna
app.post('/api/create-order', async (req, res) => {
    if (!razorpay) return res.status(500).json({ message: "Razorpay is not configured on server" });
    
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Order creation failed" });
    }
});

// 5. API: Payment Verify Karna
app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userDetails } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        // Save to DB
        const newDonation = new Donation({
            name: userDetails.name,
            email: userDetails.email,
            amount: userDetails.amount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
        });
        await newDonation.save();

        // Send Email
        const htmlBody = `<p>Thank you ${userDetails.name} for your donation of ₹${userDetails.amount}.</p>`;
        
        // Background mein email bhejenge taaki response delay na ho
        sendEmailViaBrevo(userDetails.email, '80G Donation Receipt - Spread Smiles Foundation', htmlBody)
            .catch(err => console.log("Payment email failed silently", err));

        res.status(200).json({ message: "Payment verified and record saved successfully" });
    } else {
        res.status(400).json({ message: "Invalid signature" });
    }
});

// 6. API: Get Donations
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch records" });
    }
});

// ==========================================
// 7. API: Contact Us Form
// ==========================================
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        const htmlBody = `
            <h3>New Message from Contact Form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> <br/> ${message}</p>
        `;

        await sendEmailViaBrevo(process.env.EMAIL_USER, `New Contact Form Query: ${subject}`, htmlBody);
        res.status(200).json({ message: "Contact message sent successfully!" });
    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ message: "Failed to send message." });
    }
});

// ==========================================
// 8. API: Volunteer Registration Form
// ==========================================
app.post('/api/volunteer', async (req, res) => {
    try {
        const { name, email, phone, city, message } = req.body;

        const htmlBody = `
            <h3>New Volunteer Registration</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Availability/Message:</strong> <br/> ${message}</p>
        `;

        await sendEmailViaBrevo(process.env.EMAIL_USER, `New Volunteer Registration: ${name}`, htmlBody);
        res.status(200).json({ message: "Volunteer registration sent successfully!" });
    } catch (error) {
        console.error("Volunteer Form Error:", error);
        res.status(500).json({ message: "Failed to submit registration." });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));