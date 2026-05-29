require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection (MongoDB)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/spreadsmiles")
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => console.log("❌ Database Error: ", err));

// Database Schema (Admin Panel ke liye record format)
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
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 3. Email Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 4. API: Order Create Karna (React se amount aayega)
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // Razorpay amount ko paise mein count karta hai
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

// 5. API: Payment Verify Karna, Record Save Karna aur Email Bhejna
app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userDetails } = req.body;

    // Signature Match karna (Security Check)
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        
        // A. Database mein record save karein
        const newDonation = new Donation({
            name: userDetails.name,
            email: userDetails.email,
            amount: userDetails.amount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
        });
        await newDonation.save();

        // B. User ko Email Bhejein (Official 80G Receipt)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userDetails.email,
            subject: '80G Donation Receipt - Spread Smiles Foundation',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #333;">
                    
                    <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="color: #1e3a8a; margin: 0;">Spread Smiles Foundation</h1>
                        <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Shaheen Bagh, New Delhi | +91 7840008043</p>
                    </div>
                    
                    <div style="padding: 10px 0;">
                        <h3 style="color: #111827; margin-bottom: 10px;">Dear ${userDetails.name},</h3>
                        <p style="line-height: 1.5; color: #4b5563;">Thank you so much for your generous donation. Your contribution empowers our mission and helps us bring more smiles to the world.</p>
                        
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
                            <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 10px;">Donation Receipt</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Donor Name:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${userDetails.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Email:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${userDetails.email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Donation Amount:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #059669;">₹${userDetails.amount}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Transaction ID:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right; font-family: monospace;">${razorpay_payment_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Date:</td>
                                    <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe;">
                            <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 15px; border-bottom: 1px solid #93c5fd; padding-bottom: 10px;">Tax Exemption Details (80G)</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e3a8a;">
                                <tr>
                                    <td style="padding: 3px 0; font-weight: bold;">NGO Reg No:</td>
                                    <td style="padding: 3px 0; text-align: right;">719</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-weight: bold;">PAN:</td>
                                    <td style="padding: 3px 0; text-align: right;">ABGTS6392E</td>
                                </tr>
                                <tr>
                                    <td style="padding: 3px 0; font-weight: bold;">80G Certificate:</td>
                                    <td style="padding: 3px 0; text-align: right;">ABGTS6392EF20231</td>
                                </tr>
                            </table>
                            <p style="margin: 15px 0 0 0; font-size: 12px; font-style: italic; color: #2563eb; text-align: center;">
                                * All donations are eligible for tax exemption under section 80G of the Income Tax Act. Please retain this receipt for your tax filings.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                        This is a system-generated electronic receipt and does not require a physical signature.
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log("Email Failed:", error);
            else console.log("Email Sent to Donor");
        });

        res.status(200).json({ message: "Payment verified and record saved successfully" });
    } else {
        res.status(400).json({ message: "Invalid signature" });
    }
});

// 6. API: Admin Panel ke liye saare records nikalna
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 }); // Latest pehle aayega
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch records" });
    }
});

// 7. API: Contact Form Submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Yeh mail admin ko jayegi
        replyTo: email, // Seedha reply par click karke user ko mail jayega
        subject: `New Website Inquiry: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-w: 600px; margin: auto;">
                <h2 style="color: #5cb85c; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from Website</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3 style="margin-top: 20px; color: #333;">Message:</h3>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #5cb85c; color: #555; white-space: pre-wrap;">${message}</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending contact email:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

// 8. API: Volunteer Registration Form
app.post('/api/volunteer', async (req, res) => {
    const { name, email, phone, city, message } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Volunteer Registration: ${name} from ${city}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-w: 600px; margin: auto;">
                <h2 style="color: #2081e2; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Volunteer Registration</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>City:</strong> ${city}</p>
                <h3 style="margin-top: 20px; color: #333;">Interest & Availability:</h3>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #2081e2; color: #555; white-space: pre-wrap;">${message}</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Volunteer registered successfully" });
    } catch (error) {
        console.error("Error sending volunteer email:", error);
        res.status(500).json({ message: "Failed to register volunteer" });
    }
});

// Server Start karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));