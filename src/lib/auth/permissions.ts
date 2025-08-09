export const PERMISSIONS = {
  // User management
  'users.read': ['ADMIN', 'SUPER_ADMIN'],
  'users.create': ['ADMIN', 'SUPER_ADMIN'],
  'users.update': ['ADMIN', 'SUPER_ADMIN'],
  'users.delete': ['SUPER_ADMIN'],
  'users.suspend': ['ADMIN', 'SUPER_ADMIN'],

  // Tour management
  'tours.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'tours.create': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'tours.update': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'tours.delete': ['ADMIN', 'SUPER_ADMIN'],

  // Booking management
  'bookings.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'bookings.create': ['TOURIST'],
  'bookings.update': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'bookings.cancel': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],

  // Content management
  'content.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'content.create': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'content.update': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'content.delete': ['ADMIN', 'SUPER_ADMIN'],

  // Admin functions
  'admin.dashboard': ['ADMIN', 'SUPER_ADMIN'],
  'admin.analytics': ['ADMIN', 'SUPER_ADMIN'],
  'admin.settings': ['SUPER_ADMIN'],
  'admin.system': ['SUPER_ADMIN'],

  // Profile management
  'profile.read': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'profile.update': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'profile.delete': ['TOURIST', 'GUIDE', 'ADMIN', 'SUPER_ADMIN'],

  // Guide specific permissions
  'guide.tours': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'guide.bookings': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],
  'guide.reviews': ['GUIDE', 'ADMIN', 'SUPER_ADMIN'],

  // Tourist specific permissions
  'tourist.bookings': ['TOURIST'],
  'tourist.reviews': ['TOURIST'],
  'tourist.favorites': ['TOURIST'],

  // System permissions
  'system.logs': ['SUPER_ADMIN'],
  'system.backup': ['SUPER_ADMIN'],
  'system.security': ['SUPER_ADMIN'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export class PermissionService {
  static hasPermission(userRole: string, permission: Permission): boolean {
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles ? allowedRoles.includes(userRole as string) : false;
  }

  static getUserPermissions(userRole: string): Permission[] {
    return Object.keys(PERMISSIONS).filter(permission => 
      this.hasPermission(userRole, permission as Permission)
    ) as Permission[];
  }

  static canAccessRoute(userRole: string, route: string): boolean {
    const routePermissions: Record<string, Permission> = {
      '/dashboard/admin': 'admin.dashboard',
      '/dashboard/guide': 'guide.tours',
      '/dashboard/tourist': 'tourist.bookings',
      '/dashboard/profile': 'profile.read',
      '/admin/users': 'users.read',
      '/admin/analytics': 'admin.analytics',
      '/admin/settings': 'admin.settings',
      '/system/logs': 'system.logs',
    };

    const requiredPermission = routePermissions[route];
    return requiredPermission ? this.hasPermission(userRole, requiredPermission) : true;
  }

  static getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      'SUPER_ADMIN': 'Super Administrator',
      'ADMIN': 'Administrator',
      'GUIDE': 'Tour Guide',
      'TOURIST': 'Tourist',
    };
    return roleNames[role] || role;
  }

  static getRoleColor(role: string): string {
    const roleColors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-100 text-red-800',
      'ADMIN': 'bg-orange-100 text-orange-800',
      'GUIDE': 'bg-blue-100 text-blue-800',
      'TOURIST': 'bg-green-100 text-green-800',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  }

  static getRolePermissions(role: string): {
    canManageUsers: boolean;
    canManageTours: boolean;
    canManageBookings: boolean;
    canManageContent: boolean;
    canAccessAdminPanel: boolean;
    canAccessSystemSettings: boolean;
  } {
    return {
      canManageUsers: this.hasPermission(role, 'users.read'),
      canManageTours: this.hasPermission(role, 'tours.create'),
      canManageBookings: this.hasPermission(role, 'bookings.update'),
      canManageContent: this.hasPermission(role, 'content.create'),
      canAccessAdminPanel: this.hasPermission(role, 'admin.dashboard'),
      canAccessSystemSettings: this.hasPermission(role, 'admin.settings'),
    };
  }
}