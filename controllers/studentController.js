// controllers/studentController.js - This is your Controller (C)
const Student = require('../models/student'); // Interacts with the Model
const Teacher = require('../models/teacher'); // Also need Teacher model to validate teacher ID

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    try {
        // Uses the Model to fetch data, and populates related data
        const students = await Student.find({}).populate('teacher', 'name email');
        res.status(200).json(students); // Prepares the "View" (JSON response)
    } catch (error) {
        console.error('Error in getStudents:', error.message);
        res.status(500).json({ message: 'Server error retrieving students' });
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
        console.error('Error in getStudentById:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Student ID' });
        }
        res.status(500).json({ message: 'Server error retrieving student' });
    }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
    try {
        // Basic Validation: Check if required fields are present
        const { firstName, lastName, email, major, teacher, enrollmentDate } = req.body;
        if (!firstName || !lastName || !email || !major || !teacher || !enrollmentDate) {
            return res.status(400).json({ message: 'Please provide all required fields: firstName, lastName, email, major, teacher (ID), enrollmentDate' });
        }

        // Validate if the provided teacher ID actually exists
        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) {
            return res.status(400).json({ message: 'Provided teacher ID does not exist' });
        }

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            phone: req.body.phone,
            address: req.body.address,
            major,
            enrollmentDate,
            courses: req.body.courses,
            gpa: req.body.gpa,
            isFullTime: req.body.isFullTime,
            teacher, // Assign the teacher ID
        });

        const savedStudent = await newStudent.save();
        // Populate the teacher field in the response
        await savedStudent.populate('teacher', 'name email');
        res.status(201).json(savedStudent); // 201 Created
    } catch (error) {
        console.error('Error in createStudent:', error.message);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else if (error.name === 'CastError' && error.path === 'teacher') {
            res.status(400).json({ message: 'Invalid teacher ID format' });
        } else {
            res.status(500).json({ message: 'Server error creating student' });
        }
    }
};

// @desc    Update an existing student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { teacher } = req.body;

        // Optional: If teacher ID is being updated, validate its existence
        if (teacher) {
            const teacherExists = await Teacher.findById(teacher);
            if (!teacherExists) {
                return res.status(400).json({ message: 'Provided teacher ID does not exist' });
            }
        }
        
        // Basic validation for update: At least one field to update should be present
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update.' });
        }


        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            req.body, // Mongoose will apply schema validation to this
            { new: true, runValidators: true } // `new: true` returns the updated doc; `runValidators: true` runs schema validators on update
        ).populate('teacher', 'name email'); // Populate after update for consistent response

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error in updateStudent:', error.message);
        if (error.name === 'CastError') {
            // Check if it's a CastError for the ID itself or for the teacher field
            if (error.path === '_id') {
                return res.status(400).json({ message: 'Invalid Student ID format' });
            } else if (error.path === 'teacher') {
                return res.status(400).json({ message: 'Invalid teacher ID format' });
            }
        }
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error updating student' });
        }
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
    } catch (error) {
        console.error('Error in deleteStudent:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Student ID' });
        }
        res.status(500).json({ message: 'Server error deleting student' });
    }
};


module.exports = {
    getStudents,
    getStudentById,
    createStudent, // Export the new functions
    updateStudent,
    deleteStudent,
};