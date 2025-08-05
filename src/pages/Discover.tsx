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

export default function DiscoverPage() {
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
    queryKey: ['regions'],
    queryFn: apiService.getRegions,
  });

  const { data: apiAttractions, isLoading: attractionsLoading, error: attractionsError } = useQuery({
    queryKey: ['attractions'],
    queryFn: apiService.getAttractions,
  });

  const { data: apiHeritages, isLoading: heritagesLoading, error: heritagesError } = useQuery({
    queryKey: ['heritages'],
    queryFn: apiService.getHeritages,
  });

  const { data: apiClothing, isLoading: clothingLoading, error: clothingError } = useQuery({
    queryKey: ['clothing'],
    queryFn: apiService.getClothing,
  });

  const { data: apiCuisines, isLoading: cuisinesLoading, error: cuisinesError } = useQuery({
    queryKey: ['cuisines'],
    queryFn: apiService.getCuisines,
  });

  const { data: apiFestivals, isLoading: festivalsLoading, error: festivalsError } = useQuery({
    queryKey: ['festivals'],
    queryFn: apiService.getFestivals,
  });

  // Transform API data to frontend format
  const regions = apiRegions?.map(transformApiData.region) || [];
  const attractions = apiAttractions?.map(transformApiData.attraction) || [];
  const heritageItems = apiHeritages?.map(transformApiData.heritage) || [];
  const clothingItems = apiClothing?.map(transformApiData.clothing) || [];
  const cuisineItems = apiCuisines?.map(transformApiData.cuisine) || [];
  const festivalEvents = apiFestivals?.map(transformApiData.festival) || [];

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
                {selectedCategory ? `Category: ${selectedCategory}` : "Filter by Category"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                All Categories
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
                {selectedHeritageType ? `Type: ${selectedHeritageType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : "Filter by Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleHeritageTypeFilter(null)}>
                All Types
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
                {selectedClothingGender ? `Gender: ${selectedClothingGender.charAt(0).toUpperCase() + selectedClothingGender.slice(1)}` : "Filter by Gender"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleClothingGenderFilter(null)}>
                All Genders
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
                {selectedCuisineType ? `Type: ${selectedCuisineType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : "Filter by Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCuisineTypeFilter(null)}>
                All Types
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
                {selectedFestivalType ? `Type: ${selectedFestivalType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : "Filter by Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleFestivalTypeFilter(null)}>
                All Types
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
          <p className="text-lg text-slate-600">Loading Morocco's treasures...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Oops! Something went wrong</h1>
          <p className="text-lg text-slate-600 mb-6">
            We're having trouble loading the data. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Morocco</h1>
        <p className="text-xl text-slate-600">
          Explore the diverse regions, heritage, cuisine, and culture that make Morocco an unforgettable destination.
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {getFilterDropdown()}
        </div>
      </div>
      
      {/* Tabs for different discover sections */}
      <Tabs defaultValue="regions" value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="heritage">Heritage</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="cuisine">Cuisine</TabsTrigger>
          <TabsTrigger value="festivals">Festivals</TabsTrigger>
        </TabsList>
        
        {/* Regions Tab Content */}
        <TabsContent value="regions" className="pt-6">
          {filteredRegions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.map((region) => (
                <RegionCard key={region.id} region={region} attractions={attractions} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No regions found matching your search.</p>
            </div>
          )}
        </TabsContent>

        {/* Interactive Map Tab Content */}
        <TabsContent value="map" className="pt-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <Map className="h-5 w-5 mr-2 text-emerald-600" />
              <h2 className="text-xl font-semibold">Interactive Map of Morocco</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Explore Morocco's regions, attractions, and points of interest on our interactive map. 
              Click on markers to learn more about each location.
            </p>
            
            {isLoading ? (
              <div className="h-[600px] rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Loading map data...</p>
                </div>
              </div>
            ) : regions.length === 0 && attractions.length === 0 ? (
              <div className="h-[600px] rounded-lg border flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-600">No map data available</p>
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
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-emerald-600 rounded-full mr-2"></div>
                <span className="text-sm">Regions ({regions.length})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm">Attractions ({attractions.length})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
                <span className="text-sm">Heritage Sites</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-600 rounded-full mr-2"></div>
                <span className="text-sm">Cities</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Attractions Tab Content */}
        <TabsContent value="attractions" className="pt-6">
          {filteredAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} regions={regions} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No attractions found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Heritage Tab Content */}
        <TabsContent value="heritage" className="pt-6">
          {filteredHeritage.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHeritage.map((heritage) => (
                <HeritageCard key={heritage.id} heritage={heritage} regions={regions} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No heritage items found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Clothing Tab Content */}
        <TabsContent value="clothing" className="pt-6">
          {filteredClothing.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClothing.map((clothing) => (
                <ClothingCard key={clothing.id} clothing={clothing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No clothing items found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Cuisine Tab Content */}
        <TabsContent value="cuisine" className="pt-6">
          {filteredCuisine.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCuisine.map((cuisine) => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No cuisine items found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Festivals Tab Content */}
        <TabsContent value="festivals" className="pt-6">
          {filteredFestivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFestivals.map((festival) => (
                <FestivalCard key={festival.id} festival={festival} regions={regions} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No festivals found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Region Card Component
const RegionCard = ({ region, attractions }: { region: Region; attractions: Attraction[] }) => {
  const regionAttractionsCount = attractions.filter(a => a.regionId === region.id).length;
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gradient-to-r from-emerald-600 to-emerald-400">
        {/* Region image would go here in implementation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-0 p-4">
          <h3 className="text-xl font-bold text-white">{region.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {region.capital}
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <p className="text-slate-600 line-clamp-3">{region.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-slate-500">{regionAttractionsCount} attractions</span>
        <Button asChild>
          <Link to={`/regions/${region.id}`}>Explore Region</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Attraction Card Component
const AttractionCard = ({ attraction, regions }: { attraction: Attraction; regions: Region[] }) => {
  const region = regions.find(r => r.id === attraction.regionId);
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-200">
        {/* Attraction image would go here in implementation */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.type}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{attraction.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {region ? region.name : 'Morocco'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 line-clamp-3">{attraction.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/attractions/${attraction.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Heritage Card Component
const HeritageCard = ({ heritage, regions }: { heritage: HeritageItem; regions: Region[] }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          {/* Heritage image would go here in implementation */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {heritage.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{heritage.name}</CardTitle>
            <CardDescription>
              {heritage.regionIds.map(regionId => {
                const region = regions.find(r => r.id === regionId);
                return region?.name;
              }).filter(Boolean).join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{heritage.description}</p>
            <div className="text-sm text-emerald-700">
              <p className="font-medium">Significance:</p>
              <p className="line-clamp-2">{heritage.importance}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/heritage/${heritage.id}`}>
                Learn More
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Clothing Card Component
const ClothingCard = ({ clothing }: { clothing: ClothingItem }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          {/* Clothing image would go here in implementation */}
          <div className="absolute top-4 left-4">
            <Badge className="capitalize">
              {clothing.gender}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{clothing.name}</CardTitle>
            <CardDescription>
              Traditional Moroccan Attire
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{clothing.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="text-sm font-medium text-slate-700">Materials:</p>
              {clothing.materials.slice(0, 3).map((material, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {material}
                </Badge>
              ))}
              {clothing.materials.length > 3 && (
                <span className="text-xs text-slate-500">+{clothing.materials.length - 3} more</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/clothing/${clothing.id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Cuisine Card Component
const CuisineCard = ({ cuisine }: { cuisine: CuisineItem }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          {/* Cuisine image would go here in implementation */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {cuisine.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
          {cuisine.spiceLevel !== 'none' && (
            <div className="absolute top-4 right-4">
              <Badge variant={
                cuisine.spiceLevel === 'mild' ? "outline" : 
                cuisine.spiceLevel === 'medium' ? "secondary" : 
                "destructive"
              }>
                {cuisine.spiceLevel.charAt(0).toUpperCase() + cuisine.spiceLevel.slice(1)} Spice
              </Badge>
            </div>
          )}
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{cuisine.name}</CardTitle>
            <CardDescription>
              Moroccan Cuisine
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{cuisine.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="text-sm font-medium text-slate-700">Key Ingredients:</p>
              {cuisine.ingredients.slice(0, 4).map((ingredient, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {ingredient.split('-').join(' ')}
                </Badge>
              ))}
              {cuisine.ingredients.length > 4 && (
                <span className="text-xs text-slate-500">+{cuisine.ingredients.length - 4} more</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/cuisine/${cuisine.id}`}>
                See Recipe
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Festival Card Component
const FestivalCard = ({ festival, regions }: { festival: FestivalEvent; regions: Region[] }) => {
  const region = festival.regionId !== 'all' 
    ? regions.find(r => r.id === festival.regionId) 
    : null;
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          {/* Festival image would go here in implementation */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {festival.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{festival.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {festival.location} {region && `(${region.name})`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-4 mb-3">{festival.description}</p>
            
            <div className="flex items-center text-sm text-slate-700 space-x-4 mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                <span>{festival.timeOfYear}</span>
              </div>
              <div>
                <span className="font-medium">{festival.duration} {festival.duration > 1 ? 'days' : 'day'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/festivals/${festival.id}`}>
                View Festival
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};