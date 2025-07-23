'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { languages } from '@/app/i18n/settings'

const languageNames = {
  en: 'English',
  ar: 'العربية'
}

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const currentLang = pathname.split('/')[1]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const routes = [
    {
      href: `/${currentLang}`,
      label: t('nav.home'),
      active: pathname === `/${currentLang}`,
    },
    {
      href: `/${currentLang}/tours`,
      label: t('nav.tours'),
      active: pathname.includes('/tours'),
    },
    {
      href: `/${currentLang}/destinations`,
      label: t('nav.destinations'),
      active: pathname.includes('/destinations'),
    },
    {
      href: `/${currentLang}/experiences`,
      label: t('nav.experiences'),
      active: pathname.includes('/experiences'),
    },
    {
      href: `/${currentLang}/contact`,
      label: t('nav.contact'),
      active: pathname.includes('/contact'),
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (currentLang && i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang)
    }
  }, [currentLang, i18n])

  const handleLanguageChange = async (newLang: string) => {
    if (newLang === currentLang) return

    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/')

    try {
      await i18n.changeLanguage(newLang)
      router.push(newPath)
      setShowLangMenu(false)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-switcher')) {
        setShowLangMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLang}`} className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt=""
              width={40}
              height={40}
              className="w-auto h-8"
            />
            <span className={cn(
              "font-semibold text-xl transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}>
              Morocco By Rasha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative py-2',
                  route.active
                    ? isScrolled ? 'text-primary' : 'text-white font-semibold'
                    : isScrolled ? 'text-gray-600' : 'text-white/90'
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative language-switcher">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-white/80"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLangMenu(!showLangMenu)
                }}
              >
                <Globe className="h-4 w-4" />
                <span>{languageNames[currentLang as keyof typeof languageNames]}</span>
              </Button>
              
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 py-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors",
                        currentLang === lang
                          ? "bg-primary/5 text-primary"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {languageNames[lang as keyof typeof languageNames]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <Button
              variant="ghost"
              className={cn(
                "transition-colors",
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white hover:text-white/80"
              )}
              size="sm"
            >
              {t('nav.login')}
            </Button>
            
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              size="sm"
            >
              {t('nav.signup')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-md",
              isScrolled ? "text-gray-600" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'text-sm font-medium transition-colors px-4 py-2 rounded-md',
                    route.active
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        handleLanguageChange(lang)
                        setIsMobileMenuOpen(false)
                      }}
                      className={cn(
                        "text-left px-4 py-2 rounded-md text-sm transition-colors",
                        currentLang === lang
                          ? "bg-primary/5 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {languageNames[lang as keyof typeof languageNames]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-gray-600 hover:text-gray-900"
                  size="sm"
                >
                  {t('nav.login')}
                </Button>
                <Button
                  className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
                  size="sm"
                >
                  {t('nav.signup')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 