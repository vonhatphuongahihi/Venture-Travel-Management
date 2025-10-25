import { PrismaClient } from '@prisma/client';
import { PasswordUtils, JWTUtils } from '@/utils';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const prisma = new PrismaClient();

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

            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone,
                    address: userData.address,
                    date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth) : null,
                    gender: userData.gender
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
                    last_login: true,
                    created_at: true,
                    updated_at: true
                }
            });

            // Generate JWT token
            const token = JWTUtils.generateToken({
                userId: user.user_id,
                email: user.email,
                role: user.role
            });

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token
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
}
