'use client'

import { PropsWithChildren } from 'react'
import { MainNav } from '@/components/navigation/main-nav'
import I18nProvider from '@/app/i18n/provider'

export function ClientProviders({ children, lang }: PropsWithChildren<{ lang: string }>) {
  return (
    <I18nProvider lang={lang}>
      <MainNav />
      {children}
    </I18nProvider>
  )
} 