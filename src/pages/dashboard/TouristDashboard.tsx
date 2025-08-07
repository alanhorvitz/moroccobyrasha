import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboard as UserDashboardComponent } from '@/components/dashboard/UserDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const TouristDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="TOURIST">
      <UserDashboardComponent user={user} />
    </ProtectedRoute>
  );
};

export default TouristDashboard;