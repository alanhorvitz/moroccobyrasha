import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Thermometer, Users, Camera, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, transformApiData } from '@/lib/api';
import { Region, Attraction } from '@/lib/types';

export default function RegionDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch regions and attractions data
  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  const { data: apiAttractions, isLoading: attractionsLoading, error: attractionsError } = useQuery({
    queryKey: ['attractions'],
    queryFn: apiService.getAttractions,
  });

  // Transform API data
  const regions = apiRegions?.map(transformApiData.region) || [];
  const attractions = apiAttractions?.map(transformApiData.attraction) || [];

  // Find the specific region and its attractions
  const region = regions.find(r => r.id === id);
  const regionAttractions = attractions.filter(a => a.regionId === id);

  // Loading state
  if (regionsLoading || attractionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading region details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (regionsError || attractionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Region</h1>
          <p className="text-slate-600 mb-6">There was an error loading the region data.</p>
          <Button asChild>
            <Link to="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Region not found
  if (!region) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Region Not Found</h1>
          <p className="text-slate-600 mb-6">The region you're looking for doesn't exist.</p>
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
      <section className="relative h-96 bg-gradient-to-r from-emerald-600 to-emerald-400">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-6 bg-white/10 border-white text-white hover:bg-white/20">
              <Link to="/discover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Link>
            </Button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{region.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{region.description}</p>
            <div className="flex items-center mt-4 text-white/80">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Capital: {region.capital}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Region Info */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Attractions</h3>
                <p className="text-slate-600">{regionAttractions.length} places</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Climate</h3>
                <p className="text-slate-600">Mediterranean</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Best Time to Visit</h3>
                <p className="text-slate-600">Spring & Fall</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Experience</h3>
                <p className="text-slate-600">Cultural & Historical</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="attractions" className="w-full">
            <TabsList className="grid w-full md:w-96 grid-cols-2">
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attractions" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Attractions in {region.name}</h2>
                <p className="text-slate-600">Discover the must-visit places in this region</p>
              </div>
              
              {regionAttractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regionAttractions.map((attraction) => (
                    <Card key={attraction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-slate-200">
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.type}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{attraction.name}</CardTitle>
                        <CardDescription>
                          {region.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 line-clamp-3">{attraction.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link to={`/attractions/${attraction.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-500">No attractions data available for this region yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">About {region.name}</h2>
                <p className="text-slate-600">Learn more about this fascinating region</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Overview</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {region.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Facts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Capital:</span>
                      <span className="text-slate-600">{region.capital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Attractions:</span>
                      <span className="text-slate-600">{regionAttractions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Region Type:</span>
                      <span className="text-slate-600">Cultural</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}