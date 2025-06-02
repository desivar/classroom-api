// routes/teacherRoutes.js - These are your Routes
const express = require('express');
const router = express.Router();
// Import all functions from the controller using destructuring
const { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher management
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Retrieve a list of all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A list of teachers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       500:
 *         description: Server error
 */
router.get('/', getTeachers); // Maps GET /api/teachers to getTeachers Controller function

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Retrieve a single teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single teacher object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getTeacherById); // Maps GET /api/teachers/:id to getTeacherById Controller function

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherInput' # Changed to TeacherInput for consistency
 *           examples:
 *             newTeacher:
 *               value:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 phone: "123-456-7890"
 *                 address: "123 Main St"
 *                 hireDate: "2023-09-01T00:00:00.000Z"
 *                 isActive: true
 *                 subjectsTaught: ["Math", "Physics"]
 *                 employeeId: "EMP001"
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid input data (e.g., missing required fields, validation errors)
 *       500:
 *         description: Server error
 */
router.post('/', createTeacher); // Maps POST /api/teachers to createTeacher Controller function

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update an existing teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeacherInput' # Changed to TeacherInput for consistency
 *           examples:
 *             updateTeacher:
 *               value:
 *                 name: "Johnathan Doe"
 *                 phone: "987-654-3210"
 *                 isActive: false
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid input data or invalid ID
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateTeacher); // Maps PUT /api/teachers/:id to updateTeacher Controller function

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teacher deleted successfully
 *                 deletedTeacher:
 *                   $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteTeacher); // Maps DELETE /api/teachers/:id to deleteTeacher Controller function

module.exports = router;






