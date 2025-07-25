'use client'

import { HeroSection } from '@/components/hero/hero-section'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Map, Compass, Camera } from 'lucide-react'

export default function Home({
  params,
}: {
  params: { lang: string }
}) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleExploreClick = () => {
    const destinationsSection = document.getElementById('destinations')
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDiscoveryClick = () => {
    router.push(`/${params.lang}/discovery`)
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        title={t('hero.title', 'Discover Morocco')}
        subtitle={t('hero.subtitle', 'Experience the magic of ancient cities, vibrant culture, and breathtaking landscapes')}
        ctaText={t('hero.cta', 'Explore Destinations')}
        onCtaClick={handleExploreClick}
      />
      
      {/* Destinations section */}
      <div id="destinations" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('destinations.title', 'Explore Morocco')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('destinations.subtitle', 'Discover the beautiful cities and hidden gems of Morocco through our interactive map and detailed guides')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow">
              <Map className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('features.map.title', 'Interactive Map')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('features.map.description', 'Explore Morocco with our interactive map featuring major cities and attractions')}
              </p>
              <Button onClick={handleDiscoveryClick} className="w-full">
                {t('features.map.cta', 'Explore Map')}
              </Button>
            </div>

            <div className="text-center p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow">
              <Compass className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('features.guides.title', 'City Guides')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('features.guides.description', 'Detailed information about each city including attractions and cultural insights')}
              </p>
              <Button variant="outline" className="w-full">
                {t('features.guides.cta', 'Browse Guides')}
              </Button>
            </div>

            <div className="text-center p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow">
              <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('features.experiences.title', 'Experiences')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('features.experiences.description', 'Curated experiences and tours to make the most of your Moroccan adventure')}
              </p>
              <Button variant="outline" className="w-full">
                {t('features.experiences.cta', 'View Experiences')}
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={handleDiscoveryClick}>
              <Map className="mr-2 h-5 w-5" />
              {t('cta.discovery', 'Start Discovering')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
} 