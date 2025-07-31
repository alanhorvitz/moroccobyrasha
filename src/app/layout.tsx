import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReactQueryProvider } from '@/lib/providers/ReactQueryProvider'
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Morocco Tourism Platform | Discover the Magic of Morocco',
  description: 'Explore Morocco\'s rich culture, stunning landscapes, and vibrant cities. Plan your perfect Moroccan adventure with our comprehensive tourism platform.',
  keywords: 'Morocco, tourism, travel, culture, attractions, tours, Marrakech, Casablanca, Fez, Rabat',
  authors: [{ name: 'Morocco Tourism Platform' }],
  openGraph: {
    title: 'Morocco Tourism Platform',
    description: 'Discover the Magic of Morocco',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'es_ES', 'it_IT', 'ar_MA'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ReactQueryProvider>
            <LanguageProvider>
              <AuthProvider>
                <TooltipProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">
                      {children}
                    </main>
                    <Footer />
                  </div>
                  <Toaster />
                </TooltipProvider>
              </AuthProvider>
            </LanguageProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}