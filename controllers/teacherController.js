// controllers/teacherController.js - This is your Controller (C)
const Teacher = require('../models/teacher'); // Interacts with the Model

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({}); // Uses the Model to fetch data
        res.status(200).json(teachers); // Prepares the "View" (JSON response)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Public
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id); // Uses the Model to fetch data
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json(teacher); // Prepares the "View" (JSON response)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeachers,
    getTeacherById,
};