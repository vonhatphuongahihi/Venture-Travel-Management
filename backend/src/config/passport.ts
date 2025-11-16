import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure Google OAuth Strategy
const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback";

console.log("Google OAuth Config:", {
    clientID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
    callbackURL: GOOGLE_CALLBACK_URL,
});

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            const { emails, displayName, photos } = profile;

            try {
                if (!emails || !emails[0]?.value) {
                    return done(new Error("Không thể lấy thông tin email từ Google"), undefined);
                }

                const email = emails[0].value;
                const googleId = profile.id;

                // Kiểm tra người dùng đã tồn tại hay chưa
                let user = await prisma.user.findFirst({
                    where: {
                        email: email,
                    },
                });

                if (user) {
                    return done(null, user);
                }

                // Nếu người dùng chưa tồn tại, tạo một user mới với thông tin từ Google
                user = await prisma.user.create({
                    data: {
                        name: displayName,
                        email: email,
                        profilePhoto: photos?.[0]?.value || null,
                        role: "USER",
                        isActive: true,
                        isVerified: true, // Google users are auto-verified
                        password: "", // No password for Google users
                        gender: "other",
                        dateOfBirth: new Date("2000-01-01"),
                    },
                });

                if (!user) {
                    return done(new Error("Không thể tạo người dùng mới"), undefined);
                }

                return done(null, user);
            } catch (error) {
                console.error("Google OAuth Error:", error);
                return done(error, undefined);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, user.userId);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId: id },
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
