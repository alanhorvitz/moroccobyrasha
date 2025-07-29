'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { touristAttractions as attractions } from '@/lib/data/attractions';
import { moroccanRegions as regions } from '@/lib/data/regions';
import { Attraction, Region } from '@/lib/types';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    if (id) {
      const foundAttraction = attractions.find(a => a.id === id);
      setAttraction(foundAttraction || null);
      
      if (foundAttraction) {
        const foundRegion = regions.find(r => r.id === foundAttraction.regionId);
        setRegion(foundRegion || null);
      }
    }
  }, [id]);

  if (!attraction) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Attraction Not Found</h1>
          <p className="text-slate-600 mb-6">The attraction you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/discover">Back to Discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-slate-600 to-slate-400">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-6 bg-white/10 border-white text-white hover:bg-white/20">
              <Link href="/discover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.category}</Badge>
              {attraction.featured && (
                <Badge variant="outline" className="bg-white/80 border-0">Featured</Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{attraction.name}</h1>
            <div className="flex items-center text-white/80">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{region ? `${attraction.location.lat}, ${attraction.location.lng}, ${region.name}` : `${attraction.location.lat}, ${attraction.location.lng}`}</span>
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
              <Card>
                <CardHeader>
                  <CardTitle>About {attraction.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-600 leading-relaxed">{attraction.description}</p>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-slate-600">{attraction.location.lat}, {attraction.location.lng}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-emerald-600" />
                        <div>
                          <p className="font-medium">Category</p>
                          <p className="text-sm text-slate-600">{attraction.category}</p>
                        </div>
                      </div>
                      
                      {attraction.visitingHours && (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                          <div>
                            <p className="font-medium">Visiting Hours</p>
                            <p className="text-sm text-slate-600">{attraction.visitingHours}</p>
                          </div>
                        </div>
                      )}
                      
                      {attraction.entryFee && (
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-emerald-600" />
                          <div>
                            <p className="font-medium">Entry Fee</p>
                            <p className="text-sm text-slate-600">{attraction.entryFee}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {attraction.highlights && attraction.highlights.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                        <ul className="space-y-2">
                          {attraction.highlights.map((highlight, index) => (
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
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Region Info */}
              {region && (
                <Card>
                  <CardHeader>
                    <CardTitle>Explore {region.name}</CardTitle>
                    <CardDescription>Discover more about this region</CardDescription>
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
                      <div className="flex justify-between">
                        <span className="text-slate-500">Best Time:</span>
                        <span className="font-medium">{region.bestTimeToVisit}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/regions/${region.id}`}>Explore Region</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Your Visit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/tourism">Find Tours</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/services">Book Guide</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/gallery">View Photos</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Travel Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Travel Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <Camera className="h-4 w-4 mt-0.5 mr-2 text-emerald-600 flex-shrink-0" />
                      <span>Best photography hours are early morning and late afternoon</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="h-4 w-4 mt-0.5 mr-2 text-emerald-600 flex-shrink-0" />
                      <span>Consider hiring a local guide for deeper cultural insights</span>
                    </li>
                    <li className="flex items-start">
                      <Calendar className="h-4 w-4 mt-0.5 mr-2 text-emerald-600 flex-shrink-0" />
                      <span>Check local weather and seasonal considerations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}