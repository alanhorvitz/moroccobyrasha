import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionService } from '@/lib/auth/permissions';
import { ProtectedRouteProps } from '@/lib/types/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Required role: {requiredRole}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission) {
    const hasPermission = PermissionService.hasPermission(
      user.role,
      `${requiredPermission.resource}.${requiredPermission.action}` as `${string}.${string}`
    );

    if (!hasPermission) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to perform this action.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;