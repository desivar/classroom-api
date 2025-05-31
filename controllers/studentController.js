// controllers/studentController.js - This is your Controller (C)
const Student = require('../models/student'); // Interacts with the Model

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    try {
        // Uses the Model to fetch data, and populates related data
        const students = await Student.find({}).populate('teacher', 'name email');
        res.status(200).json(students); // Prepares the "View" (JSON response)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
    try {
        // Uses the Model to fetch data, and populates related data
        const student = await Student.findById(req.params.id).populate('teacher', 'name email');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student); // Prepares the "View" (JSON response)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    getStudentById,
};