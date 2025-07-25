'use client'

import { useTranslation } from 'react-i18next'
import { MoroccoMap } from '@/components/map/morocco-map'

export default function DiscoveryPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {t('discovery.title', 'Discover Morocco')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('discovery.subtitle', 'Explore the beautiful cities and regions of Morocco by clicking on the map')}
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl">
          <MoroccoMap />
        </div>
      </div>
    </div>
  )
}