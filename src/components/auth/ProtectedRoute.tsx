import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionService } from '@/lib/auth/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  AlertTriangle, 
  Shield, 
  Lock,
  User,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2 text-red-500" />
              Authentication Required
            </CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button className="w-full" onClick={() => navigate('/login')}>
              <User className="w-4 h-4 mr-2" />
              Login to Continue
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-orange-500" />
              Insufficient Permissions
            </CardTitle>
            <CardDescription className="text-center">
              You don't have the required role to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Your Role: {PermissionService.getRoleDisplayName(user.role)}
              </Badge>
              <span className="text-gray-400">→</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Required: {PermissionService.getRoleDisplayName(requiredRole)}
              </Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !PermissionService.hasPermission(user.role, requiredPermission as any)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access this resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              <p>Required permission: <code className="bg-gray-100 px-2 py-1 rounded">{requiredPermission}</code></p>
              <p className="mt-2">Your role: <Badge variant="secondary" className="ml-1">{user.role}</Badge></p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If fallback is provided and user doesn't have permission, show fallback
  if (fallback && requiredPermission && !PermissionService.hasPermission(user.role, requiredPermission as any)) {
    return <>{fallback}</>;
  }

  // User has access, render children
  return <>{children}</>;
};

// Convenience components for different access levels
export const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="ADMIN">
    {children}
  </ProtectedRoute>
);

export const SuperAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="SUPER_ADMIN">
    {children}
  </ProtectedRoute>
);

export const GuideOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="GUIDE">
    {children}
  </ProtectedRoute>
);

export const TouristOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="TOURIST">
    {children}
  </ProtectedRoute>
);

export const RequirePermission: React.FC<{ 
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}> = ({ children, permission, fallback }) => (
  <ProtectedRoute requiredPermission={permission} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

// Default export for backward compatibility
export default ProtectedRoute;