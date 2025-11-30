import {
    corsOptions,
    errorHandler,
    notFoundHandler,
    securityMiddleware
} from '@/middleware';
import routes from '@/routes';
import googleAuthRoutes from '@/routes/googleAuthRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// CORS
app.use(cors(corsOptions));

// Security middleware
app.use(securityMiddleware);


// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);
app.use('/api/auth', googleAuthRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

export default app;