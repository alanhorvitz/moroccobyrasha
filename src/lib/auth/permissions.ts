export const PERMISSIONS = {
  // User management
  'users.read': ['admin', 'super_admin'],
  'users.create': ['admin', 'super_admin'],
  'users.update': ['admin', 'super_admin'],
  'users.delete': ['super_admin'],
  'users.suspend': ['admin', 'super_admin'],

  // Tour management
  'tours.read': ['tourist', 'guide', 'admin', 'super_admin'],
  'tours.create': ['guide', 'admin', 'super_admin'],
  'tours.update': ['guide', 'admin', 'super_admin'],
  'tours.delete': ['admin', 'super_admin'],

  // Booking management
  'bookings.read': ['tourist', 'guide', 'admin', 'super_admin'],
  'bookings.create': ['tourist'],
  'bookings.update': ['guide', 'admin', 'super_admin'],
  'bookings.cancel': ['tourist', 'guide', 'admin', 'super_admin'],

  // Content management
  'content.read': ['tourist', 'guide', 'admin', 'super_admin'],
  'content.create': ['guide', 'admin', 'super_admin'],
  'content.update': ['guide', 'admin', 'super_admin'],
  'content.delete': ['admin', 'super_admin'],

  // Admin functions
  'admin.dashboard': ['admin', 'super_admin'],
  'admin.analytics': ['admin', 'super_admin'],
  'admin.settings': ['super_admin'],

  // Profile management
  'profile.read': ['tourist', 'guide', 'admin', 'super_admin'],
  'profile.update': ['tourist', 'guide', 'admin', 'super_admin'],
  'profile.delete': ['tourist', 'guide', 'admin', 'super_admin'],
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
      '/dashboard/guide': 'tours.create',
      '/dashboard/tourist': 'bookings.read',
      '/dashboard/profile': 'profile.read',
    };

    const requiredPermission = routePermissions[route];
    return requiredPermission ? this.hasPermission(userRole, requiredPermission) : true;
  }
}