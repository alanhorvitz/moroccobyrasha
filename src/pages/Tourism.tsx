import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter, Users, DollarSign, MapPin, Book, Video, ArrowRight, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { apiService, transformApiData } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

import { virtualTours } from '@/lib/data/virtual-tours';
import { TourPackage, TravelGuide, VirtualTour, Region } from '@/lib/types';

export default function TourismPage() {
  const { t, isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("tours");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dynamic data
  const { data: apiRegions } = useQuery({ queryKey: ['regions', language], queryFn: apiService.getRegions });
  const { data: apiTourPackages } = useQuery({ queryKey: ['tour-packages', language], queryFn: apiService.getTourPackages });
  const { data: apiTravelGuides } = useQuery({ queryKey: ['travel-guides', language], queryFn: apiService.getTravelGuides });

  const regions = useMemo<Region[]>(() => (apiRegions || []).map(r => transformApiData.region(r, language)), [apiRegions, language]);
  const tours = useMemo<TourPackage[]>(() => (apiTourPackages || []).map(tp => transformApiData.tourPackage(tp, language)), [apiTourPackages, language]);
  const guides = useMemo<TravelGuide[]>(() => (apiTravelGuides || []).map(g => transformApiData.travelGuide(g, language)), [apiTravelGuides, language]);

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 15]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const [selectedGuideType, setSelectedGuideType] = useState<string>("all");
  const [selectedGuideRegion, setSelectedGuideRegion] = useState<string>("all");

  const [selectedVirtualTourRegion, setSelectedVirtualTourRegion] = useState<string>("all");

  const maxDuration = tours.length ? Math.max(...tours.map(tour => tour.duration)) : 15;
  const maxPrice = tours.length ? Math.max(...tours.map(tour => tour.price)) : 2000;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    resetFilters();
  };

  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<TravelGuide[]>([]);
  const [filteredVirtualTours, setFilteredVirtualTours] = useState(virtualTours);

  // Initialize filtered lists when data loads or filters change
  const applyTourFilters = (
    term: string,
    region: string,
    duration: [number, number],
    price: [number, number]
  ) => {
    setFilteredTours(
      tours.filter(tour => {
        const matchesSearch =
          tour.title.toLowerCase().includes(term) ||
          tour.description.toLowerCase().includes(term);
        const matchesRegion = region === "all" || tour.regionId === region;
        const matchesDuration = tour.duration >= duration[0] && tour.duration <= duration[1];
        const matchesPrice = tour.price >= price[0] && tour.price <= price[1];
        return matchesSearch && matchesRegion && matchesDuration && matchesPrice;
      })
    );
  };

  const applyGuideFilters = (term: string, type: string, region: string) => {
    setFilteredGuides(
      guides.filter(guide => {
        const matchesSearch =
          guide.title.toLowerCase().includes(term) ||
          guide.description.toLowerCase().includes(term) ||
          guide.tags.some(tag => tag.toLowerCase().includes(term));
        const matchesType = type === "all" || guide.type === (type as any);
        const matchesRegion = region === "all" || guide.regionIds.includes(region) || guide.regionIds.includes("all");
        return matchesSearch && matchesType && matchesRegion;
      })
    );
  };

  const applyVirtualTourFilters = (term: string, region: string) => {
    setFilteredVirtualTours(
      virtualTours.filter(tour => {
        const matchesSearch =
          tour.title.toLowerCase().includes(term) ||
          tour.description.toLowerCase().includes(term);
        const matchesRegion = region === "all" || tour.regionId === region;
        return matchesSearch && matchesRegion;
      })
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (activeTab === "tours") {
      applyTourFilters(term, selectedRegion, durationRange, priceRange);
    } else if (activeTab === "guides") {
      applyGuideFilters(term, selectedGuideType, selectedGuideRegion);
    } else if (activeTab === "virtual-tours") {
      applyVirtualTourFilters(term, selectedVirtualTourRegion);
    }
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    applyTourFilters(searchTerm, value, durationRange, priceRange);
  };
  const handleDurationChange = (values: number[]) => {
    const range: [number, number] = [values[0], values[1]];
    setDurationRange(range);
    applyTourFilters(searchTerm, selectedRegion, range, priceRange);
  };
  const handlePriceChange = (values: number[]) => {
    const range: [number, number] = [values[0], values[1]];
    setPriceRange(range);
    applyTourFilters(searchTerm, selectedRegion, durationRange, range);
  };

  const handleGuideTypeChange = (value: string) => {
    setSelectedGuideType(value);
    applyGuideFilters(searchTerm, value, selectedGuideRegion);
  };
  const handleGuideRegionChange = (value: string) => {
    setSelectedGuideRegion(value);
    applyGuideFilters(searchTerm, selectedGuideType, value);
  };
  const handleVirtualTourRegionChange = (value: string) => {
    setSelectedVirtualTourRegion(value);
    applyVirtualTourFilters(searchTerm, value);
  };

  const resetFilters = () => {
    if (activeTab === "tours") {
      setSelectedRegion("all");
      setDurationRange([1, maxDuration]);
      setPriceRange([0, maxPrice]);
      setFilteredTours(tours);
    } else if (activeTab === "guides") {
      setSelectedGuideType("all");
      setSelectedGuideRegion("all");
      setFilteredGuides(guides);
    } else if (activeTab === "virtual-tours") {
      setSelectedVirtualTourRegion("all");
      setFilteredVirtualTours(virtualTours);
    }
  };

  // Update filtered lists when data changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { setFilteredTours(tours); }, [tours.length]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { setFilteredGuides(guides); }, [guides.length]);

  return (
    <div className={`container mx-auto px-4 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('tourism.title')}</h1>
        <p className="text-xl text-slate-600">
          {t('tourism.description')}
        </p>
      </div>
      <Tabs defaultValue="tours" value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full md:w-fit grid-cols-3 mx-auto">
          <TabsTrigger value="tours">{t('tourism.tourPackages')}</TabsTrigger>
          <TabsTrigger value="guides">{t('contentHub.travelGuides')}</TabsTrigger>
          <TabsTrigger value="virtual-tours">{t('tourism.virtualTours')}</TabsTrigger>
        </TabsList>
        <TabsContent value="tours">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className={`flex flex-col md:flex-row gap-4 md:items-center mb-6 ${isRTL ? 'rtl-flex-row' : ''}`}>
              <div className="relative flex-grow">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input placeholder={t('tourism.searchTourPackages')} className={`${isRTL ? 'pr-10' : 'pl-10'}`} value={searchTerm} onChange={handleSearch} />
              </div>
              <Button variant="outline" onClick={resetFilters}>{t('common.resetFilters')}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {t('common.region')}
                </label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.allRegions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allRegions')}</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {t('tourism.durationRange', { from: String(durationRange[0]), to: String(durationRange[1]) })}
                </label>
                <Slider defaultValue={[1, maxDuration]} min={1} max={maxDuration} step={1} value={[durationRange[0], durationRange[1]]} onValueChange={handleDurationChange} className="my-4" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" /> {t('tourism.priceRange', { from: `$${priceRange[0]}`, to: `$${priceRange[1]}` })}
                </label>
                <Slider defaultValue={[0, maxPrice]} min={0} max={maxPrice} step={50} value={[priceRange[0], priceRange[1]]} onValueChange={handlePriceChange} className="my-4" />
              </div>
            </div>
          </div>
          <div>
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} regions={regions} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">{t('tourism.noTourPackages')}</p>
                <Button onClick={resetFilters} className="mt-4">{t('common.resetFilters')}</Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="guides">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className={`flex flex-col md:flex-row gap-4 md:items-center mb-6 ${isRTL ? 'rtl-flex-row' : ''}`}>
              <div className="relative flex-grow">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input placeholder={t('tourism.searchTravelGuides')} className={`${isRTL ? 'pr-10' : 'pl-10'}`} value={searchTerm} onChange={handleSearch} />
              </div>
              <Button variant="outline" onClick={resetFilters}>{t('common.resetFilters')}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Book className="h-4 w-4 mr-1" /> {t('tourism.guideType')}
                </label>
                <Select value={selectedGuideType} onValueChange={handleGuideTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('discover.filters.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('discover.filters.allTypes')}</SelectItem>
                    <SelectItem value="general">{t('tourism.guideTypes.general')}</SelectItem>
                    <SelectItem value="specialized">{t('tourism.guideTypes.specialized')}</SelectItem>
                    <SelectItem value="thematic">{t('tourism.guideTypes.thematic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {t('common.region')}
                </label>
                <Select value={selectedGuideRegion} onValueChange={handleGuideRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.allRegions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allRegions')}</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => (
                  <TravelGuideCard key={guide.id} guide={guide} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">{t('tourism.noTravelGuides')}</p>
                <Button onClick={resetFilters} className="mt-4">{t('common.resetFilters')}</Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="virtual-tours">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className={`flex flex-col md:flex-row gap-4 md:items-center mb-6 ${isRTL ? 'rtl-flex-row' : ''}`}>
              <div className="relative flex-grow">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input placeholder={t('tourism.searchVirtualTours')} className={`${isRTL ? 'pr-10' : 'pl-10'}`} value={searchTerm} onChange={handleSearch} />
              </div>
              <Button variant="outline" onClick={resetFilters}>{t('common.resetFilters')}</Button>
            </div>
            <div className="grid grid-cols-1">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {t('common.region')}
                </label>
                <Select value={selectedVirtualTourRegion} onValueChange={handleVirtualTourRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.allRegions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allRegions')}</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            {filteredVirtualTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVirtualTours.map((tour) => (
                  <VirtualTourCard key={tour.id} tour={tour} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">{t('tourism.noVirtualTours')}</p>
                <Button onClick={resetFilters} className="mt-4">{t('common.resetFilters')}</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tour Package Card Component
const TourCard = ({ tour, regions, t }: { tour: TourPackage; regions: Region[]; t: (key: string, params?: Record<string, string | number>) => string }) => {
  const region = regions.find(r => r.id === tour.regionId);
  const regionName = region ? region.name : tour.regionId;
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-200">
        <div className="absolute top-4 left-4">
          {tour.featured && (
            <Badge className="bg-emerald-600 hover:bg-emerald-700">{t('tourism.featured')}</Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{tour.duration} {t('home.days')}</span>
            </div>
            <span className="font-bold">${tour.price}</span>
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{tour.title}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {regionName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 line-clamp-3">{tour.description}</p>
        {tour.rating && (
          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-4 w-4 ${i < Math.floor(tour.rating) ? "text-yellow-500" : "text-slate-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">
              {tour.rating.toFixed(1)} ({tour.reviewCount} {t('marketplace.reviews')})
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-slate-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{t('home.max')} {tour.maxParticipants}</span>
        </div>
        <Button asChild>
          <Link to={`/tours/${tour.id}`}>{t('home.viewTour')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Travel Guide Card Component
const TravelGuideCard = ({ guide, t }: { guide: TravelGuide; t: (key: string, params?: Record<string, string | number>) => string }) => {
  const typeLabel = ((): string => {
    if (guide.type === 'general') return t('tourism.guideTypes.general');
    if (guide.type === 'specialized') return t('tourism.guideTypes.specialized');
    if (guide.type === 'thematic') return t('tourism.guideTypes.thematic');
    return guide.type;
  })();

  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
            <Badge variant={
              guide.type === 'general' ? 'default' :
              guide.type === 'specialized' ? 'secondary' : 'outline'
            }>
              {typeLabel}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{guide.title}</CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-1">
              <span>{t('contentHub.author')}: {guide.author}</span>
              <span className="text-xs">• {new Date(guide.publishedDate).toLocaleDateString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-3 mb-3">{guide.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.tags.slice(0, 5).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">#{tag}</Badge>
              ))}
              {guide.tags.length > 5 && (
                <span className="text-xs text-slate-500">+{guide.tags.length - 5} more</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group">
              <Link to={`/guides/${guide.id}`}>
                {t('contentHub.readGuide')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Virtual Tour Card Component remains unchanged
const VirtualTourCard = ({ tour, t }: { tour: VirtualTour; t: (key: string, params?: Record<string, string | number>) => string }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-60 bg-slate-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="lg" className="flex items-center gap-2 bg-black/70 hover:bg-black">
            <Video className="h-5 w-5" />
            <span>{t('tourism.experience360')}</span>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-bold text-white">{tour.title}</h3>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{tour.regionId}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{tour.duration} {t('common.min')}</span>
          </div>
        </div>
        <p className="text-slate-600 line-clamp-3">{tour.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/virtual-tours/${tour.id}`}>{t('tourism.startVirtualTour')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};