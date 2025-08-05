import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Star, DollarSign, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { TourPackage, Region } from '@/lib/types';

export default function TourPackageDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch tour packages and regions data
  const { data: apiTourPackages, isLoading: tourPackagesLoading, error: tourPackagesError } = useQuery({
    queryKey: ['tour-packages'],
    queryFn: apiService.getTourPackages,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  // Transform API data
  const tourPackages = apiTourPackages?.map(transformApiData.tourPackage) || [];
  const regions = apiRegions?.map(transformApiData.region) || [];

  // Find the specific tour package and its region
  const tour = tourPackages.find(t => t.id === id);
  const region = tour ? regions.find(r => r.id === tour.regionId) : null;

  // Loading state
  if (tourPackagesLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading tour package details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (tourPackagesError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Tour Package</h1>
          <p className="text-slate-600 mb-6">There was an error loading the tour package data.</p>
          <Button asChild>
            <Link to="/tourism">Back to Tourism</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Tour package not found
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
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                            <div>
                              <p className="font-medium">Region</p>
                              <p className="text-sm text-slate-600">{region ? region.name : 'Morocco'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Star className="h-5 w-5 mr-2 text-emerald-600" />
                            <div>
                              <p className="font-medium">Type</p>
                              <p className="text-sm text-slate-600">{tour.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Detailed itinerary will be provided upon booking.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                        <ul className="space-y-2">
                          {tour.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-slate-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">What's Not Included</h3>
                        <ul className="space-y-2">
                          {tour.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-slate-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{tour.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price:</span>
                    <span className="font-medium">${tour.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">{tour.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Max Group:</span>
                    <span className="font-medium">{tour.maxParticipants} people</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Book This Tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    Contact Guide
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Similar Tours
                  </Button>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/tourism">Explore More Tours</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}