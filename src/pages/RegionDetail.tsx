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
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegionDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t, isRTL } = useLanguage();

  // Fetch regions and attractions data
  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  const { data: apiAttractions, isLoading: attractionsLoading, error: attractionsError } = useQuery({
    queryKey: ['attractions', language],
    queryFn: apiService.getAttractions,
  });

  // Transform API data with current language
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];
  const attractions = apiAttractions?.map(attraction => transformApiData.attraction(attraction, language)) || [];

  // Find the specific region and its attractions
  const region = regions.find(r => r.id === id);
  const regionAttractions = attractions.filter(a => a.regionId === id);

  // Loading state
  if (regionsLoading || attractionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('regionDetail.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (regionsError || attractionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('regionDetail.errorTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('regionDetail.errorMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('regionDetail.backToDiscover')}</Link>
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
          <h1 className="text-2xl font-bold mb-4">{t('regionDetail.notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('regionDetail.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('regionDetail.backToDiscover')}</Link>
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
                <ArrowLeft className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('regionDetail.backToDiscover')}
              </Link>
            </Button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{region.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{region.description}</p>
            <div className={`flex items-center mt-4 text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{t('regionDetail.capital')}: {region.capital}</span>
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
                <h3 className="font-semibold">{t('regionDetail.attractions')}</h3>
                <p className="text-slate-600">{t('regionDetail.placesCount', { count: regionAttractions.length })}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">{t('regionDetail.climate')}</h3>
                <p className="text-slate-600">{region.climate || t('regionDetail.mediterranean')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">{t('regionDetail.bestTimeToVisit')}</h3>
                <p className="text-slate-600">{region.bestTimeToVisit || t('regionDetail.springAndFall')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold">{t('regionDetail.experience')}</h3>
                <p className="text-slate-600">{t('regionDetail.culturalAndHistorical')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="attractions" className="w-full">
            <TabsList className={`grid w-full md:w-96 grid-cols-2 ${isRTL ? 'rtl' : 'ltr'}`}>
              <TabsTrigger value="attractions">{t('regionDetail.tabs.attractions')}</TabsTrigger>
              <TabsTrigger value="about">{t('regionDetail.tabs.about')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attractions" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('regionDetail.attractionsInRegion', { name: region.name })}</h2>
                <p className="text-slate-600">{t('regionDetail.attractionsDescription')}</p>
              </div>
              
              {regionAttractions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regionAttractions.map((attraction) => (
                    <Card key={attraction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-slate-200">
                        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
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
                          <Link to={`/attractions/${attraction.id}`}>{t('regionDetail.viewDetails')}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-500">{t('regionDetail.noAttractionsMessage')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('regionDetail.aboutRegion', { name: region.name })}</h2>
                <p className="text-slate-600">{t('regionDetail.aboutDescription')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('regionDetail.overview')}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {region.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('regionDetail.keyFacts')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{t('regionDetail.capital')}:</span>
                      <span className="text-slate-600">{region.capital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('regionDetail.attractions')}:</span>
                      <span className="text-slate-600">{regionAttractions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('regionDetail.regionType')}:</span>
                      <span className="text-slate-600">{t('regionDetail.cultural')}</span>
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