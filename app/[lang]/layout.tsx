import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/navigation/footer"
import { MainNav } from "@/components/navigation/main-nav"
import I18nProvider from "../i18n/provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Morocco By Rasha - Authentic Moroccan Travel Experiences",
  description: "Discover authentic Moroccan experiences with personalized tours and cultural adventures.",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider locale={lang}>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 