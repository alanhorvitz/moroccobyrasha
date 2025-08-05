import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Users, Camera, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiService, transformApiData } from '@/lib/api';
import { Attraction, Region } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t, isRTL } = useLanguage();

  // Fetch attractions and regions data
  const { data: apiAttractions, isLoading: attractionsLoading, error: attractionsError } = useQuery({
    queryKey: ['attractions', language],
    queryFn: apiService.getAttractions,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  // Transform API data with current language
  const attractions = apiAttractions?.map(attraction => transformApiData.attraction(attraction, language)) || [];
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];

  // Find the specific attraction and its region
  const attraction = attractions.find(a => a.id === id);
  const region = attraction ? regions.find(r => r.id === attraction.regionId) : null;

  // Loading state
  if (attractionsLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('attractionDetail.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (attractionsError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('attractionDetail.errorTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('attractionDetail.errorMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('attractionDetail.backToDiscover')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Attraction not found
  if (!attraction) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('attractionDetail.notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('attractionDetail.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('attractionDetail.backToDiscover')}</Link>
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
              <Link to="/discover">
                <ArrowLeft className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('attractionDetail.backToDiscover')}
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.type}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{attraction.name}</h1>
            <div className={`flex items-center text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{region ? `${region.name}` : t('attractionDetail.morocco')}</span>
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
                  <CardTitle>{t('attractionDetail.aboutTitle', { name: attraction.name })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-600 leading-relaxed">{attraction.description}</p>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t('attractionDetail.keyInformation')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <MapPin className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <div>
                          <p className="font-medium">{t('attractionDetail.location')}</p>
                          <p className="text-sm text-slate-600">{region ? region.name : t('attractionDetail.morocco')}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Star className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <div>
                          <p className="font-medium">{t('attractionDetail.type')}</p>
                          <p className="text-sm text-slate-600">{attraction.type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('attractionDetail.quickFacts')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('attractionDetail.type')}:</span>
                    <span className="font-medium">{attraction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('attractionDetail.region')}:</span>
                    <span className="font-medium">{region ? region.name : t('attractionDetail.morocco')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('attractionDetail.capital')}:</span>
                    <span className="font-medium">{region ? region.capital : t('attractionDetail.notAvailable')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('attractionDetail.visitInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <div>
                      <p className="font-medium">{t('attractionDetail.bestTimeToVisit')}</p>
                      <p className="text-sm text-slate-600">{t('attractionDetail.springAndFall')}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <div>
                      <p className="font-medium">{t('attractionDetail.visitorType')}</p>
                      <p className="text-sm text-slate-600">{t('attractionDetail.allAges')}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Camera className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <div>
                      <p className="font-medium">{t('attractionDetail.photoOpportunities')}</p>
                      <p className="text-sm text-slate-600">{t('attractionDetail.excellent')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">{t('attractionDetail.exploreMoreAttractions')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}