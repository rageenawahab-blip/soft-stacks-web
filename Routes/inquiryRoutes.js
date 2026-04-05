const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry'); // Adjust path to your model

// --- 1. POST: Submit a New Inquiry ---
router.post('/', async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();

        // TRIGGER NOTIFICATION
        // req.io comes from the middleware we added in server.js
        if (req.io) {
            req.io.emit('new_student_lead', {
                name: req.body.userName,
                message: req.body.userMessage
            });
        }

        res.status(201).json({ message: "Inquiry received!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});
// --- 2. GET: Fetch All Inquiries (For Dashboard) ---
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ date: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- 3. DELETE: Remove an Inquiry by ID ---
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;