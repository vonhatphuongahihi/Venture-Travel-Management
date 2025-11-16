import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyAdmin() {
    try {
        const result = await prisma.user.update({
            where: { email: "admin@venturetravel.com" },
            data: { isVerified: true },
        });
        console.log("✅ Admin account verified:", result.email);
    } catch (error) {
        console.error("❌ Error verifying admin:", error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAdmin();
