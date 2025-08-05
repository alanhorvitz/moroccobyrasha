export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

export class AuditLogger {
  private static logs: AuditLog[] = [];

  static log(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logEntry: AuditLog = {
      ...entry,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      timestamp: new Date(),
    };

    this.logs.unshift(logEntry);

    // Keep only the last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    // In a real implementation, you would send this to your backend
    console.log('Audit Log:', logEntry);
  }

  static getLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(filters.action!.toLowerCase())
      );
    }

    if (filters?.resource) {
      filteredLogs = filteredLogs.filter(log => 
        log.resource.toLowerCase().includes(filters.resource!.toLowerCase())
      );
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    const limit = filters?.limit || 100;
    return filteredLogs.slice(0, limit);
  }

  static seedDemoLogs(): void {
    if (this.logs.length > 0) return; // Don't seed if logs already exist

    const demoLogs: Omit<AuditLog, 'id' | 'timestamp'>[] = [
      {
        userId: '1',
        userName: 'Admin User',
        action: 'User Login',
        resource: 'Authentication',
        success: true,
        ipAddress: '192.168.1.1',
      },
      {
        userId: '2',
        userName: 'Tourist User',
        action: 'Profile Update',
        resource: 'User Profile',
        resourceId: '2',
        success: true,
        details: { fields: ['firstName', 'lastName'] },
      },
      {
        userId: '1',
        userName: 'Admin User',
        action: 'User Status Change',
        resource: 'User Management',
        resourceId: '3',
        success: true,
        details: { from: 'pending', to: 'active' },
      },
      {
        userId: '3',
        userName: 'Guide User',
        action: 'Tour Creation',
        resource: 'Tours',
        resourceId: 'tour-123',
        success: true,
        details: { tourName: 'Marrakech City Tour' },
      },
      {
        action: 'Failed Login Attempt',
        resource: 'Authentication',
        success: false,
        ipAddress: '192.168.1.100',
        details: { email: 'suspicious@example.com' },
      }
    ];

    demoLogs.forEach((log, index) => {
      const logEntry: AuditLog = {
        ...log,
        id: `demo-${index}`,
        timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)), // 2 hours apart
      };
      this.logs.push(logEntry);
    });
  }

  // Convenience methods for common actions
  static logUserAction(userId: string, userName: string, action: string, resource: string, details?: Record<string, unknown>): void {
    this.log({
      userId,
      userName,
      action,
      resource,
      details,
      success: true,
    });
  }

  static logFailedAction(action: string, resource: string, details?: Record<string, unknown>, userId?: string): void {
    this.log({
      userId,
      action,
      resource,
      details,
      success: false,
    });
  }

  static logSecurityEvent(event: string, details?: Record<string, unknown>, userId?: string): void {
    this.log({
      userId,
      action: event,
      resource: 'Security',
      details,
      success: false,
    });
  }
}