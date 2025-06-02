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
        // Destructure all expected fields from the TeacherInput schema
        const { name, email, phone, subjectsTaught, employeeId, address, hireDate, isActive } = req.body;

        // Basic Validation: Check if required fields are present
        if (!name || !email || !phone || !subjectsTaught || !employeeId) {
            return res.status(400).json({ message: 'Please provide all required fields: name, email, phone, subjectsTaught, employeeId' });
        }

        const newTeacher = new Teacher({
            name,
            email,
            phone,
            address, // Include optional fields directly
            hireDate, // Include optional fields directly
            isActive, // Include optional fields directly
            subjectsTaught,
            employeeId,
        });

        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher); // 201 Created
    } catch (error) {
        console.error('Error in createTeacher:', error.message);
        // Handle Mongoose validation errors (e.g., unique fields, schema type errors)
        if (error.name === 'ValidationError') {
            // Provide more specific validation messages if possible, or just the error.message from Mongoose
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            res.status(400).json({ message: 'Validation failed', errors });
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
        // You can choose to destructure specific fields or pass req.body directly.
        // Passing req.body directly relies on Mongoose schema validation for consistency.
        // The current 'if' condition below is robust enough.

        // Basic Validation for update: At least one field to update should be present
        // This check ensures that the request body is not empty.
        if (Object.keys(req.body).length === 0) {
             return res.status(400).json({ message: 'No fields provided for update.' });
        }

        // Mongoose will apply schema validation to req.body based on your Teacher model
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // `new: true` returns the updated doc; `runValidators: true` runs schema validators on update
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json(updatedTeacher);
    } catch (error) {
        console.error('Error in updateTeacher:', error.message);
        if (error.name === 'CastError') {
            // Check if it's a CastError for the ID itself
            if (error.path === '_id') {
                return res.status(400).json({ message: 'Invalid Teacher ID format' });
            }
            // Add checks for other fields if they could cause CastError (e.g., if you had a number field and sent a string)
            return res.status(400).json({ message: 'Invalid data format for update' });
        }
        if (error.name === 'ValidationError') {
            // Provide more specific validation messages if possible
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            res.status(400).json({ message: 'Validation failed', errors });
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
};