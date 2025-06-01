// routes/studentRoutes.js - These are your Routes
const express = require('express');
const router = express.Router();
// CORRECTED LINE: Import all functions from the controller using destructuring
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');


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

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *           examples:
 *             newStudent:
 *               value:
 *                 firstName: "Jane"
 *                 lastName: "Smith"
 *                 email: "jane.smith@example.com"
 *                 phone: "999-888-7777"
 *                 address: "456 Oak Ave"
 *                 major: "Computer Science"
 *                 enrollmentDate: "2023-08-15T00:00:00.000Z"
 *                 courses: ["CS101", "MA101"]
 *                 gpa: 3.8
 *                 isFullTime: true
 *                 teacher: "60c72b2f9b1e8e0015f8a2c1" # Replace with an actual Teacher ID from your DB
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input data (e.g., missing required fields, validation errors, invalid teacher ID)
 *       500:
 *         description: Server error
 */
router.post('/', createStudent); // Maps POST /api/students to createStudent Controller function

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *           examples:
 *             updateStudent:
 *               value:
 *                 lastName: "Johnson"
 *                 phone: "111-222-3333"
 *                 major: "Software Engineering"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input data or invalid ID
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateStudent); // Maps PUT /api/students/:id to updateStudent Controller function

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student deleted successfully
 *                 deletedStudent:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteStudent); // Maps DELETE /api/students/:id to deleteStudent Controller function

module.exports = router;