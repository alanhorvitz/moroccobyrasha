import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar, Map, Users, Star, Package, MessageSquare, Clock, 
  PlusCircle, Edit, Trash, ArrowLeft, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

// Mock data - in production these would come from API calls
const mockTours = [
  {
    id: '1',
    title: 'Marrakech City Highlights',
    status: 'active',
    bookings: 12,
    rating: 4.8,
    image: '/images/Marrakech.jpg',
    price: 50,
    duration: '3 hours',
    date: '2024-08-15',
    city: 'Marrakech'
  },
  {
    id: '2',
    title: 'Fes Historical Tour',
    status: 'active',
    bookings: 8,
    rating: 4.7,
    image: '/images/Fes.jpg',
    price: 65,
    duration: '4 hours',
    date: '2024-08-18',
    city: 'Fes'
  },
  {
    id: '3',
    title: 'Casablanca Modern Architecture',
    status: 'draft',
    bookings: 0,
    rating: 0,
    image: '/images/ModernArchitecture.jpg',
    price: 40,
    duration: '2.5 hours',
    date: '2024-08-20',
    city: 'Casablanca'
  }
];

const mockBookings = [
  {
    id: '101',
    tourId: '1',
    tourName: 'Marrakech City Highlights',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    date: '2024-07-28',
    time: '10:00 AM',
    participants: 2,
    status: 'confirmed',
    totalAmount: 100
  },
  {
    id: '102',
    tourId: '1',
    tourName: 'Marrakech City Highlights',
    customerName: 'Emily Chen',
    customerEmail: 'emily@example.com',
    date: '2024-07-29',
    time: '10:00 AM',
    participants: 4,
    status: 'confirmed',
    totalAmount: 200
  },
  {
    id: '103',
    tourId: '2',
    tourName: 'Fes Historical Tour',
    customerName: 'Mohammed Al-Farsi',
    customerEmail: 'mohammed@example.com',
    date: '2024-07-30',
    time: '9:30 AM',
    participants: 3,
    status: 'pending',
    totalAmount: 195
  }
];

const mockReviews = [
  {
    id: '201',
    tourId: '1',
    tourName: 'Marrakech City Highlights',
    customerName: 'Laura Wilson',
    rating: 5,
    comment: 'Amazing tour! Our guide was very knowledgeable and showed us hidden gems in Marrakech.',
    date: '2024-07-20'
  },
  {
    id: '202',
    tourId: '1',
    tourName: 'Marrakech City Highlights',
    customerName: 'Mark Johnson',
    rating: 4,
    comment: 'Great experience overall, learned a lot about the history of Marrakech.',
    date: '2024-07-15'
  },
  {
    id: '203',
    tourId: '2',
    tourName: 'Fes Historical Tour',
    customerName: 'Sophie Bennett',
    rating: 5,
    comment: 'The best tour I\'ve had in Morocco! Our guide was fantastic and showed us all the best spots.',
    date: '2024-07-18'
  }
];

// Star Rating component for reviews
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const GuideDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  
  if (!user) {
    return null;
  }
  
  // Calculate earnings and stats
  const totalEarnings = mockBookings
    .filter(booking => booking.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
    
  const totalBookings = mockBookings.length;
  const confirmedBookings = mockBookings.filter(booking => booking.status === 'confirmed').length;
  const pendingBookings = mockBookings.filter(booking => booking.status === 'pending').length;
  
  const averageRating = mockReviews.length > 0 
    ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length 
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Tour Guide Dashboard</h1>
      </div>
      
      {/* Guide Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600">${totalEarnings}</div>
            <p className="text-gray-500 text-sm mt-1">From {confirmedBookings} confirmed bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600">{mockTours.length}</div>
            <p className="text-gray-500 text-sm mt-1">
              {mockTours.filter(tour => tour.status === 'active').length} active tours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600">{totalBookings}</div>
            <p className="text-gray-500 text-sm mt-1">
              {pendingBookings} pending, {confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-emerald-600 mr-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              From {mockReviews.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="tours">My Tours</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Tours Tab */}
        <TabsContent value="tours">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Tours</CardTitle>
                <CardDescription>
                  Manage your tour offerings
                </CardDescription>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Tour
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {mockTours.map((tour) => (
                  <div key={tour.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                    <div className="w-full md:w-32 h-24 bg-gray-100 rounded-md flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Map className="h-8 w-8" />
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{tour.title}</h3>
                          <p className="text-sm text-gray-500">{tour.city} • {tour.duration}</p>
                        </div>
                        <StatusBadge status={tour.status} />
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{tour.bookings} bookings</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{tour.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">${tour.price} per person</span>
                        </div>
                        
                        {tour.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">{tour.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Tour</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{tour.title}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Delete Tour</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="flex items-center">
                View All Tours
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                Manage your tour bookings and reservations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-md">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold">{booking.tourName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{booking.date} at {booking.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{booking.participants} participants</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{booking.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span>{booking.customerEmail}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                        <div className="text-xl font-bold text-emerald-600">${booking.totalAmount}</div>
                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="flex items-center">
                View All Bookings
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                See what people are saying about your tours
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">{averageRating.toFixed(1)}</div>
                      <StarRating rating={averageRating} />
                    </div>
                    <div className="flex-grow">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = mockReviews.filter(review => review.rating === star).length;
                          const percentage = mockReviews.length > 0 ? (count / mockReviews.length) * 100 : 0;
                          
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <div className="w-12 text-sm text-gray-600">{star} stars</div>
                              <Progress value={percentage} className="h-2" />
                              <div className="text-xs text-gray-500 w-8">{count}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      Great job! Your average rating is above 4.5 stars. Keep up the good work!
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="font-semibold">{review.customerName}</div>
                          <div className="text-sm text-gray-500">{review.tourName}</div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-gray-500">{review.date}</div>
                        <Button variant="ghost" size="sm">Reply</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideDashboard;