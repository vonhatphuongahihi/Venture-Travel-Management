import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

// CORS configuration
export const corsOptions = {
    origin: function (origin: string | undefined, callback: Function) {
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:8082',
            'http://localhost:5173' // Vite default port
        ];

        // Cho phép requests không có origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Cho phép các domains từ Vercel (bao gồm preview deployments)
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }

        // Cho phép các domains từ Render
        if (origin.includes('.onrender.com')) {
            return callback(null, true);
        }

        // Kiểm tra trong danh sách allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With']
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
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
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
