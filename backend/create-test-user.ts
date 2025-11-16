import { PrismaClient } from "@prisma/client";
import { PasswordUtils } from "./src/utils";

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Hash password
        const hashedPassword = await PasswordUtils.hashPassword("testpassword123");

        const user = await prisma.user.create({
            data: {
                name: "Phong Bui",
                email: "phongbui22012004@gmail.com",
                password: hashedPassword,
                phone: "0123456789",
                address: "Ho Chi Minh City",
                role: "USER",
                isActive: true,
                isVerified: true, // Đã verify sẵn
                dateOfBirth: new Date("2004-01-22"),
                gender: "male",
            },
        });

        console.log("✅ Test user created:", {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.error("❌ Error creating test user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
