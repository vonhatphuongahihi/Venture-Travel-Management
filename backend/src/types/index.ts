import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    gender?: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: Omit<User, 'password'>;
        token: string;
    };
}

export interface VerifyResponse {
    success: boolean;
    message: string;
    data?: {
        user: Omit<User, 'password'>;
    };
    error?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
