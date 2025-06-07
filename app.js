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
const User = require('./models/User'); // Import the new User model
const isAuthenticated = require('./middleware/authMiddleware'); // Import the new middleware

// --- NEW: Import cors package ---
const cors = require('cors');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5500;

// --- NEW: CORS Configuration ---
// For development, allowing all origins is often sufficient, but for production,
// you should restrict it to your frontend's domain(s).
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5500', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};
app.use(cors(corsOptions));
// --- END NEW CORS Configuration ---


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
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (https)
        httpOnly: true, // Prevent client-side JS from reading the cookie
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site with secure, 'lax' for same-site
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
    try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            // Create a new user if one doesn't exist
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
            });
        }
        return done(null, user); // Pass the user object to serializeUser
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user's MongoDB _id in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach the user object to req.user
    } catch (err) {
        done(err, null);
    }
});

app.get('/debug-session', (req, res) => {
    res.json({
        session: req.session,
        user: req.user,
        sessionID: req.sessionID
    });
});

// --- Authentication Routes ---
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })); // Request email scope

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login-failure' }),
    function(req, res) {
        // Successful authentication, redirect to your frontend dashboard
        // Make sure this URL matches your frontend's actual URL
        res.redirect(process.env.FRONTEND_SUCCESS_REDIRECT_URL || 'http://localhost:5500/dashboard');
    });

// Route for login failure
app.get('/login-failure', (req, res) => {
    // Redirect to a failure page on your frontend
    res.redirect(process.env.FRONTEND_FAILURE_REDIRECT_URL || 'http://localhost:3000/login?status=failed');
});

// Example of a protected route
app.get('/profile', isAuthenticated, (req, res) => {
    res.json({
        message: 'Welcome to your protected profile!',
        user: req.user,
        sessionId: req.sessionID
    });
});

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out.' });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.json({ message: 'Logged out successfully.' });
            // Optionally, redirect to a frontend page after successful logout
            // res.redirect(process.env.FRONTEND_LOGOUT_REDIRECT_URL || 'http://localhost:5500/login');
        });
    });
});

// --- API Routes ---
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