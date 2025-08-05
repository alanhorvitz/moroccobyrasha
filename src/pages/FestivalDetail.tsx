import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar, Loader2, Music } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { FestivalEvent, Region } from '@/lib/types';

export default function FestivalDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch festivals and regions data
  const { data: apiFestivals, isLoading: festivalsLoading, error: festivalsError } = useQuery({
    queryKey: ['festivals'],
    queryFn: apiService.getFestivals,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  // Transform API data
  const festivals = apiFestivals?.map(transformApiData.festival) || [];
  const regions = apiRegions?.map(transformApiData.region) || [];

  // Find the specific festival and its region
  const festival = festivals.find(f => f.id === id);
  const region = festival && festival.regionId !== 'all' ? regions.find(r => r.id === festival.regionId) : null;

  // Loading state
  if (festivalsLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading festival details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (festivalsError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Festival</h1>
          <p className="text-slate-600 mb-6">There was an error loading the festival data.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Festival not found
  if (!festival) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Festival Not Found</h1>
          <p className="text-slate-600 mb-6">The festival you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-pink-600 to-pink-400">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-6 bg-white/10 border-white text-white hover:bg-white/20">
              <Link to="/discover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-pink-600 hover:bg-pink-700">
                {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{festival.name}</h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{festival.location} {region && `(${region.name})`}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{festival.timeOfYear}</span>
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {festival.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{festival.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-sm text-slate-600">{festival.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Music className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">Type</p>
                              <p className="text-sm text-slate-600">
                                {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">Time of Year</p>
                              <p className="text-sm text-slate-600">{festival.timeOfYear}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="text-sm text-slate-600">{festival.duration} {festival.duration > 1 ? 'days' : 'day'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historical Significance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {festival.historicalSignificance ? (
                        <p className="text-slate-600 leading-relaxed">{festival.historicalSignificance}</p>
                      ) : (
                        <p className="text-slate-600">Historical information will be available soon.</p>
                      )}
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
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">
                      {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-medium">{festival.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time of Year:</span>
                    <span className="font-medium">{festival.timeOfYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{festival.duration} {festival.duration > 1 ? 'days' : 'day'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Festival Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">Best Time to Visit</p>
                      <p className="text-sm text-slate-600">{festival.timeOfYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">Visitor Type</p>
                      <p className="text-sm text-slate-600">All Ages</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">Photo Opportunities</p>
                      <p className="text-sm text-slate-600">Excellent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">Explore More Festivals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 