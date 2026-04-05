const express = require('express');
const router = express.Router();
const Course = require('../models/Course');




// POST: Add a new course
router.post('/add', async (req, res) => {
    try {
        const { courseName, duration, fees, status } = req.body;
        const newCourse = new Course({ courseName, duration, fees, status });
        await newCourse.save();
        res.status(201).json({ message: "Course created successfully!" });
    } catch (err) {
    console.log("--- REAL ERROR START ---");
    console.error(err); // This prints the full red error in your VS Code terminal
    console.log("--- REAL ERROR END ---");
    res.status(500).json({ error: err.message });
}
});

// GET: List all courses (for your grid and table)
router.get('/list', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a course
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- UPDATE (EDIT) COURSE ---
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the modified document
        );
        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err });
    }
});

module.exports = router;