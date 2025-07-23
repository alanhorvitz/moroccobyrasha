'use client'

import { HeroSection } from '@/components/hero/hero-section'
import { useTranslation } from 'react-i18next'

export default function Home({
  params,
}: {
  params: { lang: string }
}) {
  const { t } = useTranslation()

  const handleExploreClick = () => {
    const destinationsSection = document.getElementById('destinations')
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        onCtaClick={handleExploreClick}
      />
      
      {/* Additional sections will be added here */}
      <div id="destinations" className="h-screen">
        {/* Destinations section placeholder */}
      </div>
    </main>
  )
} 