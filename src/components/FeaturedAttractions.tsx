'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - in real app this would come from your data layer
const mockAttractions = [
  {
    id: '1',
    name: 'Hassan II Mosque',
    category: 'Religious',
    regionId: 'casablanca',
    description: 'One of the largest mosques in the world, featuring stunning architecture and oceanfront location.',
    featured: true
  },
  {
    id: '2', 
    name: 'Jemaa el-Fnaa',
    category: 'Cultural',
    regionId: 'marrakech',
    description: 'The main square and market place in Marrakech, alive with storytellers, musicians, and food stalls.',
    featured: true
  },
  {
    id: '3',
    name: 'Chefchaouen Blue City',
    category: 'Historic',
    regionId: 'chefchaouen',
    description: 'Famous blue-painted city nestled in the Rif Mountains, known for its stunning azure buildings.',
    featured: true
  }
]

const mockRegions = [
  { id: 'casablanca', name: 'Casablanca-Settat' },
  { id: 'marrakech', name: 'Marrakech-Safi' },
  { id: 'chefchaouen', name: 'Tangier-Tetouan-Al Hoceima' }
]

export default function FeaturedAttractions() {
  const [featuredAttractions, setFeaturedAttractions] = useState(mockAttractions.filter(a => a.featured).slice(0, 3))

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Must-Visit Attractions</h2>
            <p className="text-slate-600 max-w-2xl">
              Discover Morocco's most iconic landmarks and hidden gems that showcase the country's rich heritage
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/discover">
              View All Attractions <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAttractions.map((attraction) => (
            <Card key={attraction.id} className="overflow-hidden">
              <div className="relative h-64 bg-slate-200 overflow-hidden">
                <img 
                  src={`/images/${attraction.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}.jpg`}
                  alt={attraction.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/morocco-attraction-default.jpg'
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700">{attraction.category}</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{attraction.name}</CardTitle>
                <CardDescription>
                  {mockRegions.find(r => r.id === attraction.regionId)?.name || 'Morocco'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-3">{attraction.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/attractions/${attraction.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}