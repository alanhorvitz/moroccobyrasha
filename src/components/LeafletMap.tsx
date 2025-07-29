import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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
  location: { lat: number; lng: number };
  type: string;
  description: string;
}

interface LeafletMapProps {
  regions?: Region[];
  attractions?: Attraction[];
  height?: string;
}

// Custom icons for different marker types
const regionIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const attractionIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to fit map bounds to all markers
function FitBounds({ regions, attractions }: { regions: Region[], attractions: Attraction[] }) {
  const map = useMap();

  useEffect(() => {
    if (regions.length === 0 && attractions.length === 0) return;

    const bounds = new LatLngBounds([]);
    
    regions.forEach(region => {
      bounds.extend([region.coordinates.lat, region.coordinates.lng]);
    });
    
    attractions.forEach(attraction => {
      bounds.extend([attraction.location.lat, attraction.location.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, regions, attractions]);

  return null;
}

export function LeafletMap({ 
  regions = [], 
  attractions = [], 
  height = "600px" 
}: LeafletMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<{ type: 'region' | 'attraction', data: Region | Attraction } | null>(null);

  // Morocco's approximate center
  const moroccoCenter: [number, number] = [31.7917, -7.0926];

  const handleMarkerClick = (type: 'region' | 'attraction', data: Region | Attraction) => {
    setSelectedMarker({ type, data });
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={moroccoCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
      >
        <TileLayer
          url="/images/Map.jpg"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Region markers */}
        {regions.map((region) => (
          <Marker
            key={`region-${region.id}`}
            position={[region.coordinates.lat, region.coordinates.lng]}
            icon={regionIcon}
            eventHandlers={{
              click: () => handleMarkerClick('region', region),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{region.name}</h3>
                <p className="text-xs text-gray-600">Capital: {region.capital}</p>
                <Button 
                  size="sm" 
                  className="mt-2 h-6 px-2 text-xs"
                  onClick={() => handleMarkerClick('region', region)}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Attraction markers */}
        {attractions.map((attraction) => (
          <Marker
            key={`attraction-${attraction.id}`}
            position={[attraction.location.lat, attraction.location.lng]}
            icon={attractionIcon}
            eventHandlers={{
              click: () => handleMarkerClick('attraction', attraction),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{attraction.name}</h3>
                <p className="text-xs text-gray-600">Type: {attraction.type}</p>
                <Button 
                  size="sm" 
                  className="mt-2 h-6 px-2 text-xs"
                  onClick={() => handleMarkerClick('attraction', attraction)}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds regions={regions} attractions={attractions} />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs text-slate-600 space-y-2">
          <div className="font-medium mb-2 flex items-center gap-1">
            <Navigation className="h-3 w-3" />
            Morocco Interactive Map
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
            <span>Regions ({regions.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span>Attractions ({attractions.length})</span>
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
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
                {selectedMarker.type === 'region' 
                  ? (selectedMarker.data as Region).name
                  : (selectedMarker.data as Attraction).name
                }
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
                      <p>
                        {(selectedMarker.data as Region).coordinates.lat.toFixed(4)}, 
                        {(selectedMarker.data as Region).coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/regions/${selectedMarker.data.id}`}>
                        Explore Region
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/tourism?region=${selectedMarker.data.id}`}>
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
                      <p>
                        {(selectedMarker.data as Attraction).location.lat.toFixed(4)}, 
                        {(selectedMarker.data as Attraction).location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/attractions/${selectedMarker.data.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/tourism?attraction=${selectedMarker.data.id}`}>
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
    </div>
  );
}