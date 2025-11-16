import { PrismaClient } from "@prisma/client";
import { PasswordUtils, JWTUtils, generateUserId } from "@/utils";
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    VerifyEmailRequest,
    VerifyResponse,
} from "@/types";
import { EmailService } from "./emailService";

const prisma = new PrismaClient();
const emailService = new EmailService();

export class AuthService {
    // Register new user
    static async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingUser) {
                // If user exists but not verified, resend verification email
                if (!existingUser.isVerified) {
                    // Generate new verification token
                    const verificationToken = generateUserId();
                    const verificationExpires = new Date();
                    verificationExpires.setTime(
                        verificationExpires.getTime() + 24 * 60 * 60 * 1000
                    ); // 24 hours

                    // Update user with new token
                    await prisma.user.update({
                        where: { userId: existingUser.userId },
                        data: {
                            verificationToken: verificationToken,
                            verificationExpires: verificationExpires,
                        },
                    });

                    // Send verification email
                    const emailSent = await emailService.sendVerificationEmail(
                        existingUser.email,
                        existingUser.name,
                        verificationToken
                    );

                    if (!emailSent) {
                        console.error(
                            "Failed to resend verification email to:",
                            existingUser.email
                        );
                    }

                    // Get updated user data with all required fields
                    const updatedUser = await prisma.user.findUnique({
                        where: { userId: existingUser.userId },
                        select: {
                            userId: true,
                            name: true,
                            email: true,
                            phone: true,
                            address: true,
                            profilePhoto: true,
                            dateOfBirth: true,
                            gender: true,
                            role: true,
                            isActive: true,
                            isVerified: true,
                            verificationToken: true,
                            verificationExpires: true,
                            lastLogin: true,
                            createdAt: true,
                            updatedAt: true,
                            googleId: true,
                            authProvider: true,
                        },
                    });

                    return {
                        success: true,
                        message:
                            "Email đã tồn tại nhưng chưa xác thực. Chúng tôi đã gửi lại email xác thực.",
                        data: {
                            user: updatedUser!,
                            token: "",
                        },
                    };
                } else {
                    // User exists and is already verified
                    return {
                        success: false,
                        message: "Email đã được sử dụng",
                    };
                }
            }

            const hashedPassword = await PasswordUtils.hashPassword(userData.password);

            // Generate verification token
            const verificationToken = generateUserId();
            const verificationExpires = new Date();
            verificationExpires.setTime(verificationExpires.getTime() + 24 * 60 * 60 * 1000);

            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone,
                    address: userData.address,
                    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
                    gender: userData.gender,
                    verificationToken: verificationToken,
                    verificationExpires: verificationExpires,
                },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    profilePhoto: true,
                    dateOfBirth: true,
                    gender: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    verificationToken: true,
                    verificationExpires: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    googleId: true,
                    authProvider: true,
                },
            });

            // Send verification email
            const emailSent = await emailService.sendVerificationEmail(
                userData.email,
                userData.name,
                verificationToken
            );

            if (!emailSent) {
                console.error("Failed to send verification email to:", userData.email);
            }

            return {
                success: true,
                message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
                data: {
                    user,
                    token: "", // No token until email is verified
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Đăng ký thất bại",
            };
        }
    }

    // Login user
    static async login(loginData: LoginRequest): Promise<AuthResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: loginData.email },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    password: true,
                    phone: true,
                    address: true,
                    profilePhoto: true,
                    dateOfBirth: true,
                    gender: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    verificationToken: true,
                    verificationExpires: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    googleId: true,
                    authProvider: true,
                },
            });

            if (!user) {
                return {
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                };
            }

            if (!user.isActive) {
                return {
                    success: false,
                    message: "Tài khoản đã bị vô hiệu hóa",
                };
            }

            // Check if email is verified
            if (!user.isVerified) {
                return {
                    success: false,
                    message: "Vui lòng xác thực email trước khi đăng nhập",
                };
            }


            // Check if user has a password (for local authentication)
            if (!user.password) {
                return {
                    success: false,
                    message: "Tài khoản này sử dụng phương thức đăng nhập khác",
                };
            }

            const isPasswordValid = await PasswordUtils.comparePassword(loginData.password, user.password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                };
            }

            // Update last login
            await prisma.user.update({
                where: { userId: user.userId },
                data: { lastLogin: new Date() },
            });

            // Generate JWT token
            const token = JWTUtils.generateToken({
                userId: user.userId,
                email: user.email,
                role: user.role,
            });

            const { password, ...userWithoutPassword } = user;

            return {
                success: true,
                message: "Đăng nhập thành công",
                data: {
                    user: userWithoutPassword,
                    token,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Đăng nhập thất bại",
            };
        }
    }

    // Verify email
    static async verifyEmail(verifyData: VerifyEmailRequest): Promise<VerifyResponse> {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    verificationToken: verifyData.token,
                },
            });

            if (!user) {
                return {
                    success: false,
                    message: "Token xác thực không hợp lệ",
                };
            }

            if (user.verificationExpires && new Date() > user.verificationExpires) {
                console.log("Token is expired");
                return {
                    success: false,
                    message: "Token xác thực đã hết hạn",
                };
            }

            // Update user as verified
            const updatedUser = await prisma.user.update({
                where: { userId: user.userId },
                data: {
                    isVerified: true,
                    verificationToken: null,
                    verificationExpires: null,
                },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    profilePhoto: true,
                    dateOfBirth: true,
                    gender: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    verificationToken: true,
                    verificationExpires: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    googleId: true,
                    authProvider: true,
                },
            });

            // Send welcome email
            await emailService.sendWelcomeEmail(user.email, user.name);

            return {
                success: true,
                message: "Xác thực email thành công",
                data: {
                    user: updatedUser,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: "Xác thực email thất bại",
                error: error instanceof Error ? error.message : "Lỗi không xác định",
            };
        }
    }
}
