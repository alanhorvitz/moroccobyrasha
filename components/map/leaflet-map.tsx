'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MoroccoCityData } from './morocco-map'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LeafletMapProps {
  cities: MoroccoCityData[]
  onCityClick: (cityId: string) => void
}

export default function LeafletMap({ cities, onCityClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create the map centered on Morocco
    const map = L.map(mapRef.current, {
      center: [31.7917, -7.0926], // Center of Morocco
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
    })

    mapInstanceRef.current = map

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    // Create custom icon for cities
    const cityIcon = L.divIcon({
      className: 'custom-city-marker',
      html: `
        <div class="city-marker-container">
          <div class="city-marker-pulse"></div>
          <div class="city-marker-dot"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    // Add markers for each city
    cities.forEach((city) => {
      const marker = L.marker(city.coordinates, { icon: cityIcon })
        .addTo(map)
        .bindPopup(`
          <div class="city-popup">
            <h3 class="city-popup-title">${city.name}</h3>
            <p class="city-popup-region">${city.region}</p>
            <p class="city-popup-description">${city.description}</p>
            <div class="city-popup-footer">
              <span class="city-popup-population">Population: ${city.population.toLocaleString()}</span>
              <button class="city-popup-button" onclick="window.cityClickHandler('${city.id}')">
                Explore City
              </button>
            </div>
          </div>
        `, {
          maxWidth: 300,
          className: 'custom-popup'
        })

      // Add click event to marker
      marker.on('click', () => {
        onCityClick(city.id)
      })
    })

    // Make the click handler globally available for popup buttons
    ;(window as unknown as { cityClickHandler: (cityId: string) => void }).cityClickHandler = onCityClick

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      delete (window as unknown as { cityClickHandler?: unknown }).cityClickHandler
    }
  }, [cities, onCityClick])

  return (
    <>
      <div ref={mapRef} className="h-full w-full" />
      <style jsx global>{`
        .custom-city-marker {
          background: transparent;
          border: none;
        }

        .city-marker-container {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .city-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: rgba(239, 68, 68, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
        }

        .city-marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .city-marker-dot:hover {
          background: #dc2626;
          transform: translate(-50%, -50%) scale(1.2);
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }

        .city-popup {
          padding: 16px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .city-popup-title {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .city-popup-region {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .city-popup-description {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.4;
        }

        .city-popup-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .city-popup-population {
          font-size: 12px;
          color: #6b7280;
        }

        .city-popup-button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .city-popup-button:hover {
          background: #dc2626;
        }

        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </>
  )
}