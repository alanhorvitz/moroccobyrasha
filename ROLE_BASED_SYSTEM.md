# Role-Based Access Control System

## Overview

The Morocco Tourism Platform now implements a comprehensive role-based access control (RBAC) system that provides different dashboards and functionality based on user roles. This system ensures security and provides appropriate interfaces for different user types.

## User Roles

### 1. **TOURIST** (Default Role)
- **Purpose**: Regular users who book tours and explore Morocco
- **Dashboard**: User-friendly dashboard with limited functionality
- **Permissions**:
  - ✅ Browse tours and attractions
  - ✅ Book tours and manage bookings
  - ✅ Write reviews and ratings
  - ✅ Save favorite tours
  - ✅ Update personal profile
  - ❌ Manage other users
  - ❌ Create tours
  - ❌ Access admin features

### 2. **GUIDE** (Tour Guide)
- **Purpose**: Professional tour guides who create and manage tours
- **Dashboard**: Enhanced dashboard with tour management
- **Permissions**:
  - ✅ All tourist permissions
  - ✅ Create and manage tours
  - ✅ Manage bookings for their tours
  - ✅ Respond to reviews
  - ✅ Access guide-specific analytics
  - ❌ Manage other users
  - ❌ Access admin panel

### 3. **ADMIN** (Administrator)
- **Purpose**: Platform administrators with user management capabilities
- **Dashboard**: Full admin dashboard with comprehensive controls
- **Permissions**:
  - ✅ All guide permissions
  - ✅ Manage all users
  - ✅ View platform analytics
  - ✅ Moderate content
  - ✅ Manage tours and bookings
  - ✅ Access admin panel
  - ❌ System-level settings
  - ❌ Database management

### 4. **SUPER_ADMIN** (Super Administrator)
- **Purpose**: System administrators with full platform control
- **Dashboard**: Complete admin dashboard with system management
- **Permissions**:
  - ✅ All admin permissions
  - ✅ System-level settings
  - ✅ Database management
  - ✅ Security logs
  - ✅ Platform configuration
  - ✅ User role management

## Dashboard Features by Role

### Tourist Dashboard
```
📊 Personal Stats
├── My Bookings (3)
├── Saved Tours (12)
├── Reviews Given (8)
└── Days Traveled (45)

🎯 Quick Actions
├── Browse Tours
├── My Bookings
├── Write Review
└── Update Profile

📅 Recent Bookings
├── Marrakech Desert Adventure
├── Fez Cultural Experience
└── Atlas Mountains Trek

💝 Recommended Tours
├── Chefchaouen Blue City
├── Sahara Desert Camping
└── Essaouira Coastal Tour

👤 Account Status
├── Email Verified
├── Member Since
├── Last Login
└── Account Type
```

### Admin Dashboard
```
📊 Platform Stats
├── Total Users (1,234)
├── Active Tours (89)
├── Bookings Today (156)
└── Revenue ($45,678)

⚡ Quick Actions
├── Manage Users
├── System Settings
├── Security Logs
└── Analytics

📈 Recent Activity
├── New user registration
├── Tour booking completed
├── Guide profile updated
└── Payment received

⚠️ System Alerts
├── Database backup due
└── Security update available
```

## Permission System

### Permission Structure
```typescript
// User Management
'users.read': ['ADMIN', 'SUPER_ADMIN']
'users.create': ['ADMIN', 'SUPER_ADMIN']
'users.update': ['ADMIN', 'SUPER_ADMIN']
'users.delete': ['SUPER_ADMIN']
'users.suspend': ['ADMIN', 'SUPER_ADMIN']

// Tour Management
'tours.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN']
'tours.create': ['GUIDE', 'ADMIN', 'SUPER_ADMIN']
'tours.update': ['GUIDE', 'ADMIN', 'SUPER_ADMIN']
'tours.delete': ['ADMIN', 'SUPER_ADMIN']

// Booking Management
'bookings.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN']
'bookings.create': ['TOURIST']
'bookings.update': ['GUIDE', 'ADMIN', 'SUPER_ADMIN']
'bookings.cancel': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN']

// Admin Functions
'admin.dashboard': ['ADMIN', 'SUPER_ADMIN']
'admin.analytics': ['ADMIN', 'SUPER_ADMIN']
'admin.settings': ['SUPER_ADMIN']
'admin.system': ['SUPER_ADMIN']
```

## Components Structure

### Dashboard Components
```
src/components/dashboard/
├── Dashboard.tsx          # Main dashboard router
├── AdminDashboard.tsx     # Admin dashboard
└── UserDashboard.tsx      # User dashboard
```

### Authentication Components
```
src/components/auth/
├── ProtectedRoute.tsx     # Route protection
├── AdminOnly.tsx         # Admin-only wrapper
├── SuperAdminOnly.tsx    # Super admin wrapper
├── GuideOnly.tsx         # Guide-only wrapper
└── TouristOnly.tsx       # Tourist-only wrapper
```

### Admin Components
```
src/components/admin/
└── UserManagement.tsx    # User management interface
```

## Usage Examples

### Protecting Routes
```tsx
// Admin-only route
<AdminOnly>
  <UserManagement />
</AdminOnly>

// Permission-based route
<RequirePermission permission="users.read">
  <UserList />
</RequirePermission>

// Role-based route
<ProtectedRoute requiredRole="GUIDE">
  <TourManagement />
</ProtectedRoute>
```

### Checking Permissions in Components
```tsx
const { hasPermission } = useAuth();

// Check if user can manage users
if (hasPermission('admin', 'users.read')) {
  // Show user management features
}

// Check if user can create tours
if (hasPermission('tours', 'tours.create')) {
  // Show tour creation form
}
```

### Role-Based UI Rendering
```tsx
const { user } = useAuth();

// Show different content based on role
{user.role === 'ADMIN' && <AdminPanel />}
{user.role === 'GUIDE' && <GuidePanel />}
{user.role === 'TOURIST' && <TouristPanel />}
```

## Database Integration

### User Model with Roles
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  role ENUM('TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'TOURIST',
  status ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED') DEFAULT 'PENDING',
  emailVerified BOOLEAN DEFAULT FALSE,
  -- ... other fields
);
```

### Role-Based Queries
```typescript
// Get users by role
const admins = await prisma.user.findMany({
  where: { role: 'ADMIN' }
});

// Get users with specific permissions
const canManageUsers = await prisma.user.findMany({
  where: {
    role: { in: ['ADMIN', 'SUPER_ADMIN'] }
  }
});
```

## Security Features

### 1. **Route Protection**
- Automatic redirection for unauthorized access
- Clear error messages explaining access requirements
- Graceful fallbacks for missing permissions

### 2. **Permission Validation**
- Server-side permission checks
- Client-side permission validation
- Real-time permission updates

### 3. **Role-Based UI**
- Different dashboards for each role
- Conditional rendering based on permissions
- Appropriate feature sets for each user type

### 4. **Access Control**
- JWT tokens with role information
- Automatic token refresh
- Secure logout and session management

## Testing Different Roles

### Create Test Users
```bash
# Create admin user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'

# Create guide user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guide@test.com",
    "password": "Guide123!",
    "firstName": "Ahmed",
    "lastName": "Guide",
    "role": "GUIDE"
  }'

# Create tourist user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tourist@test.com",
    "password": "Tourist123!",
    "firstName": "Sarah",
    "lastName": "Tourist",
    "role": "TOURIST"
  }'
```

### Test Dashboard Access
1. **Login as Tourist**: Limited dashboard with booking features
2. **Login as Guide**: Enhanced dashboard with tour management
3. **Login as Admin**: Full admin dashboard with user management
4. **Login as Super Admin**: Complete system control

## Best Practices

### 1. **Always Check Permissions**
```tsx
// Good: Check permission before rendering
{hasPermission('admin', 'users.read') && <UserManagement />}

// Bad: Rely only on role
{user.role === 'ADMIN' && <UserManagement />}
```

### 2. **Use Protected Routes**
```tsx
// Good: Use protected route wrapper
<ProtectedRoute requiredPermission="users.read">
  <UserManagement />
</ProtectedRoute>
```

### 3. **Provide Clear Feedback**
```tsx
// Good: Show why access is denied
<Card>
  <CardTitle>Access Denied</CardTitle>
  <CardDescription>
    You need ADMIN role to access this page.
  </CardDescription>
</Card>
```

### 4. **Graceful Degradation**
```tsx
// Good: Show alternative content
<RequirePermission 
  permission="admin.dashboard" 
  fallback={<UserDashboard />}
>
  <AdminDashboard />
</RequirePermission>
```

## Future Enhancements

### 1. **Advanced Permissions**
- [ ] Granular permission system
- [ ] Custom permission groups
- [ ] Time-based permissions
- [ ] Location-based access

### 2. **Role Management**
- [ ] Admin role assignment interface
- [ ] Role hierarchy management
- [ ] Temporary role assignments
- [ ] Role-based notifications

### 3. **Analytics & Monitoring**
- [ ] Permission usage analytics
- [ ] Access pattern monitoring
- [ ] Security audit logs
- [ ] Role performance metrics

### 4. **Enhanced Security**
- [ ] Multi-factor authentication
- [ ] Session management
- [ ] IP-based restrictions
- [ ] Advanced threat detection

The role-based system provides a secure, scalable foundation for the Morocco Tourism Platform, ensuring each user type has appropriate access and functionality while maintaining platform security and integrity. 