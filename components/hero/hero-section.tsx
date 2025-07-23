'use client'

import { Button } from '@/components/ui/button'
import { VideoBackground } from './video-background'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  onCtaClick: () => void
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  onCtaClick,
}: HeroSectionProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <VideoBackground />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mb-8 text-lg md:text-xl lg:text-2xl">
            {subtitle}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-accent hover:bg-accent/90"
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  )
} 