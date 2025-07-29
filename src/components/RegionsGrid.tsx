'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

// Mock data - in real app this would come from your data layer
const mockRegions = [
  {
    id: 'marrakech',
    name: 'Marrakech-Safi',
    capital: 'Marrakech',
    description: 'The red city famous for its medina, souks, and vibrant culture',
    imageUrl: '/images/Marrakech.jpg',
    attractions: ['Jemaa el-Fnaa', 'Bahia Palace', 'Majorelle Garden']
  },
  {
    id: 'casablanca',
    name: 'Casablanca-Settat', 
    capital: 'Casablanca',
    description: 'Morocco\'s economic capital and largest city',
    imageUrl: '/images/casablanca.jpg',
    attractions: ['Hassan II Mosque', 'Old Medina', 'Corniche']
  },
  {
    id: 'fes',
    name: 'Fès-Meknès',
    capital: 'Fès',
    description: 'The spiritual and cultural heart of Morocco',
    imageUrl: '/images/fes.jpg', 
    attractions: ['Fes el-Bali', 'Al Quaraouiyine', 'Bou Inania Madrasa']
  },
  {
    id: 'rabat',
    name: 'Rabat-Salé-Kénitra',
    capital: 'Rabat',
    description: 'The political capital with rich historical heritage',
    imageUrl: '/images/rabat.jpg',
    attractions: ['Hassan Tower', 'Oudayas Kasbah', 'Royal Palace']
  }
]

export default function RegionsGrid() {
  const [featuredRegions] = useState(mockRegions.slice(0, 4))

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Morocco's Regions</h2>
            <p className="text-slate-600 max-w-2xl">
              Discover the diverse landscapes, cultures, and experiences across Morocco's 12 distinctive regions
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/discover">
              View All Regions <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRegions.map((region) => (
            <Link key={region.id} href={`/regions/${region.id}`}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-emerald-100 overflow-hidden">
                  <img 
                    src={region.imageUrl || `/images/${region.name.replace(/\s+/g, '')}.jpg`}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/morocco-default.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{region.name}</h3>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-500 line-clamp-2">{region.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-slate-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{region.capital}</span>
                  </div>
                  <div>{region.attractions.length} attractions</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}