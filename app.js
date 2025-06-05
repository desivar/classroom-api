// app.js
require('dotenv').config(); // Loads environment variables into process.env
const express = require('express');
const connectDB = require('./config/db'); // Assuming this connects to MongoDB
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const User = require('./models/User'); // We'll assume a User model for storing authenticated users

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware for parsing JSON bodies
app.use(express.json());

// --- Passport.js Configuration ---

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'aVerySecretKey', // Use a strong, unique secret from environment variables
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true // Prevent client-side JS from reading the cookie
    }
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5500/auth/github/callback"
},
async (accessToken, refreshToken, profile, done) => {
    // In a real application, you would find or create a user in your database
    // based on the GitHub profile ID.
    try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                // You can save more profile data as needed
            });
        }
        return done(null, user); // Pass the user object to serializeUser
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user into the session
// This is called once during login after the strategy successfully authenticates a user.
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user's MongoDB _id in the session
});

// Deserialize user from the session
// This is called on subsequent requests to retrieve the user object from the database using the stored ID.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach the user object to req.user
    } catch (err) {
        done(err, null);
    }
});

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    // If not authenticated, send a 401 Unauthorized response
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
}

// --- Authentication Routes ---
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })); // Request email scope

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login-failure' }),
    function(req, res) {
        // Successful authentication, redirect to a dashboard or success page.
        // req.user will contain the authenticated user.
        res.redirect('/profile'); // Example: Redirect to a protected profile page
    });

// Route for login failure
app.get('/login-failure', (req, res) => {
    res.status(401).send('GitHub authentication failed. Please try again.');
});

// Example of a protected route
app.get('/profile', isAuthenticated, (req, res) => {
    // req.user is available here because of deserializeUser
    res.json({
        message: 'Welcome to your protected profile!',
        user: req.user,
        sessionId: req.sessionID // Useful for debugging
    });
});

// Logout route
app.get('/logout', (req, res, next) => {
    // req.logout requires a callback in newer Passport versions
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => { // Destroy the session completely
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out.' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.json({ message: 'Logged out successfully.' });
        });
    });
});

// --- API Routes ---
// Apply isAuthenticated middleware to protect write operations
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);


// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route
app.get('/', (req, res) => {
    res.send('Classroom API is running. Go to /api-docs for Swagger documentation.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    console.log(`GitHub OAuth Login: http://localhost:${PORT}/auth/github`);
});

// --- User Model (for Passport to store authenticated users) ---
// Create a new file: models/User.js
/*
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    displayName: String,
    email: String,
    // Add any other fields you want to store about the user
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
*/