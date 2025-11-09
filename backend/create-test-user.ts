import { PrismaClient } from '@prisma/client';
import { PasswordUtils } from './src/utils';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword('testpassword123');

    const user = await prisma.user.create({
      data: {
        name: 'Phong Bui',
        email: 'phongbui22012004@gmail.com',
        password: hashedPassword,
        phone: '0123456789',
        address: 'Ho Chi Minh City',
        role: 'USER',
        is_active: true,
        is_verified: true, // Đã verify sẵn
        date_of_birth: new Date('2004-01-22'),
        gender: 'male'
      }
    });

    console.log('✅ Test user created:', {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified
    });
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();