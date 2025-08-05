import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar, Loader2, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { HeritageItem, Region } from '@/lib/types';

export default function HeritageDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch heritage and regions data
  const { data: apiHeritages, isLoading: heritagesLoading, error: heritagesError } = useQuery({
    queryKey: ['heritages'],
    queryFn: apiService.getHeritages,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  // Transform API data
  const heritages = apiHeritages?.map(transformApiData.heritage) || [];
  const regions = apiRegions?.map(transformApiData.region) || [];

  // Find the specific heritage item and its regions
  const heritage = heritages.find(h => h.id === id);
  const heritageRegions = heritage ? regions.filter(r => heritage.regionIds.includes(r.id)) : [];

  // Loading state
  if (heritagesLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading heritage details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (heritagesError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Heritage</h1>
          <p className="text-slate-600 mb-6">There was an error loading the heritage data.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Heritage not found
  if (!heritage) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Heritage Not Found</h1>
          <p className="text-slate-600 mb-6">The heritage item you're looking for doesn't exist.</p>
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
      <section className="relative h-96 bg-gradient-to-r from-amber-600 to-amber-400">
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
              <Badge className="bg-amber-600 hover:bg-amber-700">
                {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{heritage.name}</h1>
            <div className="flex items-center text-white/80">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{heritageRegions.map(r => r.name).join(', ') || 'Morocco'}</span>
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
                  <TabsTrigger value="significance">Significance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {heritage.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{heritage.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                            <div>
                              <p className="font-medium">Regions</p>
                              <p className="text-sm text-slate-600">{heritageRegions.map(r => r.name).join(', ') || 'Morocco'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Award className="h-5 w-5 mr-2 text-amber-600" />
                            <div>
                              <p className="font-medium">Type</p>
                              <p className="text-sm text-slate-600">
                                {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="significance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cultural Significance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 leading-relaxed">{heritage.importance}</p>
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
                      {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Regions:</span>
                    <span className="font-medium">{heritageRegions.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">Best Time to Visit</p>
                      <p className="text-sm text-slate-600">Year-round</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">Visitor Type</p>
                      <p className="text-sm text-slate-600">Cultural Enthusiasts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">Photo Opportunities</p>
                      <p className="text-sm text-slate-600">Excellent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">Explore More Heritage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 