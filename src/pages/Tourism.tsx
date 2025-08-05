import { useState } from 'react';
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

import { tourPackages } from '@/lib/data/tour-packages';
import { moroccanRegions as regions } from '@/lib/data/regions';
import { travelGuides } from '@/lib/data/travel-guides';
import { virtualTours } from '@/lib/data/virtual-tours';
import { TourPackage, TravelGuide, VirtualTour } from '@/lib/types';

export default function TourismPage() {
  const [activeTab, setActiveTab] = useState("tours");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTours, setFilteredTours] = useState(tourPackages);
  const [filteredGuides, setFilteredGuides] = useState(travelGuides);
  const [filteredVirtualTours, setFilteredVirtualTours] = useState(virtualTours);
  
  // Filter states for tour packages
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 15]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  
  // Filter states for travel guides
  const [selectedGuideType, setSelectedGuideType] = useState<string>("all");
  const [selectedGuideRegion, setSelectedGuideRegion] = useState<string>("all");
  
  // Filter states for virtual tours
  const [selectedVirtualTourRegion, setSelectedVirtualTourRegion] = useState<string>("all");
  
  const maxDuration = Math.max(...tourPackages.map(tour => tour.duration));
  const maxPrice = Math.max(...tourPackages.map(tour => tour.price));
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    resetFilters();
  };
  
  // Handle search input
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
  
  // Tour package filters
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
  
  // Apply all tour package filters
  const applyTourFilters = (
    term: string,
    region: string,
    duration: [number, number],
    price: [number, number]
  ) => {
    setFilteredTours(
      tourPackages.filter(tour => {
        // Search term filter
        const matchesSearch =
          tour.title.toLowerCase().includes(term) ||
          tour.description.toLowerCase().includes(term);
        
        // Region filter
        const matchesRegion = region === "all" || tour.regionId === region;
        
        // Duration filter
        const matchesDuration =
          tour.duration >= duration[0] && tour.duration <= duration[1];
        
        // Price filter
        const matchesPrice =
          tour.price >= price[0] && tour.price <= price[1];
        
        return matchesSearch && matchesRegion && matchesDuration && matchesPrice;
      })
    );
  };
  
  // Travel guide filters
  const handleGuideTypeChange = (value: string) => {
    setSelectedGuideType(value);
    applyGuideFilters(searchTerm, value, selectedGuideRegion);
  };
  
  const handleGuideRegionChange = (value: string) => {
    setSelectedGuideRegion(value);
    applyGuideFilters(searchTerm, selectedGuideType, value);
  };
  
  // Apply all travel guide filters
  const applyGuideFilters = (term: string, type: string, region: string) => {
    setFilteredGuides(
      travelGuides.filter(guide => {
        // Search term filter
        const matchesSearch =
          guide.title.toLowerCase().includes(term) ||
          guide.description.toLowerCase().includes(term) ||
          guide.tags.some(tag => tag.toLowerCase().includes(term));
        
        // Type filter
        const matchesType = type === "all" || guide.type === type;
        
        // Region filter
        const matchesRegion = 
          region === "all" || 
          guide.regionIds.includes(region) || 
          guide.regionIds.includes("all");
        
        return matchesSearch && matchesType && matchesRegion;
      })
    );
  };
  
  // Virtual tour filters
  const handleVirtualTourRegionChange = (value: string) => {
    setSelectedVirtualTourRegion(value);
    applyVirtualTourFilters(searchTerm, value);
  };
  
  // Apply all virtual tour filters
  const applyVirtualTourFilters = (term: string, region: string) => {
    setFilteredVirtualTours(
      virtualTours.filter(tour => {
        // Search term filter
        const matchesSearch =
          tour.title.toLowerCase().includes(term) ||
          tour.description.toLowerCase().includes(term);
        
        // Region filter
        const matchesRegion = region === "all" || tour.regionId === region;
        
        return matchesSearch && matchesRegion;
      })
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    if (activeTab === "tours") {
      setSelectedRegion("all");
      setDurationRange([1, maxDuration]);
      setPriceRange([0, maxPrice]);
      setFilteredTours(tourPackages);
    } else if (activeTab === "guides") {
      setSelectedGuideType("all");
      setSelectedGuideRegion("all");
      setFilteredGuides(travelGuides);
    } else if (activeTab === "virtual-tours") {
      setSelectedVirtualTourRegion("all");
      setFilteredVirtualTours(virtualTours);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Moroccan Tourism</h1>
        <p className="text-xl text-slate-600">
          Discover Morocco through our tour packages, travel guides, and virtual tours for an unforgettable experience.
        </p>
      </div>
      
      {/* Tabs for different tourism sections */}
      <Tabs defaultValue="tours" value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full md:w-fit grid-cols-3 mx-auto">
          <TabsTrigger value="tours">Tour Packages</TabsTrigger>
          <TabsTrigger value="guides">Travel Guides</TabsTrigger>
          <TabsTrigger value="virtual-tours">Virtual Tours</TabsTrigger>
        </TabsList>

        {/* Tour Packages Tab */}
        <TabsContent value="tours">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search tour packages..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Region
                </label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Duration Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Duration (days): {durationRange[0]} - {durationRange[1]}
                </label>
                <Slider
                  defaultValue={[1, maxDuration]}
                  min={1}
                  max={maxDuration}
                  step={1}
                  value={[durationRange[0], durationRange[1]]}
                  onValueChange={handleDurationChange}
                  className="my-4"
                />
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" /> Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  defaultValue={[0, maxPrice]}
                  min={0}
                  max={maxPrice}
                  step={50}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="my-4"
                />
              </div>
            </div>
          </div>
          
          {/* Tour Packages List */}
          <div>
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">No tour packages found matching your criteria.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Travel Guides Tab */}
        <TabsContent value="guides">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search travel guides..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guide Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Book className="h-4 w-4 mr-1" /> Guide Type
                </label>
                <Select value={selectedGuideType} onValueChange={handleGuideTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="specialized">Specialized</SelectItem>
                    <SelectItem value="thematic">Thematic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Region
                </label>
                <Select value={selectedGuideRegion} onValueChange={handleGuideRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Travel Guides List */}
          <div>
            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.map((guide) => (
                  <TravelGuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">No travel guides found matching your criteria.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Virtual Tours Tab */}
        <TabsContent value="virtual-tours">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search virtual tours..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1">
              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Region
                </label>
                <Select value={selectedVirtualTourRegion} onValueChange={handleVirtualTourRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Virtual Tours List */}
          <div>
            {filteredVirtualTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVirtualTours.map((tour) => (
                  <VirtualTourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">No virtual tours found matching your criteria.</p>
                <Button onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tour Package Card Component
const TourCard = ({ tour }: { tour: TourPackage }) => {
  const region = regions.find(r => r.id === tour.regionId);
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-200">
        {/* Tour image would go here in implementation */}
        <div className="absolute top-4 left-4">
          {tour.featured && (
            <Badge className="bg-emerald-600 hover:bg-emerald-700">Featured</Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{tour.duration} days</span>
            </div>
            <span className="font-bold">${tour.price}</span>
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{tour.title}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {region ? region.name : 'Multiple Regions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 line-clamp-3">{tour.description}</p>
        {tour.rating && (
          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(tour.rating) ? "text-yellow-500" : "text-slate-300"}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">
              {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-slate-500">
          <Users className="h-4 w-4 mr-1" />
          <span>Max {tour.maxParticipants}</span>
        </div>
        <Button asChild>
          <Link to={`/tours/${tour.id}`}>View Tour</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Travel Guide Card Component
const TravelGuideCard = ({ guide }: { guide: TravelGuide }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-60 md:h-auto bg-slate-200 relative">
          {/* Guide featured image would go here in implementation */}
          <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
            <Badge variant={
              guide.type === 'general' ? 'default' :
              guide.type === 'specialized' ? 'secondary' : 'outline'
            }>
              {guide.type.charAt(0).toUpperCase() + guide.type.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{guide.title}</CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-1">
              <span>By {guide.author}</span>
              <span className="text-xs">• {new Date(guide.publishedDate).toLocaleDateString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 line-clamp-3 mb-3">{guide.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.tags.slice(0, 5).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {guide.tags.length > 5 && (
                <span className="text-xs text-slate-500">+{guide.tags.length - 5} more</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full group">
              <Link to={`/guides/${guide.id}`}>
                Read Guide
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Virtual Tour Card Component
const VirtualTourCard = ({ tour }: { tour: VirtualTour }) => {
  const region = regions.find(r => r.id === tour.regionId);
  
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-60 bg-slate-200">
        {/* Tour thumbnail image would go here in implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="lg" className="flex items-center gap-2 bg-black/70 hover:bg-black">
            <Video className="h-5 w-5" />
            <span>Experience 360°</span>
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
            <span>{region ? region.name : 'Morocco'}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{tour.duration} min</span>
          </div>
        </div>
        <p className="text-slate-600 line-clamp-3">{tour.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/virtual-tours/${tour.id}`}>
            Start Virtual Tour
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};