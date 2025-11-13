import { Router, Request, Response } from "express";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { JWTUtils } from "../utils";

const router = Router();
const prisma = new PrismaClient();

// Google OAuth login
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    }),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as any;

            if (!user) {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found`);
            }

            // Generate JWT token
            const token = JWTUtils.generateToken({
                userId: user.userId,
                email: user.email,
                role: user.role,
            });

            // Update last login
            await prisma.user.update({
                where: { userId: user.userId },
                data: { lastLogin: new Date() },
            });

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
        } catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
        }
    }
);

// Google OAuth success handler (for frontend)
router.get("/google/success", (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_token`);
    }

    // Return success page with token
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Đăng nhập thành công</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: #f5f5f5;
                }
                .success { 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    max-width: 400px;
                    margin: 0 auto;
                }
                .loading { 
                    color: #26B8ED; 
                    font-size: 18px; 
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="success">
                <h2>✅ Đăng nhập Google thành công!</h2>
                <p class="loading">Đang chuyển hướng...</p>
                <script>
                    // Send token to parent window
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            token: '${token}'
                        }, '${process.env.FRONTEND_URL}');
                        window.close();
                    } else {
                        // Redirect to main page
                        window.location.href = '${process.env.FRONTEND_URL}';
                    }
                </script>
            </div>
        </body>
        </html>
    `);
});

export default router;
