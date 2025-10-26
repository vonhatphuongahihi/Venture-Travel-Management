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
                'Đăng ký thất bại',
                error instanceof Error ? error.message : 'Lỗi không xác định'
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
                'Đăng nhập thất bại',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }

    // Get current user profile
    static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('Người dùng chưa được xác thực'));
                return;
            }

            // Return user data in the correct format
            res.status(200).json({
                success: true,
                message: 'Lấy thông tin hồ sơ thành công',
                data: {
                    user: req.user
                }
            });
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Không thể lấy thông tin hồ sơ',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }

    // Logout user (client-side token removal)
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(ResponseUtils.success('Đăng xuất thành công'));
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Đăng xuất thất bại',
                error instanceof Error ? error.message : 'Lỗi không xác định'
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
                'Xác thực email thất bại',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }
}
