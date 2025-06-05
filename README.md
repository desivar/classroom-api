Classroom API 🚀
A simple API designed to manage classroom activities, including students, assignments, and schedules.

📌 Features
Student management (CRUD operations)

Assignment handling

Schedule tracking

Authentication with JWT

📦 Installation
git clone https://github.com/your-repo/classroom-api.git
cd classroom-api
npm install
⚙️ Configuration
Create a .env file in the root directory with:
MONGO_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
🚀 Running the Server
npm start
OR with Nodemon:
npm run dev
📖 API Endpoints Table
Method	Endpoint	Description	Authentication
POST	/students	Add a new student	✅ Required
GET	/students	Get all students	❌ Not required
PUT	/students/:id	Update student info	✅ Required
DELETE	/students/:id	Remove a student	✅ Required
POST	/assignments	Create an assignment	✅ Required
🛠 Swagger Documentation
Swagger is integrated for API documentation. Run the server and visit:
http://localhost:5000/api-docs
🛡 Authentication
This API uses JWT authentication. Include a Bearer Token in requests that require authentication.

📌 Contribution Guidelines
Fork the repository.

Create a feature branch.

Submit a pull request with a description.
