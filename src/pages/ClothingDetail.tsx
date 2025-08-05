import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar, Loader2, Shirt } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { ClothingItem, Region } from '@/lib/types';

export default function ClothingDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch clothing and regions data
  const { data: apiClothing, isLoading: clothingLoading, error: clothingError } = useQuery({
    queryKey: ['clothing'],
    queryFn: apiService.getClothing,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  // Transform API data
  const clothingItems = apiClothing?.map(transformApiData.clothing) || [];
  const regions = apiRegions?.map(transformApiData.region) || [];

  // Find the specific clothing item and its regions
  const clothing = clothingItems.find(c => c.id === id);
  const clothingRegions = clothing ? regions.filter(r => clothing.regionIds.includes(r.id)) : [];

  // Loading state
  if (clothingLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading clothing details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (clothingError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Clothing</h1>
          <p className="text-slate-600 mb-6">There was an error loading the clothing data.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Clothing not found
  if (!clothing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Clothing Not Found</h1>
          <p className="text-slate-600 mb-6">The clothing item you're looking for doesn't exist.</p>
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
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-purple-400">
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
              <Badge className="bg-purple-600 hover:bg-purple-700 capitalize">
                {clothing.gender}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{clothing.name}</h1>
            <div className="flex items-center text-white/80">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{clothingRegions.map(r => r.name).join(', ') || 'Morocco'}</span>
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
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {clothing.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{clothing.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                            <div>
                              <p className="font-medium">Regions</p>
                              <p className="text-sm text-slate-600">{clothingRegions.map(r => r.name).join(', ') || 'Morocco'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Shirt className="h-5 w-5 mr-2 text-purple-600" />
                            <div>
                              <p className="font-medium">Gender</p>
                              <p className="text-sm text-slate-600 capitalize">{clothing.gender}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="materials" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Materials & Occasions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Materials Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {clothing.materials.map((material, index) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Occasions</h3>
                        <div className="flex flex-wrap gap-2">
                          {clothing.occasions.map((occasion, index) => (
                            <Badge key={index} variant="secondary" className="capitalize">
                              {occasion}
                            </Badge>
                          ))}
                        </div>
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
                    <span className="text-slate-600">Gender:</span>
                    <span className="font-medium capitalize">{clothing.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Regions:</span>
                    <span className="font-medium">{clothingRegions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Materials:</span>
                    <span className="font-medium">{clothing.materials.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Occasions:</span>
                    <span className="font-medium">{clothing.occasions.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">Explore More Clothing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 