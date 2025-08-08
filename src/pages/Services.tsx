import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Users, Phone, Mail, Car, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { tourGuides } from '@/lib/data/guides';
import { transportServices } from '@/lib/data/transport';
import { moroccanRegions as regions } from '@/lib/data/regions';
import { Guide, TransportService } from '@/lib/types';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("guides");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Guide filters
  const [selectedGuideRegion, setSelectedGuideRegion] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  
  // Transport filters
  const [selectedTransportType, setSelectedTransportType] = useState<string>("all");
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  
  // Extract unique languages and specialties for filtering
  const allLanguages = [...new Set(tourGuides.flatMap(guide => guide.languages))];
  const allSpecialties = [...new Set(tourGuides.flatMap(guide => guide.specialties))];
  
  // Extract unique transport types
  const allTransportTypes = [...new Set(transportServices.map(service => service.type))];
  
  // Filter guides based on criteria
  const filteredGuides = tourGuides.filter(guide => {
    const matchesSearch = !searchTerm || 
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedGuideRegion === "all" || 
      guide.regions.includes(selectedGuideRegion);
    
    const matchesLanguage = selectedLanguage === "all" || 
      guide.languages.includes(selectedLanguage);
    
    const matchesSpecialty = selectedSpecialty === "all" || 
      guide.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesRegion && matchesLanguage && matchesSpecialty;
  });
  
  // Filter transport services based on criteria
  const filteredTransport = transportServices.filter(service => {
    const matchesSearch = !searchTerm || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedTransportType === "all" || 
      service.type === selectedTransportType;
    
    const matchesCapacity = !selectedCapacity || 
      service.capacity >= selectedCapacity;
    
    return matchesSearch && matchesType && matchesCapacity;
  });
  
  // Reset guide filters
  const resetGuideFilters = () => {
    setSearchTerm("");
    setSelectedGuideRegion("all");
    setSelectedLanguage("all");
    setSelectedSpecialty("all");
  };
  
  // Reset transport filters
  const resetTransportFilters = () => {
    setSearchTerm("");
    setSelectedTransportType("all");
    setSelectedCapacity(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tourism Services</h1>
        <p className="text-xl text-slate-600">
          Find local guides and transportation services to enhance your Moroccan experience.
        </p>
      </div>
      
      {/* Service Type Tabs */}
      <Tabs defaultValue="guides" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="guides">Local Guides</TabsTrigger>
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
        </TabsList>
        
        {/* Guides Tab Content */}
        <TabsContent value="guides" className="mt-6">
          {/* Search and Filter for Guides */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search guides by name or specialty..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" onClick={resetGuideFilters} className="shrink-0">
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Region:</label>
                <Select value={selectedGuideRegion} onValueChange={setSelectedGuideRegion}>
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
              
              {/* Language Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Language:</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {allLanguages.map(language => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Specialty Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Specialty:</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {allSpecialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Guides List */}
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No guides found matching your criteria.</p>
              <Button onClick={resetGuideFilters} className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Transportation Tab Content */}
        <TabsContent value="transportation" className="mt-6">
          {/* Search and Filter for Transportation */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search transportation services..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" onClick={resetTransportFilters} className="shrink-0">
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Vehicle Type:</label>
                <Select value={selectedTransportType} onValueChange={setSelectedTransportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {allTransportTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Capacity Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Capacity:</label>
                <Select 
                  value={selectedCapacity?.toString() || "any"} 
                  onValueChange={(value) => setSelectedCapacity(value === "any" ? null : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Capacity</SelectItem>
                    <SelectItem value="2">2+ passengers</SelectItem>
                    <SelectItem value="4">4+ passengers</SelectItem>
                    <SelectItem value="6">6+ passengers</SelectItem>
                    <SelectItem value="10">10+ passengers</SelectItem>
                    <SelectItem value="15">15+ passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Transportation List */}
          {filteredTransport.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTransport.map(transport => (
                <TransportCard key={transport.id} transport={transport} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No transportation services found matching your criteria.</p>
              <Button onClick={resetTransportFilters} className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Guide Card Component
const GuideCard = ({ guide }: { guide: Guide }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-1/3 bg-slate-200 relative">
          {/* Guide image would go here in implementation */}
          {!guide.available && (
            <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs text-center py-1">
              Currently Unavailable
            </div>
          )}
        </div>
        <div className="w-full sm:w-2/3 flex flex-col">
          <CardHeader>
            <CardTitle>{guide.name}</CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-2 mt-1">
              {guide.regions.map(regionId => {
                const region = regions.find(r => r.id === regionId);
                return region ? (
                  <Badge key={regionId} variant="outline" className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {region.name}
                  </Badge>
                ) : null;
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-slate-600 text-sm line-clamp-3 mb-3">{guide.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.languages.map(language => (
                <Badge key={language} variant="secondary">{language}</Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map(specialty => (
                <Badge key={specialty} variant="outline">{specialty}</Badge>
              ))}
            </div>
            
            {guide.rating && (
              <div className="flex items-center mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(guide.rating) ? "text-yellow-500" : "text-slate-300"}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {guide.rating.toFixed(1)} ({guide.reviewCount} reviews)
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-bold">${guide.hourlyRate}/hour</span>
              <div className="flex items-center text-sm text-slate-500">
                <Phone className="h-3 w-3 mr-1" />
                {guide.contactPhone}
              </div>
            </div>
            <Button asChild disabled={!guide.available}>
              <Link to={`#contact-guide-${guide.id}`}>
                Contact Guide
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Transport Card Component
const TransportCard = ({ transport }: { transport: TransportService }) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-200">
        {/* Transport image would go here in implementation */}
        <div className="absolute top-4 left-4">
          <Badge className="capitalize">
            {transport.type}
          </Badge>
        </div>
        {!transport.available && (
          <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center text-xs py-1">
            Currently Unavailable
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{transport.name}</CardTitle>
        <CardDescription className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Capacity: {transport.capacity} passengers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 line-clamp-2 mb-4">{transport.description}</p>
        
        <h4 className="text-sm font-medium mb-2">Features:</h4>
        <ul className="text-sm text-slate-600 space-y-1 mb-4">
          {transport.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
          {transport.features.length > 3 && (
            <li className="text-slate-400">+ {transport.features.length - 3} more features</li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center">
          <Car className="h-4 w-4 mr-1 text-slate-400" />
          <span className="font-bold">${transport.pricePerDay}</span>
          <span className="text-sm text-slate-500 ml-1">/ day</span>
        </div>
        <Button asChild disabled={!transport.available}>
          <Link to={`#book-transport-${transport.id}`}>
            <Calendar className="mr-2 h-4 w-4" />
            Book Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};