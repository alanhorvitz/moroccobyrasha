import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = process.argv[2] || 'admin@morocco.com';
    const password = process.argv[3] || 'Admin123!';
    const firstName = process.argv[4] || 'Admin';
    const lastName = process.argv[5] || 'User';
    const role = process.argv[6] || 'ADMIN';

    // Validate role
    const validRoles = ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(role)) {
      console.error('❌ Invalid role. Valid roles are:', validRoles.join(', '));
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  User already exists with email:', email);
      console.log('Updating role to:', role);
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role },
      });
      
      console.log('✅ User updated successfully:', {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📋 User Details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', `${user.firstName} ${user.lastName}`);
    console.log('  Role:', user.role);
    console.log('  Status:', user.status);
    console.log('  Email Verified:', user.emailVerified);
    console.log('  Created At:', user.createdAt);
    
    console.log('\n🔑 Login Credentials:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    
    console.log('\n🌐 Access Admin Dashboard:');
    console.log('  URL: http://localhost:3000/dashboard/admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 Admin User Creation Script

Usage:
  npx tsx scripts/create-admin.ts [email] [password] [firstName] [lastName] [role]

Examples:
  # Create default admin user
  npx tsx scripts/create-admin.ts

  # Create custom admin user
  npx tsx scripts/create-admin.ts admin@example.com MyPassword123! John Admin

  # Create super admin user
  npx tsx scripts/create-admin.ts superadmin@example.com SuperPassword123! Super Admin SUPER_ADMIN

Valid roles: TOURIST, GUIDE, ADMIN, SUPER_ADMIN
  `);
  process.exit(0);
}

createAdminUser();




