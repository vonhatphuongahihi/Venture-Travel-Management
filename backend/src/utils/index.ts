import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class PasswordUtils {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

export class JWTUtils {
    static generateToken(payload: { userId: string; email: string; role: string }): string {
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

        return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
    }

    static verifyToken(token: string): any {
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        return jwt.verify(token, secret);
    }
}

export class ValidationUtils {
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone: string): boolean {
        const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
        return phoneRegex.test(phone);
    }

    static isValidPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    static isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
}

export class ResponseUtils {
    static success<T>(message: string, data?: T) {
        return {
            success: true,
            message,
            data
        };
    }

    static error(message: string, error?: string) {
        return {
            success: false,
            message,
            error
        };
    }
}

export const generateUserId = (): string => uuidv4();
