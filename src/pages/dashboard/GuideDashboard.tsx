import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboard as UserDashboardComponent } from '@/components/dashboard/UserDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const GuideDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="GUIDE">
      <UserDashboardComponent user={user} />
    </ProtectedRoute>
  );
};

export default GuideDashboard;