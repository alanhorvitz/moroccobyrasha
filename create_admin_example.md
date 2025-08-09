# Creating Admin Users - Morocco Tourism Platform

## Method 1: Direct API Registration

You can create admin users directly through the registration endpoint by specifying the role parameter:

### Create Admin User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@morocco.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

### Create Super Admin User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@morocco.com",
    "password": "SuperAdmin123!",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "SUPER_ADMIN"
  }'
```

## Method 2: Database Direct Insert

You can also create admin users directly in the database using Prisma:

```typescript
// In a script or seed file
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './server/auth';

const prisma = new PrismaClient();

async function createAdminUser() {
  const passwordHash = await hashPassword('Admin123!');
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@morocco.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        privacy: {
          profileVisible: true,
          showPhone: false,
          showEmail: false,
        },
      },
    },
  });
  
  console.log('Admin user created:', adminUser);
}

createAdminUser();
```

## Method 3: Update Existing User Role

You can also update an existing user's role to make them an admin:

```bash
# First, get the user's ID by email
curl -X GET "http://localhost:3001/api/auth/admin/users?search=user@example.com" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Then update the user's role (requires admin endpoint)
curl -X PATCH http://localhost:3001/api/auth/admin/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "role": "ADMIN"
  }'
```

## Admin Dashboard Features

Once you have admin users, they can access:

### Admin Dashboard (`/dashboard/admin`)
- 📊 Platform statistics (users, tours, bookings, revenue)
- ⚡ Quick actions (manage users, system settings, security logs)
- 📈 Recent activity monitoring
- ⚠️ System alerts and notifications

### User Management
- View all users with pagination and search
- Filter users by role and status
- Update user status (active, suspended, banned)
- View user profiles and activity

### System Management
- Platform analytics and reports
- Content moderation
- Security logs
- System configuration (Super Admin only)

## Security Notes

1. **Password Requirements**: Admin passwords must meet the same security standards (8+ chars, uppercase, lowercase, number, special char)
2. **Email Verification**: Admin users still need email verification unless manually set to verified
3. **Access Control**: Admin routes are protected with role-based middleware
4. **Audit Logging**: All admin actions are logged for security purposes

## Testing Admin Access

1. Create an admin user using one of the methods above
2. Login with the admin credentials
3. Navigate to `/dashboard/admin` to access the admin panel
4. Test user management and other admin features

## Default Admin Credentials (for testing)

If you want to create a default admin user for testing, you can add this to your seed script:

```typescript
// In prisma/seed.ts
const adminUser = await prisma.user.upsert({
  where: { email: 'admin@morocco.com' },
  update: {},
  create: {
    email: 'admin@morocco.com',
    passwordHash: await hashPassword('Admin123!'),
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    status: 'ACTIVE',
    emailVerified: true,
  },
});
```


