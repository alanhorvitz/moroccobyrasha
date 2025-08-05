import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Star, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { tourPackages } from '@/lib/data/tour-packages';
import { moroccanRegions as regions } from '@/lib/data/regions';
import { TourPackage, Region } from '@/lib/types';

export default function TourPackageDetail() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (id) {
      const foundTour = tourPackages.find(t => t.id === id);
      setTour(foundTour || null);
      
      if (foundTour) {
        const foundRegion = regions.find(r => r.id === foundTour.regionId);
        setRegion(foundRegion || null);
      }
    }
  }, [id]);

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tour Package Not Found</h1>
          <p className="text-slate-600 mb-6">The tour package you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/tourism">Back to Tourism</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-6 bg-white/10 border-white text-white hover:bg-white/20">
              <Link to="/tourism">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tourism
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-emerald-600 hover:bg-emerald-700">{tour.type}</Badge>
              {tour.featured && (
                <Badge variant="outline" className="bg-white/80 border-0">Featured</Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{tour.title}</h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>${tour.price} per person</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Max {tour.maxParticipants} people</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{tour.description}</p>
                      
                      {tour.highlights && tour.highlights.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Tour Highlights</h3>
                            <ul className="space-y-2">
                              {tour.highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-slate-600">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tour.itinerary && tour.itinerary.length > 0 ? (
                        <div className="space-y-6">
                          {tour.itinerary.map((day: { title: string; description: string; activities?: string[] }, index: number) => (
                            <div key={index} className="border-l-4 border-emerald-600 pl-6 pb-6">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold -ml-10 mr-4">
                                  {index + 1}
                                </div>
                                <h3 className="text-lg font-semibold">{day.title}</h3>
                              </div>
                              <p className="text-slate-600">{day.description}</p>
                              {day.activities && day.activities.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {day.activities.map((activity: string, actIndex: number) => (
                                    <li key={actIndex} className="text-sm text-slate-500 ml-4">
                                      • {activity}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500">Detailed itinerary will be provided upon booking.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">What's Included</h3>
                          <ul className="space-y-2">
                            {tour.included && tour.included.length > 0 ? (
                              tour.included.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-slate-600 text-sm">{item}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-slate-500 text-sm">Details available upon inquiry</li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3">What's Not Included</h3>
                          <ul className="space-y-2">
                            {tour.excluded && tour.excluded.length > 0 ? (
                              tour.excluded.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-slate-600 text-sm">{item}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-slate-500 text-sm">Details available upon inquiry</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-3">Important Notes</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li>• Minimum 2 people required for tour confirmation</li>
                          <li>• Prices may vary during peak seasons</li>
                          <li>• Tours are subject to weather conditions</li>
                          <li>• Cancellation policy applies - contact for details</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Tour</span>
                    <span className="text-2xl font-bold text-emerald-600">${tour.price}</span>
                  </CardTitle>
                  <CardDescription>Per person</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-medium">{tour.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Max Group:</span>
                      <span className="font-medium">{tour.maxParticipants} people</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tour Type:</span>
                      <span className="font-medium">{tour.type}</span>
                    </div>
                  </div>
                  <Separator />
                  <Button className="w-full">Book Now</Button>
                  <Button variant="outline" className="w-full">Request Quote</Button>
                </CardContent>
              </Card>
              
              {/* Region Info */}
              {region && (
                <Card>
                  <CardHeader>
                    <CardTitle>About {region.name}</CardTitle>
                    <CardDescription>Explore this region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 line-clamp-3 mb-4">{region.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capital:</span>
                        <span className="font-medium">{region.capital}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Climate:</span>
                        <span className="font-medium">{region.climate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/regions/${region.id}`}>Explore Region</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/services">Find Guide</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/services">Transport Services</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}