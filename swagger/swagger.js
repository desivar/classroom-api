// swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Classroom API',
        version: '1.0.0',
        description: 'API for managing teachers and students in a classroom system, including CRUD operations (Part 1: Get Single & Get All).',
    },
    servers: [
        {
            url: 'http://localhost:5500',
            description: 'Development server',
        },
    ],
    components: {
        schemas: {
            Teacher: {
                type: 'object',
                required: ['name', 'email', 'phone', 'subjectsTaught', 'employeeId'],
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    address: { type: 'string' },
                    hireDate: { type: 'string', format: 'date' },
                    isActive: { type: 'boolean' },
                    subjectsTaught: { type: 'array', items: { type: 'string' } },
                    employeeId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                example: { /* ... example data ... */ }
            },
            Student: {
                type: 'object',
                required: ['name', 'email', 'teacher'],
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    teacher: { type: 'string' }, // Can be an object when populated
                    dateOfBirth: { type: 'string', format: 'date' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                example: { /* ... example data ... */ }
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;