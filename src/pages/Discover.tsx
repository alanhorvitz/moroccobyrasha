import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Tag, Utensils, Calendar, Shirt, Map, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SimpleLeafletMap } from '@/components/SimpleLeafletMap';
import { apiService, transformApiData } from '@/lib/api';
import { Region, Attraction, HeritageItem, ClothingItem, CuisineItem, FestivalEvent } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DiscoverPage() {
  const { t, isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("regions");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHeritageType, setSelectedHeritageType] = useState<string | null>(null);
  const [selectedClothingGender, setSelectedClothingGender] = useState<string | null>(null);
  const [selectedCuisineType, setSelectedCuisineType] = useState<string | null>(null);
  const [selectedFestivalType, setSelectedFestivalType] = useState<string | null>(null);
  
  // Fetch data from API using React Query
  const { data: apiRegions, isLoading: regionsLoading, error: regionsError } = useQuery({
    queryKey: ['regions', language],
    queryFn: apiService.getRegions,
  });

  const { data: apiAttractions, isLoading: attractionsLoading, error: attractionsError } = useQuery({
    queryKey: ['attractions', language],
    queryFn: apiService.getAttractions,
  });

  const { data: apiHeritages, isLoading: heritagesLoading, error: heritagesError } = useQuery({
    queryKey: ['heritages', language],
    queryFn: apiService.getHeritages,
  });

  const { data: apiClothing, isLoading: clothingLoading, error: clothingError } = useQuery({
    queryKey: ['clothing', language],
    queryFn: apiService.getClothingList,
  });

  const { data: apiCuisines, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
    queryKey: ['cuisines', language],
    queryFn: apiService.getCuisines,
  });

  const { data: apiFestivals, isLoading: festivalsLoading, error: festivalsError } = useQuery({
    queryKey: ['festivals', language],
    queryFn: apiService.getFestivals,
  });

  // Transform API data to frontend format with current language
  const regions = apiRegions?.map(region => transformApiData.region(region, language)) || [];
  const attractions = apiAttractions?.map(attraction => transformApiData.attraction(attraction, language)) || [];
  const heritageItems = apiHeritages?.map(heritage => transformApiData.heritage(heritage, language)) || [];
  const clothingItems = apiClothing?.map(clothing => transformApiData.clothing(clothing, language)) || [];
  const cuisineItems = apiCuisines?.map(cuisine => transformApiData.cuisine(cuisine, language)) || [];
  const festivalEvents = apiFestivals?.map(festival => transformApiData.festival(festival, language)) || [];



  // Use useMemo to compute filtered data instead of useState + useEffect
  const filteredRegions = useMemo(() => {
    if (!searchTerm) return regions;
    return regions.filter(region => 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      region.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.capital.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [regions, searchTerm]);

  const filteredAttractions = useMemo(() => {
    let filtered = attractions;
    
    if (searchTerm) {
      filtered = filtered.filter(attraction => 
        attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        attraction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(attraction => attraction.type === selectedCategory);
    }
    
    return filtered;
  }, [attractions, searchTerm, selectedCategory]);

  const filteredHeritage = useMemo(() => {
    let filtered = heritageItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedHeritageType) {
      filtered = filtered.filter(item => item.type === selectedHeritageType);
    }
    
    return filtered;
  }, [heritageItems, searchTerm, selectedHeritageType]);

  const filteredClothing = useMemo(() => {
    let filtered = clothingItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedClothingGender) {
      filtered = filtered.filter(item => item.gender === selectedClothingGender);
    }
    
    return filtered;
  }, [clothingItems, searchTerm, selectedClothingGender]);

  const filteredCuisine = useMemo(() => {
    let filtered = cuisineItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCuisineType) {
      filtered = filtered.filter(item => item.type === selectedCuisineType);
    }
    
    return filtered;
  }, [cuisineItems, searchTerm, selectedCuisineType]);

  const filteredFestivals = useMemo(() => {
    let filtered = festivalEvents;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFestivalType) {
      filtered = filtered.filter(event => event.type === selectedFestivalType);
    }
    
    return filtered;
  }, [festivalEvents, searchTerm, selectedFestivalType]);
  
  // Unique categories for filtering
  const attractionCategories = [...new Set(attractions.map(attraction => attraction.type))];
  const heritageTypes = [...new Set(heritageItems.map(item => item.type))];
  const clothingGenders = [...new Set(clothingItems.map(item => item.gender))];
  const cuisineTypes = [...new Set(cuisineItems.map(item => item.type))];
  const festivalTypes = [...new Set(festivalEvents.map(event => event.type))];
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category filters
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleHeritageTypeFilter = (type: string | null) => {
    setSelectedHeritageType(type);
  };

  const handleClothingGenderFilter = (gender: string | null) => {
    setSelectedClothingGender(gender);
  };

  const handleCuisineTypeFilter = (type: string | null) => {
    setSelectedCuisineType(type);
  };

  const handleFestivalTypeFilter = (type: string | null) => {
    setSelectedFestivalType(type);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    resetFilters();
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedHeritageType(null);
    setSelectedClothingGender(null);
    setSelectedCuisineType(null);
    setSelectedFestivalType(null);
  };

  // CRUD handlers - removed as requested

  // Loading states
  const isLoading = regionsLoading || attractionsLoading || heritagesLoading || 
                   clothingLoading || cuisinesLoading || festivalsLoading;

  const hasError = regionsError || attractionsError || heritagesError || 
                  clothingError || cuisinesError || festivalsError;

  // Get filter dropdown based on active tab
  const getFilterDropdown = () => {
    switch (activeTab) {
      case "attractions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {selectedCategory ? t('discover.filters.category', { value: selectedCategory }) : t('discover.filters.filterByCategory')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                {t('discover.filters.allCategories')}
              </DropdownMenuItem>
              {attractionCategories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => handleCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "heritage":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {selectedHeritageType ? t('discover.filters.type', { value: selectedHeritageType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }) : t('discover.filters.filterByType')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleHeritageTypeFilter(null)}>
                {t('discover.filters.allTypes')}
              </DropdownMenuItem>
              {heritageTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleHeritageTypeFilter(type)}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "clothing":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                {selectedClothingGender ? t('discover.filters.gender', { value: selectedClothingGender.charAt(0).toUpperCase() + selectedClothingGender.slice(1) }) : t('discover.filters.filterByGender')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleClothingGenderFilter(null)}>
                {t('discover.filters.allGenders')}
              </DropdownMenuItem>
              {clothingGenders.map((gender) => (
                <DropdownMenuItem key={gender} onClick={() => handleClothingGenderFilter(gender)}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "cuisine":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                {selectedCuisineType ? t('discover.filters.type', { value: selectedCuisineType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }) : t('discover.filters.filterByType')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCuisineTypeFilter(null)}>
                {t('discover.filters.allTypes')}
              </DropdownMenuItem>
              {cuisineTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleCuisineTypeFilter(type)}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "festivals":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {selectedFestivalType ? t('discover.filters.type', { value: selectedFestivalType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }) : t('discover.filters.filterByType')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleFestivalTypeFilter(null)}>
                {t('discover.filters.allTypes')}
              </DropdownMenuItem>
              {festivalTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleFestivalTypeFilter(type)}>
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return null;
    }
  };

  // Loading component
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600">{t('discover.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  // Error component
  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">{t('discover.errorTitle')}</h1>
          <p className="text-lg text-slate-600 mb-6">
            {t('discover.errorMessage')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('discover.refreshButton')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('discover.title')}</h1>
        <p className="text-xl text-slate-600">
          {t('discover.subtitle')}
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className={`flex flex-col md:flex-row gap-4 justify-between mb-6 ${isRTL ? 'rtl-flex-row' : ''}`}>
          <div className="relative flex-grow">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={activeTab === 'map' ? t('discover.mapSearchDisabled') : t('discover.searchPlaceholder', { category: activeTab })}
              className={`${isRTL ? 'pr-10' : 'pl-10'} ${activeTab === 'map' ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={searchTerm}
              onChange={handleSearch}
              disabled={activeTab === 'map'}
            />
          </div>
          
          {activeTab !== 'map' && getFilterDropdown()}
        </div>
      </div>
      
      {/* Tabs for different discover sections */}
      <Tabs defaultValue="regions" value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className={`grid w-full grid-cols-2 md:grid-cols-7 gap-2 ${isRTL ? 'rtl' : 'ltr'}`}>
          <TabsTrigger value="regions">{t('discover.tabs.regions')}</TabsTrigger>
          <TabsTrigger value="map">{t('discover.tabs.map')}</TabsTrigger>
          <TabsTrigger value="attractions">{t('discover.tabs.attractions')}</TabsTrigger>
          <TabsTrigger value="heritage">{t('discover.tabs.heritage')}</TabsTrigger>
          <TabsTrigger value="clothing">{t('discover.tabs.clothing')}</TabsTrigger>
          <TabsTrigger value="cuisine">{t('discover.tabs.cuisine')}</TabsTrigger>
          <TabsTrigger value="festivals">{t('discover.tabs.festivals')}</TabsTrigger>
        </TabsList>
        
        {/* Regions Tab Content */}
        <TabsContent value="regions" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.regions')}</h2>
          </div>
          {filteredRegions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.map((region) => (
                <RegionCard 
                  key={region.id} 
                  region={region} 
                  attractions={attractions} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsRegions')}</p>
            </div>
          )}
        </TabsContent>

        {/* Interactive Map Tab Content */}
        <TabsContent value="map" className="pt-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className={`flex items-center mb-4 ${isRTL ? 'rtl-flex' : ''}`}>
              <Map className={`h-5 w-5 text-emerald-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <h2 className="text-xl font-semibold">{t('discover.mapTitle')}</h2>
            </div>
            <p className="text-slate-600 mb-6">
              {t('discover.mapDescription')}
            </p>
            
            {isLoading ? (
              <div className="h-[600px] rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">{t('discover.loadingMapData')}</p>
                </div>
              </div>
            ) : regions.length === 0 && attractions.length === 0 ? (
              <div className="h-[600px] rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-600">{t('discover.noMapData')}</p>
                </div>
              </div>
            ) : (
              <div className="h-[600px] rounded-lg overflow-hidden border">
                <SimpleLeafletMap 
                  regions={regions}
                  attractions={attractions}
                  height="600px"
                  active={activeTab === 'map'}
                />
              </div>
            )}
            
            <div className={`mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'rtl' : 'ltr'}`}>
              <div className={`flex items-center ${isRTL ? 'rtl-flex' : ''}`}>
                <div className={`w-4 h-4 bg-emerald-600 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                <span className="text-sm">{t('discover.mapLegend.regions')} ({regions.length})</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'rtl-flex' : ''}`}>
                <div className={`w-4 h-4 bg-blue-600 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                <span className="text-sm">{t('discover.mapLegend.attractions')} ({attractions.length})</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'rtl-flex' : ''}`}>
                <div className={`w-4 h-4 bg-purple-600 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                <span className="text-sm">{t('discover.mapLegend.heritageSites')}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'rtl-flex' : ''}`}>
                <div className={`w-4 h-4 bg-orange-600 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                <span className="text-sm">{t('discover.mapLegend.cities')}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Attractions Tab Content */}
        <TabsContent value="attractions" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.attractions')}</h2>
          </div>
          {filteredAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction) => (
                <AttractionCard 
                  key={attraction.id} 
                  attraction={attraction} 
                  regions={regions} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsAttractions')}</p>
            </div>
          )}
        </TabsContent>
        
        {/* Heritage Tab Content */}
        <TabsContent value="heritage" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.heritage')}</h2>
          </div>
          {filteredHeritage.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHeritage.map((heritage) => (
                <HeritageCard 
                  key={heritage.id} 
                  heritage={heritage} 
                  regions={regions} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsHeritage')}</p>
            </div>
          )}
        </TabsContent>
        
        {/* Clothing Tab Content */}
        <TabsContent value="clothing" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.clothing')}</h2>
          </div>
          {filteredClothing.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClothing.map((clothing) => (
                <ClothingCard 
                  key={clothing.id} 
                  clothing={clothing} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsClothing')}</p>
            </div>
          )}
        </TabsContent>
        
        {/* Cuisine Tab Content */}
        <TabsContent value="cuisine" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.cuisine')}</h2>
          </div>
          {filteredCuisine.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCuisine.map((cuisine) => (
                <CuisineCard 
                  key={cuisine.id} 
                  cuisine={cuisine} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsCuisine')}</p>
            </div>
          )}
        </TabsContent>
        
        {/* Festivals Tab Content */}
        <TabsContent value="festivals" className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('discover.tabs.festivals')}</h2>
          </div>
          {filteredFestivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFestivals.map((festival) => (
                <FestivalCard 
                  key={festival.id} 
                  festival={festival} 
                  regions={regions} 
                  t={t} 
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t('discover.noResultsFestivals')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* CRUD Modals - removed as requested */}
    </div>
  );
}

// Region Card Component
const RegionCard = ({ 
  region, 
  attractions, 
  t, 
  isRTL
}: { 
  region: Region; 
  attractions: Attraction[]; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  const regionAttractionsCount = attractions.filter(a => a.regionId === region.id).length;
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gradient-to-r from-emerald-600 to-emerald-400 overflow-hidden">
        {/* Region image from database */}
        {region.imageUrl ? (
          <img 
            src={region.imageUrl} 
            alt={region.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-0 p-4">
          <h3 className="text-xl font-bold text-white">{region.name}</h3>
          <div className={`flex items-center text-white/80 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {region.capital}
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <p className="text-slate-600 line-clamp-3">{region.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-slate-500">{regionAttractionsCount} {t('discover.cards.attractions')}</span>
        <Button asChild>
          <Link to={`/regions/${region.id}`}>{t('discover.cards.exploreRegion')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Attraction Card Component
const AttractionCard = ({ 
  attraction, 
  regions, 
  t, 
  isRTL
}: { 
  attraction: Attraction; 
  regions: Region[]; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  const region = regions.find(r => r.id === attraction.regionId);
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {/* Attraction image from database */}
        {attraction.images && attraction.images.length > 0 ? (
          <img 
            src={attraction.images[0]} 
            alt={attraction.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <div className={`absolute top-4 z-10 ${isRTL ? 'right-4' : 'left-4'}`}>
          <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.type}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{attraction.name}</CardTitle>
        <CardDescription className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          {region ? region.name : 'Morocco'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 line-clamp-3">{attraction.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/attractions/${attraction.id}`}>{t('discover.cards.viewDetails')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Heritage Card Component
const HeritageCard = ({ 
  heritage, 
  regions, 
  t, 
  isRTL
}: { 
  heritage: HeritageItem; 
  regions: Region[]; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className={`flex flex-col md:flex-row h-full ${isRTL ? 'rtl-flex-row' : ''}`}>
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative overflow-hidden">
          {/* Heritage image from database */}
          {heritage.images && heritage.images.length > 0 ? (
            <img 
              src={heritage.images[0]} 
              alt={heritage.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <Badge variant="secondary" className="capitalize">
              {heritage.type ? heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Heritage'}
            </Badge>
          </div>
          {/* CRUD buttons overlay - removed as requested */}
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{heritage.name}</CardTitle>
            <CardDescription>
              {Array.isArray(heritage.regionIds) ? heritage.regionIds.map(regionId => {
                const region = regions.find(r => r.id === regionId);
                return region?.name;
              }).filter(Boolean).join(', ') : 'Multiple Regions'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{heritage.description}</p>
            <div className="text-sm text-emerald-700">
              <p className="font-medium">{t('discover.cards.significance')}:</p>
              <p className="line-clamp-2">{heritage.importance || 'Cultural significance'}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/heritage/${heritage.id}`}>
                {t('discover.cards.learnMore')}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Clothing Card Component
const ClothingCard = ({ 
  clothing, 
  t, 
  isRTL
}: { 
  clothing: ClothingItem; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className={`flex flex-col md:flex-row h-full ${isRTL ? 'rtl-flex-row' : ''}`}>
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative overflow-hidden">
          {/* Clothing image from database */}
          {clothing.images && clothing.images.length > 0 ? (
            <img 
              src={clothing.images[0]} 
              alt={clothing.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <Badge className="capitalize">
              {clothing.gender}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{clothing.name}</CardTitle>
            <CardDescription>
              {t('discover.cards.traditionalMoroccanAttire')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{clothing.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="text-sm font-medium text-slate-700">{t('discover.cards.materials')}:</p>
              {clothing.materials.slice(0, 3).map((material, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {material}
                </Badge>
              ))}
              {clothing.materials.length > 3 && (
                <span className="text-xs text-slate-500">{t('discover.cards.more', { count: String(clothing.materials.length - 3) })}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/clothing/${clothing.id}`}>
                {t('discover.cards.viewDetails')}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Cuisine Card Component
const CuisineCard = ({ 
  cuisine, 
  t, 
  isRTL
}: { 
  cuisine: CuisineItem; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className={`flex flex-col md:flex-row h-full ${isRTL ? 'rtl-flex-row' : ''}`}>
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative overflow-hidden">
          {/* Cuisine image from database */}
          {cuisine.images && cuisine.images.length > 0 ? (
            <img 
              src={cuisine.images[0]} 
              alt={cuisine.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <Badge variant="secondary" className="capitalize">
              {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
          {cuisine.spiceLevel !== 'none' && (
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
              <Badge variant={
                cuisine.spiceLevel === 'mild' ? "outline" : 
                cuisine.spiceLevel === 'medium' ? "secondary" : 
                "destructive"
              }>
                {t('discover.cards.spiceLevel', { level: cuisine.spiceLevel.charAt(0).toUpperCase() + cuisine.spiceLevel.slice(1) })}
              </Badge>
            </div>
          )}
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{cuisine.name}</CardTitle>
            <CardDescription>
              {t('discover.cards.moroccanCuisine')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{cuisine.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="text-sm font-medium text-slate-700">{t('discover.cards.keyIngredients')}:</p>
              {cuisine.ingredients.slice(0, 4).map((ingredient, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {ingredient.split('-').join(' ')}
                </Badge>
              ))}
              {cuisine.ingredients.length > 4 && (
                <span className="text-xs text-slate-500">{t('discover.cards.more', { count: String(cuisine.ingredients.length - 4) })}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/cuisine/${cuisine.id}`}>
                {t('discover.cards.seeRecipe')}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Festival Card Component
const FestivalCard = ({ 
  festival, 
  regions, 
  t, 
  isRTL
}: { 
  festival: FestivalEvent; 
  regions: Region[]; 
  t: (key: string, params?: Record<string, string | number>) => string; 
  isRTL: boolean;
}) => {
  const region = festival.regionId !== 'all' 
    ? regions.find(r => r.id === festival.regionId) 
    : null;
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className={`flex flex-col md:flex-row h-full ${isRTL ? 'rtl-flex-row' : ''}`}>
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative overflow-hidden">
          {/* Festival image from database */}
          {festival.images && festival.images.length > 0 ? (
            <img 
              src={festival.images[0]} 
              alt={festival.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <Badge variant="secondary" className="capitalize">
              {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{festival.name}</CardTitle>
            <CardDescription className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {festival.location} {region && `(${region.name})`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{festival.description}</p>
            
            <div className={`flex items-center text-sm text-slate-700 space-x-4 mb-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className={`h-4 w-4 text-slate-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span>{festival.timeOfYear}</span>
              </div>
              <div>
                <span className="font-medium">{festival.duration} {festival.duration > 1 ? t('discover.cards.days') : t('discover.cards.day')}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/festivals/${festival.id}`}>
                {t('discover.cards.viewFestival')}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};