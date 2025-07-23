'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { languages } from '@/app/i18n/settings'

const languageNames = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español'
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (locale: string) => {
    const currentPathname = pathname
    const segments = currentPathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  const currentLang = pathname.split('/')[1]

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={currentLang === lang ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => switchLanguage(lang)}
          className={`${
            currentLang === lang ? 'bg-secondary/90' : 'bg-background/80'
          } backdrop-blur-sm`}
        >
          {languageNames[lang as keyof typeof languageNames]}
        </Button>
      ))}
    </div>
  )
} 