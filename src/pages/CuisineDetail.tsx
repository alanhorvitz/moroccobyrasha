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
import { useLanguage } from '@/contexts/LanguageContext';

export default function CuisineDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t, isRTL } = useLanguage();

  // Fetch cuisine and regions data
  const { data: apiCuisines, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
    queryKey: ['cuisines', language],
    queryFn: apiService.getCuisines,
  });

  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  // Transform API data with current language
  const cuisineItems = apiCuisines?.map(cuisine => transformApiData.cuisine(cuisine, language)) || [];
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];

  // Find the specific cuisine item and its regions
  const cuisine = cuisineItems.find(c => c.id === id);
  const cuisineRegions = cuisine ? regions.filter(r => cuisine.regionIds.includes(r.id)) : [];

  // Loading state
  if (cuisinesLoading || regionsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('cuisineDetail.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cuisinesError || regionsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('cuisineDetail.errorTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('cuisineDetail.errorMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('cuisineDetail.backToDiscover')}</Link>
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
          <h1 className="text-2xl font-bold mb-4">{t('cuisineDetail.notFoundTitle')}</h1>
          <p className="text-slate-600 mb-6">{t('cuisineDetail.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/discover">{t('cuisineDetail.backToDiscover')}</Link>
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
                <ArrowLeft className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {t('cuisineDetail.backToDiscover')}
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-orange-600 hover:bg-orange-700">
                {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
              {cuisine.spiceLevel !== 'none' && (
                <Badge variant="outline" className="bg-white/80 border-0">
                  {t('cuisineDetail.spiceLevel', { level: t(`cuisineDetail.${cuisine.spiceLevel}`) })}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{cuisine.name}</h1>
            <div className={`flex items-center text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span>{cuisineRegions.map(r => r.name).join(', ') || t('cuisineDetail.morocco')}</span>
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
                  <TabsTrigger value="overview">{t('cuisineDetail.tabs.overview')}</TabsTrigger>
                  <TabsTrigger value="ingredients">{t('cuisineDetail.tabs.ingredients')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('cuisineDetail.aboutCuisine', { name: cuisine.name })}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed">{cuisine.description}</p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t('cuisineDetail.keyInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                            <div>
                              <p className="font-medium">{t('cuisineDetail.regions')}</p>
                              <p className="text-sm text-slate-600">{cuisineRegions.map(r => r.name).join(', ') || t('cuisineDetail.morocco')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Flame className="h-5 w-5 mr-2 text-orange-600" />
                            <div>
                              <p className="font-medium">{t('cuisineDetail.spiceLevel')}</p>
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
                      <CardTitle>{t('cuisineDetail.ingredientsVariants')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t('cuisineDetail.keyIngredients')}</h3>
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
                            <h3 className="text-lg font-semibold mb-3">{t('cuisineDetail.popularVariants')}</h3>
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
                  <CardTitle>{t('cuisineDetail.quickFacts')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cuisineDetail.type')}:</span>
                    <span className="font-medium">
                      {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cuisineDetail.regions')}:</span>
                    <span className="font-medium">{cuisineRegions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cuisineDetail.spiceLevel')}:</span>
                    <span className="font-medium capitalize">{cuisine.spiceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('cuisineDetail.ingredients')}:</span>
                    <span className="font-medium">{cuisine.ingredients.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full">
                <Link to="/discover">{t('cuisineDetail.exploreMoreCuisine')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 