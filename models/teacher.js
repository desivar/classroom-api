// models/teacher.js - This is your Model (M)
const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    address: {
        type: String,
        required: false, // Explicitly false, consistent with TeacherInput being optional
    },
    hireDate: {
        type: Date,
        required: false, // Explicitly false, consistent with TeacherInput being optional (default is handled by Mongoose)
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        required: false, // Explicitly false, consistent with TeacherInput being optional (default is handled by Mongoose)
        default: true,
    },
    subjectsTaught: {
        type: [String],
        required: [true, 'Please add subjects taught'],
    },
    employeeId: {
        type: String,
        required: [true, 'Please add an employee ID'],
        unique: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Teacher', teacherSchema);