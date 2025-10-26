import { User as PrismaUser } from '@prisma/client';
import { Request } from 'express';

// Custom user type for authenticated requests
export interface AuthUser {
    user_id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    profile_photo: string | null;
    date_of_birth: Date | null;
    gender: string | null;
    role: string;
    is_active: boolean;
    last_login: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface AuthenticatedRequest extends Request {
    user?: Express.User;
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
        user: Omit<PrismaUser, 'password'>;
        token: string;
    };
}

export interface VerifyResponse {
    success: boolean;
    message: string;
    data?: {
        user: Omit<PrismaUser, 'password'>;
    };
    error?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
