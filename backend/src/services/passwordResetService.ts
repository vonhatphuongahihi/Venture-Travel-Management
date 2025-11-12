import { PrismaClient } from '@prisma/client';
import { PasswordUtils, JWTUtils } from '@/utils';
import { ForgotPasswordRequest, ResetPasswordRequest, ForgotPasswordResponse, ResetPasswordResponse, VerifyResetTokenResponse, PasswordResetJWTPayload } from '@/types';
import { EmailService } from './emailService';

const prisma = new PrismaClient();
const emailService = new EmailService();

export class PasswordResetService {
    // Request password reset - send email with reset link
    static async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: request.email },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    is_active: true,
                    is_verified: true
                }
            });

            if (!user) {
                // Don't reveal if email exists or not for security
                return {
                    success: true,
                    message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            if (!user.is_verified) {
                return {
                    success: false,
                    message: 'Vui lòng xác thực email trước khi đặt lại mật khẩu'
                };
            }

            // Generate JWT token for password reset (expires in 1 hour)
            const resetToken = JWTUtils.generatePasswordResetToken({
                userId: user.user_id,
                email: user.email,
                type: 'password_reset'
            });

            // Calculate expiry time (1 hour from now)
            const resetExpires = new Date();
            resetExpires.setTime(resetExpires.getTime() + (60 * 60 * 1000)); // 1 hour

            // Update user with reset token
            await prisma.user.update({
                where: { user_id: user.user_id },
                data: {
                    reset_token: resetToken,
                    reset_expires: resetExpires
                }
            });

            // Send password reset email
            const emailSent = await emailService.sendPasswordResetEmail(
                user.email,
                user.name,
                resetToken
            );

            if (!emailSent) {
                console.error('Failed to send password reset email to:', user.email);
                return {
                    success: false,
                    message: 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.'
                };
            }

            return {
                success: true,
                message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.'
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.'
            };
        }
    }

    // Reset password using token
    static async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        try {
            // Verify the reset token
            const decoded = JWTUtils.verifyToken(request.token) as PasswordResetJWTPayload;

            if (!decoded || decoded.type !== 'password_reset') {
                return {
                    success: false,
                    message: 'Token đặt lại mật khẩu không hợp lệ'
                };
            }

            // Find user with the reset token
            const user = await prisma.user.findFirst({
                where: {
                    user_id: decoded.userId,
                    reset_token: request.token,
                    reset_expires: {
                        gt: new Date() // Token not expired
                    }
                },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    is_active: true
                }
            });

            if (!user) {
                return {
                    success: false,
                    message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            // Hash the new password
            const hashedPassword = await PasswordUtils.hashPassword(request.newPassword);

            // Update user password and clear reset token
            const updatedUser = await prisma.user.update({
                where: { user_id: user.user_id },
                data: {
                    password: hashedPassword,
                    reset_token: null,
                    reset_expires: null,
                    updated_at: new Date()
                },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    profile_photo: true,
                    date_of_birth: true,
                    gender: true,
                    role: true,
                    is_active: true,
                    is_verified: true,
                    verification_token: true,
                    verification_expires: true,
                    reset_token: true,
                    reset_expires: true,
                    last_login: true,
                    created_at: true,
                    updated_at: true,
                    google_id: true,
                    auth_provider: true
                }
            });

            return {
                success: true,
                message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.',
                data: {
                    user: updatedUser
                }
            };
        } catch (error) {
            console.error('Reset password error:', error);
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                return {
                    success: false,
                    message: 'Token đặt lại mật khẩu đã hết hạn'
                };
            }
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.'
            };
        }
    }

    // Verify reset token (optional - for frontend to check if token is valid)
    static async verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
        try {
            // Verify the reset token
            const decoded = JWTUtils.verifyToken(token) as PasswordResetJWTPayload;

            if (!decoded || decoded.type !== 'password_reset') {
                return {
                    success: false,
                    message: 'Token không hợp lệ'
                };
            }

            // Find user with the reset token
            const user = await prisma.user.findFirst({
                where: {
                    user_id: decoded.userId,
                    reset_token: token,
                    reset_expires: {
                        gt: new Date() // Token not expired
                    }
                },
                select: {
                    user_id: true,
                    email: true,
                    is_active: true
                }
            });

            if (!user) {
                return {
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            return {
                success: true,
                message: 'Token hợp lệ',
                data: {
                    email: user.email
                }
            };
        } catch (error) {
            console.error('Verify reset token error:', error);
            return {
                success: false,
                message: 'Token không hợp lệ'
            };
        }
    }
}