'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Menu, 
  X, 
  MapPin, 
  Camera, 
  Compass, 
  Map, 
  Bus,
  Instagram,
  UserCircle2,
  LogIn,
  LogOut,
  User,
  Settings,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('nav.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="px-2 py-6">
                  <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                      Visit Morocco
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 px-2">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.home')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/discover" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <Map className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.discover')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/tourism" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <Compass className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.tourism')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/gallery" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <Camera className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.gallery')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/content-hub" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <Instagram className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.contentHub')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/marketplace" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <ShoppingBag className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.marketplace')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/services" className="flex items-center py-2 text-lg font-medium hover:text-emerald-600 transition-colors">
                      <Bus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('nav.services')}
                    </Link>
                  </SheetClose>
                </nav>
                <div className="mt-auto px-2 py-4">
                  <div className="flex justify-start gap-2 flex-wrap">
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('en')}
                    >
                      EN
                    </Button>
                    <Button
                      variant={language === 'fr' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('fr')}
                    >
                      FR
                    </Button>
                    <Button
                      variant={language === 'es' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('es')}
                    >
                      ES
                    </Button>
                    <Button
                      variant={language === 'it' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('it')}
                    >
                      IT
                    </Button>
                    <Button
                      variant={language === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('ar')}
                    >
                      AR
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent hidden sm:block">
              Visit Morocco
            </span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent sm:hidden">
              Morocco
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/discover" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.discover')}
          </Link>
          <Link href="/tourism" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.tourism')}
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.gallery')}
          </Link>
          <Link href="/content-hub" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.contentHub')}
          </Link>
          <Link href="/marketplace" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.marketplace')}
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            {t('nav.services')}
          </Link>
        </nav>

        {/* Right Side - Language & User */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('nav.selectLanguage')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                {t('languages.english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                {t('languages.french')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es')}>
                {t('languages.spanish')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('it')}>
                {t('languages.italian')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                {t('languages.arabic')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle2 className="h-5 w-5" />
                  <span className="sr-only">{t('nav.userAccount')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.firstName} {user.lastName}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {user.email}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {t('auth.role')}: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('nav.dashboard')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('nav.profileSettings')}
                  </Link>
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="flex items-center">
                  <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.login')}
                </Link>
              </Button>
              <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register" className="flex items-center">
                  <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.register')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;