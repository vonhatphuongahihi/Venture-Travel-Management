import { PrismaClient } from '@prisma/client';
import { PasswordUtils, JWTUtils, generateUserId } from '@/utils';
import { LoginRequest, RegisterRequest, AuthResponse, VerifyEmailRequest, VerifyResponse } from '@/types';
import { EmailService } from './emailService';

const prisma = new PrismaClient();
const emailService = new EmailService();

export class AuthService {
    // Register new user
    static async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                // If user exists but not verified, resend verification email
                if (!existingUser.is_verified) {
                    // Generate new verification token
                    const verificationToken = generateUserId();
                    const verificationExpires = new Date();
                    verificationExpires.setTime(verificationExpires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

                    // Update user with new token
                    await prisma.user.update({
                        where: { user_id: existingUser.user_id },
                        data: {
                            verification_token: verificationToken,
                            verification_expires: verificationExpires
                        }
                    });

                    // Send verification email
                    const emailSent = await emailService.sendVerificationEmail(
                        existingUser.email,
                        existingUser.name,
                        verificationToken
                    );

                    if (!emailSent) {
                        console.error('Failed to resend verification email to:', existingUser.email);
                    }

                    // Get updated user data with all required fields
                    const updatedUser = await prisma.user.findUnique({
                        where: { user_id: existingUser.user_id },
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
                            last_login: true,
                            created_at: true,
                            updated_at: true,
                            google_id: true,         
      auth_provider: true      
                        }
                    });

                    return {
                        success: true,
                        message: 'Email đã tồn tại nhưng chưa xác thực. Chúng tôi đã gửi lại email xác thực.',
                        data: {
                            user: updatedUser!,
                            token: ''
                        }
                    };
                } else {
                    // User exists and is already verified
                    return {
                        success: false,
                        message: 'Email đã được sử dụng'
                    };
                }
            }

            const hashedPassword = await PasswordUtils.hashPassword(userData.password);

            // Generate verification token
            const verificationToken = generateUserId();
            const verificationExpires = new Date();
            verificationExpires.setTime(verificationExpires.getTime() + (24 * 60 * 60 * 1000));

            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone,
                    address: userData.address,
                    date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth) : null,
                    gender: userData.gender,
                    verification_token: verificationToken,
                    verification_expires: verificationExpires
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
                    last_login: true,
                    created_at: true,
                    updated_at: true,
                     google_id: true,         
      auth_provider: true      
                }
            });

            // Send verification email
            const emailSent = await emailService.sendVerificationEmail(
                userData.email,
                userData.name,
                verificationToken
            );

            if (!emailSent) {
                console.error('Failed to send verification email to:', userData.email);
            }

            return {
                success: true,
                message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
                data: {
                    user,
                    token: '' // No token until email is verified
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Đăng ký thất bại',
            };
        }
    }

    // Login user
    static async login(loginData: LoginRequest): Promise<AuthResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: loginData.email }
            });

            if (!user) {
                return {
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Tài khoản đã bị vô hiệu hóa'
                };
            }

            // Check if email is verified
            if (!user.is_verified) {
                return {
                    success: false,
                    message: 'Vui lòng xác thực email trước khi đăng nhập'
                };
            }

            if (!user.password) {
  return {
    success: false,
    message: 'Tài khoản này không có mật khẩu. Vui lòng đăng nhập bằng Google.'
  };
}

const isPasswordValid = await PasswordUtils.comparePassword(
  loginData.password,
  user.password
);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                };
            }

            // Update last login
            await prisma.user.update({
                where: { user_id: user.user_id },
                data: { last_login: new Date() }
            });

            // Generate JWT token
            const token = JWTUtils.generateToken({
                userId: user.user_id,
                email: user.email,
                role: user.role
            });

            const { password, ...userWithoutPassword } = user;

            return {
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: userWithoutPassword,
                    token
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Đăng nhập thất bại'
            };
        }
    }

    // Verify email
    static async verifyEmail(verifyData: VerifyEmailRequest): Promise<VerifyResponse> {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    verification_token: verifyData.token,
                }
            });

            if (!user) {
                return {
                    success: false,
                    message: 'Token xác thực không hợp lệ'
                };
            }

            if (user.verification_expires && new Date() > user.verification_expires) {
                console.log('Token is expired');
                return {
                    success: false,
                    message: 'Token xác thực đã hết hạn'
                };
            }

            // Update user as verified
            const updatedUser = await prisma.user.update({
                where: { user_id: user.user_id },
                data: {
                    is_verified: true,
                    verification_token: null,
                    verification_expires: null
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
                    last_login: true,
                    created_at: true,
                    updated_at: true,
                     google_id: true,         
      auth_provider: true      
                }
            });

            // Send welcome email
            await emailService.sendWelcomeEmail(user.email, user.name);

            return {
                success: true,
                message: 'Xác thực email thành công',
                data: {
                    user: updatedUser
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Xác thực email thất bại',
                error: error instanceof Error ? error.message : 'Lỗi không xác định'
            };
        }
    }
}
