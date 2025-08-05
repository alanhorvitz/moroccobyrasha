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
import { useLanguage } from '@/contexts/LanguageContext';

export default function FestivalDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t, isRTL } = useLanguage();

  // Fetch festivals and regions data
  const { data: apiFestivals, isLoading: festivalsLoading, error: festivalsError } = useQuery({
    queryKey: ['festivals', language],
    queryFn: apiService.getFestivals,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  // Transform API data with current language
  const festivals = apiFestivals?.map(festival => transformApiData.festival(festival, language)) || [];
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];

  // Find the specific festival and its region
  const festival = festivals.find(f => f.id === id);
  const region = festival && festival.regionId !== 'all' ? regions.find(r => r.id === festival.regionId) : null;

  // Loading state
  if (festivalsLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('festivalDetail.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (festivalsError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('festivalDetail.errorTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('festivalDetail.errorMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('festivalDetail.backToDiscover')}</Link>
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
          <h1 className="text-2xl font-bold mb-4">{t('festivalDetail.notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('festivalDetail.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('festivalDetail.backToDiscover')}</Link>
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
                <ArrowLeft className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('festivalDetail.backToDiscover')}
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-pink-600 hover:bg-pink-700">
                {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{festival.name}</h1>
            <div className={`flex items-center gap-6 text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span>{festival.location} {region && `(${region.name})`}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
                  <TabsTrigger value="overview">{t('festivalDetail.tabs.overview')}</TabsTrigger>
                  <TabsTrigger value="history">{t('festivalDetail.tabs.history')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('festivalDetail.aboutTitle', { festivalName: festival.name })}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{festival.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t('festivalDetail.keyInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">{t('festivalDetail.location')}</p>
                              <p className="text-sm text-slate-600">{festival.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Music className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">{t('festivalDetail.type')}</p>
                              <p className="text-sm text-slate-600">
                                {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">{t('festivalDetail.timeOfYear')}</p>
                              <p className="text-sm text-slate-600">{festival.timeOfYear}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-pink-600" />
                            <div>
                              <p className="font-medium">{t('festivalDetail.duration')}</p>
                              <p className="text-sm text-slate-600">{festival.duration} {festival.duration > 1 ? t('festivalDetail.days') : t('festivalDetail.day')}</p>
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
                      <CardTitle>{t('festivalDetail.historicalSignificanceTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {festival.historicalSignificance ? (
                        <p className="text-slate-600 leading-relaxed">{festival.historicalSignificance}</p>
                      ) : (
                        <p className="text-slate-600">{t('festivalDetail.historicalSignificanceMessage')}</p>
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
                  <CardTitle>{t('festivalDetail.quickFactsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('festivalDetail.type')}:</span>
                    <span className="font-medium">
                      {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('festivalDetail.location')}:</span>
                    <span className="font-medium">{festival.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('festivalDetail.timeOfYear')}:</span>
                    <span className="font-medium">{festival.timeOfYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('festivalDetail.duration')}:</span>
                    <span className="font-medium">{festival.duration} {festival.duration > 1 ? t('festivalDetail.days') : t('festivalDetail.day')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('festivalDetail.festivalInformationTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">{t('festivalDetail.bestTimeToVisit')}</p>
                      <p className="text-sm text-slate-600">{festival.timeOfYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">{t('festivalDetail.visitorType')}</p>
                      <p className="text-sm text-slate-600">{t('festivalDetail.allAges')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-pink-600" />
                    <div>
                      <p className="font-medium">{t('festivalDetail.photoOpportunities')}</p>
                      <p className="text-sm text-slate-600">{t('festivalDetail.excellent')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">{t('festivalDetail.exploreMoreFestivals')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 