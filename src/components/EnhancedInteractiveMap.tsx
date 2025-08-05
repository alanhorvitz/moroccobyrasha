import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Info, X, Navigation, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { moroccanRegions } from '@/lib/data/regions';
import { touristAttractions } from '@/lib/data/attractions';
import { Region, TouristAttraction } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMarker {
  id: string;
  type: 'region' | 'attraction';
  name: string;
  position: [number, number];
  data: Region | TouristAttraction;
}

// Morocco coordinates for regions and major attractions
const moroccoMapData: MapMarker[] = [
  // Regions
  { id: 'casablanca-settat', type: 'region', name: 'Casablanca-Settat', position: [33.5731, -7.5898], data: moroccanRegions.find(r => r.id === 'casablanca-settat')! },
  { id: 'marrakech-safi', type: 'region', name: 'Marrakech-Safi', position: [31.6225, -7.9898], data: moroccanRegions.find(r => r.id === 'marrakech-safi')! },
  { id: 'fes-meknes', type: 'region', name: 'Fès-Meknès', position: [34.0181, -5.0078], data: moroccanRegions.find(r => r.id === 'fes-meknes')! },
  { id: 'rabat-sale-kenitra', type: 'region', name: 'Rabat-Salé-Kénitra', position: [34.0209, -6.8416], data: moroccanRegions.find(r => r.id === 'rabat-sale-kenitra')! },
  { id: 'tangier-tetouan-al-hoceima', type: 'region', name: 'Tangier-Tétouan-Al Hoceïma', position: [35.7595, -5.8340], data: moroccanRegions.find(r => r.id === 'tangier-tetouan-al-hoceima')! },
  { id: 'oriental', type: 'region', name: 'Oriental', position: [34.6814, -2.9336], data: moroccanRegions.find(r => r.id === 'oriental')! },
  { id: 'souss-massa', type: 'region', name: 'Souss-Massa', position: [30.4278, -9.5981], data: moroccanRegions.find(r => r.id === 'souss-massa')! },
  { id: 'draa-tafilalet', type: 'region', name: 'Drâa-Tafilalet', position: [31.9314, -4.4316], data: moroccanRegions.find(r => r.id === 'draa-tafilalet')! },
  
  // Major attractions
  ...touristAttractions.slice(0, 10).map(attraction => ({
    id: attraction.id,
    type: 'attraction' as const,
    name: attraction.name,
    position: getAttractionCoordinates(attraction.name),
    data: attraction
  }))
];

function getAttractionCoordinates(name: string): [number, number] {
  const coordinates: { [key: string]: [number, number] } = {
    'Jemaa el-Fnaa': [31.6260, -7.9892],
    'Hassan II Mosque': [33.6082, -7.6325],
    'Fes el Bali': [34.0656, -4.9734],
    'Chefchaouen Blue City': [35.1688, -5.2636],
    'Sahara Desert (Merzouga)': [31.0801, -4.0133],
    'Atlas Mountains': [31.2574, -7.8759],
    'Essaouira Medina': [31.5125, -9.7749],
    'Ait Benhaddou': [31.0472, -7.1318],
    'Todra Gorge': [31.5899, -5.5969],
    'Volubilis': [34.0743, -5.5539]
  };
  return coordinates[name] || [31.7917, -7.0926]; // Default to Morocco center
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export default function EnhancedInteractiveMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'terrain'>('street');
  const [filterType, setFilterType] = useState<'all' | 'regions' | 'attractions'>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.7917, -7.0926]); // Morocco center
  const [mapZoom, setMapZoom] = useState(6);

  const filteredMarkers = moroccoMapData.filter(marker => {
    if (filterType === 'all') return true;
    if (filterType === 'regions') return marker.type === 'region';
    if (filterType === 'attractions') return marker.type === 'attraction';
    return true;
  });

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setMapCenter(marker.position);
    setMapZoom(10);
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
    setMapCenter([31.7917, -7.0926]);
    setMapZoom(6);
  };

  const getTileLayerUrl = () => {
    switch (mapView) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}';
      default:
        return '/images/OpenStreetMap.jpg';
    }
  };

  const getMarkerIcon = (marker: MapMarker) => {
    const color = marker.type === 'region' ? '#059669' : '#dc2626';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
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

          <Select value={mapView} onValueChange={(value: 'satellite' | 'street' | 'terrain') => setMapView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="street">Street</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url={getTileLayerUrl()}
              attribution={mapView === 'street' ? 
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' :
                '&copy; <a href="https://www.esri.com/">Esri</a>'
              }
            />
            
            {filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={getMarkerIcon(marker)}
                eventHandlers={{
                  click: () => handleMarkerClick(marker)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{marker.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {marker.type === 'region' ? 
                        `Capital: ${(marker.data as Region).capital}` :
                        `Category: ${(marker.data as TouristAttraction).category}`
                      }
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkerClick(marker)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMapCenter([31.7917, -7.0926]);
                setMapZoom(6);
              }}
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
            >
              <Layers className="h-4 w-4" />
            </Button>
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
        <div className="inline-flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Interactive Morocco Map - Click markers to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}