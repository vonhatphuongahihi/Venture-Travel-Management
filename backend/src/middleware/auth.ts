import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '@/utils';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/types';

const prisma = new PrismaClient();

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
            return;
        }

        const decoded = JWTUtils.verifyToken(token) as { userId: string; email: string; role: string };

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { user_id: decoded.userId },
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

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
            return;
        }

        if (!user.is_active) {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }

        req.user = user as any;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
