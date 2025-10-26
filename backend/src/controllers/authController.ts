import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { LoginRequest, RegisterRequest, VerifyEmailRequest, AuthenticatedRequest } from '@/types';
import { ResponseUtils } from '@/utils';

export class AuthController {
    // Register new user
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const userData: RegisterRequest = req.body;
            const result = await AuthService.register(userData);

            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Registration failed',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Login user
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const loginData: LoginRequest = req.body;
            const result = await AuthService.login(loginData);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(401).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Login failed',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Get current user profile
    static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            res.status(200).json(ResponseUtils.success('Profile retrieved successfully', req.user));
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to get profile',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Logout user (client-side token removal)
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(ResponseUtils.success('Logout successful'));
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Logout failed',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Verify email
    static async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const verifyData: VerifyEmailRequest = req.body;
            const result = await AuthService.verifyEmail(verifyData);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Email verification failed',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }
}
