import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Thermometer, Users, Camera, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { moroccanRegions as regions } from '@/lib/data/regions';
import { touristAttractions as attractions } from '@/lib/data/attractions';
import { tourPackages } from '@/lib/data/tour-packages';
import { Region, Attraction, TourPackage } from '@/lib/types';

export default function RegionDetail() {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [regionAttractions, setRegionAttractions] = useState<Attraction[]>([]);
  const [regionTours, setRegionTours] = useState<TourPackage[]>([]);

  useEffect(() => {
    if (id) {
      const foundRegion = regions.find(r => r.id === id);
      setRegion(foundRegion || null);
      
      if (foundRegion) {
        setRegionAttractions(attractions.filter(a => a.regionId === id));
        setRegionTours(tourPackages.filter(t => t.regionId === id));
      }
    }
  }, [id]);

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
                <h3 className="font-semibold">Population</h3>
                <p className="text-slate-600">{region.population}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Climate</h3>
                <p className="text-slate-600">{region.climate}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Best Time to Visit</h3>
                <p className="text-slate-600">{region.bestTimeToVisit}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">Top Attractions</h3>
                <p className="text-slate-600">{region.attractions.length} places</p>
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
              <TabsTrigger value="tours">Tours</TabsTrigger>
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
                          <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.category}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{attraction.name}</CardTitle>
                        <CardDescription>{attraction.location}</CardDescription>
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
            
            <TabsContent value="tours" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Tours in {region.name}</h2>
                <p className="text-slate-600">Explore curated tour packages for this region</p>
              </div>
              
              {regionTours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regionTours.map((tour) => (
                    <Card key={tour.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-slate-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex justify-between items-center text-white">
                            <span className="font-medium">{tour.duration} days</span>
                            <span className="font-bold">${tour.price}</span>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{tour.title}</CardTitle>
                        <CardDescription>{tour.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 line-clamp-3">{tour.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-slate-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Max {tour.maxParticipants}</span>
                        </div>
                        <Button asChild>
                          <Link to={`/tours/${tour.id}`}>View Tour</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-500">No tours available for this region yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}