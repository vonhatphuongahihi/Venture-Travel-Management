import { UpdateProfileRequest, ChangePasswordRequest, ChangeEmailRequest, UserService } from '@/services/userService';
import { AuthenticatedRequest } from '@/types';
import { ResponseUtils } from '@/utils';
import { Response } from 'express';

export class AdminController {
    // Get admin profile
    static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            // Check if user is ADMIN
            if (req.user.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Access denied. Admin role required'));
                return;
            }

            const result = await UserService.getProfile(req.user.user_id);
            
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to get profile',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Update admin profile
    static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            // Check if user is ADMIN
            if (req.user.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Access denied. Admin role required'));
                return;
            }

            const updateData: UpdateProfileRequest = req.body;
            const result = await UserService.updateProfile(req.user.user_id, updateData);
            
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to update profile',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Update admin avatar
    static async updateAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            // Check if user is ADMIN
            if (req.user.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Access denied. Admin role required'));
                return;
            }

            if (!req.file) {
                res.status(400).json(ResponseUtils.error('No file uploaded'));
                return;
            }

            const result = await UserService.updateAvatar(req.user.user_id, req.file);
            
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to update avatar',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Change password
    static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            // Check if user is ADMIN
            if (req.user.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Access denied. Admin role required'));
                return;
            }

            const { oldPassword, newPassword }: ChangePasswordRequest = req.body;
            const result = await UserService.changePassword(req.user.user_id, oldPassword, newPassword);
            
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to change password',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }

    // Change email
    static async changeEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
                return;
            }

            // Check if user is ADMIN
            if (req.user.role !== 'ADMIN') {
                res.status(403).json(ResponseUtils.error('Access denied. Admin role required'));
                return;
            }

            const { email }: ChangeEmailRequest = req.body;
            const result = await UserService.changeEmail(req.user.user_id, email);
            
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Failed to change email',
                error instanceof Error ? error.message : 'Unknown error'
            ));
        }
    }
}

