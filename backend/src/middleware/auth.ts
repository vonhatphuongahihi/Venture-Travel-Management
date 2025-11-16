import { Request, Response, NextFunction } from "express";
import { JWTUtils } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, AuthUser } from "@/types";

const prisma = new PrismaClient();

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access token is required",
            });
            return;
        }

        const decoded = JWTUtils.verifyToken(token) as {
            userId: string;
            email: string;
            role: string;
        };

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { userId: decoded.userId },
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
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid token - user not found",
            });
            return;
        }

        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: "Account is deactivated",
            });
            return;
        }

        req.user = user as Express.User;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
