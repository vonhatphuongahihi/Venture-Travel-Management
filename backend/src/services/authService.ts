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
                return {
                    success: false,
                    message: 'User with this email already exists'
                };
            }

            const hashedPassword = await PasswordUtils.hashPassword(userData.password);

            // Generate verification token
            const verificationToken = generateUserId();
            const verificationExpires = new Date();
            verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours

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
                    updated_at: true
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
                message: 'User registered successfully. Please check your email to verify your account.',
                data: {
                    user,
                    token: '' // No token until email is verified
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Registration failed',
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
                    message: 'Invalid email or password'
                };
            }

            if (!user.is_active) {
                return {
                    success: false,
                    message: 'Account is deactivated'
                };
            }

            // Check if email is verified
            if (!user.is_verified) {
                return {
                    success: false,
                    message: 'Please verify your email before logging in'
                };
            }

            const isPasswordValid = await PasswordUtils.comparePassword(loginData.password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid email or password'
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
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Login failed'
            };
        }
    }

    // Verify email
    static async verifyEmail(verifyData: VerifyEmailRequest): Promise<VerifyResponse> {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    verification_token: verifyData.token,
                    verification_expires: {
                        gt: new Date() // Token not expired
                    }
                }
            });

            if (!user) {
                return {
                    success: false,
                    message: 'Invalid or expired verification token'
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
                    updated_at: true
                }
            });

            // Send welcome email
            await emailService.sendWelcomeEmail(user.email, user.name);

            return {
                success: true,
                message: 'Email verified successfully',
                data: {
                    user: updatedUser
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Email verification failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
