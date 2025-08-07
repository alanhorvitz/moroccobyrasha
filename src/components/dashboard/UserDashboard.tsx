import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Heart, 
  User,
  BookOpen,
  Star,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserDashboardProps {
  user: any;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const { hasPermission } = useAuth();

  const userStats = [
    {
      title: 'My Bookings',
      value: '3',
      change: '+1 this month',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saved Tours',
      value: '12',
      change: '+2 recently',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Reviews Given',
      value: '8',
      change: '+3 this year',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Days Traveled',
      value: '45',
      change: '+15 days',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      tour: 'Marrakech Desert Adventure',
      date: '2024-02-15',
      status: 'confirmed',
      price: '$299'
    },
    {
      id: 2,
      tour: 'Fez Cultural Experience',
      date: '2024-01-28',
      status: 'completed',
      price: '$199'
    },
    {
      id: 3,
      tour: 'Atlas Mountains Trek',
      date: '2024-01-10',
      status: 'completed',
      price: '$399'
    }
  ];

  const recommendedTours = [
    {
      id: 1,
      title: 'Chefchaouen Blue City',
      description: 'Explore the famous blue-washed buildings',
      price: '$249',
      rating: 4.8,
      image: '/images/chefchaouen.jpg'
    },
    {
      id: 2,
      title: 'Sahara Desert Camping',
      description: 'Overnight in the magical Sahara desert',
      price: '$349',
      rating: 4.9,
      image: '/images/sahara.jpg'
    },
    {
      id: 3,
      title: 'Essaouira Coastal Tour',
      description: 'Discover the charming coastal town',
      price: '$179',
      rating: 4.7,
      image: '/images/essaouira.jpg'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Tours',
      description: 'Discover new adventures',
      icon: MapPin,
      action: () => console.log('Browse tours'),
      permission: 'tours.read'
    },
    {
      title: 'My Bookings',
      description: 'View your upcoming trips',
      icon: Calendar,
      action: () => console.log('My bookings'),
      permission: 'bookings.read'
    },
    {
      title: 'Write Review',
      description: 'Share your experience',
      icon: Star,
      action: () => console.log('Write review'),
      permission: 'content.create'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account',
      icon: User,
      action: () => console.log('Update profile'),
      permission: 'profile.update'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600">Here's your travel dashboard and upcoming adventures.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <User className="w-4 h-4 mr-1" />
            {user?.role}
          </Badge>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common actions and shortcuts for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              hasPermission('tours', action.permission) && (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                  onClick={action.action}
                >
                  <action.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Bookings
          </CardTitle>
          <CardDescription>
            Your latest tour bookings and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.tour}</p>
                    <p className="text-sm text-gray-500">Date: {booking.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                    className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {booking.status}
                  </Badge>
                  <span className="font-medium text-gray-900">{booking.price}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Tours we think you'll love based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedTours.map((tour) => (
              <div key={tour.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg border">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{tour.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{tour.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tour.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{tour.price}</span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Status
          </CardTitle>
          <CardDescription>
            Your account information and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Account Verified</p>
                  <p className="text-xs text-green-600">Your email has been verified</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Login</p>
                <p className="font-medium">{new Date(user?.lastLogin).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 