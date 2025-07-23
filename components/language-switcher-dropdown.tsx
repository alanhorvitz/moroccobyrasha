'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { languages } from '@/app/i18n/settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const languageNames = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español'
}

export function LanguageSwitcherDropdown({ isScrolled }: { isScrolled: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLang = pathname.split('/')[1]

  const switchLanguage = (locale: string) => {
    if (locale === currentLang) return

    let newPathname = pathname
    if (pathname === `/${currentLang}`) {
      // If we're on the home page
      newPathname = `/${locale}`
    } else {
      // For other pages, replace the language segment
      const segments = pathname.split('/')
      segments[1] = locale
      newPathname = segments.join('/')
    }

    // Use replace instead of push to avoid adding to history stack
    router.replace(newPathname)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 transition-colors",
            isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-white/80"
          )}
        >
          <Globe className="h-4 w-4" />
          <span>{languageNames[currentLang as keyof typeof languageNames]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={cn(
              "cursor-pointer",
              currentLang === lang && "bg-accent"
            )}
          >
            {languageNames[lang as keyof typeof languageNames]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 