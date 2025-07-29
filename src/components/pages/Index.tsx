import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Compass, Camera, Users, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';

import { moroccanRegions as regions } from '@/lib/data/regions';
import { touristAttractions as attractions } from '@/lib/data/attractions';
import { tourPackages } from '@/lib/data/tour-packages';
import { contentItems } from '@/lib/data/content';

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const [featuredRegions, setFeaturedRegions] = useState(regions.slice(0, 4));
  const [featuredAttractions, setFeaturedAttractions] = useState(attractions.filter(a => a.featured).slice(0, 3));
  const [featuredTours, setFeaturedTours] = useState(tourPackages.filter(t => t.featured).slice(0, 3));
  const [featuredContent, setFeaturedContent] = useState(contentItems.filter(c => c.featured).slice(0, 2));

  const heroImages = [
    "/images/hero/morocco-marrakech.jpg",
    "/images/hero/morocco-desert.jpg",
    "/images/hero/morocco-chefchaouen.jpg"
  ];

  return (
    <div className={`flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Hero Section */}
      <section className="relative">
        {/* Placeholder for Hero Images - In a real implementation these would be actual images */}
        <div className="relative h-[80vh] bg-gradient-to-r from-emerald-900 to-emerald-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 z-20 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {t('home.heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/discover">
                    {t('home.exploreRegions')} <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                  <Link href="/tourism">
                    {t('home.viewTourPackages')} <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Morocco Regions Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('home.exploreMorocco')}</h2>
              <p className="text-slate-600 max-w-2xl">
                {t('home.exploreMoroccoDesc')}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/discover">
                {t('home.viewAllRegions')} <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRegions.map((region) => (
              <Link key={region.id} href={`/regions/${region.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-emerald-100 overflow-hidden">
                    <img 
                      src={region.imageUrl || `/images/${region.name.replace(/\s+/g, '')}.jpg`}
                      alt={region.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/morocco-default.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                    <div className="absolute bottom-0 p-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">{region.name}</h3>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-500 line-clamp-2">{region.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-slate-500">
                    <div className="flex items-center">
                      <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      <span>{region.capital}</span>
                    </div>
                    <div>{region.attractions.length} {t('home.attractions')}</div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Attractions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('home.mustVisitAttractions')}</h2>
              <p className="text-slate-600 max-w-2xl">
                {t('home.mustVisitAttractionsDesc')}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/discover">
                {t('home.viewAllAttractions')} <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredAttractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden">
                <div className="relative h-64 bg-slate-200 overflow-hidden">
                  <img 
                    src={`/images/${attraction.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}.jpg`}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/morocco-attraction-default.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{attraction.name}</CardTitle>
                  <CardDescription>
                    {regions.find(r => r.id === attraction.regionId)?.name || 'Morocco'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-3">{attraction.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/attractions/${attraction.id}`}>
                      {t('common.viewDetails')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('home.featuredTourPackages')}</h2>
              <p className="text-slate-600 max-w-2xl">
                {t('home.featuredTourPackagesDesc')}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/tourism">
                {t('home.viewAllTours')} <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden">
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img 
                    src={`/images/tours/${tour.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}.jpg`}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/morocco-tour-default.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{tour.duration} {t('home.days')}</span>
                      <span className="text-white font-bold">${tour.price}</span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{tour.title}</CardTitle>
                  <CardDescription>
                    {regions.find(r => r.id === tour.regionId)?.name || 'Multiple Regions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-3">{tour.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-slate-500">
                    <Users className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <span>{t('home.max')} {tour.maxParticipants}</span>
                  </div>
                  <Button asChild>
                    <Link href={`/tours/${tour.id}`}>
                      {t('home.viewTour')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Hub Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('home.travelInspiration')}</h2>
              <p className="text-slate-600 max-w-2xl">
                {t('home.travelInspirationDesc')}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/content-hub">
                {t('home.exploreContentHub')} <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredContent.map((content) => (
              <Card key={content.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-2/5 h-48 md:h-auto bg-slate-200 overflow-hidden">
                    <img 
                      src={`/images/content/${content.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)}.jpg`}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/morocco-content-default.jpg';
                      }}
                    />
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{content.title}</CardTitle>
                      <CardDescription>
                        {content.author} • {new Date(content.publishedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {content.type === "article" && (
                        <p className="text-slate-600 line-clamp-3">{content.content.substring(0, 150)}...</p>
                      )}
                      {content.type === "video" && (
                        <p className="text-slate-600">Video content about Moroccan experiences</p>
                      )}
                      {content.type === "podcast" && (
                        <p className="text-slate-600">Audio podcast featuring travel insights</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {content.category?.slice(0, 3).map((cat, index) => (
                          <Badge key={index} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/content/${content.id}`}>
                          {t('common.readMore')}
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.readyToExperience')}</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {t('home.readyToExperienceDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
      


            <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
             <Link href="/tourism">
                {t('home.browseTourPackages')} <Calendar className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
              <Link href="/services">
                {t('home.findTravelServices')} <Compass className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}