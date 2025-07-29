"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar, Map, Heart, Camera, Clock, ArrowLeft, ChevronRight,
  MapPin, Package, Star, User, MessageSquare, X, CalendarCheck, CircleDashed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';

// Mock data - in production these would come from API calls
const mockBookings = [
  {
    id: '101',
    tourId: '1',
    tourName: 'Marrakech City Highlights',
    guideName: 'Ahmed Hassan',
    date: '2024-08-15',
    time: '10:00 AM',
    participants: 2,
    status: 'confirmed',
    totalAmount: 100,
    image: '/images/Marrakech.jpg',
    location: 'Marrakech, Morocco',
  },
  {
    id: '102',
    tourId: '2',
    tourName: 'Fes Historical Tour',
    guideName: 'Fatima Zahra',
    date: '2024-09-20',
    time: '9:30 AM',
    participants: 3,
    status: 'pending',
    totalAmount: 195,
    image: '/images/Fes.jpg',
    location: 'Fes, Morocco',
  }
];

const mockSavedItems = [
  {
    id: '201',
    type: 'attraction',
    title: 'Jardin Majorelle',
    image: '/public/assets/attractions/jardin-majorelle.jpg',
    location: 'Marrakech, Morocco',
    rating: 4.8,
    savedDate: '2024-07-10'
  },
  {
    id: '202',
    type: 'tour',
    title: 'Sahara Desert Expedition',
    image: '/public/assets/tours/sahara.jpg',
    location: 'Merzouga, Morocco',
    rating: 4.9,
    savedDate: '2024-07-15',
    price: 150,
    duration: '2 days'
  },
  {
    id: '203',
    type: 'restaurant',
    title: 'Le Jardin',
    image: '/images/restaurant.jpg',
    location: 'Marrakech, Morocco',
    rating: 4.6,
    savedDate: '2024-07-18',
    cuisine: 'Moroccan, Mediterranean'
  }
];

const mockItinerary = {
  title: 'Morocco Adventure 2024',
  startDate: '2024-08-10',
  endDate: '2024-08-20',
  locations: ['Marrakech', 'Fes', 'Chefchaouen', 'Sahara Desert'],
  days: [
    {
      date: '2024-08-10',
      title: 'Arrive in Marrakech',
      activities: [
        { 
          time: '12:00 PM', 
          title: 'Airport Pickup',
          type: 'transport',
          details: 'Meet driver at Marrakech Menara Airport',
          status: 'booked'
        },
        { 
          time: '2:00 PM', 
          title: 'Check-in at Riad El Fenn',
          type: 'accommodation',
          details: 'Luxury riad in the Medina',
          status: 'booked'
        },
        { 
          time: '6:00 PM', 
          title: 'Dinner at Nomad',
          type: 'food',
          details: 'Modern Moroccan cuisine with rooftop views',
          status: 'planned'
        }
      ]
    },
    {
      date: '2024-08-11',
      title: 'Marrakech Medina Tour',
      activities: [
        { 
          time: '9:00 AM', 
          title: 'Marrakech City Highlights Tour',
          type: 'tour',
          details: 'Guided tour of main attractions',
          status: 'booked'
        },
        { 
          time: '1:00 PM', 
          title: 'Lunch at Le Jardin',
          type: 'food',
          details: 'Traditional Moroccan cuisine in garden setting',
          status: 'planned'
        },
        { 
          time: '3:00 PM', 
          title: 'Visit Jardin Majorelle',
          type: 'attraction',
          details: 'Explore the famous blue garden',
          status: 'planned'
        }
      ]
    },
    {
      date: '2024-08-12',
      title: 'Travel to Fes',
      activities: [
        { 
          time: '8:00 AM', 
          title: 'Depart for Fes',
          type: 'transport',
          details: 'Private transfer via the Middle Atlas',
          status: 'booked'
        },
        { 
          time: '1:00 PM', 
          title: 'Lunch in Ifrane',
          type: 'food',
          details: 'Stop in the "Switzerland of Morocco"',
          status: 'planned'
        },
        { 
          time: '5:00 PM', 
          title: 'Check-in at Riad Fes',
          type: 'accommodation',
          details: 'Traditional riad in Fes Medina',
          status: 'booked'
        }
      ]
    }
  ]
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'booked':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

// Activity Icon component for the itinerary
const ActivityIcon = ({ type }: { type: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'transport':
        return <Map className="h-4 w-4" />;
      case 'accommodation':
        return <User className="h-4 w-4" />;
      case 'food':
        return <MessageSquare className="h-4 w-4" />;
      case 'tour':
        return <Package className="h-4 w-4" />;
      case 'attraction':
        return <MapPin className="h-4 w-4" />;
      default:
        return <CircleDashed className="h-4 w-4" />;
    }
  };

  return (
    <div className={`p-1.5 rounded-full ${getIconColor()}`}>
      {getIcon()}
    </div>
  );
};

const getIconColor = (type?: string) => {
  switch (type) {
    case 'transport':
      return 'bg-blue-100 text-blue-700';
    case 'accommodation':
      return 'bg-purple-100 text-purple-700';
    case 'food':
      return 'bg-orange-100 text-orange-700';
    case 'tour':
      return 'bg-emerald-100 text-emerald-700';
    case 'attraction':
      return 'bg-pink-100 text-pink-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const TouristDashboard: React.FC = () => {
  const navigate = useRouter();
  const { user } = useAuth();
  
  const [selectedItinerary, setSelectedItinerary] = useState(mockItinerary);
  const [savedItems, setSavedItems] = useState(mockSavedItems);
  
  if (!user) {
    return null;
  }
  
  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Tourist Dashboard</h1>
      </div>
      
      <Tabs defaultValue="itinerary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="itinerary">My Itinerary</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>
        
        {/* Itinerary Tab */}
        <TabsContent value="itinerary">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <CardTitle>{selectedItinerary.title}</CardTitle>
                  <CardDescription>
                    {selectedItinerary.startDate} to {selectedItinerary.endDate} • 
                    {selectedItinerary.days.length} days
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex overflow-x-auto gap-4 pb-4">
                {selectedItinerary.locations.map((location, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="whitespace-nowrap py-1.5 px-3"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {location}
                  </Badge>
                ))}
              </div>
              
              <Accordion type="multiple" defaultValue={['0']} className="mt-4">
                {selectedItinerary.days.map((day, dayIndex) => (
                  <AccordionItem key={dayIndex} value={dayIndex.toString()}>
                    <AccordionTrigger>
                      <div className="flex flex-col items-start">
                        <div className="text-sm font-medium text-gray-500">
                          Day {dayIndex + 1} • {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-lg font-semibold">{day.title}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="border-l-2 border-gray-200 pl-6 ml-2 space-y-6">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="relative">
                            <div className="absolute -left-8 top-0 flex items-center justify-center">
                              <ActivityIcon type={activity.type} />
                            </div>
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                                  <span className="text-sm text-gray-500 font-medium">{activity.time}</span>
                                </div>
                                <h4 className="font-medium mt-1">{activity.title}</h4>
                                <p className="text-sm text-gray-600 mt-0.5">{activity.details}</p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <StatusBadge status={activity.status} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="flex items-center">
                View Full Itinerary
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>
                Manage your tour and activity reservations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {mockBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No bookings yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Explore our tours and activities to plan your perfect Morocco adventure.
                  </p>
                  <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate.push('/tourism')}>
                    Discover Tours
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-md overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gray-100 md:h-auto h-32 flex items-center justify-center">
                          <Map className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="p-4 md:p-6 flex flex-col justify-between w-full">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={booking.status} />
                                <span className="text-sm text-gray-500">Booking #{booking.id}</span>
                              </div>
                              <h3 className="text-xl font-semibold mt-2">{booking.tourName}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{booking.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-600">${booking.totalAmount}</div>
                              <div className="text-sm text-gray-500">{booking.participants} participants</div>
                            </div>
                          </div>
                          
                          <div className="border-t my-4" />
                          
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {booking.date} at {booking.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  Guide: {booking.guideName}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end">
                              {booking.status === 'pending' && (
                                <Button variant="destructive" size="sm">Cancel</Button>
                              )}
                              <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
                                {booking.status === 'confirmed' ? 'View Details' : 'Complete Payment'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Saved Items Tab */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Items</CardTitle>
              <CardDescription>
                Places and activities you've saved for later
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {savedItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No saved items</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Save your favorite attractions, tours, and restaurants to plan your trip.
                  </p>
                  <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate.push('/discover')}>
                    Discover Morocco
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative">
                        <div className="h-40 bg-gray-100 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <Badge className="absolute top-2 right-2 capitalize">
                          {item.type}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          onClick={() => handleRemoveSavedItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        
                        {item.type === 'tour' && (
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm text-gray-600">{item.duration}</div>
                            <div className="font-semibold">${item.price}</div>
                          </div>
                        )}
                        
                        {item.type === 'restaurant' && (
                          <div className="text-sm text-gray-600 mt-3">
                            {item.cuisine}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                          {item.type === 'tour' ? 'Book Now' : 'View Details'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="flex items-center">
                View All Saved Items
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TouristDashboard;