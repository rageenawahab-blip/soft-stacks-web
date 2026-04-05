const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
// POST: Save a new teacher to MongoDB
router.post('/add', async (req, res) => {
    try {
        const { name, experience, subjects } = req.body;
        
        const newTeacher = new Teacher({
            name,
            experience,
            subjects
        });

        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// GET: Fetch all teachers from MongoDB
router.get('/list', async (req, res) => {
    try {
        // Find all teachers and sort by most recent
        const teachers = await Teacher.find().sort({ createdAt: -1 });
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// DELETE: Remove a teacher by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;