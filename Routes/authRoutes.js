const router = require('express').Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');// For password hashing
const crypto = require('crypto');// For sending emails
const nodemailer = require('nodemailer');

// --- 1. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    console.log("--- NEW LOGIN ATTEMPT ---");
    console.log("Request Body:", req.body); // This checks if data arrived
    console.log("Email Received:", req.body.email);
    const { email, password } = req.body;
    console.log("1. Login Attempt for:", email); // Check if email is arriving

    try {
   const user = await User.findOne({ email });
if (!user) {
    console.log("❌ DB says: No such email exists");
    return res.status(400).json({ message: "Invalid Email" });
}
// If we reach here, email exists. Now check password:
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    console.log("❌ DB says: Email found, but Password is wrong");
    console.log("Typed:", password);
    console.log("Hashed in DB:", user.password);
    return res.status(400).json({ message: "Invalid Password" });
}
        console.log("4. ✅ Login SUCCESS for:", user.email);
        res.status(200).json({ message: "Login Successful", user: user.email });

    } catch (err) {
        console.error("5. 🔥 Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// --- 2. FORGOT PASSWORD & RESET PASSWORD ROUTES ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');

    // Save token and expiry (1 hour) to user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    // Send the email using Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your App Password
        }
    });
// Email content
    const mailOptions = {
        to: user.email,
        from: 'Soft Stacks Admin',
        subject: 'Password Reset Request',
       text: `Click here to reset your password: http://127.0.0.1:5501/reset-password.html?token=${token}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to email!" });
    } catch (err) {
        res.status(500).json({ message: "Error sending email" });
    }
});
// Reset password route
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
});
module.exports = router;