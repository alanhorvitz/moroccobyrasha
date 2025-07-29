'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const heroImages = [
    "/images/Marrakech.jpg",
    "/images/hero/morocco-desert.jpg", 
    "/images/hero/morocco-chefchaouen.jpg"
  ]

  return (
    <section className="relative">
      {/* Placeholder for Hero Images - In a real implementation these would be actual images */}
      <div className="relative h-[80vh] bg-gradient-to-r from-emerald-900 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 z-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Discover the Magic of Morocco
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
              Experience authentic Moroccan culture, stunning landscapes, and unforgettable adventures across 12 diverse regions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/discover">
                  Explore Regions <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                <Link href="/tourism">
                  View Tour Packages <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}