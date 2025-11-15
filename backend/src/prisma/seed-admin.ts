import { PrismaClient } from '@prisma/client';
import { PasswordUtils } from '@/utils';

const prisma = new PrismaClient();

async function main() {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@venturetravel.com' }
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }

    // Create admin user
    const adminPassword = await PasswordUtils.hashPassword('13032004');

    const adminUser = await prisma.user.create({
        data: {
            name: 'Administrator',
            email: 'admin@venturetravel.com',
            password: adminPassword,
            role: 'ADMIN',
            isActive: true,
            isVerified: true,
            phone: '+84365486141',
            address: 'Ho Chi Minh City, Vietnam'
        }
    });

    console.log('✅ Admin user created:', {
        id: adminUser.userId,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
    });
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });