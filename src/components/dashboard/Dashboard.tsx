import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Shield, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full">
              <User className="w-4 h-4 mr-2" />
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    const userRole = user.role as string;
    
    switch (userRole) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return <AdminDashboard user={user} />;
      
      case 'TOURIST':
      case 'GUIDE':
      default:
        return <UserDashboard user={user} />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrator';
      case 'ADMIN':
        return 'Administrator';
      case 'GUIDE':
        return 'Tour Guide';
      case 'TOURIST':
        return 'Tourist';
      default:
        return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    return role === 'ADMIN' || role === 'SUPER_ADMIN' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Role Badge */}
      <div className="mb-6 flex justify-end">
        <Badge 
          variant="secondary" 
          className={getRoleBadgeClass(user.role as string)}
        >
          <Shield className="w-4 h-4 mr-1" />
          {getRoleDisplayName(user.role as string)}
        </Badge>
      </div>

      {/* Render appropriate dashboard */}
      {renderDashboard()}
    </div>
  );
}; 