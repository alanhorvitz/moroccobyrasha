'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data - in real app this would come from your data layer
const mockTourPackages = [
  {
    id: '1',
    title: 'Imperial Cities Tour',
    duration: '8',
    price: 1299,
    regionId: 'multiple',
    description: 'Experience the grandeur of Morocco\'s four imperial cities: Rabat, Fès, Meknès, and Marrakech.',
    maxParticipants: 12,
    featured: true
  },
  {
    id: '2',
    title: 'Sahara Desert Adventure',
    duration: '5',
    price: 899,
    regionId: 'merzouga',
    description: 'Journey into the heart of the Sahara with camel trekking and overnight camping under the stars.',
    maxParticipants: 8,
    featured: true
  },
  {
    id: '3',
    title: 'Atlas Mountains Trek',
    duration: '7',
    price: 799,
    regionId: 'atlas',
    description: 'Hike through the stunning Atlas Mountains and experience Berber culture in traditional villages.',
    maxParticipants: 10,
    featured: true
  }
]

const mockRegions = [
  { id: 'multiple', name: 'Multiple Regions' },
  { id: 'merzouga', name: 'Drâa-Tafilalet' },
  { id: 'atlas', name: 'Béni Mellal-Khénifra' }
]

export default function TourPackagesSection() {
  const [featuredTours] = useState(mockTourPackages.filter(t => t.featured).slice(0, 3))

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Tour Packages</h2>
            <p className="text-slate-600 max-w-2xl">
              Carefully curated tours that showcase the best of Morocco with expert guides and authentic experiences
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/tourism">
              View All Tours <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden">
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img 
                  src={`/images/tours/${tour.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}.jpg`}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/morocco-tour-default.jpg'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{tour.duration} days</span>
                    <span className="text-white font-bold">${tour.price}</span>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{tour.title}</CardTitle>
                <CardDescription>
                  {mockRegions.find(r => r.id === tour.regionId)?.name || 'Multiple Regions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 line-clamp-3">{tour.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-slate-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Max {tour.maxParticipants}</span>
                </div>
                <Button asChild>
                  <Link href={`/tours/${tour.id}`}>
                    View Tour
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