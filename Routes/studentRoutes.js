const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST: Register a new student
router.post('/enroll', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: Get all students
router.get('/list', async (req, res) => {
    try {
        const students = await Student.find().sort({ enrollmentDate: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE: Remove a teacher by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;