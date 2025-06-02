// swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Classroom API',
        version: '1.0.0',
        description: 'API for managing teachers and students in a classroom system, including CRUD operations.',
    },
    servers: [
        {
            url: 'http://localhost:5500',
            description: 'Development server',
        },
        {
            url: 'https://classroom-api-edrf.onrender.com',
            description: 'Render Deployment Server',
        },
    ],
    components: {
        schemas: {
            Teacher: {
                type: 'object',
                // _id is required for the full object returned
                required: ['_id', 'name', 'email', 'phone', 'subjectsTaught', 'employeeId'],
                properties: {
                    _id: { type: 'string', description: 'Unique identifier for the teacher' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    phone: { type: 'string', example: '+15551234567' },
                    address: { type: 'string', example: '123 Main St, Anytown, USA' },
                    hireDate: { type: 'string', format: 'date', example: '2020-09-01' },
                    isActive: { type: 'boolean', example: true },
                    subjectsTaught: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Mathematics', 'Physics']
                    },
                    employeeId: { type: 'string', example: 'EMP001' },
                    createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the teacher was created' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the teacher was last updated' },
                },
                example: {
                    _id: '60c72b2f9b1d8e001c8a1b2a',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+15551234567',
                    address: '123 Main St, Anytown, USA',
                    hireDate: '2020-09-01',
                    isActive: true,
                    subjectsTaught: ['Mathematics', 'Physics'],
                    employeeId: 'EMP001',
                    createdAt: '2023-01-15T10:00:00Z',
                    updatedAt: '2023-01-15T10:00:00Z'
                }
            },
            Student: {
                type: 'object',
                // For the full Student object (as returned by GET requests), _id, name, email, teacher (ID or populated object) are usually present
                // We'll define 'teacher' as a string here for simplicity in the base schema,
                // and for GET responses where it's populated, Swagger will show the populated object
                required: ['_id', 'name', 'email', 'teacher'], // teacher ID will be required here
                properties: {
                    _id: { type: 'string', description: 'Unique identifier for the student' },
                    name: { type: 'string', example: 'Lulu Doe' },
                    email: { type: 'string', format: 'email', example: 'lulu.doe@example.com' },
                    // When *sent* (input) it's a string ID. When *returned* (output/populated), it can be an object.
                    // For the base schema, it's simplest to define the ID type here.
                    // The routes will specify if the request body schema needs a different structure.
                    teacher: { type: 'string', description: 'ID of the assigned teacher', example: '683af42300684df9ce7efdbc' },
                    // dateOfBirth removed
                    createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the student was created' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the student was last updated' },
                },
                example: {
                    _id: '60c72b2f9b1d8e001c8a1b2c',
                    name: 'Lulu Doe',
                    email: 'lulu.doe@example.com',
                    teacher: '683af42300684df9ce7efdbc', // Example of teacher ID, before populate
                    // dateOfBirth removed
                    createdAt: '2023-01-15T10:00:00Z',
                    updatedAt: '2023-01-15T10:00:00Z'
                }
            },
            // TeacherInput schema - if you only need name, email, phone, subjectsTaught, employeeId
            TeacherInput: {
                type: 'object',
                required: ['name', 'email', 'phone', 'subjectsTaught', 'employeeId'],
                properties: {
                    name: { type: 'string', example: 'Jane Smith' },
                    email: { type: 'string', format: 'email', example: 'jane.smith@example.com' },
                    phone: { type: 'string', example: '+15559876543' },
                    address: { type: 'string', example: '456 Oak Ave, Othertown, USA' },
                    hireDate: { type: 'string', format: 'date', example: '2021-03-01' },
                    isActive: { type: 'boolean', example: true },
                    subjectsTaught: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Chemistry', 'Biology']
                    },
                    employeeId: { type: 'string', example: 'EMP002' },
                },
                example: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '+15559876543',
                    address: '456 Oak Ave, Othertown, USA',
                    hireDate: '2021-03-01',
                    isActive: true,
                    subjectsTaught: ['Chemistry', 'Biology'],
                    employeeId: 'EMP002'
                }
            }
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;