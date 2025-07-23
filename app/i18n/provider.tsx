'use client'

import { I18nextProvider } from 'react-i18next'
import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getOptions } from './settings'

interface I18nProviderProps {
  children: React.ReactNode
  locale: string
}

export default function I18nProvider({ children, locale }: I18nProviderProps) {
  const i18n = createInstance()

  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string) => import(`@/public/locales/${language}/translation.json`)
      )
    )
    .init({
      ...getOptions(locale),
      lng: locale,
    })

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
} 