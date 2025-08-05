import { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

interface Region {
  id: string;
  name: string;
  capital: string;
  coordinates: { lat: number; lng: number };
  description: string;
}

interface Attraction {
  id: string;
  name: string;
  location: { lat: number; lng: number }; // Using 'location' as in attractions.ts
  type: string; // Using 'type' instead of 'category' as in attractions.ts
  description: string;
}

interface MoroccoMapProps {
  regions?: Region[];
  attractions?: Attraction[];
  height?: string;
}

interface MapMarker {
  id: string;
  type: 'region' | 'attraction';
  name: string;
  coordinates: { lat: number; lng: number };
  data: Region | Attraction;
}

export function MoroccoMap({ 
  regions = [], 
  attractions = [], 
  height = "600px" 
}: MoroccoMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);

  // Convert regions and attractions to map markers
  const mapMarkers: MapMarker[] = [
    ...regions.map(region => ({
      id: region.id,
      type: 'region' as const,
      name: region.name,
      coordinates: region.coordinates, // Use the object directly
      data: region
    })),
    ...attractions.map(attraction => ({
      id: attraction.id,
      type: 'attraction' as const,
      name: attraction.name,
      coordinates: attraction.location, // Use location instead of coordinates
      data: attraction
    }))
  ];

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="relative" style={{ height }}>
      {/* Morocco Map Background */}
      <div 
        className="relative h-full w-full bg-gradient-to-br from-blue-100 via-emerald-50 to-yellow-50 rounded-lg overflow-hidden"
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
          `)}`
        }}
      >
        {/* Markers overlaid on the map */}
        {mapMarkers.map((marker) => {
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
                      : `Category: ${(marker.data as Attraction).type}`
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
            <span>Regions ({mapMarkers.filter(m => m.type === 'region').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Attractions ({mapMarkers.filter(m => m.type === 'attraction').length})</span>
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
                ✕
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
                      <span className="font-medium">Coordinates:</span>
                      <p>{selectedMarker.coordinates.lat.toFixed(4)}, {selectedMarker.coordinates.lng.toFixed(4)}</p>
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
                      {(selectedMarker.data as Attraction).description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{(selectedMarker.data as Attraction).type}</p>
                    </div>
                    <div>
                      <span className="font-medium">Coordinates:</span>
                      <p>{selectedMarker.coordinates.lat.toFixed(4)}, {selectedMarker.coordinates.lng.toFixed(4)}</p>
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

      {/* Information note */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Info className="h-3 w-3" />
          <span>Click markers to explore</span>
        </div>
      </div>
    </div>
  );
}