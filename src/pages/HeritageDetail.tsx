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
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeritageDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t, isRTL } = useLanguage();

  // Fetch heritage and regions data
  const { data: apiHeritages, isLoading: heritagesLoading, error: heritagesError } = useQuery({
    queryKey: ['heritages', language],
    queryFn: apiService.getHeritages,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  // Transform API data with current language
  const heritages = apiHeritages?.map(heritage => transformApiData.heritage(heritage, language)) || [];
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];

  // Find the specific heritage item and its regions
  const heritage = heritages.find(h => h.id === id);
  const heritageRegions = heritage ? regions.filter(r => heritage.regionIds.includes(r.id)) : [];

  // Loading state
  if (heritagesLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('heritageDetail.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (heritagesError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('heritageDetail.errorTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('heritageDetail.errorMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('heritageDetail.backToDiscover')}</Link>
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
          <h1 className="text-2xl font-bold mb-4">{t('heritageDetail.notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('heritageDetail.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('heritageDetail.backToDiscover')}</Link>
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
                <ArrowLeft className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('heritageDetail.backToDiscover')}
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-amber-600 hover:bg-amber-700">
                {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{heritage.name}</h1>
            <div className={`flex items-center text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{heritageRegions.map(r => r.name).join(', ') || t('heritageDetail.morocco')}</span>
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
                  <TabsTrigger value="overview">{t('heritageDetail.tabs.overview')}</TabsTrigger>
                  <TabsTrigger value="significance">{t('heritageDetail.tabs.significance')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('heritageDetail.aboutHeritage', { name: heritage.name })}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{heritage.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t('heritageDetail.keyInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                            <div>
                              <p className="font-medium">{t('heritageDetail.regions')}</p>
                              <p className="text-sm text-slate-600">{heritageRegions.map(r => r.name).join(', ') || t('heritageDetail.morocco')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Award className="h-5 w-5 mr-2 text-amber-600" />
                            <div>
                              <p className="font-medium">{t('heritageDetail.type')}</p>
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
                      <CardTitle>{t('heritageDetail.culturalSignificance')}</CardTitle>
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
                  <CardTitle>{t('heritageDetail.quickFacts')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('heritageDetail.type')}:</span>
                    <span className="font-medium">
                      {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('heritageDetail.regions')}:</span>
                    <span className="font-medium">{heritageRegions.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('heritageDetail.visitInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">{t('heritageDetail.bestTimeToVisit')}</p>
                      <p className="text-sm text-slate-600">{t('heritageDetail.yearRound')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">{t('heritageDetail.visitorType')}</p>
                      <p className="text-sm text-slate-600">{t('heritageDetail.culturalEnthusiasts')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="font-medium">{t('heritageDetail.photoOpportunities')}</p>
                      <p className="text-sm text-slate-600">{t('heritageDetail.excellent')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">{t('heritageDetail.exploreMoreHeritage')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 