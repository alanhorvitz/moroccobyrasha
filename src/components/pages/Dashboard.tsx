"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  ArrowRight, 
  UserCircle, 
  Users, 
  Map, 
  Calendar, 
  Briefcase
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useRouter();
  
  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'guide':
          router.push('/dashboard/guide');
          break;
        case 'tourist':
          router.push('/dashboard/tourist');
          break;
        default:
          // Default case, show the general dashboard
          break;
      }
    }
  }, [user, navigate]);
  
  // If we don't have a user, don't render anything
  if (!user) {
    return null;
  }
  
  // This is a fallback dashboard that shows different options based on user's role
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              View and update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full p-6">
                <UserCircle className="h-10 w-10 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push('/dashboard/profile')}
            >
              View Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, guides, and tourists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-full p-6">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                  <p className="text-gray-500">User statistics and management</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push('/dashboard/admin')}
              >
                Go to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {user.role === 'guide' && (
          <Card>
            <CardHeader>
              <CardTitle>Tour Management</CardTitle>
              <CardDescription>
                Manage your tours and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-6">
                  <Briefcase className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Guide Dashboard</h3>
                  <p className="text-gray-500">Tour statistics and bookings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push('/dashboard/guide')}
              >
                Go to Guide Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {user.role === 'tourist' && (
          <Card>
            <CardHeader>
              <CardTitle>My Itinerary</CardTitle>
              <CardDescription>
                View your travel plans and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 rounded-full p-6">
                  <Map className="h-10 w-10 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tourist Dashboard</h3>
                  <p className="text-gray-500">Itinerary and bookings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push('/dashboard/tourist')}
              >
                Go to Tourist Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      {/* Quick Actions Section */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 p-2"
          onClick={() => router.push('/dashboard/profile')}
        >
          <UserCircle className="h-8 w-8 mb-2" />
          <span>Edit Profile</span>
        </Button>
        
        {user.role === 'tourist' && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/tours')}
            >
              <Map className="h-8 w-8 mb-2" />
              <span>Discover Tours</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/dashboard/tourist')}
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span>My Bookings</span>
            </Button>
          </>
        )}
        
        {user.role === 'guide' && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/dashboard/guide')}
            >
              <Briefcase className="h-8 w-8 mb-2" />
              <span>Manage Tours</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/dashboard/guide')}
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span>View Bookings</span>
            </Button>
          </>
        )}
        
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/dashboard/admin')}
            >
              <Users className="h-8 w-8 mb-2" />
              <span>Manage Users</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => router.push('/dashboard/admin')}
            >
              <Map className="h-8 w-8 mb-2" />
              <span>Manage Tours</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;