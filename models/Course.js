const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: Number, required: true }, // Ensure this is Number
    status: { type: String, default: 'Active' }
}, { timestamps: true });
 // Added this so your .sort({ createdAt: -1 }) works!
module.exports = mongoose.model('Course', CourseSchema);