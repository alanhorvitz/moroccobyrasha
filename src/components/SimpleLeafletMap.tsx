import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

interface SimpleLeafletMapProps {
  regions?: Region[];
  attractions?: Attraction[];
  height?: string;
}

export function SimpleLeafletMap({ 
  regions = [], 
  attractions = [], 
  height = "600px" 
}: SimpleLeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [31.7917, -7.0926], // Morocco center
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapRef.current = map;

    // Add CartoDB Positron tiles (shows unified Morocco territory)
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      crossOrigin: true
    });
    
    tileLayer.addTo(map);
    
    // Add error handling for tile loading
    tileLayer.on('tileerror', function(error) {
      console.log('Tile loading error:', error);
      // Fallback to OpenStreetMap if CartoDB fails
      const fallbackLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        crossOrigin: true
      });
      fallbackLayer.addTo(map);
    });
    
    // Add a fallback background color
    if (mapContainerRef.current) {
      mapContainerRef.current.style.backgroundColor = '#f8fafc';
    }

    // Custom icons
    const regionIcon = L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="10" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="#ffffff"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const attractionIcon = L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="#ffffff"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add region markers
    const bounds = L.latLngBounds([]);
    
    regions.forEach((region) => {
      const marker = L.marker([region.coordinates.lat, region.coordinates.lng], {
        icon: regionIcon
      }).addTo(map);
      
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${region.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Capital: ${region.capital}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.3;">${region.description.substring(0, 100)}...</p>
          <a href="/regions/${region.id}" style="display: inline-block; padding: 4px 8px; background: #10b981; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">View Details</a>
        </div>
      `);
      
      bounds.extend([region.coordinates.lat, region.coordinates.lng]);
    });

    // Add attraction markers
    attractions.forEach((attraction) => {
      const marker = L.marker([attraction.location.lat, attraction.location.lng], {
        icon: attractionIcon
      }).addTo(map);
      
      marker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${attraction.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Type: ${attraction.type}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.3;">${attraction.description.substring(0, 100)}...</p>
          <a href="/attractions/${attraction.id}" style="display: inline-block; padding: 4px 8px; background: #ef4444; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">View Details</a>
        </div>
      `);
      
      bounds.extend([attraction.location.lat, attraction.location.lng]);
    });

    // Fit map to show all markers
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [regions, attractions]);

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} className="rounded-lg overflow-hidden" />
      
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
    </div>
  );
}