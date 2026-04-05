const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    experience: { type: Number, required: true },
    subjects: [String], 
    status: { type: String, default: 'Active' }, // Make sure this is here!
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Teacher', teacherSchema);