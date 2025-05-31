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
        required: false,
    },
    hireDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
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
    timestamps: true,
});

module.exports = mongoose.model('Teacher', teacherSchema);