import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Helper method to render HTML template with placeholders
    private renderTemplate(templateName: string, placeholders: Record<string, string>): string {
        try {
            const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
            let template = fs.readFileSync(templatePath, "utf8");

            // Replace placeholders
            for (const [key, value] of Object.entries(placeholders)) {
                template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
            }

            return template;
        } catch (error) {
            console.error("Error rendering template:", error);
            throw new Error("Failed to render email template");
        }
    }

    // Send verification email
    async sendVerificationEmail(
        email: string,
        name: string,
        verificationToken: string
    ): Promise<boolean> {
        try {
            // Check if user still exists
            const user = await prisma.user.findUnique({
                where: { email },
                select: { userId: true, isVerified: true },
            });

            if (!user) {
                console.log("Không tìm thấy người dùng, bỏ qua gửi email:", email);
                return false;
            }

            if (user.isVerified) {
                console.log("Người dùng đã được xác thực, bỏ qua gửi email:", email);
                return false;
            }

            const verificationUrl = `${
                process.env.FRONTEND_URL || "http://localhost:8081"
            }/verify-email?token=${verificationToken}`;

            // Render email template
            const htmlContent = this.renderTemplate("verificationEmail", {
                name: name,
                verificationUrl: verificationUrl,
            });

            const mailOptions = {
                from: process.env.SMTP_FROM || "Venture <noreply@venture.com>",
                to: email,
                subject: "Xác thực tài khoản Venture",
                html: htmlContent,
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Lỗi khi gửi email xác thực:", error);
            return false;
        }
    }

    // Send welcome email after verification
    async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
        try {
            // Check if user still exists
            const user = await prisma.user.findUnique({
                where: { email },
                select: { userId: true, isVerified: true },
            });

            if (!user) {
                console.log("Không tìm thấy người dùng, bỏ qua gửi email chào mừng:", email);
                return false;
            }

            if (!user.isVerified) {
                console.log("Người dùng chưa được xác thực, bỏ qua gửi email chào mừng:", email);
                return false;
            }

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8081";

            // Render email template
            const htmlContent = this.renderTemplate("welcomeEmail", {
                name: name,
                frontendUrl: frontendUrl,
            });

            const mailOptions = {
                from: process.env.SMTP_FROM || "Venture <noreply@Venture.com>",
                to: email,
                subject: "Chào mừng bạn đến với Venture!",
                html: htmlContent,
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Lỗi khi gửi email chào mừng:", error);
            return false;
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(
        email: string,
        name: string,
        resetToken: string
    ): Promise<boolean> {
        try {
            // Check if user still exists
            const user = await prisma.user.findUnique({
                where: { email },
                select: { userId: true, isActive: true },
            });

            if (!user) {
                console.log("Không tìm thấy người dùng, bỏ qua gửi email reset password:", email);
                return false;
            }

            if (!user.isActive) {
                console.log("Người dùng không active, bỏ qua gửi email reset password:", email);
                return false;
            }

            const resetUrl = `${
                process.env.FRONTEND_URL || "http://localhost:8081"
            }/reset-password?token=${resetToken}`;

            // Render email template
            const htmlContent = this.renderTemplate("passwordResetEmail", {
                name: name,
                resetUrl: resetUrl,
            });

            const mailOptions = {
                from: process.env.SMTP_FROM || "Venture <noreply@venture.com>",
                to: email,
                subject: "Đặt lại mật khẩu - Venture Travel",
                html: htmlContent,
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Lỗi khi gửi email reset password:", error);
            return false;
        }
    }

    // Test email configuration
    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log("✅ Kết nối SMTP thành công");
            return true;
        } catch (error) {
            console.error("❌ Kết nối SMTP thất bại:", error);
            return false;
        }
    }
}
