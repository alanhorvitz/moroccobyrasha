import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar, Loader2, Utensils, Flame } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { CuisineItem, Region } from '@/lib/types';

export default function CuisineDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch cuisine and regions data
  const { data: apiCuisines, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
    queryKey: ['cuisines'],
    queryFn: apiService.getCuisines,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  // Transform API data
  const cuisineItems = apiCuisines?.map(transformApiData.cuisine) || [];
  const regions = apiRegions?.map(transformApiData.region) || [];

  // Find the specific cuisine item and its regions
  const cuisine = cuisineItems.find(c => c.id === id);
  const cuisineRegions = cuisine ? regions.filter(r => cuisine.regionIds.includes(r.id)) : [];

  // Loading state
  if (cuisinesLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading cuisine details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cuisinesError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Cuisine</h1>
          <p className="text-slate-600 mb-6">There was an error loading the cuisine data.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Cuisine not found
  if (!cuisine) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cuisine Not Found</h1>
          <p className="text-slate-600 mb-6">The cuisine item you're looking for doesn't exist.</p>
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
      <section className="relative h-96 bg-gradient-to-r from-orange-600 to-orange-400">
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
              <Badge className="bg-orange-600 hover:bg-orange-700">
                {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
              {cuisine.spiceLevel !== 'none' && (
                <Badge variant="outline" className="bg-white/80 border-0">
                  {cuisine.spiceLevel.charAt(0).toUpperCase() + cuisine.spiceLevel.slice(1)} Spice
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{cuisine.name}</h1>
            <div className="flex items-center text-white/80">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{cuisineRegions.map(r => r.name).join(', ') || 'Morocco'}</span>
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
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {cuisine.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{cuisine.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                            <div>
                              <p className="font-medium">Regions</p>
                              <p className="text-sm text-slate-600">{cuisineRegions.map(r => r.name).join(', ') || 'Morocco'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Flame className="h-5 w-5 mr-2 text-orange-600" />
                            <div>
                              <p className="font-medium">Spice Level</p>
                              <p className="text-sm text-slate-600 capitalize">{cuisine.spiceLevel}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ingredients" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ingredients & Variants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Ingredients</h3>
                        <div className="flex flex-wrap gap-2">
                          {cuisine.ingredients.map((ingredient, index) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {ingredient.split('-').join(' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {cuisine.popularVariants && cuisine.popularVariants.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Popular Variants</h3>
                            <div className="flex flex-wrap gap-2">
                              {cuisine.popularVariants.map((variant, index) => (
                                <Badge key={index} variant="secondary" className="capitalize">
                                  {variant}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
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
                      {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Regions:</span>
                    <span className="font-medium">{cuisineRegions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Spice Level:</span>
                    <span className="font-medium capitalize">{cuisine.spiceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ingredients:</span>
                    <span className="font-medium">{cuisine.ingredients.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">Explore More Cuisine</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 