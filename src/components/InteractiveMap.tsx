import { useState, useEffect } from 'react';
import { MapPin, Info, X, Navigation, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { moroccanRegions } from '@/lib/data/regions';
import { touristAttractions } from '@/lib/data/attractions';
import { Region, TouristAttraction } from '@/lib/types';

interface MapMarker {
  id: string;
  type: 'region' | 'attraction';
  name: string;
  coordinates: { lat: number; lng: number };
  data: Region | TouristAttraction;
}

// Enhanced map data with real coordinates
const mapMarkers: MapMarker[] = [
  // Regions with actual coordinates
  { id: 'casablanca-settat', type: 'region', name: 'Casablanca-Settat', coordinates: { lat: 33.5731, lng: -7.5898 }, data: moroccanRegions.find(r => r.id === 'casablanca-settat')! },
  { id: 'marrakech-safi', type: 'region', name: 'Marrakech-Safi', coordinates: { lat: 31.6225, lng: -7.9898 }, data: moroccanRegions.find(r => r.id === 'marrakech-safi')! },
  { id: 'fes-meknes', type: 'region', name: 'Fès-Meknès', coordinates: { lat: 34.0181, lng: -5.0078 }, data: moroccanRegions.find(r => r.id === 'fes-meknes')! },
  { id: 'rabat-sale-kenitra', type: 'region', name: 'Rabat-Salé-Kénitra', coordinates: { lat: 34.0209, lng: -6.8416 }, data: moroccanRegions.find(r => r.id === 'rabat-sale-kenitra')! },
  { id: 'tangier-tetouan-al-hoceima', type: 'region', name: 'Tangier-Tétouan-Al Hoceïma', coordinates: { lat: 35.7595, lng: -5.8340 }, data: moroccanRegions.find(r => r.id === 'tangier-tetouan-al-hoceima')! },
  { id: 'oriental', type: 'region', name: 'Oriental', coordinates: { lat: 34.6814, lng: -2.9336 }, data: moroccanRegions.find(r => r.id === 'oriental')! },
  { id: 'souss-massa', type: 'region', name: 'Souss-Massa', coordinates: { lat: 30.4278, lng: -9.5981 }, data: moroccanRegions.find(r => r.id === 'souss-massa')! },
  { id: 'draa-tafilalet', type: 'region', name: 'Drâa-Tafilalet', coordinates: { lat: 31.9314, lng: -4.4316 }, data: moroccanRegions.find(r => r.id === 'draa-tafilalet')! },
  
  // Major attractions with coordinates
  ...touristAttractions.slice(0, 8).map(attraction => ({
    id: attraction.id,
    type: 'attraction' as const,
    name: attraction.name,
    coordinates: getAttractionCoordinates(attraction.name),
    data: attraction
  }))
];

function getAttractionCoordinates(name: string): { lat: number; lng: number } {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    'Jemaa el-Fnaa': { lat: 31.6260, lng: -7.9892 },
    'Hassan II Mosque': { lat: 33.6082, lng: -7.6325 },
    'Fes el Bali': { lat: 34.0656, lng: -4.9734 },
    'Chefchaouen Blue City': { lat: 35.1688, lng: -5.2636 },
    'Sahara Desert (Merzouga)': { lat: 31.0801, lng: -4.0133 },
    'Atlas Mountains': { lat: 31.2574, lng: -7.8759 },
    'Essaouira Medina': { lat: 31.5125, lng: -9.7749 },
    'Ait Benhaddou': { lat: 31.0472, lng: -7.1318 }
  };
  return coordinates[name] || { lat: 31.7917, lng: -7.0926 }; // Default to Morocco center
}

export default function InteractiveMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'regions' | 'attractions'>('all');
  const [mapCenter, setMapCenter] = useState({ lat: 31.7917, lng: -7.0926 });
  const [zoomLevel, setZoomLevel] = useState(6);
  const [isMapReady, setIsMapReady] = useState(false);

  const filteredMarkers = mapMarkers.filter(marker => {
    if (filterType === 'all') return true;
    if (filterType === 'regions') return marker.type === 'region';
    if (filterType === 'attractions') return marker.type === 'attraction';
    return true;
  });

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setMapCenter(marker.coordinates);
    setZoomLevel(10);
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
    setMapCenter({ lat: 31.7917, lng: -7.0926 });
    setZoomLevel(6);
  };

  const resetMapView = () => {
    setMapCenter({ lat: 31.7917, lng: -7.0926 });
    setZoomLevel(6);
    setSelectedMarker(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Map Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={(value: 'all' | 'regions' | 'attractions') => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter markers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markers</SelectItem>
              <SelectItem value="regions">Regions Only</SelectItem>
              <SelectItem value="attractions">Attractions Only</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={resetMapView}>
            <Navigation className="h-4 w-4 mr-1" />
            Reset View
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <span>Regions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Attractions</span>
          </div>
        </div>
      </div>

      {/* Enhanced Map Container with Interactive Features */}
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100">
        <div 
          className="relative h-[600px] w-full bg-gradient-to-br from-blue-100 via-emerald-50 to-yellow-50"
          style={{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <!-- Morocco Outline -->
                <path d="M200,150 L800,120 L820,200 L750,280 L700,360 L650,440 L700,520 L600,600 L500,680 L400,760 L300,840 L250,900 L220,960 L180,920 L160,840 L140,760 L160,680 L180,600 L200,520 L240,440 L220,360 L200,280 L180,200 Z" 
                      fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" opacity="0.6"/>
              </svg>
            `)})`
          }}
        >
          {/* Markers */}
          {filteredMarkers.map((marker) => {
            // Convert lat/lng to screen coordinates (simplified projection)
            const x = ((marker.coordinates.lng + 13) / 20) * 100; // Convert longitude to percentage
            const y = ((35 - marker.coordinates.lat) / 15) * 100;  // Convert latitude to percentage
            
            return (
              <div
                key={marker.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedMarker?.id === marker.id ? 'z-20 scale-125' : 'z-10'
                }`}
                style={{
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`
                }}
                onMouseEnter={() => setHoveredMarker(marker)}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={() => handleMarkerClick(marker)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    marker.type === 'region' 
                      ? 'bg-emerald-500 hover:bg-emerald-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                
                {/* Hover tooltip */}
                {hoveredMarker?.id === marker.id && !selectedMarker && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border text-xs whitespace-nowrap z-30">
                    <div className="font-semibold">{marker.name}</div>
                    <div className="text-slate-600">
                      {marker.type === 'region' 
                        ? `Capital: ${(marker.data as Region).capital}`
                        : `Category: ${(marker.data as TouristAttraction).category}`
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-medium mb-2">Interactive Morocco Map</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Regions ({filteredMarkers.filter(m => m.type === 'region').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Attractions ({filteredMarkers.filter(m => m.type === 'attraction').length})</span>
            </div>
          </div>
        </div>

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
          <div className="text-xs text-slate-600">
            Zoom: {zoomLevel}x
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleClosePopup}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${selectedMarker.type === 'region' ? 'text-emerald-600' : 'text-red-600'}`} />
                {selectedMarker.name}
              </CardTitle>
              <CardDescription>
                {selectedMarker.type === 'region' ? 'Region' : 'Tourist Attraction'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {selectedMarker.type === 'region' ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {(selectedMarker.data as Region).description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Capital:</span>
                      <p>{(selectedMarker.data as Region).capital}</p>
                    </div>
                    <div>
                      <span className="font-medium">Population:</span>
                      <p>{(selectedMarker.data as Region).population}</p>
                    </div>
                    <div>
                      <span className="font-medium">Best Time:</span>
                      <p>{(selectedMarker.data as Region).bestTimeToVisit}</p>
                    </div>
                    <div>
                      <span className="font-medium">Climate:</span>
                      <p>{(selectedMarker.data as Region).climate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Top Attractions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(selectedMarker.data as Region).attractions.slice(0, 6).map((attraction) => (
                        <Badge key={attraction} variant="outline" className="text-xs">
                          {attraction}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/regions/${selectedMarker.data.id}`}>
                        Explore Region
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/tourism?region=${selectedMarker.data.id}`}>
                        View Tours
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 line-clamp-4">
                      {(selectedMarker.data as TouristAttraction).description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{(selectedMarker.data as TouristAttraction).category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Best Time:</span>
                      <p>{(selectedMarker.data as TouristAttraction).bestTimeToVisit}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{(selectedMarker.data as TouristAttraction).duration}</p>
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>
                      <p>{(selectedMarker.data as TouristAttraction).difficulty || 'Easy'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Activities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(selectedMarker.data as TouristAttraction).activities?.slice(0, 4).map((activity) => (
                        <Badge key={activity} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/attractions/${selectedMarker.data.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/tourism?attraction=${selectedMarker.data.id}`}>
                        Find Tours
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Click regions to explore</span>
          </div>
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Interactive Morocco Map</span>
          </div>
        </div>
      </div>
    </div>
  );
}