'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { moroccoCities } from '@/components/map/morocco-map'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Users, Camera } from 'lucide-react'
import Image from 'next/image'

export default function CityPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n } = useTranslation()
  
  const cityId = params.cityId as string
  const city = moroccoCities.find(c => c.id === cityId)
  const isArabic = i18n.language === 'ar'

  if (!city) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">City Not Found</h1>
          <Button onClick={() => router.push('/discovery')}>
            Back to Discovery
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <Image
          src={city.image}
          alt={isArabic ? city.nameAr : city.name}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              {isArabic ? city.nameAr : city.name}
            </h1>
            <p className="text-xl font-medium">
              {city.region}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute left-4 top-4 bg-white/90 text-black hover:bg-white"
          onClick={() => router.push('/discovery')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Map
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* City Info Cards */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border bg-card p-6">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="font-semibold">
                  {city.coordinates[0].toFixed(4)}, {city.coordinates[1].toFixed(4)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-card p-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Population</p>
                <p className="font-semibold">{city.population.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-card p-6">
              <Camera className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Region</p>
                <p className="font-semibold">{city.region}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">About {isArabic ? city.nameAr : city.name}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {isArabic ? city.descriptionAr : city.description}
            </p>
          </div>

          {/* Attractions */}
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Top Attractions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {(isArabic ? city.attractionsAr : city.attractions).map((attraction, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <span className="font-medium">{attraction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Placeholder */}
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={`https://images.unsplash.com/photo-${1539650116574 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={`${city.name} gallery ${index}`}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      // Fallback images
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1539650116574-75c0c6d4d6d7',
                        'https://images.unsplash.com/photo-1548630826-2ec01a41f48f',
                        'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
                      ];
                      (e.target as HTMLImageElement).src = `${fallbackImages[index - 1]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Plan Your Visit
            </Button>
            <Button variant="outline" size="lg">
              View on Map
            </Button>
            <Button variant="outline" size="lg">
              Share City
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}