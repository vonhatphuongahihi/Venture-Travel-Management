import { Request, Response } from 'express';
import { PasswordResetService } from '@/services/passwordResetService';
import { ForgotPasswordRequest, ResetPasswordRequest, VerifyResetTokenRequest } from '@/types';
import { ResponseUtils } from '@/utils';

export class PasswordResetController {
    // Request password reset - send email with reset link
    static async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const requestData: ForgotPasswordRequest = req.body;
            const result = await PasswordResetService.forgotPassword(requestData);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Không thể xử lý yêu cầu đặt lại mật khẩu',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }

    // Reset password using token
    static async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const requestData: ResetPasswordRequest = req.body;
            const result = await PasswordResetService.resetPassword(requestData);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Không thể đặt lại mật khẩu',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }

    // Verify reset token (optional - for frontend validation)
    static async verifyResetToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query as { token: string };

            if (!token) {
                res.status(400).json(ResponseUtils.error('Token là bắt buộc'));
                return;
            }

            const result = await PasswordResetService.verifyResetToken(token);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json(ResponseUtils.error(
                'Không thể xác thực token',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }
}