const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending to yourself to test
    subject: 'MERN System Test',
    text: 'If you see this, your Gmail App Password is working!'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("❌ Error:", error.message);
    } else {
        console.log("✅ Email sent successfully: " + info.response);
    }
});