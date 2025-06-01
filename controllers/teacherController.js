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
        console.error('Error in getTeachers:', error.message);
        res.status(500).json({ message: 'Server error retrieving teachers' });
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
        console.error('Error in getTeacherById:', error.message);
        // Handle CastError for invalid IDs (e.g., non-MongoDB ID format)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }
        res.status(500).json({ message: 'Server error retrieving teacher' });
    }
};

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Public
const createTeacher = async (req, res) => {
    try {
        // Basic Validation: Check if required fields are present
        const { name, email, phone, subjectsTaught, employeeId } = req.body;
        if (!name || !email || !phone || !subjectsTaught || !employeeId) {
            return res.status(400).json({ message: 'Please provide all required fields: name, email, phone, subjectsTaught, employeeId' });
        }

        const newTeacher = new Teacher({
            name,
            email,
            phone,
            address: req.body.address,
            hireDate: req.body.hireDate,
            isActive: req.body.isActive,
            subjectsTaught,
            employeeId,
        });

        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher); // 201 Created
    } catch (error) {
        console.error('Error in createTeacher:', error.message);
        // Handle Mongoose validation errors (e.g., unique fields, schema type errors)
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error creating teacher' });
        }
    }
};

// @desc    Update an existing teacher
// @route   PUT /api/teachers/:id
// @access  Public
const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, subjectsTaught, employeeId } = req.body;

        // Basic Validation for update: At least one field to update should be present,
        // and required fields if they are explicitly being updated.
        if (!name && !email && !phone && !subjectsTaught && !employeeId && !req.body.address && !req.body.hireDate && req.body.isActive === undefined) {
             return res.status(400).json({ message: 'No fields provided for update.' });
        }
        // More robust validation would check format of each field if provided

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            req.body, // Mongoose will apply schema validation to this
            { new: true, runValidators: true } // `new: true` returns the updated doc; `runValidators: true` runs schema validators on update
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json(updatedTeacher);
    } catch (error) {
        console.error('Error in updateTeacher:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error updating teacher' });
        }
    }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Public
const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully', deletedTeacher });
    } catch (error) {
        console.error('Error in deleteTeacher:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }
        res.status(500).json({ message: 'Server error deleting teacher' });
    }
};

module.exports = {
    getTeachers,
    getTeacherById,
    createTeacher, // Export the new functions
    updateTeacher,
    deleteTeacher,
};