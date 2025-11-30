import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

// CORS configuration
export const corsOptions = {
    origin: function (origin: string | undefined, callback: Function) {
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:8080',
            'http://localhost:8081', 
            'http://localhost:8082',
            'http://localhost:5173' // Vite default port
        ];

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware
export const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
});

// Error handling middleware
export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', error);

    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.message
        });
        return;
    }

    if (error.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
        return;
    }

    if (error.name === 'ForbiddenError') {
        res.status(403).json({
            success: false,
            message: 'Forbidden'
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
};
