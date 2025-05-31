// routes/studentRoutes.js - These are your Routes
const express = require('express');
const { getStudents, getStudentById } = require('../controllers/studentController'); // Imports Controller functions
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Retrieve a list of all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 */
router.get('/', getStudents); // Maps GET /api/students to getStudents Controller function

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Retrieve a single student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single student object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getStudentById); // Maps GET /api/students/:id to getStudentById Controller function

module.exports = router;