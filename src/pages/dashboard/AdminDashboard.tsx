import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard as AdminDashboardComponent } from '@/components/dashboard/AdminDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardComponent user={user} />
    </ProtectedRoute>
  );
};

export default AdminDashboard;