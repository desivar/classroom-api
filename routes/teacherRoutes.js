// routes/teacherRoutes.js - These are your Routes
const express = require('express');
const { getTeachers, getTeacherById } = require('../controllers/teacherController'); // Imports Controller functions
const router = express.Router();

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

module.exports = router;