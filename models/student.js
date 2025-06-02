// models/student.js - This is your Model (M)
const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
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
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Please assign a teacher to this student'],
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please add a date of birth'], // CHANGED: Set to required: true for consistency
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);