import { UpdateProfileRequest, UserService } from '@/services/userService';
import { AuthenticatedRequest } from '@/types';
import { ResponseUtils } from '@/utils';
import { Response } from 'express';

export class UserController {
    // Get user profile
    static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
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

    // Update user profile
    static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
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

    // Update user avatar
    static async updateAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ResponseUtils.error('User not authenticated'));
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
}
