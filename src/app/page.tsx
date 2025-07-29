import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Hero from '@/components/Hero'
import FeaturedAttractions from '@/components/FeaturedAttractions'
import RegionsGrid from '@/components/RegionsGrid'
import TourPackagesSection from '@/components/TourPackagesSection'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import NewsletterSignup from '@/components/NewsletterSignup'

// Dynamic import for EnhancedInteractiveMap
const EnhancedInteractiveMap = dynamic(() => import('@/components/EnhancedInteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />
})

export const metadata: Metadata = {
  title: 'Morocco Tourism Platform | Discover the Magic of Morocco',
  description: 'Explore Morocco\'s rich culture, stunning landscapes, and vibrant cities. Discover 12 unique regions, authentic experiences, and plan your perfect Moroccan adventure.',
  openGraph: {
    title: 'Morocco Tourism Platform',
    description: 'Discover the Magic of Morocco',
    images: ['/images/hero-morocco.jpg'],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Attractions */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <FeaturedAttractions />
        </div>
      </section>

      {/* Interactive Map (now EnhancedInteractiveMap) */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Morocco's Regions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the diverse landscapes and rich cultural heritage of Morocco's 12 regions
            </p>
          </div>
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <EnhancedInteractiveMap />
          </Suspense>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <RegionsGrid />
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <TourPackagesSection />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  )
}