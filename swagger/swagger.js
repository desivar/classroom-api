// swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Classroom API',
        version: '1.0.0',
        description: 'API for managing teachers and students in a classroom system, including CRUD operations, Auth/github.',
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
        // --- START NEW ADDITION FOR SECURITY SCHEMES ---
        securitySchemes: {
            cookieAuth: { // Name your security scheme, e.g., 'cookieAuth'
                type: 'apiKey',
                in: 'cookie',
                name: 'connect.sid', // The name of your session cookie
                description: 'Session cookie for authentication. After logging in via /auth/github, your browser will have this cookie. Swagger UI will automatically send it with "Execute".'
            }
        },
        // --- END NEW ADDITION FOR SECURITY SCHEMES ---
        schemas: { // Your existing schemas follow after this
            Teacher: {
                type: 'object',
                // Added _id to required as it's part of the full object returned
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
                // _id should be required for the full Student object that's returned
                required: ['_id', 'name', 'email', 'teacher', 'dateOfBirth'], // RE-ADDED dateOfBirth
                properties: {
                    _id: { type: 'string', description: 'Unique identifier for the student' },
                    name: { type: 'string', example: 'Candy Loom' },
                    email: { type: 'string', format: 'email', example: 'candlo@example.com' },
                    // When populated, 'teacher' will be an object.
                    // For consistency with raw data (before populate) or if not populated, it's a string (ID).
                    // We model it as an object here for reflecting a populated response,
                    // but the StudentInput will use a string.
                    teacher: {
                        type: 'object',
                        description: 'Teacher object (populated) or Teacher ID (unpopulated)',
                        properties: {
                            _id: { type: 'string', example: '683af42300684df9ce7efdbc' },
                            name: { type: 'string', example: 'John Doe' },
                            email: { type: 'string', format: 'email', example: 'john.doe@example.com' }
                        }
                    },
                    dateOfBirth: { type: 'string', format: 'date-time', example: '2009-06-20T00:00:00Z' }, // RE-ADDED dateOfBirth
                    createdAt: { type: 'string', format: 'date-time', description: 'Timestamp when the student was created' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Timestamp when the student was last updated' },
                },
                example: {
                    _id: '60c72b2f9b1d8e001c8a1b2c',
                    name: 'Candy Loom',
                    email: 'candlo@example.com',
                    teacher: { // Example of populated teacher
                        _id: '683af42300684df9ce7efdbc',
                        name: 'John Doe',
                        email: 'john.doe@example.com'
                    },
                    dateOfBirth: '2009-06-20T00:00:00Z',
                    createdAt: '2023-01-15T10:00:00Z',
                    updatedAt: '2023-01-15T10:00:00Z'
                }
            },
            // RE-ADDED: StudentInput schema for POST and PUT requests
            StudentInput: {
                type: 'object',
                required: ['name', 'email', 'teacher', 'dateOfBirth'],
                properties: {
                    name: { type: 'string', example: 'Candy Loom' },
                    email: { type: 'string', format: 'email', example: 'candlo@example.com' },
                    teacher: { type: 'string', description: 'ID of the assigned teacher', example: '683af42300684df9ce7efdbc' },
                    dateOfBirth: { type: 'string', format: 'date-time', example: '2009-06-20T00:00:00Z' }
                },
                example: {
                    name: 'Candy Loom',
                    email: 'candlo@example.com',
                    teacher: '683af42300684df9ce7efdbc',
                    dateOfBirth: '2009-06-20T00:00:00Z'
                }
            },
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
    // --- START NEW ADDITION FOR GLOBAL SECURITY ---
    security: [
      {
        cookieAuth: [] // Refer to the security scheme by its name
      }
    ]
    // --- END NEW ADDITION FOR GLOBAL SECURITY ---
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;