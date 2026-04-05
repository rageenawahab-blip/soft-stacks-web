const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }, // Changed to required
    status: { type: String, default: 'New' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);